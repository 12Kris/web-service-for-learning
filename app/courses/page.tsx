"use client";
import { useEffect, useState } from "react";
import { getCourses } from '@/lib/courses/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen } from 'lucide-react';
import Link from "next/link";

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        async function fetchCourses() {
            const data = await getCourses();
            if (Array.isArray(data)) {
                setCourses(data);
            } else {
                console.error("Expected array, but got", data);
            }
        }

        fetchCourses();
    }, []);

    if (!courses || courses.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Available Courses</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
}

function CourseCard({ course }) {
    return (
        <Link href={`/courses/${course.id}`}>
            <Card className="flex flex-col cursor-pointer">
                <CardHeader>
                    <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                    <CardDescription>
            <span className="flex items-center space-x-2 mb-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${course.instructor_name}`} />
                <AvatarFallback>{course.instructor_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <span>{course.instructor_name}</span>
            </span>
                        <span className="text-sm text-muted-foreground">
              Created on {new Date(course.created_at).toLocaleDateString()}
            </span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="mb-4">{course.description}</p>
                    <div className="flex justify-between items-center">
                        <Badge variant="secondary" className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {course.enrolled_students} enrolled
                        </Badge>
                        <Badge variant="secondary" className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1" />
                            {course.lesson_count} lessons
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
