"use server";

import { supabase } from "@/lib/supabaseClient";
import { Block, LearningMaterial, Test, TestQuestion, TestAnswer } from "@/lib/definitions";

type SupabaseResponse<T> = { data: T | null; error: Error | null };

export async function getBlocks(): Promise<Block[]> {
    const { data, error } = await supabase.from("Block").select("*, Course(*)");
    if (error) console.error("Error fetching blocks:", error);
    return data || [];
}

export async function getBlockById(blockId: number): Promise<Block | null> {
    const { data, error } = await supabase.from("Block").select("*").eq("id", blockId).single();
    if (error) console.error("Error fetching block:", error);
    return data;
}

export async function createBlock(blockData: { course_id: string; name: string }): Promise<Block | null> {
    const { data, error } = await supabase.from("Block").insert(blockData).select().single();
    if (error) throw new Error(`Error creating block: ${error.message}`);
    return data;
}

export async function updateBlock(blockId: number, blockData: Partial<Block>): Promise<void> {
    const { error } = await supabase.from("Block").update(blockData).eq("id", blockId);
    if (error) throw new Error(`Error updating block: ${error.message}`);
}

export async function deleteBlock(blockId: number): Promise<void> {
    const { error } = await supabase.from("Block").delete().eq("id", blockId);
    if (error) throw new Error(`Error deleting block: ${error.message}`);
}


export async function getTestById(testId: number): Promise<Test | null> {
    const { data, error } = await supabase.from("Test").select("*").eq("id", testId).single();
    if (error) console.error("Error fetching test:", error);
    return data;
}

export async function createTest(testData: {
    block_id: number;
    question: string;
    answers: { text: string; isCorrect: boolean }[];
}): Promise<Test | null> {
    try {
        const { data: testDataResponse, error: testError }: SupabaseResponse<Test> = await supabase
            .from("Test")
            .insert({ block_id: testData.block_id, question: testData.question })
            .select()
            .single();

        if (testError) throw new Error(`Error creating test: ${testError.message}`);

        const testId = testDataResponse?.id;

        const { data: questionData, error: questionError }: SupabaseResponse<TestQuestion> = await supabase
            .from("TestQuestions")
            .insert({ test_id: testId, question: testData.question, correct_id: null })
            .select()
            .single();

        if (questionError) throw new Error(`Error creating test question: ${questionError.message}`);

        const questionId = questionData?.id;

        const answerPromises = testData.answers.map(async (answer) => {
            const { data: answerResponse, error: answerError }: SupabaseResponse<TestAnswer> = await supabase
                .from("TestAnswers")
                .insert({ question_id: questionId, answer: answer.text })
                .select()
                .single();

            if (answerError) throw new Error(`Error creating answer: ${answerError.message}`);
            return answerResponse;
        });

        const answers = await Promise.all(answerPromises);
        const correctAnswer = answers.find((answer) => answer?.correct);

        if (correctAnswer) {
            await supabase.from("TestQuestions").update({ correct_id: correctAnswer.id }).eq("id", questionId);
        }

        return testDataResponse;
    } catch (error: any) {
        console.error("Error creating test:", error.message);
        throw new Error("Internal server error: " + error.message);
    }
}

export async function updateTest(testId: number, testData: Partial<Test>): Promise<void> {
    const { error } = await supabase.from("Test").update(testData).eq("id", testId);
    if (error) throw new Error(`Error updating test: ${error.message}`);
}

export async function deleteTest(testId: number): Promise<void> {
    const { error } = await supabase.from("Test").delete().eq("id", testId);
    if (error) throw new Error(`Error deleting test: ${error.message}`);
}

export async function getMaterialsByBlock(blockId: number): Promise<LearningMaterial[]> {
    const { data, error } = await supabase.from("LearningMaterial").select("*").eq("block_id", blockId);
    if (error) console.error("Error fetching materials:", error);
    return data || [];
}

export async function createMaterial(materialData: {
    title: string;
    content: string;
    block_id: number;
}): Promise<LearningMaterial | null> {
    const { data, error } = await supabase.from("LearningMaterial").insert(materialData).select().single();
    if (error) throw new Error(`Error creating material: ${error.message}`);
    return data;
}

export async function updateMaterial(materialId: number, materialData: Partial<LearningMaterial>): Promise<void> {
    const { error } = await supabase.from("LearningMaterial").update(materialData).eq("id", materialId);
    if (error) throw new Error(`Error updating material: ${error.message}`);
}

export async function deleteMaterial(materialId: number): Promise<void> {
    const { error } = await supabase.from("LearningMaterial").delete().eq("id", materialId);
    if (error) throw new Error(`Error deleting material: ${error.message}`);
}

export async function getMaterialById(materialId: number): Promise<LearningMaterial | null> {
    const { data, error } = await supabase.from("LearningMaterial").select("*").eq("id", materialId).single();
    if (error) console.error("Error fetching material:", error);
    return data;
}