"use server";

import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/supabase/server";
import OpenAI from "openai";
import { getSpacedRepetition } from "@/lib/courses/spaced-repetition-actions";
import { SpacedRepetition } from "@/lib/types/learning";
import {recordAiUsage} from "@/lib/courses/ai-actions";
const openai = new OpenAI({
  // baseURL: "https://openrouter.ai/api/v1",

  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
  // dangerouslyAllowBrowser: true,
});

export async function updateSpacedRepetitionWithAi(
  courseId: number,
  howDifficult: number,
  timeSpent: number
) {
  try {
    console.log("Request to AI", courseId);

    const supabase = await createClient();
    const user = await getUser();

    if (!user?.id) {
      return {
        updatedSpacedRepetition: null,
        error: new Error("User is not authenticated."),
      };
    }

    const oldSpacedRepetition: SpacedRepetition = await (
      await getSpacedRepetition(courseId)
    ).spaced_repetition;

    const newSpacedRepetition = await generateCourseContent(
      JSON.stringify(oldSpacedRepetition),
      howDifficult,
      timeSpent
    );

    const { error } = await supabase
      .from("UserCourse")
      .update({
        spaced_repetition: newSpacedRepetition,
      })
      .eq("user_id", user.id)
      .eq("course_id", courseId);

    if (error) {
      console.error("Error updating spaced repetition:", error);
      return { updatedSpacedRepetition: oldSpacedRepetition, error };
    }

    return { updatedSpacedRepetition: newSpacedRepetition, error: null };
  } catch (err) {
    console.error("Error in updateSpacedRepetitionWithAi:", err);
    return { updatedSpacedRepetition: null, error: err };
  }
}

async function generateCourseContent(
  oldSpaceRepetion: string,
  howDifficult: number,
  timeSpent: number
): Promise<SpacedRepetition | Error> {
  try {
    const prompt = `
    Today is ${new Date().toISOString().split("T")[0]}.

    You are an AI that specializes in spaced repetition scheduling. Here is the current spaced repetition data in JSON format: 
    ${oldSpaceRepetion}

    Based on this data, generate an updated spaced repetition schedule. Consider the difficulty level of ${howDifficult} and the time spent of ${timeSpent} minutes in your update.
    `;

    await recordAiUsage();

    const response = await openai.responses.create({
      model: "gpt-4.1-nano-2025-04-14",
      input: [{ role: "user", content: prompt }],
      text: {
        format: {
          type: "json_schema",
          name: "SpacedRepetition",
          schema: {
            type: "object",
            properties: {
              start_date: {
                type: "string",
                description: "The date when spaced repetition started.",
              },
              schedule: {
                type: "array",
                description:
                  "An array of numbers representing the intervals for the next reviews.",
                items: {
                  type: "number",
                },
              },
              next_review_dates: {
                type: "array",
                description: "An array of dates for the next review sessions.",
                items: {
                  type: "string",
                },
              },
            },
            required: ["start_date", "schedule", "next_review_dates"],
            additionalProperties: false,
          },
          strict: true,
        },
      },
    });

    const generatedContent = JSON.parse(response.output_text);
    return generatedContent as SpacedRepetition;
  } catch (error) {
    return error as Error;
  }
}
