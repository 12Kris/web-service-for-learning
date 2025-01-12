"use server";

import {supabase} from "@/lib/supabaseClient";
import {Block, LearningMaterial, Test, TestAnswer, TestQuestion} from "@/lib/definitions";

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

export async function createBlock(course_id: number | null, name: string): Promise<Block | null> {
    const {data, error} = await supabase
        .from("Block")
        .insert([{course_id, name}])

    if (error) {
        throw new Error(`Error creating block: ${error.message}`);
    }
}

export async function updateBlock(id: number, course_id: number | null, name: string): Promise<void> {
    const {error} = await supabase.from("Block").update([{course_id, name}]).eq("id", id);
    if (error) throw new Error(`Error updating block: ${error.message}`);
}

export async function deleteBlock(blockId: number): Promise<void> {
    const {error} = await supabase.from("Block").delete().eq("id", blockId);
    if (error) throw new Error(`Error deleting block: ${error.message}`);
}


export async function getTestById(testId: number) {
    const {data, error} = await supabase
        .from("Test")
        .select("id, block_id, TestQuestions(id, question, correct_id, TestAnswers!TestAnswers_question_id_fkey(id, answer))")
        .eq("id", testId);

    if (error) {
        console.error("Error fetching test:", error);
        return null;
    }

    return data && data.length > 0 ? {
        id: data[0].id,
        blockId: data[0].block_id,
        questions: data[0].TestQuestions.map((q: any) => ({
            id: q.id.toString(),
            question: q.question,
            answers: q.TestAnswers.map((a: any) => ({
                id: a.id.toString(),
                text: a.answer,
                correct: a.id === q.correct_id,
            })),
        })),
    } : null;
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
    questions: {
        id: string;
        question: string;
        answers: { id: string; text: string; correct: boolean }[];
    }[];
}): Promise<Test | null> {
    try {
        if (!testData.block_id) {
            throw new Error("block_id is required.");
        }
        if (!testData.questions || !Array.isArray(testData.questions)) {
            throw new Error("questions must be a valid array.");
        }

        for (const question of testData.questions) {
            if (!question.question) {
                throw new Error(`Each question must have a non-empty 'question' field.`);
            }
            if (!Array.isArray(question.answers) || question.answers.length === 0) {
                throw new Error(`Each question must have at least one answer.`);
            }
            if (!question.answers.some((answer) => answer.correct)) {
                throw new Error(`Each question must have at least one correct answer.`);
            }
        }

        const {data: testDataResponse, error: testError}: SupabaseResponse<Test> = await supabase
            .from("Test")
            .insert({block_id: testData.block_id, name: testData.name})
            .select()
            .single();

        if (testError) throw new Error(`Error creating test: ${testError.message}`);
        const testId = testDataResponse?.id;

        for (const question of testData.questions) {
            const {data: questionData, error: questionError}: SupabaseResponse<TestQuestion> = await supabase
                .from("TestQuestions")
                .insert({
                    test_id: testId,
                    question: question.question,
                    correct_id: null,
                })
                .select()
                .single();

            if (questionError) throw new Error(`Error creating test question: ${questionError.message}`);
            const questionId = questionData?.id;

            const answersToInsert = question.answers.map((answer) => ({
                question_id: questionId,
                answer: answer.text,
            }));

            const {data: insertedAnswers, error: answersError}: SupabaseResponse<TestAnswer[]> = await supabase
                .from("TestAnswers")
                .insert(answersToInsert)
                .select();

            if (answersError) throw new Error(`Error creating answers: ${answersError.message}`);

            const correctAnswer = question.answers.find((answer) => answer.correct);
            if (correctAnswer) {
                const correctAnswerData = insertedAnswers?.find(
                    (insertedAnswer) => insertedAnswer.answer === correctAnswer.text
                );

                if (correctAnswerData) {
                    const {error: updateError} = await supabase
                        .from("TestQuestions")
                        .update({correct_id: correctAnswerData.id})
                        .eq("id", questionId);

                    if (updateError) throw new Error(`Error updating correct_id: ${updateError.message}`);
                }
            }
        }

        return testDataResponse;
    } catch (error: any) {
        console.error("Error creating test:", error.message);
        throw new Error("Internal server error: " + error.message);
    }
}


export async function updateTest(
    testId: number,
    testData: {
        block_id: number;
        questions: {
            question: string;
            answers: { text: string; correct: boolean }[];
        }[];
    }
): Promise<Test | null> {
    try {
        const {data: testDataResponse, error: testError} = await supabase
            .from("Test")
            .update({block_id: testData.block_id})
            .eq("id", testId)
            .select()
            .single();

        if (testError) throw new Error(`Error updating test: ${testError.message}`);

        const {error: deleteQuestionsError} = await supabase
            .from("TestQuestions")
            .delete()
            .eq("test_id", testId);

        if (deleteQuestionsError) {
            throw new Error(`Error deleting old questions: ${deleteQuestionsError.message}`);
        }

        const {error: deleteAnswersError} = await supabase
            .from("TestAnswers")
            .delete()
            .in(
                "question_id",
                testData.questions.map((q) => q.question)
            );

        if (deleteAnswersError) {
            throw new Error(`Error deleting old answers: ${deleteAnswersError.message}`);
        }

        for (const question of testData.questions) {
            const {data: questionData, error: questionError} = await supabase
                .from("TestQuestions")
                .insert({
                    test_id: testId,
                    question: question.question,
                    correct_id: null,
                })
                .select()
                .single();

            if (questionError) {
                throw new Error(`Error creating question: ${questionError.message}`);
            }

            const questionId = questionData?.id;
            const correctAnswerText = question.answers.find((a) => a.correct)?.text;

            const answers = await Promise.all(
                question.answers.map(async (answer) => {
                    const {data: answerData, error: answerError} = await supabase
                        .from("TestAnswers")
                        .insert({
                            question_id: questionId,
                            answer: answer.text,
                        })
                        .select()
                        .single();

                    if (answerError) {
                        throw new Error(`Error creating answer: ${answerError.message}`);
                    }
                    return answerData;
                })
            );

            const correctAnswer = answers.find((a) => a.answer === correctAnswerText);
            if (correctAnswer) {
                await supabase
                    .from("TestQuestions")
                    .update({correct_id: correctAnswer.id})
                    .eq("id", questionId);
            }
        }

        return testDataResponse;
    } catch (error) {
        console.error("Error updating test:", error.message);
        throw error;
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

export async function createMaterial(
    materialData: { title: string; block_id: number },
    materialContents: { front: string; back: string }[]
  ): Promise<LearningMaterial | null> {
    const { data, error } = await supabase
      .from("LearningMaterial")
      .insert(materialData)
      .select()
      .single();
  
    if (error) throw new Error(`Error creating material: ${error.message}`);
  
    if (data?.id) {
      const cardData = materialContents.map((content) => ({
        front: content.front,
        back: content.back,
        material_id: data.id,
      }));
  
      const { error: cardError } = await supabase.from("flashcards").insert(cardData);
      if (cardError) throw new Error(`Error creating cards: ${cardError.message}`);
    }
  
    return data;
  }

  export async function updateMaterial(
    materialId: number,
    materialData: Partial<LearningMaterial>,
    materialContents: { front: string; back: string }[]
  ): Promise<void> {
    const { error } = await supabase
      .from("LearningMaterial")
      .update(materialData)
      .eq("id", materialId);
  
    if (error) throw new Error(`Error updating material: ${error.message}`);
  
    const { error: deleteError } = await supabase
      .from("flashcards")
      .delete()
      .eq("learning_material_id", materialId);
  
    if (deleteError) throw new Error(`Error deleting old cards: ${deleteError.message}`);
    const cardData = materialContents.map((content) => ({
      front: content.front,
      back: content.back,
      learning_material_id: materialId,
    }));
  
    const { error: insertError } = await supabase.from("flashcards").insert(cardData);
    if (insertError) throw new Error(`Error updating cards: ${insertError.message}`);
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