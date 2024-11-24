"use client";
import {useEffect, useState} from "react";
import {getCourseById, addCourseToUser} from "@/lib/courses/actions";
import {Button} from "@/components/ui/button";
import {use} from 'react';

interface Course {
    id: string;
    title: string;
    description: string;
    instructor_name: string;
}

export default function CourseDetailPage({params}: { params: Promise<{ id: string }> }) {
    const [course, setCourse] = useState<Course | null>(null);

    const {id} = use(params);

    useEffect(() => {
        async function fetchCourse() {
            if (!id) return;
            const courseData = await getCourseById(id);
            setCourse(courseData);
        }

        fetchCourse();
    }, [id]);

    if (!course) {
        return <div>Loading...</div>;
    }

    const handleAddCourse = async () => {
        await addCourseToUser(course.id);
        alert("Course added to your account!");
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
            <div className="mb-6">{course.description}</div>
            <div>
                <span className="font-bold">Instructor:</span> {course.instructor_name}
            </div>
            <div className="my-4">
                <Button onClick={handleAddCourse}>Add this course to my account</Button>
            </div>
        </div>
    );
}
