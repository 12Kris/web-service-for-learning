"use client";
import { useEffect, useState } from "react";
import {addCourseToUser, getCourseById, isCourseAddedToUser} from "@/lib/courses/actions";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/authActions";
import {use} from 'react';
import Link from "next/link";

interface Course {
    id: string;
    title: string;
    description: string;
    instructor_name: string;
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [course, setCourse] = useState<Course | null>(null);
    const [isCourseAdded, setIsCourseAdded] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const { id } = use(params);

    useEffect(() => {
        async function fetchCourse() {
            if (!id) return;
            const courseData = await getCourseById(id);
            setCourse(courseData);
        }

        fetchCourse();
    }, [id]);

    useEffect(() => {
        async function fetchUser() {
            const user = await getUser();
            if (user) {
                setUserId(user.id);
            }
        }

        fetchUser();
    }, []);

    useEffect(() => {
        async function checkCourse() {
            if (userId && id) {
                const result = await isCourseAddedToUser(userId, id);
                console.log(result)
                setIsCourseAdded(result);
            }
        }

        checkCourse();
    }, [userId, id]);

    if (!course) {
        return <div>Loading...</div>;
    }

    const handleAddCourse = async () => {
        if (!userId || !course.id) return;
        await addCourseToUser(course.id, userId);
        alert("Course added to your account!");
        setIsCourseAdded(true);
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
            <div className="mb-6">{course.description}</div>
            <div>
                <span className="font-bold">Instructor:</span> {course.instructor_name}
            </div>
            <div className="my-4">
                <Button onClick={handleAddCourse} disabled={isCourseAdded}>
                    {isCourseAdded ? "Course Added" : "Add this course to my account"}
                </Button>

                <Link href={`/workspace/${course.id}/cards`}>Пройти тест</Link>
            </div>
        </div>
    );
}