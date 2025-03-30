"use server";
// import { supabase } from "@/utils/supabase/client";
import {getUser} from "@/utils/supabase/server";
import {Course, CourseWithStudents} from "@/lib/types/course";
import {LearningMaterial} from "@/lib/types/learning";
// import { Test, TestQuestionForCourse, UserTestAnswer } from "@/lib/types/test";
import {TestData, TestQuestionForCourse} from "@/lib/types/test";
// import { SaveTestResult } from "@/lib/types/test";
import {Module} from "@/lib/types/modules";
import {createClient} from "@/utils/supabase/server";

// import { getUser } from "@/utils/supabase/server";

export async function getCourseById(courseId: number) {
    const supabase = await createClient();
    const {data, error} = await supabase
        .from("Course")
        // Removed "description" from the embedded profile selection
        .select(
            "*, creator:profiles!Course_creator_id_fkey1 (id, email, full_name, bio)"
        )
        .eq("id", courseId)
        .single();

    if (error) {
        console.error("Error fetching course:", JSON.stringify(error, null, 2));
        return null;
    }

    return data;
}

export async function getCardsByBlock(blockId: number) {
    const supabase = await createClient();
    const {data, error} = await supabase
        .from("Card")
        .select("*")
        .eq("block_id", blockId);

    if (error) {
        console.error("Error fetching cards:", error);
        return [];
    }

    return data;
}

export async function isCourseAddedToUser(courseId: number) {
    const supabase = await createClient();
    const user = await getUser();
    if (!user) {
        throw new Error("User not authenticated");
    }

    const {data, error} = await supabase
        .from("UserCourse")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", courseId);

    if (error) {
        console.error("Error checking if course is added:", error);
        return false;
    }

    return data.length > 0;
}

export async function getUserCourses() {
    const supabase = await createClient();
    try {
        const user = await getUser();

        if (!user) {
            throw new Error("User not authenticated");
        }

        const {data, error} = await supabase
            .from("UserCourse")
            .select("course_id")
            .eq("user_id", user.id);

        if (error) {
            return [];
        }

        const courseIds = data.map((item) => item.course_id);

        const {data: courses, error: courseError} = await supabase
            .from("Course")
            .select("*")
            .in("id", courseIds);

        if (courseError) {
            return [];
        }

        return courses;
    } catch (error) {
        console.error("Error fetching user courses:", error);
        return [];
    }
}

export async function addCourseToUser(
    courseId: number
): Promise<{ success: boolean; message: string }> {
    const supabase = await createClient();
    try {
        const user = await getUser();

        if (!user) {
            throw new Error("User not authenticated");
        }

        const {data: course, error: courseError} = await supabase
            .from("Course")
            .select("id")
            .eq("id", courseId)
            .single();

        if (courseError || !course) {
            throw new Error("Course not found");
        }

        const {data: existingUserCourse} = await supabase
            .from("UserCourse")
            .select("*")
            .eq("user_id", user.id)
            .eq("course_id", courseId)
            .single();

        if (existingUserCourse) {
            return {success: false, message: "You have already added this course"};
        }
        // spaced_repetition
        const startDate = new Date().toISOString().split("T")[0];
        const schedule = [1, 3, 7, 14, 30];
        const nextReviewDates = schedule.map(days => {
            const date = new Date();
            date.setDate(date.getDate() + days);
            return date.toISOString().split("T")[0];
        });

        const spacedRepetition = {
            start_date: startDate,
            schedule,
            next_review_dates: nextReviewDates
        };

        const {error: insertError} = await supabase
            .from("UserCourse")
            .insert({
                user_id: user.id,
                course_id: courseId,
                spaced_repetition: spacedRepetition
            });

        if (insertError) {
            throw new Error(`Failed to add course: ${insertError.message}`);
        }

        return {success: true, message: "Course added successfully"};
    } catch (error) {
        console.error("Error adding course to user:", error);
        return {
            success: false,
            message:
                (error as Error).message || "An error occurred while adding the course",
        };
    }
}

export async function removeCourseFromUser(
    courseId: number
): Promise<{ success: boolean; message: string }> {
    const supabase = await createClient();
    try {
        const user = await getUser();

        if (!user) {
            throw new Error("User not authenticated");
        }

        const {data: course, error: courseError} = await supabase
            .from("Course")
            .select("id")
            .eq("id", courseId)
            .single();

        if (courseError || !course) {
            throw new Error("Course not found");
        }

        const {data: existingUserCourse} = await supabase
            .from("UserCourse")
            .select("*")
            .eq("user_id", user.id)
            .eq("course_id", courseId)
            .single();

        if (!existingUserCourse) {
            return {success: false, message: "You have not added this course"};
        }

        const {error: deleteError} = await supabase
            .from("UserCourse")
            .delete()
            .eq("user_id", user.id)
            .eq("course_id", courseId);

        if (deleteError) {
            throw new Error(`Failed to remove course: ${deleteError.message}`);
        }

        return {success: true, message: "Course removed successfully"};
    } catch (error) {
        console.error("Error removing course from user:", error);
        return {
            success: false,
            message:
                (error as Error).message ||
                "An error occurred while removing the course",
        };
    }
}

export async function getUserCreatedCourses(): Promise<Course[]> {
    const supabase = await createClient();
    try {
        const user = await getUser();
        if (!user) throw new Error("User not authenticated");

        const {data, error} = await supabase
            .from("Course")
            .select("*, student_count: user_courses(count)")
            .eq("creator_id", user.id);

        if (error) {
            console.error("Error fetching courses from Supabase:", error);
            return [];
        }

        if (!data) return [];

        return data.map((course) => ({
            ...course,
            student_count: course.student_count
                ? course.student_count[0]?.count || 0
                : 0,
        })) as CourseWithStudents[];
    } catch (error) {
        console.error("Error fetching user created courses:", error);
        return [];
    }
}

export async function getCourses(): Promise<Course[]> {
    const supabase = await createClient();
    const {data, error} = await supabase.from("Course").select(`
        *,
        creator:profiles!Course_creator_id_fkey1 (
          id,
          email,
          full_name
        )
      `);

    if (error) {
        console.error("Error fetching courses:", JSON.stringify(error, null, 2));
        return [];
    }

    return data as Course[];
}

export async function getCoursesWithUserProgress(): Promise<Course[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.from("Course").select(`
      *,
      creator:profiles!Course_creator_id_fkey1 (
        id,
        email,
        full_name
      ),
      user_progress:UserCourse!inner (
        spaced_repetition
      )
    `);

    if (error) {
        console.error("Error fetching courses:", JSON.stringify(error, null, 2));
        return [];
    }

    return data as Course[];
}


export async function createCourse(
    courseData: Omit<Course, "id" | "creator_id" | "creator">
): Promise<Course | null> {
    const supabase = await createClient();
    try {
        const user = await getUser();

        if (!user) {
            throw new Error("User not authenticated");
        }

        const {data, error} = await supabase
            .from("Course")
            .insert({
                ...courseData,
                creator_id: user.id,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating course:", error);
            throw new Error(`Failed to create course: ${error.message}`);
        }

        if (courseData.curriculum && Array.isArray(courseData.curriculum)) {
            const modulesToInsert = courseData.curriculum.map((module) => ({
                course_id: data.id,
                name: module.title,
                description: module.description ?? null,
            }));

            const {error: moduleError} = await supabase
                .from("Module")
                .insert(modulesToInsert);

            if (moduleError) {
                console.error("Error inserting modules:", moduleError);
                throw new Error(`Failed to insert modules: ${moduleError.message}`);
            }
        }

        return data;
    } catch (error) {
        console.error("Error in createCourse:", error);
        throw new Error(
            (error as Error).message || "An error occurred while creating the course"
        );
    }
}

export async function deleteCourse(
    courseId: number
): Promise<{ success: boolean; message: string }> {
    const supabase = await createClient();
    try {
        const user = await getUser();

        if (!user) {
            throw new Error("User not authenticated");
        }

        const {data: course, error: fetchError} = await supabase
            .from("Course")
            .select("creator_id")
            .eq("id", courseId)
            .single();

        if (fetchError) {
            throw new Error("Failed to fetch course");
        }

        if (course.creator_id !== user.id) {
            throw new Error("You don't have permission to delete this course");
        }

        const {error: deleteError} = await supabase
            .from("Course")
            .delete()
            .eq("id", courseId);

        if (deleteError) {
            throw new Error(`Failed to delete course: ${deleteError.message}`);
        }

        return {
            success: true,
            message: "Course and all related data deleted successfully",
        };
    } catch (error) {
        console.error("Error in deleteCourse:", error);
        return {
            success: false,
            message:
                (error as Error).message ||
                "An error occurred while deleting the course",
        };
    }
}

export async function updateCourse(
    courseId?: number,
    courseData?: Partial<Course>,
    creator_id?: string | undefined
) {
    const supabase = await createClient();
    try {
        const user = await getUser();

        if (!user) {
            throw new Error("User not authenticated");
        }

        if (creator_id !== user.id) {
            throw new Error("You don't have permission to update this course");
        }

        const {error} = await supabase
            .from("Course")
            .update(courseData)
            .eq("id", courseId);
        // TODO: make logic module
        if (error) {
            console.error("Error updating course:", error);
            throw new Error(`Failed to update course: ${error.message}`);
        }

        if (courseData?.curriculum && Array.isArray(courseData.curriculum)) {
            const {data: existingModules, error: fetchError} = await supabase
                .from("Module")
                .select("name")
                .eq("course_id", courseId);

            if (fetchError) {
                console.error("Error fetching existing modules:", fetchError);
                throw new Error(`Failed to fetch modules: ${fetchError.message}`);
            }

            const existingModuleNames = new Set(
                existingModules?.map((mod) => mod.name)
            );

            const newModules = courseData.curriculum.filter(
                (module) => !existingModuleNames.has(module.title)
            );

            if (newModules.length > 0) {
                const modulesToInsert = newModules.map((module) => ({
                    course_id: courseId,
                    name: module.title,
                    description: module.description,
                    duration: module.duration ?? null,
                }));

                const {error: moduleError} = await supabase
                    .from("Module")
                    .insert(modulesToInsert);

                if (moduleError) {
                    console.error("Error inserting new modules:", moduleError);
                    throw new Error(
                        `Failed to insert new modules: ${moduleError.message}`
                    );
                }
            }
        }

        return {message: "Course updated successfully"};
    } catch (error) {
        console.error("Error in updateCourse:", error);
        throw new Error(
            (error as Error).message || "An error occurred while updating the course"
        );
    }
}

export async function getStudentCountForCourse(courseId: string) {
    const supabase = await createClient();
    try {
        const {data, error} = await supabase
            .from("UserCourse")
            .select("user_id")
            .eq("course_id", courseId);

        if (error) {
            throw new Error(error.message);
        }

        return data.length;
    } catch (error) {
        console.error("Error fetching student count:", error);
        return 0;
    }
}

export async function getCardsByLearningMaterial(learningMaterialId: number) {
    const supabase = await createClient();
    const {data, error} = await supabase
        .from("flashcards")
        .select("*")
        .eq("learning_material_id", learningMaterialId);

    if (error) {
        console.error("Error fetching cards:", error);
        return [];
    }

    return data;
}

export async function getModulesByCourseId(
    courseId: number | null
): Promise<Module[]> {
    const supabase = await createClient();
    const {data, error} = await supabase
        .from("Module")
        .select("id, course_id, name, description")
        .eq("course_id", courseId);

    if (error) {
        console.error("Error fetching modules:", error);
        return [];
    }

    return data.map((module) => ({
        id: module.id,
        course_id: module.course_id,
        name: module.name,
        description: module.description,
        title: module.name,
        duration: "2 weeks",
        lessons: [],
        isActive: true,
        isCompleted: false,
        progress: 0,
    }));
}

export async function getTestsByBlockId(blockId: number): Promise<TestData[]> {
    const supabase = await createClient();
    const {data, error} = await supabase
        .from("Test")
        .select("id, block_id, question, TestQuestions(id, question)")
        .eq("block_id", blockId);

    if (error) {
        console.error("Error fetching tests:", error);
        return [];
    }

    return data as unknown as TestData[];
}

export async function getTestQuestions(testId: number): Promise<
    {
        id: number;
        question: string;
        correct_answer: number | undefined;
        answers: { id: number; answer: string; correct: boolean; text: string }[];
    }[]
> {
    const supabase = await createClient();
    const {data, error} = await supabase
        .from("TestQuestions")
        .select(
            `
            id,
            question,
            correct_id:TestAnswers!TestQuestions_correct_id_fkey(id),
            answers:TestAnswers!TestAnswers_question_id_fkey (
                id,
                answer
            )
        `
        )
        .eq("test_id", testId);

    if (error) {
        console.error("Error fetching test questions:", error);
        return [];
    }

    return (data as unknown as TestQuestionForCourse[]).map((item) => {
        const answersWithCorrect = item.answers.map((answer) => ({
            ...answer,
            correct: answer.id === item.correct_id,
        }));

        return {
            id: item.id,
            question: item.question,
            correct_answer: item.correct_id,
            answers: answersWithCorrect,
        };
    });
}

export async function getMaterialsByBlockId(
    blockId: number
): Promise<LearningMaterial[]> {
    const supabase = await createClient();
    const {data, error} = await supabase
        .from("LearningMaterial")
        .select(
            "id, block_id, title, content, material_type, order_number, flashcards(id, front, back)"
        )
        .eq("block_id", blockId)
        .order("order_number", {ascending: true});

    if (error) {
        console.error("Error fetching learning materials:", error);
        return [];
    }

    return data as LearningMaterial[];
}

export async function updateQuestion(questionId: number, questionText: string) {
    const supabase = await createClient();
    const {error} = await supabase
        .from("TestQuestions")
        .update({question: questionText})
        .eq("id", questionId);

    if (error) throw error;
}

export async function updateFlashcard(
    cardId: number,
    front: string,
    back: string
) {
    const supabase = await createClient();
    const {error} = await supabase
        .from("flashcards")
        .update({front, back})
        .eq("id", cardId);

    if (error) return error;
}

export async function deleteQuestion(questionId: number) {
    const supabase = await createClient();
    const {error} = await supabase
        .from("TestQuestions")
        .delete()
        .eq("id", questionId);

    if (error) throw error;
}

export async function deleteFlashcard(cardId: number) {
    const supabase = await createClient();
    const {error} = await supabase.from("flashcards").delete().eq("id", cardId);

    if (error) throw error;
}
