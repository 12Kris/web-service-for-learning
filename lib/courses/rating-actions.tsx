"use server";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getCourseRating(courseId: number): Promise<{ rating: number; count: number }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("CourseRating")
    .select("rating")
    .eq("course_id", courseId);

  if (error || !data) {
    console.error("Error fetching course rating:", error);
    return { rating: 0, count: 0 };
  }

  const ratings = data.filter((entry) => entry.rating !== null).map((entry) => entry.rating);
  const count = ratings.length;
  const rating = count > 0 ? ratings.reduce((sum, r) => sum + r, 0) / count : 0;

  return {
    rating: Number.parseFloat(rating.toFixed(1)),
    count,
  };
}

export async function getUserRating(courseId: number): Promise<number> {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return 0;
  }

  const { data, error } = await supabase
    .from("CourseRating")
    .select("rating")
    .eq("course_id", courseId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error getting user rating:", error);
    return 0;
  }

  if (!data || data.rating === null) {
    return 0;
  }

  return data.rating;
}

export async function hasUserRatedCourse(courseId: number): Promise<boolean> {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from("CourseRating")
    .select("rating")
    .eq("course_id", courseId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error checking if user rated course:", error);
  }

  return !!data && data.rating !== null;
}

export async function rateCourse(courseId: number, rating: number): Promise<{ success: boolean; message: string }> {

  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    console.error("No user found");
    return { success: false, message: "You must be logged in to rate a course" };
  }


  try {
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("UserCourse")
      .select("*")
      .eq("course_id", courseId)
      .eq("user_id", user.id)
      .single();

    if (enrollmentError || !enrollment) {
      console.error("Error checking enrollment:", enrollmentError);
      return { success: false, message: "You must be enrolled in the course to rate it" };
    }

    const { data: course, error: courseError } = await supabase
      .from("Course")
      .select("creator_id, rating_count")
      .eq("id", courseId)
      .single();

    if (courseError || !course) {
      console.error("Error fetching course:", courseError);
      return { success: false, message: courseError ? courseError.message : "Course not found" };
    }

    if (course.creator_id === user.id) {
      console.error("User is course creator");
      return { success: false, message: "You cannot rate your own course" };
    }

    const { data: existingRating } = await supabase
      .from("CourseRating")
      .select("rating")
      .eq("course_id", courseId)
      .eq("user_id", user.id)
      .single();

    const isUpdate = !!existingRating && existingRating.rating !== null;
    const oldRating = existingRating?.rating || 0;

    const { error: ratingError } = await supabase
      .from("CourseRating")
      .upsert({
        user_id: user.id,
        course_id: courseId,
        rating,
      });

    if (ratingError) {
      console.error("Error saving rating:", ratingError);
      return { success: false, message: `Failed to save rating: ${ratingError.message}` };
    }

    await updateCourseRating(supabase, courseId, rating, oldRating, isUpdate);
    return {
      success: true,
      message: isUpdate ? "Rating updated successfully" : "Rating submitted successfully",
    };
  } catch (error) {
    console.error("Error in rateCourse:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while processing your rating",
    };
  }
}

async function updateCourseRating(
  supabase: SupabaseClient,
  courseId: number,
  newRating: number,
  oldRating: number,
  isUpdate: boolean,
): Promise<void> {
  const { data: course, error: courseError } = await supabase
    .from("Course")
    .select("rating_count")
    .eq("id", courseId)
    .single();

  if (courseError || !course) {
    console.error("Error fetching course for rating update:", courseError);
    throw new Error(courseError ? courseError.message : "Course not found");
  }

  let updatedCount = course.rating_count || 0;

  if (!isUpdate) {
    updatedCount += 1;
  }


  const { error: updateCourseError } = await supabase
    .from("Course")
    .update({
      rating_count: updatedCount,
    })
    .eq("id", courseId);

  if (updateCourseError) {
    console.error("Error updating course rating_count:", updateCourseError);
    throw new Error(`Failed to update course rating_count: ${updateCourseError.message}`);
  }
}