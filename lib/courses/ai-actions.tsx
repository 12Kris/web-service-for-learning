import { createCourse } from "@/lib/courses/actions";
import { createBlock } from "@/lib/tests/actions";
import { createMaterial } from "@/lib/tests/actions";
import { createTest } from "@/lib/tests/actions";
import { TestData } from "@/lib/types/test";
import { TestDataWithQuestion } from "@/lib/types/test";


import { Card } from "@/lib/types/card";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY || 'My-API-Key', // Use client-safe key if available
  dangerouslyAllowBrowser: true,
});

interface GeneratedCourse {
  name: string;
  description: string;
  type: string; // e.g., "programming", "science", "history"
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

async function generateCourseContent(
  inputText: string, coursesAmount: number, difficultyLevel: string
): Promise<GeneratedCourse | null> {
  try {
    if (coursesAmount>6) {
      return null;
    }

    const prompt = `Create a course with difficulty level of ${difficultyLevel} outline based on the following topic: "${inputText}". 
        The course should include:
        - Course Name
        - Course Description
        - Course Type (e.g., programming, science, history)
        - Course Details (e.g., prerequisites, target audience)
        - A list of Learning Outcomes (at least 3). Each outcome should be a clear statement of what the learner will be able to do after completing the course.
        - A list of Modules exactly ${coursesAmount}. Each module should have:
          - Module Title
          - Module Description
          - List of Learning Materials. Create at least 3 learning materials for each module. Each learning material should have:
            - Learning Material Title
            - A list of flashcards (at least 3). Each flashcard should have:
              - Front text
              - Back text
          - List of Tests. Create at least 3 tests for each module. Each test should have:
            - A general question/prompt for the test.
            - A list of specific questions (at least 3). Each question should have:
              - Question text
              - A list of answers (at least 3). Exactly ONE answer should be marked as correct.
        `;

        const response = await openai.responses.create({
          model: "gpt-4o-2024-08-06",
          input: [
            {"role": "user", "content": prompt}
          ],
          text: {
            format: {
              type: "json_schema",
                "name": "GeneratedCourse",
                "schema": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string",
                      "description": "The name of the course."
                    },
                    "description": {
                      "type": "string",
                      "description": "A brief description of the course."
                    },
                    "type": {
                      "type": "string",
                      "description": "The type of course such as programming, science, or history."
                    },
                    "course_details": {
                      "type": "array",
                      "description": "Details specific to the course.",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "number",
                            "description": "Unique identifier for the course detail."
                          },
                          "course_detail": {
                            "type": "string",
                            "description": "Description of the course detail."
                          }
                        },
                        "required": [
                          "id",
                          "course_detail"
                        ],
                        "additionalProperties": false
                      }
                    },
                    "what_w_learn": {
                      "type": "array",
                      "description": "Learning outcomes of the course.",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "number",
                            "description": "Unique identifier for the learning outcome."
                          },
                          "description": {
                            "type": "string",
                            "description": "Description of what will be learned."
                          }
                        },
                        "required": [
                          "id",
                          "description"
                        ],
                        "additionalProperties": false
                      }
                    },
                    "modules": {
                      "type": "array",
                      "description": "The modules included in the course.",
                      "items": {
                        "type": "object",
                        "properties": {
                          "title": {
                            "type": "string",
                            "description": "The title of the module."
                          },
                          "description": {
                            "type": "string",
                            "description": "Description of the module."
                          },
                          "learningMaterials": {
                            "type": "array",
                            "description": "Learning materials associated with the module.",
                            "items": {
                              "type": "object",
                              "properties": {
                                "title": {
                                  "type": "string",
                                  "description": "Title of the learning material."
                                },
                                "cards": {
                                  "type": "array",
                                  "description": "Cards related to the learning materials.",
                                  "items": {
                                    "$ref": "#/$defs/Card"
                                  }
                                }
                              },
                              "required": [
                                "title",
                                "cards"
                              ],
                              "additionalProperties": false
                            }
                          },
                          "tests": {
                            "type": "array",
                            "description": "Tests related to the module, if applicable.",
                            "items": {
                              "type": "object",
                              "properties": {
                                "question": {
                                  "type": "string",
                                  "description": "The main question of the test."
                                },
                                "questions": {
                                  "type": "array",
                                  "description": "Sub-questions associated with the test.",
                                  "items": {
                                    "type": "object",
                                    "properties": {
                                      "question": {
                                        "type": "string",
                                        "description": "The sub-question text."
                                      },
                                      "answers": {
                                        "type": "array",
                                        "description": "Possible answers for the sub-question.",
                                        "items": {
                                          "type": "object",
                                          "properties": {
                                            "text": {
                                              "type": "string",
                                              "description": "The text of the answer."
                                            },
                                            "correct": {
                                              "type": "boolean",
                                              "description": "Indicates if the answer is correct."
                                            }
                                          },
                                          "required": [
                                            "text",
                                            "correct"
                                          ],
                                          "additionalProperties": false
                                        }
                                      }
                                    },
                                    "required": [
                                      "question",
                                      "answers"
                                    ],
                                    "additionalProperties": false
                                  }
                                }
                              },
                              "required": [
                                "question",
                                "questions"
                              ],
                              "additionalProperties": false
                            }
                          }
                        },
                        "required": [
                          "title",
                          "description",
                          "learningMaterials",
                          "tests"
                        ],
                        "additionalProperties": false
                      }
                    }
                  },
                  "required": [
                    "name",
                    "description",
                    "type",
                    "course_details",
                    "what_w_learn",
                    "modules"
                  ],
                  "additionalProperties": false,
                  "$defs": {
                    "Card": {
                      "type": "object",
                      "properties": {
                        "front": {
                          "type": "string",
                          "description": "Front text of the card."
                        },
                        "back": {
                          "type": "string",
                          "description": "Back text of the card."
                        }
                      },
                      "required": [
                        "front",
                        "back"
                      ],
                      "additionalProperties": false
                    }
                  }
                },
                "strict": true
            }
          }
        });
        
        console.log("Generated content:", response.output_text);


    const generatedContent = JSON.parse(response.output_text);
    return generatedContent as GeneratedCourse;
  } catch (error) {
    console.error("Error generating course content:", error);
    return null;
  }
}

export async function createCourseWithAI(
  inputText: string, modulesAmount: number, difficultyLevel: string
): Promise<{ success: boolean; message: string; courseId?: number }> {
  try {
    if (!inputText) {
      return { success: false, message: "Input text is required." };
    }
    if (!modulesAmount || modulesAmount < 1) {
      return { success: false, message: "Modules amount must be greater than 0." };
    }
    if (!difficultyLevel) {
      return { success: false, message: "Difficulty level is required." };
    }
    const generatedCourse = await generateCourseContent(inputText, modulesAmount, difficultyLevel);
    console.log("Generated content:", generatedCourse);


    if (!generatedCourse) {
      return { success: false, message: "Failed to generate course content." };
    }

    // Ensure modules exist or default to empty array
    const modules = generatedCourse.modules;

    console.log("Modules:", modules);

    // Create the course
    const createdCourse = await createCourse({
      name: generatedCourse.name,
      description: generatedCourse.description,
      type: generatedCourse.type,
      course_details: generatedCourse.course_details.map((detail, index) => ({
        id: index + 1, // Adding a temporary id
        course_detail: detail.course_detail,
      })),
      // curriculum: modules.map((m, index) => ({
      //   id: index + 1, // Adding a temporary id
      //   title: m.title,
      //   description: m.description,
      //   duration: "", // Provide a default or calculate
      //   lessons: [], // Will be populated based on learning materials
      //   isActive: true, // Default
      //   isCompleted: false, // Default
      //   progress: 0, // Default
      // })),
      what_w_learn: generatedCourse.what_w_learn.map((outcome, index) => ({
        id: index + 1, // Adding a temporary id
        description: outcome.description,
      })),
    });



    

    if (!createdCourse) {
      return { success: false, message: "Failed to create the course." };
    }
    const courseId = createdCourse.id;

    // Create modules, learning materials, and tests
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

          

          // Build testData based on generated test details
          const testData: TestDataWithQuestion = {
            block_id: blockId, // using module id as block id
            question: generatedTest.question || "", // updated property from q.text to q.question
            questions: (generatedTest.questions || []).map((q: any, idx: number) => ({
              id: idx + 1,
              question: q.question || "", // updated property from q.text to q.question
              answers: (q.answers || []).map((opt: any, i: number) => ({
                id: `${i + 1}`,
                text: opt.text || "",
                correct: Boolean(opt.correct)
              }))
            })),
            answers: (generatedTest.questions || []).flatMap((q: any) =>
              (q.answers || []).map((opt: any) => ({
                text: opt.text || "",
                correct: Boolean(opt.correct)
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