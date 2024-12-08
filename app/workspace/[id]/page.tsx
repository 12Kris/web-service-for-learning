"use client";

import React, { useEffect, useState } from "react";
import {getBlocksByCourseId, getMaterialsByBlockId, getCourseProgress, getTestsByBlockId} from "@/lib/courses/actions";
import { addCourseToUser, getCourseById, isCourseAddedToUser } from "@/lib/courses/actions";
import { Button } from "@/components/ui/button";
import { Course, LearningBlock, LearningMaterial } from "@/lib/courses/types";
import { getUser } from "@/lib/authActions";
import {Test} from "@/lib/courses/types";

interface Params {
    params: Promise<{ id: number }>;
}

export default function CourseDetailPage({ params }: Params) {
    const [course, setCourse] = useState<Course | null>(null);
    const [blocks, setBlocks] = useState<LearningBlock[]>([]);
    const [materials, setMaterials] = useState<Record<number, LearningMaterial[]>>({});
    const [progress, setProgress] = useState<number>(0);
    const [isCourseAdded, setIsCourseAdded] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [tests, setTests] = useState<Record<number, Test[]>>({});

    const { id } = React.use(params);


    useEffect(() => {
        async function fetchData() {
            if (!id) return;

            const courseData = await getCourseById(id);
            setCourse(courseData);

            const user = await getUser();
            if (user) {
                setUserId(user.id);

                const added = await isCourseAddedToUser(user.id, id);
                setIsCourseAdded(added);

                const userProgress = await getCourseProgress(id, user.id);
                setProgress(userProgress);
            }

            const blocksData = await getBlocksByCourseId(id);
            setBlocks(blocksData);

            const materialsData: Record<number, LearningMaterial[]> = {};
            const testsData: Record<number, Test[]> = {};

            for (const block of blocksData) {
                materialsData[block.id] = await getMaterialsByBlockId(block.id);
                testsData[block.id] = await getTestsByBlockId(block.id);
            }

            setMaterials(materialsData);
            setTests(testsData);
        }

        fetchData();
    }, [id]);

    const handleAddCourse = async () => {
        if (!userId || !course?.id) return;
        await addCourseToUser(course.id, userId);
        alert("Курс додано до вашого акаунту!");
        setIsCourseAdded(true);
    };

    if (!course) return <div>Loading...</div>;

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">{course.name}</h1>
            <p>{course.description}</p>
            <p>Прогрес курсу: {progress}%</p>
            <Button onClick={handleAddCourse} disabled={isCourseAdded}>
                {isCourseAdded ? "Курс додано" : "Додати курс"}
            </Button>

            {blocks.map((block) => (
                <div key={block.id} className="my-6">
                    <h2 className="text-2xl font-bold">{block.title}</h2>

                    {tests[block.id]?.map((test) => (
                        <div key={test.id} className="ml-4 my-2">
                            <h3 className="text-lg font-semibold">TEST: {test.question}</h3>
                        </div>
                    ))}

                    <hr/>

                    {materials[block.id]?.map((material) => (
                        <div key={material.id} className="ml-4 my-2">
                            <h3 className="text-lg font-semibold">MATERIAL: {material.title}</h3>
                            <p>{material.content}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
