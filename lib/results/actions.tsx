"use server"
import {supabase} from "@/lib/supabaseClient";
import {getUser} from "@/lib/auth/actions";
import {SaveTestResult, UserTestAnswer} from "@/lib/definitions";

export async function saveCardSelection(cardId: number, selection: boolean) {
    const user = await getUser()
    if (!user) {
        return;
    }
    const {data, error} = await supabase.from("user_cards_selection").insert([{
        user_id: user.id,
        card_id: cardId,
        selection
    }]);
    if (error) {
        console.error(error);
        return;
    }
    return data;
}

export async function saveCardResult(cardId: number, startTime: number | null, endTime: number, selection: object, rating: number) {
    const user = await getUser()
    if (!user) return;
    if (!startTime) return;
    const {data, error} = await supabase.from("card_results").insert([{
        user_id: user.id,
        card_id: cardId,
        start_time: startTime,
        end_time: endTime,
        selection_json: JSON.stringify(selection),
        rating: rating
    }])
    if (error) return error;
    return data;
}

export async function saveTestResults(
    testId: number,
    answers: UserTestAnswer[],
    duration: number,
): Promise<SaveTestResult> {
    try {
        const user = await getUser();
        if (!user) {
            throw new Error("User not authenticated");
        }

        const userId = user.id;
        const correctAnswers = answers.filter((a) => a.isCorrect).length;
        const percentCorrect = (correctAnswers / answers.length) * 100;

        const {data: previousAttempts, error: attemptsError} = await supabase
            .from("user_test_results")
            .select("id")
            .eq("user_id", userId)
            .eq("test_id", testId);

        if (attemptsError) {
            throw new Error(`Error fetching attempts: ${attemptsError.message}`);
        }

        const attemptNumber = (previousAttempts?.length || 0) + 1;
        const {data: testResult, error: testResultError} = await supabase
            .from("user_test_results")
            .insert([
                {
                    user_id: userId,
                    test_id: testId,
                    score: correctAnswers,
                    answers_json: JSON.stringify(answers),
                    percent_correct: percentCorrect.toFixed(2),
                    duration: duration.toFixed(2),
                    attempt_number: attemptNumber,
                },
            ])
            .select("id")
            .single();

        if (testResultError) {
            throw new Error(`Error saving test result: ${testResultError.message}`);
        }

        // const {error: answersError} = await supabase.from("test_answers").insert(
        //     answers.map((answer) => ({
        //         user_test_result_id: testResult.id,
        //         question_id: answer.questionId,
        //         answer: answer.answerId,
        //         is_correct: answer.isCorrect,
        //     }))
        // );
        //
        // if (answersError) {
        //     throw new Error(`Error saving answers: ${answersError.message}`);
        // }

        return {id: testResult.id};
    } catch (error) {
        console.error("Error saving test results:", error);
        return {error: (error as Error).message};
    }
}