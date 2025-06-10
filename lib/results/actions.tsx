"use server"
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/supabase/server";
import {SaveTestResult, UserTestAnswer} from "@/lib/types/test";

export async function saveCardSelection(cardId: number, selection: boolean) {
    const supabase = await createClient();
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

export async function getCardResults(cardId: number) {
    const supabase = await createClient();
    const user = await getUser();
    if (!user) {
        return;
    }
    const { data, error } = await supabase
        .from("card_results")
        .select("*")
        .eq("user_id", user.id)
        .eq("card_id", cardId)
        .single();

    if (error) {
        console.error(error);
        return;
    }
    return data;
}

export async function saveCardResult(
    cardId: number,
    startTime: number | null,
    endTime: number,
    selection: object,
    rating: number
  ) {
    const supabase = await createClient();
    const user = await getUser();
    if (!user || !startTime) return;
  
    const { data: existingResult, error: fetchError } = await supabase
      .from("card_results")
      .select("id")
      .eq("user_id", user.id)
      .eq("card_id", cardId)
      .single();
  
    if (fetchError && fetchError.code !== "PGRST116") {
      return fetchError;
    }
  
    if (existingResult) {
      const { error: updateError } = await supabase
        .from("card_results")
        .update({
          start_time: startTime,
          end_time: endTime,
          selection_json: JSON.stringify(selection),
          rating: rating,
        })
        .eq("id", existingResult.id);
  
      if (updateError) return updateError;
      return { updated: true };
    } else {  
      const { error } = await supabase.from("card_results").insert([{
        user_id: user.id,
        card_id: cardId,
        start_time: startTime,
        end_time: endTime,
        selection_json: JSON.stringify(selection),
        rating: rating
      }]);
      if (error) return error;
      return { inserted: true };
    }
  }
  

export async function saveTestResults(
    testId: number,
    answers: UserTestAnswer[],
    duration: number,
): Promise<SaveTestResult> {
    try {
        const user = await getUser();
        const supabase = await createClient();
        if (!user) {
            throw new Error("User not authenticated");
        }

        const userId = user.id;
        const correctAnswers = answers.filter((a) => a.isCorrect).length;
        const percentCorrect = Math.round((correctAnswers / answers.length) * 100); // 0‑100 integer

        const { data: existingResult, error: fetchError } = await supabase
            .from("user_test_results")
            .select("id, attempt_number")
            .eq("user_id", userId)
            .eq("test_id", testId)
            .maybeSingle();

        if (fetchError) {
            throw new Error(`Error fetching existing result: ${fetchError.message}`);
        }

        let testResultId: number;

        if (existingResult) {
            const { error: updateError } = await supabase
                .from("user_test_results")
                .update({
                    score: percentCorrect,          // store percentage
                    answers_json: JSON.stringify(answers),
                    percent_correct: percentCorrect,
                    duration,
                    attempt_number: existingResult.attempt_number + 1,
                })
                .eq("id", existingResult.id);

            if (updateError) {
                throw new Error(`Error updating test result: ${updateError.message}`);
            }

            testResultId = existingResult.id;
        } else {
            const { data: inserted, error: insertError } = await supabase
                .from("user_test_results")
                .insert([
                    {
                        user_id: userId,
                        test_id: testId,
                        score: percentCorrect,
                        answers_json: JSON.stringify(answers),
                        percent_correct: percentCorrect,
                        duration,
                        attempt_number: 1,
                    },
                ])
                .select("id")
                .single();

            if (insertError) {
                throw new Error(`Error inserting test result: ${insertError.message}`);
            }

            testResultId = inserted.id;
        }

        return { id: testResultId, percentCorrect };
    } catch (error) {
        console.error("Error saving test results:", error);
        return { error: (error as Error).message };
    }
}