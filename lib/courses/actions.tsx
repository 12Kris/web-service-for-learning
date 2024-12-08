"use server";

import {supabase} from "@/lib/supabaseClient";
import {getUser} from "@/lib/authActions";
import {
    Card,
    Course,
    CourseWithStudents, LearningBlock, LearningMaterial,
    SaveTestResult,
    Test,
    TestQuestion,
    UserTestAnswer
} from "@/lib/courses/types";

export async function getCourseById(courseId: number): Promise<Course | null> {
    const {data, error} = await supabase
        .from("Course")
        .select("*")
        .eq("id", courseId)
        .single();

    if (error) {
        console.error("Error fetching course:", error);
        return null;
    }

    return data as Course;
}

export async function getTests(): Promise<Test[]> {
    const {data, error} = await supabase
        .from('Test')
        .select(`
      id,
      question,
      Block:Block!Test_block_id_fkey (
        id,
        Course:Course!Block_course_id_fkey (
          id,
          name
        )
      )
    `);

    if (error) {
        console.error('Error fetching tests:', error);
        return [];
    }

    return data.map((item: any) => ({
        id: item.id,
        question: item.question,
        Block: {
            id: item.Block[0]?.id,
            Course: {
                id: item.Block[0]?.Course[0]?.id,
                name: item.Block[0]?.Course[0]?.name,
            },
        },
    }));
}

export async function getTestQuestions(testId: string): Promise<TestQuestion[]> {
    const {data, error} = await supabase
        .from('TestQuestions')
        .select(`
            id,
            question,
            correct_id:TestAnswers!TestQuestions_correct_id_fkey(id),
            answers:TestAnswers!TestAnswers_question_id_fkey (
                id,
                answer
            )
        `)
        .eq('test_id', testId);

    if (error) {
        return [];
    }

    return data.map((item: any) => {
        const answersWithCorrect = item.answers.map((answer: any) => ({
            ...answer,
            correct: answer.id === item.correct_id.id,
        }));

        return {
            id: item.id,
            question: item.question,
            correct_answer: item.correct_id.id,
            answers: answersWithCorrect,
        };
    });
}

export async function saveTestResults(
    testId: string,
    answers: UserTestAnswer[]
): Promise<SaveTestResult> {
    try {
        const user = await getUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        const userId = user.id;

        const {data: previousAttempts, error: attemptsError} = await supabase
            .from('user_test_results')
            .select('id')
            .eq('user_id', userId)
            .eq('test_id', testId);

        if (attemptsError) {
            throw new Error(`Error fetching attempts: ${attemptsError.message}`);
        }

        const attemptNumber = (previousAttempts?.length || 0) + 1;

        const {data: testResult, error: testResultError} = await supabase
            .from('user_test_results')
            .insert([
                {
                    user_id: userId,
                    test_id: testId,
                    score: answers.filter((a) => a.isCorrect).length,
                    attempt_number: attemptNumber,
                },
            ])
            .select('id')
            .single();

        if (testResultError) {
            throw new Error(`Error saving test result: ${testResultError.message}`);
        }

        const {error: answersError} = await supabase.from('test_answers').insert(
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
        console.error('Error saving test results:', error);
        return {error: (error as Error).message};
    }
}

export async function getCardsByBlock(blockId: string): Promise<Card[]> {
    const {data, error} = await supabase
        .from("Card")
        .select("*")
        .eq("block_id", blockId);

    if (error) {
        console.error("Error fetching cards:", error);
        return [];
    }

    return data as Card[];
}

export async function getCourses(): Promise<Course[]> {
    const {data, error} = await supabase
        .from("Course")
        .select(`
      *,
      users:creator_id (
        id,
        email,
        full_name
      )
    `);

    if (error) {
        console.error("Error fetching courses:", error);
        return [];
    }

    return data as Course[];
}

export async function isCourseAddedToUser(userId: string, courseId: number): Promise<boolean> {
    const {data, error} = await supabase
        .from("user_courses")
        .select("*")
        .eq("user_id", userId)
        .eq("course_id", courseId);

    if (error) {
        console.error("Error checking if course is added:", error);
        return false;
    }

    return data.length > 0;
}

export async function getUserCreatedCourses(): Promise<Course[]> {
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
            student_count: course.student_count ? course.student_count[0]?.count || 0 : 0
        })) as CourseWithStudents[];

    } catch (error) {
        console.error("Error fetching user created courses:", error);
        return [];
    }
}


export async function getUserCourses(): Promise<Course[]> {
    try {
        const user = await getUser();
        if (!user) throw new Error("User not authenticated");

        const {data, error} = await supabase
            .from("user_courses")
            .select("course_id")
            .eq("user_id", user.id);

        if (error) {
            console.error("Error fetching user courses:", error);
            return [];
        }

        const courseIds = data.map((item) => item.course_id);

        const {data: courses, error: courseError} = await supabase
            .from("Course")
            .select("*")
            .in("id", courseIds);

        if (courseError) {
            console.error("Error fetching course details:", courseError);
            return [];
        }

        const coursesWithProgress = await Promise.all(
            courses.map(async (course) => {
                const progress = await getCourseProgress(course.id, user.id);
                return {
                    ...course,
                    progress,
                };
            })
        );

        return coursesWithProgress as Course[];
    } catch (error) {
        console.error("Error fetching user courses with progress:", error);
        return [];
    }
}

export async function getTestsByBlockId(blockId: number): Promise<Test[]> {
    const { data, error } = await supabase
        .from("Test")
        .select("id, question")
        .eq("block_id", blockId);

    if (error) {
        console.error("Error fetching tests by block:", error);
        return [];
    }

    return data as Test[];
}

export async function getBlocksByCourseId(courseId: number): Promise<LearningBlock[]> {
    const {data, error} = await supabase
        .from("Block")
        .select("id, name")
        .eq("course_id", courseId);

    if (error) {
        console.error("Error fetching blocks:", error);
        return [];
    }

    return data.map((block) => ({
        id: block.id,
        title: block.name,
        order_number: 0,
    })) as LearningBlock[];
}


export async function getMaterialsByBlockId(blockId: number): Promise<LearningMaterial[]> {
    const {data, error} = await supabase
        .from("LearningMaterial")
        .select("id, title, content, material_type, order_number")
        .eq("block_id", blockId)
        .order("order_number", {ascending: true});

    if (error) {
        console.error("Error fetching learning materials:", error);
        return [];
    }

    return data as LearningMaterial[];
}

export async function getCourseProgress(courseId: number, userId: string): Promise<number> {
    try {
        const {data: totalBlocks, error: blocksError} = await supabase
            .from("Block")
            .select("id")
            .eq("course_id", courseId);

        if (blocksError) {
            console.error("Error fetching total blocks:", blocksError);
            return 0;
        }

        if (!totalBlocks || totalBlocks.length === 0) return 0;

        const {data: completedTests, error: testsError} = await supabase
            .from("user_test_results")
            .select(`
                test_id,
                Test:Test!user_test_results_test_id_fkey (block_id)
            `)
            .eq("user_id", userId);

        if (testsError) {
            console.error("Error fetching completed tests:", testsError);
            return 0;
        }

        const completedBlockIds = Array.from(
            new Set(
                completedTests
                    .map((test: any) => test.Test?.block_id)
                    .filter((blockId: number | null) => blockId !== null)
            )
        );

        const progress = (completedBlockIds.length / totalBlocks.length) * 100;

        return Math.round(progress);
    } catch (error) {
        console.error("Error calculating course progress:", error);
        return 0;
    }
}

export async function addCourseToUser(courseId: number, userId: string): Promise<void> {
    try {
        const user = await getUser();
        if (!user) throw new Error("User not authenticated");

        const {error} = await supabase
            .from("user_courses")
            .insert([{user_id: userId, course_id: courseId}]);

        if (error) throw new Error(`Failed to add course: ${error.message}`);
    } catch (error) {
        console.error("Error adding course to user:", error);
        throw new Error((error as Error).message);
    }
}