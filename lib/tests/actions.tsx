"use server";

import {supabase} from "@/lib/supabaseClient";
import {Block, LearningMaterial, Test, TestQuestion, TestAnswer} from "@/lib/definitions";

type SupabaseResponse<T> = { data: T | null; error: Error | null };

export async function getBlocks(): Promise<Block[]> {
    const {data, error} = await supabase.from("Block").select("*, Course(*)");
    if (error) console.error("Error fetching blocks:", error);
    return data || [];
}

export async function getBlockById(blockId: number): Promise<Block | null> {
    const {data, error} = await supabase.from("Block").select("*").eq("id", blockId).single();
    if (error) console.error("Error fetching block:", error);
    return data;
}

export async function createBlock(course_id: number, name: string): Promise<Block | null> {
    const {data, error} = await supabase
        .from("Block")
        .insert([{course_id, name}]) // передаем массив объектов

    if (error) {
        throw new Error(`Error creating block: ${error.message}`);
    }
}

export async function updateBlock(id: number, course_id: number, name: string): Promise<void> {
    const {error} = await supabase.from("Block").update([{course_id, name}]).eq("id", id);
    if (error) throw new Error(`Error updating block: ${error.message}`);
}

export async function deleteBlock(blockId: number): Promise<void> {
    const {error} = await supabase.from("Block").delete().eq("id", blockId);
    if (error) throw new Error(`Error deleting block: ${error.message}`);
}


export async function getTestById(testId: number): Promise<Test | null> {
    const {data, error} = await supabase.from("Test").select("*").eq("id", testId).single();
    if (error) console.error("Error fetching test:", error);
    return data;
}

export async function getTestAnswers(testId: number) {
    try {
        const {data: questions, error: questionsError} = await supabase
            .from("TestQuestions")
            .select(`
                id,
                question,
                correct_id,
                TestAnswers:TestAnswers!TestAnswers_question_id_fkey (id, answer)
            `)
            .eq("test_id", testId);

        if (questionsError) {
            throw new Error(questionsError.message);
        }

        const questionsWithAnswers = questions.map((question) => {
            const correctAnswer = question.TestAnswers.find(
                (answer) => answer.id === question.correct_id
            );

            return {
                id: question.id,
                question: question.question,
                answers: question.TestAnswers,
                correctAnswer: correctAnswer || null,
            };
        });

        return questionsWithAnswers;
    } catch (error) {
        console.error("Error fetching test answers:", error);
        return null;
    }
}

export async function createTest(testData: {
    block_id: number;
    question: string;
    answers: { text: string; correct: boolean }[];
}): Promise<Test | null> {
    try {
        const {data: testDataResponse, error: testError}: SupabaseResponse<Test> = await supabase
            .from("Test")
            .insert({block_id: testData.block_id, question: testData.question})
            .select()
            .single();

        if (testError) throw new Error(`Error creating test: ${testError.message}`);

        const testId = testDataResponse?.id;

        const {data: questionData, error: questionError}: SupabaseResponse<TestQuestion> = await supabase
            .from("TestQuestions")
            .insert({test_id: testId, question: testData.question, correct_id: null})
            .select()
            .single();

        if (questionError) throw new Error(`Error creating test question: ${questionError.message}`);

        const questionId = questionData?.id;

        const correctAnswerText = testData.answers.find((answer) => answer.correct)?.text;

        const answerPromises = testData.answers.map(async (answer) => {
            const {data: answerResponse, error: answerError}: SupabaseResponse<TestAnswer> = await supabase
                .from("TestAnswers")
                .insert({
                    question_id: questionId,
                    answer: answer.text,
                })
                .select()
                .single();

            if (answerError) throw new Error(`Error creating answer: ${answerError.message}`);
            return answerResponse;
        });

        const answers = await Promise.all(answerPromises);
        return [answers, correctAnswerText];
        const correctAnswer = answers.find((answer) => answer?.answer === correctAnswerText);
        // TODO: correct_id
        if (correctAnswer) {
            await supabase
                .from("TestQuestions")
                .update({correct_id: correctAnswer.id})
                .eq("id", questionId);
        }

        return testDataResponse;
    } catch (error: any) {
        console.error("Error creating test:", error.message);
        throw new Error("Internal server error: " + error.message);
    }
}


export async function updateTest(testId: number, testData: {
    block_id: number;
    question: string;
    answers: { text: string; correct: boolean }[];
}): Promise<Test | null> {
    try {
        const {data: testDataResponse, error: testError}: SupabaseResponse<Test> = await supabase
            .from("Test")
            .update({block_id: testData.block_id, question: testData.question})
            .eq("id", testId)
            .select()
            .single();

        if (testError) throw new Error(`Error updating test: ${testError.message}`);

        const {error: deleteError} = await supabase
            .from("TestQuestions")
            .delete()
            .eq("test_id", testId);

        if (deleteError) throw new Error(`Error deleting test questions: ${deleteError.message}`);

        const {data: questionData, error: questionError}: SupabaseResponse<TestQuestion> = await supabase
            .from("TestQuestions")
            .insert({
                test_id: testId,
                question: testData.question,
                correct_id: null,
            })
            .select()
            .single();

        if (questionError) throw new Error(`Error creating test question: ${questionError.message}`);

        const questionId = questionData.id;

        const correctAnswerText = testData.answers.find((answer) => answer.correct)?.text;

        const answerInsertPromises = testData.answers.map(async (answer) => {
            const {data: answerResponse, error: answerError}: SupabaseResponse<TestAnswer> = await supabase
                .from("TestAnswers")
                .insert({
                    question_id: questionId,
                    answer: answer.text,
                })
                .select()
                .single();

            if (answerError) throw new Error(`Error inserting answer: ${answerError.message}`);
            return answerResponse;
        });

        const answers = await Promise.all(answerInsertPromises);

        const correctAnswer = answers.find((answer) => answer?.answer === correctAnswerText);

        if (correctAnswer) {
            await supabase
                .from("TestQuestions")
                .update({correct_id: correctAnswer.id})
                .eq("id", questionId);
        }

        return testDataResponse;
    } catch (error: any) {
        console.error("Error updating test:", error.message);
        throw new Error("Internal server error: " + error.message);
    }
}


export async function deleteTest(testId: number): Promise<void> {
    const {error} = await supabase.from("Test").delete().eq("id", testId);
    if (error) throw new Error(`Error deleting test: ${error.message}`);
}

export async function getMaterialsByBlock(blockId: number): Promise<LearningMaterial[]> {
    const {data, error} = await supabase.from("LearningMaterial").select("*").eq("block_id", blockId);
    if (error) console.error("Error fetching materials:", error);
    return data || [];
}

export async function createMaterial(materialData: {
    title: string;
    content: string;
    block_id: number;
}): Promise<LearningMaterial | null> {
    const {data, error} = await supabase.from("LearningMaterial").insert(materialData).select().single();
    if (error) throw new Error(`Error creating material: ${error.message}`);
    return data;
}

export async function updateMaterial(materialId: number, materialData: Partial<LearningMaterial>): Promise<void> {
    const {error} = await supabase.from("LearningMaterial").update(materialData).eq("id", materialId);
    if (error) throw new Error(`Error updating material: ${error.message}`);
}

export async function deleteMaterial(materialId: number): Promise<void> {
    const {error} = await supabase.from("LearningMaterial").delete().eq("id", materialId);
    if (error) throw new Error(`Error deleting material: ${error.message}`);
}

export async function getMaterialById(materialId: number): Promise<LearningMaterial | null> {
    const {data, error} = await supabase.from("LearningMaterial").select("*").eq("id", materialId).single();
    if (error) console.error("Error fetching material:", error);
    return data;
}