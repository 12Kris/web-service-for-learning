"use server";
import { createClient } from "@/utils/supabase/server";
import {getUser} from "@/utils/supabase/server";

export async function getSpacedRepetition(courseId: number) {
    const supabase = await createClient();
    const user = await getUser();
    if (!user?.id) {
        throw new Error("User is not authenticated.");
    }

    const { data, error } = await supabase
        .from("UserCourse")
        .select("spaced_repetition")
        .eq("course_id", courseId)
        .eq("user_id", user.id)
        .single();

    if (error) {
        console.error("Error fetching spaced repetition:", error);
        throw new Error("Failed to fetch spaced repetition.");
    }

    return data;
}

export async function updateSpacedRepetition(courseId: number, nextReviewDates: {
    start_date: string;
    schedule: number[];
    next_review_dates: string[];
}) {
    const supabase = await createClient();
    const user = await getUser();

    if (!user?.id) {
        throw new Error("User is not authenticated.");
    }

    const startDate = new Date().toISOString().split("T")[0];

    const spacedRepetition = {
        start_date: startDate,
        schedule: nextReviewDates.schedule,
        next_review_dates: nextReviewDates.next_review_dates,
    };

    const { data, error } = await supabase
        .from("UserCourse")
        .upsert({
            user_id: user.id,
            course_id: courseId,
            spaced_repetition: spacedRepetition,
        });

    if (error) {
        console.error("Error updating spaced repetition:", error);
        throw new Error("Failed to update spaced repetition.");
    }

    return data;
}