"use server";

import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/supabase/server";
import OpenAI from "openai";
import { getSpacedRepetition } from "@/lib/courses/spaced-repetition-actions";
import { SpacedRepetition } from "@/lib/types/learning";
import {recordAiUsage} from "@/lib/courses/ai-actions";

import {getCardResults} from "@/lib/results/actions";

const openai = new OpenAI({
  // baseURL: "https://openrouter.ai/api/v1",

  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
  // dangerouslyAllowBrowser: true,
});

export async function updateSpacedRepetitionWithAi(
  courseId: number,
  cardId: number,
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

    const cardResults  = await getCardResults(cardId);



    console.log("Card results:", cardResults);

    if (!cardResults) {
      return {
        updatedSpacedRepetition: null,
        error: new Error("Card results not found."),
      };
    }


    const newSpacedRepetition = await generateCourseContent(
      JSON.stringify(oldSpacedRepetition),
      cardResults.start_time,
      cardResults.end_time,
      cardResults.selection_json,
      cardResults.rating
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
  startTime: number,
  endTime: number,
  selection: object,
  rating: number
): Promise<SpacedRepetition | Error> {
  try {
    const timeSpentInSeconds = Math.round((endTime - startTime) / 1000);
    console.log("Time spent in seconds:", timeSpentInSeconds);
  
    const prompt = `
  Today is ${new Date().toISOString().split("T")[0]}.
  
  You are a professional AI specializing in spaced repetition scheduling to maximize learning retention. Below is the current spaced repetition data in JSON format:
  ${oldSpaceRepetion}
  
  Additionally, consider the following details:
  - User difficulty rating: ${rating} where 1 is very easy and 5 is very difficult.
  - Total review time: ${timeSpentInSeconds} seconds
  - User selection data: ${JSON.stringify(selection)}
  
  Using the above information, generate an updated spaced repetition schedule that optimally adjusts review intervals for effective learning.
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