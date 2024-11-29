"use server";
import { supabase } from "@/lib/supabaseClient";
import { getUser } from "@/lib/authActions";
import { Course } from "@/lib/definitions";

export async function getCourseById(courseId: string) {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (error) {
    console.error("Error fetching course:", error);
    return null;
  }

  return data;
}

export async function getCardsByBlock(blockId: string) {
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


export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabase.from("Course").select(`
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

  console.log(data);
  return data as Course[];
}

export async function isCourseAddedToUser(userId: string, courseId: string) {
  const { data, error } = await supabase
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

export async function getUserCourses() {
  try {
    const user = await getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("user_courses")
      .select("course_id")
      .eq("user_id", user.id);

    if (error) {
      return [];
    }

    const courseIds = data.map((item) => item.course_id);

    const { data: courses, error: courseError } = await supabase
      .from("courses")
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

export async function addCourseToUser(courseId: string, userId: string) {
  try {
    const user = await getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }
    const { data, error } = await supabase
      .from("user_courses")
      .insert([{ user_id: user.id, course_id: courseId }]);

    if (error) {
      throw new Error(`Failed to add course: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error adding course to user:", error);
    throw new Error(
      (error as Error).message || "An error occurred while adding the course"
    );
  }
}
