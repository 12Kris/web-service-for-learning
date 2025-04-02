"use server";
import { createClient } from "@/utils/supabase/server"
import { getUser } from "@/utils/supabase/server"
import type { SupabaseClient } from "@supabase/supabase-js"

export async function getCourseRating(courseId: number): Promise<{ rating: number; count: number }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("UserCourse")
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
    .from("UserCourse")
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
    .from("UserCourse")
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
  console.log(`Attempting to rate course ${courseId} with rating ${rating}`);

  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    console.error("No user found");
    return { success: false, message: "You must be logged in to rate a course" };
  }

  console.log(`User ID: ${user.id}`);

  try {
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("UserCourse")
      .select("*")
      .eq("course_id", courseId)
      .eq("user_id", user.id)
      .single();

    if (enrollmentError) {
      console.error("Error checking enrollment:", enrollmentError);
      if (enrollmentError.code === "PGRST116") {
        const { error: insertError } = await supabase.from("UserCourse").insert({
          course_id: courseId,
          user_id: user.id,
          rating: rating,
        });

        if (insertError) {
          console.error("Error creating enrollment with rating:", insertError);
          return { success: false, message: `Failed to enroll in course: ${insertError.message}` };
        }

        await updateCourseRating(supabase, courseId, rating, 0, false);
        return { success: true, message: "Rating submitted successfully" };
      }

      return { success: false, message: `Error checking enrollment: ${enrollmentError.message}` };
    }

    if (!enrollment) {
      console.error("No enrollment found");
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

    const oldRating = enrollment.rating || 0;
    const isUpdate = oldRating > 0;

    console.log(`Old rating: ${oldRating}, Is update: ${isUpdate}`);

    const { error: updateUserCourseError } = await supabase
      .from("UserCourse")
      .update({ rating })
      .eq("course_id", courseId)
      .eq("user_id", user.id);

    if (updateUserCourseError) {
      console.error("Error updating user course rating:", updateUserCourseError);
      return { success: false, message: `Failed to update rating: ${updateUserCourseError.message}` };
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

  console.log(`Updating course rating_count to ${updatedCount}`);

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