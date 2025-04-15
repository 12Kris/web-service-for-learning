"use server";
import { createCourse } from "@/lib/courses/actions";
import { createBlock } from "@/lib/tests/actions";
import { createMaterial } from "@/lib/tests/actions";
import { createTest } from "@/lib/tests/actions";
import { TestDataWithQuestion } from "@/lib/types/test";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/supabase/server";
import { Card } from "@/lib/types/card";
import OpenAI from "openai";
import { getCardResults } from "@/lib/results/actions";
import { getSpacedRepetition } from "@/lib/courses/spaced-repetition-actions";
import { SpacedRepetition } from "@/lib/types/learning";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true,
});


// export interface SpacedRepetition {
//   start_date: string;
//   schedule: number[];
//   next_review_dates: string[];
// }

export async function updateSpacedRepetitionWithAi(
  courseId: number,
  // nextReviewDates: SpacedRepetition | null,
  howDifficult: number,
  timeSpent: number
) {

    console.log("Request to AI", courseId);

  const supabase = await createClient();
  const user = await getUser();

const cardResults = await getCardResults(courseId);
// howDifficult = cardResults?.rating ?? howDifficult;


  if (!user?.id) {
    throw new Error("User is not authenticated.");
  }


  // const olddata = 

  // console.log("Spaced Repetition Data", olddata);

  // const startDate = new Date().toISOString().split("T")[0];

  let oldSpacedRepetition: SpacedRepetition = await (await getSpacedRepetition(courseId)).spaced_repetition;

  console.log("Spaced Repetition Data", oldSpacedRepetition);



  

  // Use generateCourseContent to update spacedRepetition if available.
  const newSpacedRepetition = await generateCourseContent(
    JSON.stringify(oldSpacedRepetition),
    howDifficult,
    timeSpent
  );

  console.log("Generated Spaced Repetition Data", newSpacedRepetition);



  // if (generatedContent) {
  //   spacedRepetition = generatedContent;
  // }

  const { data, error } = await supabase
    .from("UserCourse")
    .update({
      spaced_repetition: newSpacedRepetition,
    })
    .eq("user_id", user.id)
    .eq("course_id", courseId);

  if (error) {
    console.error("Error updating spaced repetition:", error);
    throw new Error("Failed to update spaced repetition.");
  }

  return data;
}

async function generateCourseContent(
  oldSpaceRepetion: string,
  howDifficult: number,
  timeSpent: number
): Promise<SpacedRepetition | null> {
  try {
    // if (coursesAmount > 6) {
    //   return null;
    // }

    const prompt = `
You are an AI that specializes in spaced repetition scheduling. Here is the current spaced repetition data in JSON format:
${oldSpaceRepetion}

Based on this data, generate an updated spaced repetition schedule. Consider the difficulty level of ${howDifficult} and the time spent of ${timeSpent} minutes in your update.
`;

    const response = await openai.responses.create({
      model: "gpt-4o-2024-08-06",
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
    console.error("Error generating course content:", error);
    return null;
  }
}

// async function getCardResultsWithAi()