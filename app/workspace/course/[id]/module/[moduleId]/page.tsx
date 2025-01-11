"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import {getMaterialsByBlockId, getTestsByBlockId} from "@/lib/courses/actions";

export default function ModulePage() {
    const params = useParams();
    const courseId = params.courseId;
    const moduleId = params.moduleId;

    const [materials, setMaterials] = useState([]);
    const [tests, setTests] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const materialsData = await getMaterialsByBlockId(moduleId);
            const testsData = await getTestsByBlockId(moduleId);
            console.log(materialsData);
            console.log(testsData);
            setMaterials(materialsData);
            setTests(testsData);
        };

        fetchData();
    }, [moduleId]);

    return (
        <div>
            <h1>Course ID: {courseId}</h1>
            <h2>Module ID: {moduleId}</h2>

            <h3>Materials</h3>
            <div>
                {materials.map((material) => (
                    <Card key={material.id}>{material.title}</Card>
                ))}
            </div>

            <h3>Tests</h3>
            <div>
                {tests.map((test) => (
                    <Link key={test.id} href={`/test/${test.id}`}>
                        <Card>{test.title}</Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
