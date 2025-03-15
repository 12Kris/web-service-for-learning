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

export async function saveCardResult(cardId:number, startTime:string, endTime:string, selection:object) {
    const user = await getUser()
    if (!user) return;
    const {data, error} = await supabase.from("card_results").insert([{
        user_id: user.id,
        card_id: cardId,
        start_time: startTime,
        end_time: endTime,
        selection_json: selection, // need selection json
    }])
    if (error) return;
    return data;
}

export async function saveTestResults(
    testId: number,
    answers: UserTestAnswer[]
): Promise<SaveTestResult> {
    try {
        const user = await getUser();
        if (!user) {
            throw new Error("User not authenticated");
        }

        const userId = user.id;

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
                    score: answers.filter((a) => a.isCorrect).length,
                    attempt_number: attemptNumber,
                },
            ])
            .select("id")
            .single();

        if (testResultError) {
            throw new Error(`Error saving test result: ${testResultError.message}`);
        }

        const {error: answersError} = await supabase.from("test_answers").insert(
            answers.map((answer) => ({
                user_test_result_id: testResult.id,
                question_id: answer.questionId,
                answer: answer.answerId,
                is_correct: answer.isCorrect,
            }))
        );

        if (answersError) {
            throw new Error(`Error saving answers: ${answersError.message}`);
        }

        return {id: testResult.id};
    } catch (error) {
        console.error("Error saving test results:", error);
        return {error: (error as Error).message};
    }
}