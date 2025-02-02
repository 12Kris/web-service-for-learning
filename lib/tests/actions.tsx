"use server";

import {supabase} from "@/lib/supabaseClient";
import {
    Answer,
    Block, Card,
    LearningMaterial, Question,
    Test,
    TestAnswer, TestAnswerDataFromDB,
    TestDataWithQuestion,
    TestQuestion, TestQuestionDataFromDB,
    TestWithQuestions
} from "@/lib/definitions";

type SupabaseResponse<T> = { data: T | null; error: Error | null };

export async function createBlock(course_id: number | null, name: string): Promise<Block | null> {
    const {data, error} = await supabase
        .from("Module")
        .insert([{course_id, name}]).select();

    if (error) {
        throw new Error(`Error creating block: ${error.message}`);
    }

    return data[0];
}

export async function updateBlock(id: number, course_id: number, name: string): Promise<Block> {
    const {data, error} = await supabase
        .from("Module")
        .update({course_id, name})
        .eq("id", id)
        .select();
    if (error) throw new Error(`Error updating block: ${error.message}`);
    return data[0] ?? null;
}

export async function deleteBlock(blockId: number): Promise<void> {
    const {error} = await supabase.from("Module").delete().eq("id", blockId);
    if (error) throw new Error(`Error deleting block: ${error.message}`);
}


export async function getTestById(testId: number): Promise<TestWithQuestions | null> {
    const {data, error} = await supabase
        .from("Test")
        .select(`
            id,
            block_id,
            question,
            TestQuestions (
                id,
                question,
                correct_id,
                TestAnswers!TestAnswers_question_id_fkey (
                    id,
                    answer
                )
            )
        `)
        .eq("id", testId);

    if (error) {
        console.error("Error fetching test:", error);
        return null;
    }

    if (!data || data.length === 0) return null;

    const testData = data[0];

    return {
        id: testData.id,
        blockId: testData.block_id,
        question: testData.question,
        questions: testData.TestQuestions.map((q: TestQuestionDataFromDB) => ({
            id: Number(q.id),
            question: q.question,
            answers: q.TestAnswers.map((a: TestAnswerDataFromDB) => ({
                id: Number(a.id),
                text: a.answer,
                correct: a.id === q.correct_id,
            })),
        })),
    };
}

// export async function getTestAnswers(testId: number) {
//     try {
//         const {data: questions, error: questionsError} = await supabase
//             .from("TestQuestions")
//             .select(`
//                 id,
//                 question,
//                 correct_id,
//                 TestAnswers:TestAnswers!TestAnswers_question_id_fkey (id, answer)
//             `)
//             .eq("test_id", testId);
//
//         if (questionsError) {
//             throw new Error(questionsError.message);
//         }
//
//         return questions.map((question) => {
//             const correctAnswer = question.TestAnswers.find(
//                 (answer) => answer.id === question.correct_id
//             );
//
//             return {
//                 id: question.id,
//                 question: question.question,
//                 answers: question.TestAnswers,
//                 correctAnswer: correctAnswer || null,
//             };
//         });
//     } catch (error) {
//         console.error("Error fetching test answers:", error);
//         return null;
//     }
// }

export async function createTest(testData: TestDataWithQuestion): Promise<Test | null> {
    try {
        if (!testData.block_id) throw new Error("block_id is required.");
        if (!testData.questions || !Array.isArray(testData.questions)) {
            throw new Error("questions must be a valid array.");
        }

        for (const question of testData.questions) {
            if (!question.question) throw new Error(`Each question must have a non-empty 'question' field.`);
            if (!Array.isArray(question.answers) || question.answers.length === 0) {
                throw new Error(`Each question must have at least one answer.`);
            }
            if (!question.answers.some((answer: { correct: boolean; }) => answer.correct)) {
                throw new Error(`Each question must have at least one correct answer.`);
            }
        }

        const {data: testDataResponse, error: testError}: SupabaseResponse<Test> = await supabase
            .from("Test")
            .insert({block_id: testData.block_id, question: testData.question})
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

            const answersToInsert = question.answers.map((answer: { text: string; correct: boolean }) => ({
                question_id: questionId,
                answer: answer.text,
            }));

            const {data: insertedAnswers, error: answersError}: SupabaseResponse<TestAnswer[]> = await supabase
                .from("TestAnswers")
                .insert(answersToInsert)
                .select();

            if (answersError) throw new Error(`Error creating answers: ${answersError.message}`);

            const correctAnswer = question.answers.find((answer: { text: string; correct: boolean }) => answer.correct);
            if (correctAnswer) {
                const correctAnswerData = insertedAnswers?.find(
                    (insertedAnswer: TestAnswer) => insertedAnswer?.answer === correctAnswer?.text
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
    } catch (error) {
        throw error;
    }
}


export async function updateTest(
    testId: number,
    testData: TestDataWithQuestion
): Promise<Test | null> {
    try {
        const {data: testDataResponse, error: testError} = await supabase
            .from("Test")
            .update({block_id: testData.block_id, question: testData.question})
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

        const questionIds = testData?.questions?.map((q: Question) => Number(q.id)).filter(Boolean) || [];

        if (questionIds.length > 0) {
            const {error: deleteAnswersError} = await supabase
                .from("TestAnswers")
                .delete()
                .in("question_id", questionIds);

            if (deleteAnswersError) {
                throw new Error(`Error deleting old answers: ${deleteAnswersError.message}`);
            }
        }

        if (testData.questions) {
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
                const correctAnswerText = question.answers.find((a: Answer) => a.correct)?.text;

                const answers = await Promise.all(
                    question.answers.map(async (answer: Answer) => {
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
        }

        return testDataResponse;
    } catch (error) {
        throw error;
    }
}


export async function deleteTest(testId: number): Promise<void> {
    const {error} = await supabase.from("Test").delete().eq("id", testId);
    if (error) throw new Error(`Error deleting test: ${error.message}`);
}


export async function createMaterial(
    materialData: { title: string; block_id: number },
    materialContents: Card[]
): Promise<LearningMaterial | null> {
    const {data, error} = await supabase
        .from("LearningMaterial")
        .insert(materialData)
        .select()
        .single();

    if (error) throw new Error(`Error creating material: ${error.message}`);

    if (data?.id) {
        const cardData = materialContents.map((content: Card) => ({
            front: content.front,
            back: content.back,
            learning_material_id: data.id,
        }));

        const {error: cardError} = await supabase.from("flashcards").insert(cardData);
        if (cardError) throw new Error(`Error creating cards: ${cardError.message}`);
    }

    return data;
}

export async function updateMaterial(
    materialId: number,
    materialData: Partial<LearningMaterial>,
    materialContents: Card[]
): Promise<void> {
    const {error} = await supabase
        .from("LearningMaterial")
        .update(materialData)
        .eq("id", materialId);

    if (error) throw new Error(`Error updating material: ${error.message}`);

    const {error: deleteError} = await supabase
        .from("flashcards")
        .delete()
        .eq("learning_material_id", materialId);

    if (deleteError) throw new Error(`Error deleting old cards: ${deleteError.message}`);
    const cardData = materialContents.map((content: Card) => ({
        front: content.front,
        back: content.back,
        learning_material_id: materialId,
    }));

    const {error: insertError} = await supabase.from("flashcards").insert(cardData);
    if (insertError) throw new Error(`Error updating cards: ${insertError.message}`);
}


export async function deleteMaterial(materialId: number): Promise<void> {
    const {error} = await supabase.from("LearningMaterial").delete().eq("id", materialId);
    if (error) throw new Error(`Error deleting material: ${error.message}`);
}