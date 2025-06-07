"use server";
import { getUser } from "@/utils/supabase/server";
import { Course } from "@/lib/types/course";
import { LearningMaterial } from "@/lib/types/learning";
import { TestData, TestQuestionForCourse } from "@/lib/types/test";
import { Module } from "@/lib/types/modules";
import { createClient } from "@/utils/supabase/server";
import { cache } from "react";
import { Certificate } from "../types/certificate";

export async function getCourseById(courseId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Course")
    .select(
      "*, creator:profiles!Course_creator_id_fkey (id, email, full_name, bio), student_count:UserCourse(count)"
    )
    .eq("id", courseId)
    .single();

  if (error) {
    console.error("Error fetching course:", JSON.stringify(error, null, 2));
    return null;
  }

  const completed = await isCourseCompleted(courseId);
  return { ...data, isCourseCompleted: completed, student_count: data.student_count?.[0]?.count || 0, };
}

export async function getCardsByBlock(blockId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
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

  const { data, error } = await supabase
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

export const getUserCourses = cache(
  async (offset = 0, limit = 30): Promise<Course[]> => {
    const supabase = await createClient();
    try {
      const user = await getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data: userCourses, error: userCourseError } = await supabase
        .from("UserCourse")
        .select("course_id")
        .eq("user_id", user.id)
        .range(offset, offset + limit - 1);

      if (userCourseError) {
        console.error("Error fetching user course relations:", userCourseError);
        return [];
      }

      if (!userCourses?.length) {
        return [];
      }

      const courseIds = userCourses.map((item) => item.course_id);

      const { data: courses, error: courseError } = await supabase
        .from("Course")
        .select(
          `
        *,
          creator:profiles!Course_creator_id_fkey (
            id,
            full_name
          ),
          student_count:UserCourse(count),
          rating_count
      `
        )
        .in("id", courseIds);

      if (courseError) {
        console.error("Error fetching courses:", courseError);
        return [];
      }

      const courseIdsForRatings = courses.map((course) => course.id);
      const { data: ratingsData, error: ratingsError } = await supabase
        .from("CourseRating")
        .select("course_id, rating")
        .in("course_id", courseIdsForRatings);

      if (ratingsError) {
        console.error(
          "Error fetching ratings:",
          JSON.stringify(ratingsError, null, 2)
        );
      }

      const ratingsMap = ratingsData?.reduce((acc, { course_id, rating }) => {
        if (!acc[course_id]) acc[course_id] = [];
        acc[course_id].push(rating);
        return acc;
      }, {} as Record<number, number[]>);

      const coursesWithRating = courses.map((course) => {
        const ratings = ratingsMap?.[course.id] || [];
        const averageRating =
          ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
            : 0;
        return {
          ...course,
          rating: Number.parseFloat(averageRating.toFixed(1)),
          student_count: course.student_count?.[0]?.count || 0,
        };
      });

      return coursesWithRating;
    } catch (error) {
      console.error("Error fetching user courses:", error);
      return [];
    }
  }
);

export async function addCourseToUser(
  courseId: number
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();
  try {
    const user = await getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data: course, error: courseError } = await supabase
      .from("Course")
      .select("id")
      .eq("id", courseId)
      .single();

    if (courseError || !course) {
      throw new Error("Course not found");
    }

    const { data: existingUserCourse } = await supabase
      .from("UserCourse")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single();

    if (existingUserCourse) {
      return { success: false, message: "You have already added this course" };
    }
    const startDate = new Date().toISOString().split("T")[0];
    const schedule = [1, 3, 7, 14, 30];
    const nextReviewDates = schedule.map((days) => {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return date.toISOString().split("T")[0];
    });

    const spacedRepetition = {
      start_date: startDate,
      schedule,
      next_review_dates: nextReviewDates,
    };

    const { error: insertError } = await supabase.from("UserCourse").insert({
      user_id: user.id,
      course_id: courseId,
      spaced_repetition: spacedRepetition,
    });

    if (insertError) {
      throw new Error(`Failed to add course: ${insertError.message}`);
    }

    return { success: true, message: "Course added successfully" };
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

    const { data: course, error: courseError } = await supabase
      .from("Course")
      .select("id")
      .eq("id", courseId)
      .single();

    if (courseError || !course) {
      throw new Error("Course not found");
    }

    const { data: existingUserCourse } = await supabase
      .from("UserCourse")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single();

    if (!existingUserCourse) {
      return { success: false, message: "You have not added this course" };
    }

    const { error: deleteError } = await supabase
      .from("UserCourse")
      .delete()
      .eq("user_id", user.id)
      .eq("course_id", courseId);

    if (deleteError) {
      throw new Error(`Failed to remove course: ${deleteError.message}`);
    }

    return { success: true, message: "Course removed successfully" };
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

export const getUserCreatedCourses = cache(
  async (offset = 0, limit = 10): Promise<Course[]> => {
    const supabase = await createClient();
    try {
      const user = await getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("Course")
        .select(
          `
          *,
          creator:profiles!Course_creator_id_fkey (
            id,
            email,
            full_name,
            avatar_url,
            bio,
            username
          ),
          rating_count
      `
        )
        .eq("creator_id", user.id)
        .range(offset, offset + limit - 1);

      if (error) {
        console.error("Error fetching courses from Supabase:", error);
        return [];
      }

      if (!data) return [];

      const courseIds = data.map((course) => course.id);
      const { data: ratingsData, error: ratingsError } = await supabase
        .from("CourseRating")
        .select("course_id, rating")
        .in("course_id", courseIds);

      if (ratingsError) {
        console.error("Error fetching ratings:", ratingsError);
      }

      const ratingsMap = ratingsData?.reduce((acc, { course_id, rating }) => {
        if (!acc[course_id]) acc[course_id] = [];
        acc[course_id].push(rating);
        return acc;
      }, {} as Record<number, number[]>);

      const coursesWithRating = data.map((course) => {
        const ratings = ratingsMap?.[course.id] || [];
        const averageRating =
          ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
            : 0;
        return {
          ...course,
          rating: Number.parseFloat(averageRating.toFixed(1)),
          student_count: course.rating_count || 0,
          creator: course.creator?.[0] || { id: "", full_name: "Unknown" },
        };
      });

      return coursesWithRating;
    } catch (error) {
      console.error("Error fetching user created courses:", error);
      return [];
    }
  }
);

export const getCourses = cache(
  async (offset = 0, limit = 30): Promise<Course[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("Course")
      .select(
        `
      *,
      creator:profiles!Course_creator_id_fkey (
        id,
        full_name
      ),
      student_count:UserCourse(count),
      rating_count
    `
      )
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching courses:", JSON.stringify(error, null, 2));
      return [];
    }

    const courseIds = data.map((course) => course.id);
    const { data: ratingsData, error: ratingsError } = await supabase
      .from("CourseRating")
      .select("course_id, rating")
      .in("course_id", courseIds);

    if (ratingsError) {
      console.error(
        "Error fetching ratings:",
        JSON.stringify(ratingsError, null, 2)
      );
    }

    const ratingsMap = ratingsData?.reduce((acc, { course_id, rating }) => {
      if (!acc[course_id]) acc[course_id] = [];
      acc[course_id].push(rating);
      return acc;
    }, {} as Record<number, number[]>);

    const coursesWithRating = data.map((course) => {
      const ratings = ratingsMap?.[course.id] || [];
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
          : 0;
      return {
        ...course,
        rating: Number.parseFloat(averageRating.toFixed(1)),
        student_count: course.student_count?.[0]?.count || 0,
      };
    });

    return coursesWithRating;
  }
);

export const getCoursesWithUserProgress = cache(
  async (offset = 0, limit = 30): Promise<Course[]> => {
    const supabase = await createClient();
    const user = await getUser();
    const { data, error } = await supabase
      .from("Course")
      .select(
        `
      *,
    creator:profiles!Course_creator_id_fkey (
      id,
      full_name
    ),
    user_progress:UserCourse!inner (
      spaced_repetition
    ), 
    student_count:UserCourse(count),
    rating_count
    `
      )
      .eq("user_progress.user_id", user.id)
      .range(offset, offset + limit - 1);

    if (error) {
      console.error(
        "Error fetching courses with progress:",
        JSON.stringify(error, null, 2)
      );
      return [];
    }

    const courseIds = data.map((course) => course.id);
    const { data: ratingsData, error: ratingsError } = await supabase
      .from("CourseRating")
      .select("course_id, rating")
      .in("course_id", courseIds);

    if (ratingsError) {
      console.error(
        "Error fetching ratings:",
        JSON.stringify(ratingsError, null, 2)
      );
    }

    const ratingsMap = ratingsData?.reduce((acc, { course_id, rating }) => {
      if (!acc[course_id]) acc[course_id] = [];
      acc[course_id].push(rating);
      return acc;
    }, {} as Record<number, number[]>);

    const coursesWithRating = data.map((course) => {
      const ratings = ratingsMap?.[course.id] || [];
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
          : 0;
      return {
        ...course,
        rating: Number.parseFloat(averageRating.toFixed(1)),
        student_count: course.student_count?.[0]?.count || 0,
      };
    });

    return coursesWithRating;
  }
);

export async function createCourse(
  courseData: Omit<Course, "id" | "creator_id" | "creator">
): Promise<Course | null> {
  const supabase = await createClient();

  const pastelColors = [
    '#FFD1DC', // Light Pink
    '#FFECB3', // Light Yellow
    '#B3E5FC', // Light Blue
    '#C8E6C9', // Light Green
    '#F3E5F5', // Light Purple
    '#FFE0B2', // Light Orange
    '#B2EBF2', // Light Cyan
    '#FFCCBC', // Light Coral
    '#D7CCC8', // Light Brown
    '#F0F4C3', // Light Lime
  ];

  const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];

  try {
    const user = await getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("Course")
      .insert({
        ...courseData,
        creator_id: user.id,
        color: randomColor,
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

      const { error: moduleError } = await supabase
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

    const { data: course, error: fetchError } = await supabase
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

    const { error: deleteError } = await supabase
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

    const { error } = await supabase
      .from("Course")
      .update(courseData)
      .eq("id", courseId);
    if (error) {
      console.error("Error updating course:", error);
      throw new Error(`Failed to update course: ${error.message}`);
    }

    if (courseData?.curriculum && Array.isArray(courseData.curriculum)) {
      const { data: existingModules, error: fetchError } = await supabase
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

        const { error: moduleError } = await supabase
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

    return { message: "Course updated successfully" };
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
    const { data, error } = await supabase
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
  const { data, error } = await supabase
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
  const { data, error } = await supabase
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
  const { data, error } = await supabase
    .from("Test")
    .select("id, block_id, question, TestQuestions(id, question)")
    .eq("block_id", blockId);

  if (error) {
    console.error("Error fetching tests:", error);
    return [];
  }

  const testsWithCompleted = await Promise.all(
    data.map(async (test) => ({
      ...test,
      is_completed: await isTestCompleted(test.id),
    }))
  );
  return testsWithCompleted;
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
  const { data, error } = await supabase
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

export async function completeMaterial(materialId: number) {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("finished_user_materials")
    .insert({ user_id: user.id, material_id: materialId });

  if (error) {
    throw new Error(error.message);
  }
}

export async function isMaterialCompleted(
  materialId: number
): Promise<boolean> {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("finished_user_materials")
    .select("id")
    .eq("user_id", user.id)
    .eq("material_id", materialId);

  if (error) {
    console.error("Error checking material completion:", error);
    return false;
  }

  return data && data.length > 0;
}

export async function getMaterialsByBlockId(
  blockId: number
): Promise<LearningMaterial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("LearningMaterial")
    .select(
      "id, block_id, title, content, material_type, order_number, flashcards(id, front, back)"
    )
    .eq("block_id", blockId)
    .order("order_number", { ascending: true });

  if (error) {
    console.error("Error fetching learning materials:", error);
    return [];
  }

  const materialsWithCompleted = await Promise.all(
    data.map(async (material: LearningMaterial) => ({
      ...material,
      is_completed: await isMaterialCompleted(material.id),
    }))
  );
  return materialsWithCompleted;
}

export async function updateQuestion(questionId: number, questionText: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("TestQuestions")
    .update({ question: questionText })
    .eq("id", questionId);

  if (error) throw error;
}

export async function updateFlashcard(
  cardId: number,
  front: string,
  back: string
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("flashcards")
    .update({ front, back })
    .eq("id", cardId);

  if (error) return error;
}

export async function deleteQuestion(questionId: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("TestQuestions")
    .delete()
    .eq("id", questionId);

  if (error) throw error;
}

export async function deleteFlashcard(cardId: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("flashcards").delete().eq("id", cardId);

  if (error) throw error;
}

export const getTopUsersByPoints = cache(
  async (
    offset = 0,
    limit = 10
  ): Promise<
    {
      rank: number;
      initials: string;
      name: string;
      totalPoints: number;
      color: string;
    }[]
  > => {
    const supabase = await createClient();
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, username, total_points")
        .order("total_points", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error("Error fetching top users by points:", error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map((user, index) => {
        const name = user.full_name || user.username || "Unknown User";
        const initials = name
          .split(" ")
          .map((word: string) => word.charAt(0))
          .slice(0, 2)
          .join("")
          .toUpperCase();

        return {
          rank: offset + index + 1,
          initials,
          name,
          totalPoints: user.total_points || 0,
          color: "bg-blue-100",
        };
      });
    } catch (error) {
      console.error("Error in getTopUsersByPoints:", error);
      return [];
    }
  }
);

export async function isCourseCompleted(courseId: number): Promise<boolean> {
  const supabase = await createClient();

  const { data: modules, error: modulesError } = await supabase
    .from("Module")
    .select("id")
    .eq("course_id", courseId);
  if (modulesError) {
    console.error("Error fetching modules for course:", modulesError);
    return false;
  }
  const moduleIds = modules?.map((m) => m.id) ?? [];
  if (!moduleIds.length) return false;

  const { data: materials, error: materialsError } = await supabase
    .from("LearningMaterial")
    .select("id")
    .in("block_id", moduleIds);
  if (materialsError || !materials) {
    console.error("Error fetching learning materials:", materialsError);
    return false;
  }
  const totalMaterials = materials.length;
  if (totalMaterials === 0) return false;
  const { data: tests, error: testsError } = await supabase
    .from("Test")
    .select("id")
    .in("block_id", moduleIds);
  if (testsError) {
    console.error("Error fetching tests for course:", testsError);
    return false;
  }
  if (tests && tests.length > 0) {
    const testsCompleted = await Promise.all(
      tests.map((test) => isTestCompleted(test.id))
    );
    if (!testsCompleted.every((completed) => completed)) {
      return false;
    }
  }

  const completedStatuses = await Promise.all(
    materials.map(async (material) => isMaterialCompleted(material.id))
  );
  const completedCount = completedStatuses.filter((status) => status).length;

  return completedCount / totalMaterials >= 0.75;
}

export async function addReceivedPointsForCourse(
  courseId: number
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("received_points_for_course")
    .insert({ user_id: user.id, course_id: courseId });

  if (error) {
    console.error("Error adding received points:", error);
    return { success: false, message: error.message };
  }
  return { success: true, message: "Points recorded successfully" };
}

export async function isReceivedPointsForCourse(
  courseId: number
): Promise<boolean> {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("received_points_for_course")
    .select("*", { head: true, count: "exact" })
    .eq("user_id", user.id)
    .eq("course_id", courseId);

  if (error) {
    console.error("Error checking received points:", error);
    return false;
  }
  return (count ?? 0) > 0;
}

export async function addPointsToProfile(
  points: number
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("total_points")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    console.error("Error fetching profile:", profileError);
    return { success: false, message: "Failed to fetch user profile" };
  }

  const currentPoints = Number(profile.total_points) || 0;
  const newTotal = currentPoints + points;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ total_points: newTotal })
    .eq("id", user.id);

  if (updateError) {
    console.error("Error updating points:", updateError);
    return { success: false, message: updateError.message };
  }

  return { success: true, message: "Points added successfully" };
}

export async function isTestCompleted(testId: number): Promise<boolean> {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("finished_user_tests")
    .select("id")
    .eq("user_id", user.id)
    .eq("test_id", testId);

  if (error) {
    console.error("Error checking test completion:", error);
    return false;
  }
  return data.length > 0;
}

export async function getTotalStudents(): Promise<number> {
  const supabase = await createClient();
  try {
    const { error, count } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })

    if (error) {
      console.error("Error fetching total students:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Error in getTotalStudents:", error);
    return 0;
  }
}

// export async function getTotalStudents(): Promise<number> {
//   const supabase = await createClient();
//   try {
//     const { data, error } = await supabase.from("UserCourse").select("user_id");

//     if (error) {
//       console.error("Error fetching total students:", error);
//       return 0;
//     }

//     const uniqueUserIds = new Set(data.map((item) => item.user_id));
//     return uniqueUserIds.size;
//   } catch (error) {
//     console.error("Error in getTotalStudents:", error);
//     return 0;
//   }
// }

export async function getCompletedCoursesCount(): Promise<number> {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("received_points_for_course")
    .select("course_id")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching completed courses:", error);
    return 0;
  }

  return data.length;
}

export async function calculateWeeklyCardStats(userId: string, dateRange: string): Promise<{
  totalMinutes: number;
  totalCards: number;
}> {
  const supabase = await createClient();

  const [startStr, endStr] = dateRange.split(" - ");
  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${startStr}, ${currentYear}`);
  const endDate = new Date(`${endStr}, ${currentYear}`);

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  const startTimestamp = startDate.getTime();
  const endTimestamp = endDate.getTime();

  const { data, error } = await supabase
    .from("card_results")
    .select("start_time, end_time")
    .eq("user_id", userId)
    .gte("start_time", startTimestamp)
    .lte("start_time", endTimestamp);

  if (error) {
    console.error("Error fetching card results:", error);
    return { totalMinutes: 0, totalCards: 0 };
  }

  if (!data || data.length === 0) {
    return { totalMinutes: 0, totalCards: 0 };
  }

  let totalMinutes = 0;
  const totalCards = data.length;

  for (const session of data) {
    const start = new Date(Number(session.start_time));
    const end = new Date(Number(session.end_time));

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      continue;
    }

    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60));
    totalMinutes += durationMinutes;
  }

  return {
    totalMinutes,
    totalCards,
  };
}

export async function calculateStreakAndPoints(userId: string): Promise<{
  weeks: number;
  pointsToAddForWeek: number;
}> {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - today.getDay());
  currentWeekStart.setHours(0, 0, 0, 0);

  const currentWeekStartStr = currentWeekStart.toISOString().split("T")[0];

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("total_points, last_streak_points_update")
    .eq("id", userId)
    .single();

  if (profileError) {
    console.error("Error fetching profile for points update:", profileError);
    return { weeks: 0, pointsToAddForWeek: 0 };
  }

  const lastUpdate = profile.last_streak_points_update ? new Date(profile.last_streak_points_update) : null;
  let pointsToAddForWeek = 0;

  if (lastUpdate) {
    const timeDiff = today.getTime() - lastUpdate.getTime();
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    if (daysDiff >= 7) {
      pointsToAddForWeek = 20;
    } else {
      pointsToAddForWeek = 0;
    }
  } else {
    pointsToAddForWeek = 20;
  }

  const { data: cardResults, error: cardError } = await supabase
    .from("card_results")
    .select("start_time")
    .eq("user_id", userId)
    .order("start_time", { ascending: true });

  if (cardError) {
    console.error("Error fetching card results for streak:", cardError);
    return { weeks: 0, pointsToAddForWeek };
  }

  if (!cardResults || cardResults.length === 0) {
    return { weeks: 0, pointsToAddForWeek };
  }

  const eightWeeksAgo = new Date(today);
  eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

  const recentActivities = cardResults.filter((result) => {
    const start = new Date(Number(result.start_time));
    return start >= eightWeeksAgo && !isNaN(start.getTime());
  });

  if (recentActivities.length === 0) {
    return { weeks: 0, pointsToAddForWeek };
  }

  const weeks = new Set<string>();
  recentActivities.forEach((result) => {
    const start = new Date(Number(result.start_time));
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() - start.getDay());
    weekStart.setHours(0, 0, 0, 0);
    weeks.add(weekStart.toISOString().split("T")[0]);
  });

  const streakWeeks = weeks.size;

  if (lastUpdate && lastUpdate >= today) {
    return { weeks: streakWeeks, pointsToAddForWeek: 0 };
  }

  const hasActivityThisWeek = weeks.has(currentWeekStartStr);

  if (!hasActivityThisWeek) {
    return { weeks: streakWeeks, pointsToAddForWeek };
  }

  const { data: pointsHistory, error: historyError } = await supabase
    .from("streak_points_history")
    .select("week_start")
    .eq("user_id", userId)
    .eq("week_start", currentWeekStartStr);

  if (historyError) {
    console.error("Error fetching streak points history:", historyError);
    return { weeks: streakWeeks, pointsToAddForWeek };
  }

  const awardedWeeks = new Set(pointsHistory.map((entry) => entry.week_start));

  let pointsToAdd = 0;
  if (!awardedWeeks.has(currentWeekStartStr)) {
    pointsToAdd = 20;
    const { error: insertError } = await supabase
      .from("streak_points_history")
      .insert({
        user_id: userId,
        week_start: currentWeekStartStr,
        points_added: 20,
      });

    if (insertError) {
      console.error("Error inserting streak points history:", insertError);
    }
  }

  const currentTotalPoints = profile.total_points || 0;
  const newTotalPoints = currentTotalPoints + pointsToAdd;

  if (pointsToAdd > 0) {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ total_points: newTotalPoints, last_streak_points_update: today.toISOString() })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating total_points:", updateError);
      return { weeks: streakWeeks, pointsToAddForWeek };
    }
  }

  return { weeks: streakWeeks, pointsToAddForWeek };
}

export async function getUserAnalytics(userId: string) {
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("total_points")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    console.error("Error fetching profile:", profileError);
    throw new Error("Failed to fetch user profile");
  }

  const totalPoints = profile.total_points || 0;

  const today = new Date();
  const lastMonthStart = new Date(today);
  lastMonthStart.setMonth(today.getMonth() - 1);
  lastMonthStart.setDate(1);
  lastMonthStart.setHours(0, 0, 0, 0);

  const thisMonthStart = new Date(today);
  thisMonthStart.setDate(1);
  thisMonthStart.setHours(0, 0, 0, 0);

  const { data: thisMonthCardResults } = await supabase
    .from("card_results")
    .select("start_time, end_time")
    .eq("user_id", userId)
    .gte("start_time", thisMonthStart.getTime());

  const { data: lastMonthCardResults } = await supabase
    .from("card_results")
    .select("start_time, end_time")
    .eq("user_id", userId)
    .gte("start_time", lastMonthStart.getTime())
    .lt("start_time", thisMonthStart.getTime());

  let totalStudyTime = 0;
  let lastMonthStudyTime = 0;

  if (thisMonthCardResults) {
    for (const session of thisMonthCardResults) {
      const start = new Date(Number(session.start_time));
      const end = new Date(Number(session.end_time));
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        totalStudyTime += durationHours;
      }
    }
  }

  if (lastMonthCardResults) {
    for (const session of lastMonthCardResults) {
      const start = new Date(Number(session.start_time));
      const end = new Date(Number(session.end_time));
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        lastMonthStudyTime += durationHours;
      }
    }
  }

  totalStudyTime = parseFloat(totalStudyTime.toFixed(1));
  const studyTimeChange = lastMonthStudyTime
    ? parseFloat(((totalStudyTime - lastMonthStudyTime) / lastMonthStudyTime * 100).toFixed(1))
    : 0;

  const coursesCompleted = await getCompletedCoursesCount();
  const { data: userCourses } = await supabase
    .from("UserCourse")
    .select("course_id")
    .eq("user_id", userId);
  const coursesInProgress = (userCourses?.length || 0) - coursesCompleted;

  const { data: thisMonthPoints } = await supabase
    .from("streak_points_history")
    .select("points_added")
    .eq("user_id", userId)
    .gte("week_start", thisMonthStart.toISOString().split("T")[0]);

  let pointsChange = 0;
  if (thisMonthPoints) {
    pointsChange = thisMonthPoints.reduce((sum, entry) => sum + (entry.points_added || 0), 0);
  }

  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  const { data: todayCardResults } = await supabase
    .from("card_results")
    .select("start_time, end_time")
    .eq("user_id", userId)
    .gte("start_time", todayStart.getTime())
    .lte("start_time", todayEnd.getTime());

  const dailyStudyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i.toString().padStart(2, "0"),
    minutes: 0,
  }));

  if (todayCardResults) {
    for (const session of todayCardResults) {
      const start = new Date(Number(session.start_time));
      const end = new Date(Number(session.end_time));
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const hour = start.getHours();
        const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
        dailyStudyData[hour].minutes += Math.floor(durationMinutes);
      }
    }
  }

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const { data: weeklyCardResults } = await supabase
    .from("card_results")
    .select("start_time, end_time")
    .eq("user_id", userId)
    .gte("start_time", weekStart.getTime())
    .lte("start_time", weekEnd.getTime());

  const weeklyStudyData = [
    { day: "Sun", hours: 0 },
    { day: "Mon", hours: 0 },
    { day: "Tue", hours: 0 },
    { day: "Wed", hours: 0 },
    { day: "Thu", hours: 0 },
    { day: "Fri", hours: 0 },
    { day: "Sat", hours: 0 },
  ];

  if (weeklyCardResults) {
    for (const session of weeklyCardResults) {
      const start = new Date(Number(session.start_time));
      const end = new Date(Number(session.end_time));
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const dayIndex = start.getDay();
        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        weeklyStudyData[dayIndex].hours += parseFloat(durationHours.toFixed(1));
      }
    }
  }

  return {
    totalStudyTime,
    studyTimeChange,
    coursesCompleted,
    coursesInProgress,
    pointsEarned: totalPoints,
    pointsChange,
    dailyStudyData,
    weeklyStudyData,
  };
}

export async function getUserCertificates(userId: string): Promise<Certificate[]> {
  const supabase = await createClient();

  const { data: completedCourses, error: completedError } = await supabase
    .from("received_points_for_course")
    .select("course_id, created_at")
    .eq("user_id", userId);

  if (completedError || !completedCourses) {
    console.error("Error fetching completed courses:", completedError);
    return [];
  }

  const courseIds = completedCourses.map((entry) => entry.course_id);

  const { data: courses, error: courseError } = await supabase
    .from("Course")
    .select("id, name, description, color")
    .in("id", courseIds);

  if (courseError || !courses) {
    console.error("Error fetching course details:", courseError);
    return [];
  }

  const certificates: Certificate[] = completedCourses.map((entry, idx) => {
    const course = courses.find((c) => c.id === entry.course_id);
    return {
      id: entry.course_id,
      courseName: course?.name || "Unknown Course",
      issueDate: new Date(entry.created_at).toISOString().split("T")[0],
      certificateId: `CERT-${String(idx + 1).padStart(3, "0")}`,
      status: "completed",
      color: course?.color
    };
  });

  return certificates;
}

export async function getCreatorTotalPoints(creatorId: string) {
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("total_points")
    .eq("id", creatorId)
    .single();

  if (profileError || !profile) {
    console.error("Error fetching profile:", profileError);
    throw new Error("Failed to fetch user profile");
  }
  
  const totalPoints = profile.total_points || 0;

  return totalPoints
}

export async function getCreatorCompletedCoursesCount(creatorId: string): Promise<number> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("received_points_for_course")
    .select("course_id")
    .eq("user_id", creatorId);

  if (error) {
    console.error("Error fetching completed courses:", error);
    return 0;
  }

  return data.length;
}

export const getCreatorCreatedCourses = cache(
  async (offset = 0, limit = 10, creatorId: string): Promise<Course[]> => {
    const supabase = await createClient();
    try {
      const { data, error } = await supabase
        .from("Course")
        .select(
          `
          *,
          creator:profiles!Course_creator_id_fkey (
            id,
            email,
            full_name,
            avatar_url,
            bio,
            username
          ),
          rating_count
      `
        )
        .eq("creator_id", creatorId)
        .range(offset, offset + limit - 1);

      if (error) {
        console.error("Error fetching courses from Supabase:", error);
        return [];
      }

      if (!data) return [];

      const courseIds = data.map((course) => course.id);
      const { data: ratingsData, error: ratingsError } = await supabase
        .from("CourseRating")
        .select("course_id, rating")
        .in("course_id", courseIds);

      if (ratingsError) {
        console.error("Error fetching ratings:", ratingsError);
      }

      const ratingsMap = ratingsData?.reduce((acc, { course_id, rating }) => {
        if (!acc[course_id]) acc[course_id] = [];
        acc[course_id].push(rating);
        return acc;
      }, {} as Record<number, number[]>);

      const coursesWithRating = data.map((course) => {
        const ratings = ratingsMap?.[course.id] || [];
        const averageRating =
          ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
            : 0;
        return {
          ...course,
          rating: Number.parseFloat(averageRating.toFixed(1)),
          student_count: course.rating_count || 0,
          creator: course.creator?.[0] || { id: "", full_name: "Unknown" },
        };
      });

      return coursesWithRating;
    } catch (error) {
      console.error("Error fetching user created courses:", error);
      return [];
    }
  }
);