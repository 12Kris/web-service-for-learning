"use server";
import { createCourse } from "@/lib/courses/actions";
import { createBlock } from "@/lib/tests/actions";
import { createMaterial } from "@/lib/tests/actions";
import { createTest } from "@/lib/tests/actions";
import { TestDataWithQuestion } from "@/lib/types/test";

import { Card } from "@/lib/types/card";
import OpenAI from "openai";
import { createClient } from "@/utils/supabase/server";

import * as pdfParse from "pdf-parse";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error(
    "Missing OpenAI API Key. Set OPENAI_API_KEY in your Vercel environment variables."
  );
}
const openai = new OpenAI({
  apiKey,
});

interface GeneratedCourse {
  name: string;
  description: string;
  color: string;
  type: string;
  course_details: {
    id: number;
    course_detail: string;
  }[];
  what_w_learn: {
    id: number;
    description: string;
  }[];
  modules: {
    title: string;
    description: string;
    learningMaterials?: {
      title: string;
      cards: Card[];
    }[];
    tests?: {
      question: string;
      questions: {
        question: string;
        answers: { text: string; correct: boolean }[];
      }[];
    }[];
  }[];
}

export interface AiUsed {
  id: number;
  used_at: string;
  user_id: string | null;
}

export async function recordAiUsage(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    console.error("Error fetching user:", userError);
  }
  if (!user) {
    throw new Error("You must be logged in to use AI.");
  }
  const eightHoursAgo = new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString();
  const { count, error: countError } = await supabase
    .from("ai_used")
    .select("id", { count: "exact" })
    .eq("user_id", user.id)
    .gte("used_at", eightHoursAgo);

  if (countError) {
    console.error("Error counting AI usage:", countError);
  }
  if ((count ?? 0) >= 3) {
    throw new Error(
      "You have exceeded 3 AI uses in the last 8 hours. Please try again later."
    );
  }
  const { error } = await supabase
    .from("ai_used")
    .insert<Partial<AiUsed>>({ user_id: user.id });
  if (error) {
    console.error("Error recording AI usage:", error);
  }
}

async function generateCourseContent(
  inputText: string,
  coursesAmount: number,
  difficultyLevel: string,
  testsAmount: number,
  learningMaterialsAmount: number,
  pdfText: string
): Promise<GeneratedCourse | null> {
  try {
    if (coursesAmount > 6) {
      return null;
    }

    const prompt = String.raw`
    You are an expert instructional-designer LLM.
    
    ======================  HARD STRUCTURE RULES  ======================
    Return **valid JSON only** (no markdown, no commentary).
    If any rule is broken, return the single string "INVALID".
    
    Generete exactly ${testsAmount} for each module.
    Generate exactly ${learningMaterialsAmount} for each module.
    Generate exactly ${coursesAmount} modules.
    Each module must have a title, description, learningMaterials, and tests.

    Strictly follow the JSON schema.
    
    ======================  CONTENT GUIDELINES  ======================
    • User requested topic: "${inputText}"
    • If topic is to create course from pdf file, use the REFERENCE MATERIAL to generate the course.
    • Do not mention that you used pdf or any other source.
    • Difficulty: ${difficultyLevel}
    • Use clear, measurable Bloom-style verbs in "learningOutcomes".
    • Audience: self-directed online learners; prerequisites should be realistic.

    ======================  REFERENCE MATERIAL  ======================
    ${pdfText ? pdfText : "(none)"}
    `;

    const response = await openai.responses.create({
      model: "gpt-4.1-nano-2025-04-14",
      input: [{ role: "user", content: prompt }],
      text: {
        format: {
          type: "json_schema",
          name: "GeneratedCourse",
          schema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description:
                  "The name of the course. Create on your own based on course content.",
              },
              description: {
                type: "string",
                description: "A brief description of the course.",
              },
              color: {
                type: "string",
                description: "The pastel color associated with the course.",
              },
              type: {
                type: "string",
                description:
                  "The type of course such as programming, science, or history.",
              },
              course_details: {
                type: "array",
                description: "Details specific to the course.",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "number",
                      description: "Unique identifier for the course detail.",
                    },
                    course_detail: {
                      type: "string",
                      description: "Description of the course detail.",
                    },
                  },
                  required: ["id", "course_detail"],
                  additionalProperties: false,
                },
              },
              what_w_learn: {
                type: "array",
                description: "Learning outcomes of the course.",

                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "number",
                      description:
                        "Unique identifier for the learning outcome.",
                    },
                    description: {
                      type: "string",
                      description: "Description of what will be learned.",
                    },
                  },
                  required: ["id", "description"],
                  additionalProperties: false,
                },
              },
              modules: {
                type: "array",
                minItems: coursesAmount,
                maxItems: coursesAmount,
                description: `The modules included in the course. Each module corresponds to one major topic (chapter). This is VERY IMPRORTANT to generate EXACTLY ${coursesAmount} chapters.`,
                strict: true,
                items: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string",
                      description: "The title of the module.",
                    },
                    description: {
                      type: "string",
                      description: "Description of the module.",
                    },
                    learningMaterials: {
                      type: "array",
                      minItems: learningMaterialsAmount,
                      maxItems: learningMaterialsAmount,
                      description: `Learning materials associated with each chapter. This is VERY IMPRORTANT to generate EXACTLY ${learningMaterialsAmount} learning materials items per each chapter, and each learning material should have 5 flashcards.`,
                      strict: true,
                      items: {
                        type: "object",
                        properties: {
                          title: {
                            type: "string",
                            description: "Title of the learning material.",
                          },
                          cards: {
                            type: "array",
                            minItems: 5,
                            maxItems: 5,
                            description:
                              "Cards related to the learning materials.",
                            items: {
                              $ref: "#/$defs/Card",
                            },
                          },
                        },
                        required: ["title", "cards"],
                        additionalProperties: false,
                      },
                    },
                    tests: {
                      type: "array",
                      minItems: testsAmount,
                      maxItems: testsAmount,
                      description: `Tests related to the module, if applicable. **exactly ${testsAmount} items for each module**`,
                      items: {
                        type: "object",
                        properties: {
                          question: {
                            type: "string",
                            description: "The main question of the test.",
                          },
                          questions: {
                            type: "array",
                            description:
                              "Sub-questions associated with the test.",
                            items: {
                              type: "object",
                              properties: {
                                question: {
                                  type: "string",
                                  description: "The sub-question text.",
                                },
                                answers: {
                                  type: "array",
                                  description:
                                    "Possible answers for the sub-question.",
                                  items: {
                                    type: "object",
                                    properties: {
                                      text: {
                                        type: "string",
                                        description: "The text of the answer.",
                                      },
                                      correct: {
                                        type: "boolean",
                                        description:
                                          "Indicates if the answer is correct.",
                                      },
                                    },
                                    required: ["text", "correct"],
                                    additionalProperties: false,
                                  },
                                },
                              },
                              required: ["question", "answers"],
                              additionalProperties: false,
                            },
                          },
                        },
                        required: ["question", "questions"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: [
                    "title",
                    "description",
                    "learningMaterials",
                    "tests",
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: [
              "name",
              "description",
              "color",
              "type",
              "course_details",
              "what_w_learn",
              "modules",
            ],
            additionalProperties: false,
            $defs: {
              Card: {
                type: "object",
                properties: {
                  front: {
                    type: "string",
                    description: "Front text of the card.",
                  },
                  back: {
                    type: "string",
                    description: "Back text of the card.",
                  },
                },
                required: ["front", "back"],
                additionalProperties: false,
              },
            },
          },
          strict: true,
        },
      },
    });

    const generatedContent = JSON.parse(response.output_text);
    return generatedContent as GeneratedCourse;
  } catch (error) {
    console.error("Error generating course content:", error);
    return null;
  }
}

async function extractTextFromPdfFile(pdfFile: File): Promise<string> {
  const arrayBuffer = await pdfFile.arrayBuffer();

  const buffer = Buffer.from(arrayBuffer);

  const data = await pdfParse.default(buffer);

  const rawPdfText = data.text;
  const pdfText = rawPdfText

    .replace(/(\r\n|\n|\r)/gm, " ")

    .replace(/Page\s+\d+\s+of\s+\d+/gi, "")

    .replace(/\s\s+/g, " ")
    .trim();

  const limitBytes = 1 * 1024 * 1024;
  let trimmedText = pdfText;
  if (Buffer.byteLength(trimmedText, "utf-8") > limitBytes) {
    trimmedText = trimmedText.slice(0, limitBytes);
  }

  return trimmedText;
}

export async function createCourseWithAI(
  inputText: string,
  modulesAmount: number,
  difficultyLevel: string,
  testsAmount: number,
  learningMaterialsAmount: number,
  pdfFile?: File
): Promise<{ success: boolean; message: string; courseId?: number }> {
  try {
    if (!inputText) {
      return { success: false, message: "Input text is required." };
    }
    if (!modulesAmount || modulesAmount < 1) {
      return {
        success: false,
        message: "Modules amount must be greater than 0.",
      };
    }
    if (!difficultyLevel) {
      return { success: false, message: "Difficulty level is required." };
    }

    let pdfText = "";
    if (pdfFile) {
      pdfText = await extractTextFromPdfFile(pdfFile);
    }

    await recordAiUsage();
    const generatedCourse = await generateCourseContent(
      inputText,
      modulesAmount,
      difficultyLevel,
      testsAmount,
      learningMaterialsAmount,
      pdfText
    );

    if (!generatedCourse) {
      return { success: false, message: "Failed to generate course content." };
    }

    const modules = generatedCourse.modules;

    const createdCourse = await createCourse({
      name: generatedCourse.name,
      description: generatedCourse.description,
      color: generatedCourse.color,
      type: generatedCourse.type,
      course_details: generatedCourse.course_details.map((detail, index) => ({
        id: index + 1,
        course_detail: detail.course_detail,
      })),

      what_w_learn: generatedCourse.what_w_learn.map((outcome, index) => ({
        id: index + 1,
        description: outcome.description,
      })),
    });

    if (!createdCourse) {
      return { success: false, message: "Failed to create the course." };
    }
    const courseId = createdCourse.id;

    const parseCorrect = (val: boolean | string | number): boolean => {
      if (typeof val === "boolean") return val;
      if (typeof val === "string") return val.toLowerCase() === "true";
      if (typeof val === "number") return val === 1;
      return false;
    };

    for (const generatedModule of modules) {
      const createdBlock = await createBlock(
        courseId,
        generatedModule.title,
        generatedModule.description
      );

      if (!createdBlock) {
        console.warn(
          `Failed to create module: ${generatedModule.title}. Skipping.`
        );
        continue;
      }
      const blockId = createdBlock.id;
      if (generatedModule.learningMaterials) {
        for (const generatedMaterial of generatedModule.learningMaterials) {
          const createdMaterial = await createMaterial(
            {
              title: generatedMaterial.title,
              block_id: blockId,
            },
            generatedMaterial.cards
          );
          if (!createdMaterial) {
            console.warn(
              `Failed to create learning material: ${generatedMaterial.title}. Skipping.`
            );
          }
        }
      }

      if (generatedModule.tests) {
        for (const generatedTest of generatedModule.tests) {
          const testData: TestDataWithQuestion = {
            block_id: blockId,
            question: generatedTest.question || "",
            questions: (generatedTest.questions || []).map((q, idx) => ({
              id: idx + 1,
              question: q.question || "",
              answers: (q.answers || []).map((opt, i) => ({
                id: `${i + 1}`,
                text: opt.text || "",
                correct: parseCorrect(opt.correct),
              })),
            })),
            answers: (generatedTest.questions || []).flatMap((q, qi) =>
              (q.answers || []).map((opt, i) => ({
                id: `${qi + 1}-${i + 1}`,
                text: opt.text || "",
                correct: parseCorrect(opt.correct),
              }))
            ),
          };

          await createTest(testData);
        }
      }
    }

    return {
      success: true,
      message: "Course created successfully!",
      courseId: createdCourse.id,
    };
  } catch (error) {
    console.error("Error creating course with AI:", error);
    return {
      success: false,
      message: (error as Error).message || "An error occurred.",
    };
  }
}
