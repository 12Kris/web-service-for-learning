"use server";
import { createCourse } from "@/lib/courses/actions";
import { createBlock } from "@/lib/tests/actions";
import { createMaterial } from "@/lib/tests/actions";
import { createTest } from "@/lib/tests/actions";
import { TestDataWithQuestion } from "@/lib/types/test";

import { Card } from "@/lib/types/card";
import OpenAI from "openai";
import { createClient } from "@/utils/supabase/server";

import fs from "fs";
// import pdf from "pdf-parse";

import * as pdfParse from "pdf-parse"

// import * as pdfjsLib from 'pdfjs-dist';

import { pdfjs } from "react-pdf"


import { PDFDocument } from "pdf-lib";

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";
if (!apiKey) {
  throw new Error(
    "Missing OpenAI API Key. Set NEXT_PUBLIC_OPENAI_API_KEY in your Vercel environment variables."
  );
}
const openai = new OpenAI({
  apiKey,
  // dangerouslyAllowBrowser: true,
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

interface GeneratedTestAnswer {
  text: string;
  correct: boolean;
}

interface GeneratedTestQuestion {
  question: string;
  answers: GeneratedTestAnswer[];
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

  console.log("Count of AI uses in last 8 hours:", count);
  console.log("User ID:", user.id);
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
  pdfText: string,
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
    
    Schema (exactly as written):
    {
      "courseName": string,
      "courseDescription": string,
      "courseColor": string,        // pastel HEX, **NOT blue**
      "courseType": string,
      "courseDetails": string,
      "learningOutcomes": string[], // ≥ 3 items
      "modules": [                  // **exactly ${coursesAmount} items**
        {
          "title": string,
          "description": string,
          "learningMaterials": [    // exactly ${learningMaterialsAmount}
            {
              "title": string,
              "flashcards": [       // ≥ 3
                { "front": string, "back": string }
              ]
            }
          ],
          "tests": [                // exactly ${testsAmount}
            {
              "prompt": string,
              "questions": [        // ≥ 3
                {
                  "question": string,
                  "answers": [      // ≥ 3; ONE and only one has "isCorrect": true
                    { "text": string, "isCorrect": boolean }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
    
    ======================  CONTENT GUIDELINES  ======================
    • Topic: "${inputText}"
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
                description: "The name of the course.",
              },
              description: {
                type: "string",
                description: "A brief description of the course.",
              },
              color: {
                type: "string",
                description: "The color associated with the course.",
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
                description: "The modules included in the course.",
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
                      description:
                        "Learning materials associated with the module.",
                      items: {
                        type: "object",
                        properties: {
                          title: {
                            type: "string",
                            description: "Title of the learning material.",
                          },
                          cards: {
                            type: "array",
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
                      description:
                        "Tests related to the module, if applicable.",
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
  // 2️⃣  Read it in
  const arrayBuffer = await pdfFile.arrayBuffer();

  // Convert ArrayBuffer to Buffer for pdf-parse
  const buffer = Buffer.from(arrayBuffer);

  // Directly use pdf-parse without a wrapper class
  const data = await pdfParse.default(buffer)

  const rawPdfText = data.text;
  const pdfText = rawPdfText
    // Remove newlines and carriage returns
    .replace(/(\r\n|\n|\r)/gm, " ")
    // Remove pagination text like "Page 1 of 10"
    .replace(/Page\s+\d+\s+of\s+\d+/gi, "")
    // Collapse multiple spaces into one
    .replace(/\s\s+/g, " ")
    .trim();


          const limitBytes = 1 * 1024 * 1024; // 1 MB in bytes
        let trimmedText = pdfText;
        if (Buffer.byteLength(trimmedText, "utf-8") > limitBytes) {
          trimmedText = trimmedText.slice(0, limitBytes);
        }

  // // 3️⃣  Load with PDF.js
  // const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  // const pdf = await loadingTask.promise;

  // 4️⃣  Walk every page


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
    // let pdfTextPrompt = "";

    console.log("PDF file:", pdfFile);
    let pdfText = "";
    if (pdfFile) {

      pdfText = await extractTextFromPdfFile(pdfFile)

      console.log("PDF text extracted successfully.", pdfText);


      // const uint8Array = fs.readFileSync(pdfFile.name);

      // const arrayBuffer = await pdfFile.arrayBuffer();

      // const pdfDoc3 = await PDFDocument.load(arrayBuffer);


      // console.log("PDF file content:", pdfDoc3.);


        // const pdfDoc = await PDFDocument.open(file);

        // Limit PDF text size to prevent issues with API limits
        // const limitBytes = 1 * 1024 * 1024; // 1 MB in bytes
        // let trimmedText = pdfText;
        // if (Buffer.byteLength(trimmedText, "utf-8") > limitBytes) {
        //   trimmedText = trimmedText.slice(0, limitBytes);
        // }



    }

    // if (pdfFile) {
    //   parsePdf(pdfFile);
    // }

    // const arrayBuffer = await pdfFile.arrayBuffer();
    // const buffer = Buffer.from(arrayBuffer);
    // const { text: pdfText } = await pdfParse(buffer);

    // const limitBytes = 1 * 1024 * 1024;                   // 1 MB in bytes
    // let trimmed = pdfText;
    // if (Buffer.byteLength(trimmed, "utf-8") > limitBytes) {
    //   trimmed = trimmed.slice(0, limitBytes);            // truncate to 1 MB
    // }

    //     pdfTextPrompt = "\n\nUse the following PDF content as material:\n" + pdfText;

    //     console.log("PDF text extracted successfully.", pdfTextPrompt);

    // }

    // ddddddddddddddddddddddddddddddddddddddddddddddddddd

    await recordAiUsage();
    const generatedCourse = await generateCourseContent(
      inputText,
      modulesAmount,
      difficultyLevel,
      testsAmount,
      learningMaterialsAmount,
      pdfText                                  // pass the (possibly empty) prompt
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

    // helper to normalize "correct" values from the AI (boolean|string|number)
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
    // ddddddddddddddddddddddddddddddddddddddddddddddddddd

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
