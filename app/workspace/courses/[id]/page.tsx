"use client";

import {useEffect, useState} from "react";
import {use} from "react";
import "react-loading-skeleton/dist/skeleton.css";
import {Module} from "@/lib/types/learning";
import {getCourseById, getModulesByCourseId} from "@/lib/courses/actions";
import {Course} from "@/lib/definitions";
import LoadingSpinner from "@/components/ui/loading-spinner";
import EditBar from "@/components/workspace/courses/edit-bar";

import CourseDescriptionJumpotron from "@/components/workspace/courses/course-description-jumbotron";

import "react-loading-skeleton/dist/skeleton.css";
import CourseInfo from "@/components/workspace/courses/course-info";
import CourseCurriculum from "@/components/workspace/courses/course-curriculum";
import MeetTutor from "@/components/workspace/courses/meet-tutor";

export default function FlashcardPage({
                                          params,
                                      }: {
    params: Promise<{ id: number }>;
}) {
    const [course, setCourse] = useState<Course | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const {id} = use(params);

    useEffect(() => {
        async function fetchData() {
            if (!id) return;

            try {
                const modulesData = await getModulesByCourseId(id);
                setModules(modulesData);
                const courseData = await getCourseById(id);
                setCourse(courseData);
            } catch (err) {
                console.error(err);
            }
        }

        fetchData();
    }, [id]);

    if (!course) {
        return <LoadingSpinner className="mx-auto"/>;
    }

    return (
        <div className="flex flex-wrap gap-4">
            <CourseDescriptionJumpotron
                title={course?.name}
                description={course?.description}
                type={course?.type}
                id={id}
            />

            <CourseInfo
                course_details={course?.course_details || []}
                what_you_learn={course?.what_w_learn || []}
                course_rating={4}
                reviews={12}
            />

            <CourseCurriculum modules={modules}/>

            <MeetTutor
                name={course?.creator?.full_name}
                description={course?.creator?.description || undefined}
                imageUrl=""
            />
            <EditBar id={id}/>
        </div>
    );
}
