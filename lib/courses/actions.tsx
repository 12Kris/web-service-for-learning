"use server";
import {supabase} from "@/lib/supabaseClient";
import {getUser} from "@/lib/auth/actions";
import {Course, CourseWithStudents} from "@/lib/definitions";

export async function getCourseById(courseId: string) {
    const {data, error} = await supabase
        .from("Course")
        .select("*, creator:creator_id (id, email, full_name, description)")
        .eq("id", courseId)
        .single();

    if (error) {
        console.error("Error fetching course:", error);
        return null;
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

// export async function getCourseInfo(courseId: string) {
//     const {data, error} = await supabase
//         .from("CourseInfo")
//         .select("*")
//         .eq("course_id", courseId)
//         .single();

//     if (error) {
//         console.error("Error fetching course info:", error);
//         return null;
//     }

//     return data;
// }

export async function isCourseAddedToUser(courseId: string) {
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

// export async function addCourseToUser(courseId: string, userId: string) {
//   try {
//     const user = await getUser();
//     console.log(userId);

//     if (!user) {
//       throw new Error("User not authenticated");
//     }
//     const { data, error } = await supabase
//       .from("user_courses")
//       .insert([{ user_id: user.id, course_id: courseId }]);

//     if (error) {
//       throw new Error(`Failed to add course: ${error.message}`);
//     }

//     return data;
//   } catch (error) {
//     console.error("Error adding course to user:", error);
//     throw new Error(
//       (error as Error).message || "An error occurred while adding the course"
//     );
//   }
// }

export async function addCourseToUser(
    courseId: string
): Promise<{ success: boolean; message: string }> {
    try {
        const user = await getUser();

        if (!user) {
            throw new Error("User not authenticated");
        }

        // Check if the course exists
        const {data: course, error: courseError} = await supabase
            .from("Course")
            .select("id")
            .eq("id", courseId)
            .single();

        if (courseError || !course) {
            throw new Error("Course not found");
        }

        // Check if the user has already added this course
        const {data: existingUserCourse} = await supabase
            .from("UserCourse")
            .select("*")
            .eq("user_id", user.id)
            .eq("course_id", courseId)
            .single();

        if (existingUserCourse) {
            return {success: false, message: "You have already added this course"};
        }

        // Add the course to the user
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
        creator:creator_id (
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

export async function createCourse(
        courseData: Omit<Course, "id" | "creator_id" | "creator">
    ): Promise<Course | null> {
        console.log(courseData);
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
                    // curriculum: courseData.modules,
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




// export async function createCourse(
//     courseData: Omit<Course, "id" | "creator_id" | "creator"> & {modules: Module[]}
// ): Promise<Course | null> {
//     try {
//         const user = await getUser();

//         if (!user) {
//             throw new Error("User not authenticated");
//         }

//         const {data, error} = await supabase
//             .from("Course")
//             .insert({
//                 ...courseData,
//                 creator_id: user.id,
//                 curriculum: courseData.modules,
//             })
//             .select()
//             .single();

//         if (error) {
//             console.error("Error creating course:", error);
//             throw new Error(`Failed to create course: ${error.message}`);
//         }

//         return data;
//     } catch (error) {
//         console.error("Error in createCourse:", error);
//         throw new Error(
//             (error as Error).message || "An error occurred while creating the course"
//         );
//     }
// }

export async function deleteCourse(
    courseId: string
): Promise<{ success: boolean; message: string }> {
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
