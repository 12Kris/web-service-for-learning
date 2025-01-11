"use server";
import {supabase} from "@/lib/supabaseClient";
import {getUser} from "@/lib/auth/actions";
import {
    Block,
    Course,
    CourseWithStudents,
    LearningMaterial,
    SaveTestResult,
    Test, TestQuestion,
    UserTestAnswer
} from "@/lib/definitions";

export async function getCourseById(courseId: number | null) {
    const {data, error} = await supabase
        .from("Course")
        .select("*, creator:creator_id (id, email, full_name)")
        .eq("id", courseId)
        .single();

    if (error) {
        console.error("Error fetching course:", error);
        return error;
    }

    return data;
}

export async function getCardsByBlock(blockId: string) {
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

export async function isCourseAddedToUser(courseId: number | null) {
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

// export async function addCourseToUser(courseId: string, userId: string) {
//   try {
//     const user = await getUser();
//     console.log(userId);
//
//     if (!user) {
//       throw new Error("User not authenticated");
//     }
//     const { data, error } = await supabase
//       .from("user_courses")
//       .insert([{ user_id: user.id, course_id: courseId }]);
//
//     if (error) {
//       throw new Error(`Failed to add course: ${error.message}`);
//     }
//
//     return data;
//   } catch (error) {
//     console.error("Error adding course to user:", error);
//     throw new Error(
//       (error as Error).message || "An error occurred while adding the course"
//     );
//   }
// }

export async function addCourseToUser(courseId: number): Promise<{ success: boolean; message: string }> {
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

        const {error: insertError} = await supabase
            .from("UserCourse")
            .insert({user_id: user.id, course_id: courseId});

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

export async function getCourses(): Promise<Course[]> {
    const {data, error} = await supabase.from("Course").select(`
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

export async function getTests(courseId: number): Promise<Test[]> {
    const {data, error} = await supabase
        .from('Test')
        .select(`
            id,
            question,
            block_id,
            Block:Block!Test_block_id_fkey (
                id,
                name,
                Course:Course!Block_course_id_fkey (
                    id,
                    name
                )
            )
        `)
        .eq('Block.course_id', courseId);

    if (error) {
        console.error('Error fetching tests:', error);
        return [];
    }

    return data.map((item: any) => ({
        id: item.id,
        question: item.question,
        block_id: item.block_id,
        Block: {
            id: item.Block.id,
            name: item.Block.name,
            Course: {
                id: item.Block.Course.id,
                name: item.Block.Course.name,
            },
        },
    }));
}

export async function getModulesByCourseId(courseId: number | null): Promise<Block[]> {
    const {data, error} = await supabase
        .from("Block")
        .select("id, course_id, name")
        .eq("course_id", courseId);

    if (error) {
        console.error("Error fetching blocks:", error);
        return [];
    }

    return data as Block[];
}

export async function getTestsByBlockId(blockId: number): Promise<Test[]> {
    const {data, error} = await supabase
        .from("Test")
        .select("id, block_id, question")
        .eq("block_id", blockId);

    if (error) {
        console.error("Error fetching tests:", error);
        return [];
    }

    return data as Test[];
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
        console.error("Error fetching test questions:", error);
        return [];
    }

    return data.map((item: any) => {
        const answersWithCorrect = item.answers.map((answer: any) => ({
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

        const {error: answersError} = await supabase
            .from('test_answers')
            .insert(
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

export async function createCourse(
    courseData: Omit<Course, "id" | "creator_id" | "creator">
): Promise<Course | null> {
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

        return data;
    } catch (error) {
        console.error("Error in createCourse:", error);
        throw new Error(
            (error as Error).message || "An error occurred while creating the course"
        );
    }
}

export async function deleteCourse(courseId: number): Promise<{ success: boolean; message: string }> {
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
    courseId: string,
    courseData: Partial<Course>
) {
    try {
        const user = await getUser();

        if (!user) {
            throw new Error("User not authenticated");
        }

        if (courseData.creator_id !== user.id) {
            throw new Error("You don't have permission to update this course");
        }

        const {data, error} = await supabase
            .from("Course")
            .update(courseData)
            .eq("id", courseId);

        if (error) {
            console.error("Error updating course:", error);
            throw new Error(`Failed to update course: ${error.message}`);
        }

        return data;
    } catch (error) {
        console.error("Error in updateCourse:", error);
        throw new Error(
            (error as Error).message || "An error occurred while updating the course"
        );
    }
}
