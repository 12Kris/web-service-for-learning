"use client";

import {useParams} from 'next/navigation';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {Card} from '@/components/ui/card';
import {getMaterialsByBlockId, getTestsByBlockId} from "@/lib/courses/actions";
import {LearningMaterial, Test} from "@/lib/definitions";

export default function ModulePage() {
    const params = useParams();
    const moduleId = Number(params.moduleId);

    const [materials, setMaterials] = useState<LearningMaterial[]>([]);
    const [tests, setTests] = useState<Test[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const materialsData = await getMaterialsByBlockId(moduleId);
            const testsData = await getTestsByBlockId(moduleId);
            setMaterials(materialsData);
            setTests(testsData);
        };

        if (moduleId) {
            fetchData();
        }
    }, [moduleId]);


    return (
        <div className='flex text-center space-x-10 justify-center'>
            <div className='w-96 m-8'>
                <h3 className='m-3'>Cards:</h3>
                <div className='w-full bg-white'>
                    {materials.map((material) => (
                        <Link key={material.id} href={`${moduleId}/card/${material.id}`}>
                            <Card className='p-3'>{material.title}</Card>
                        </Link>
                    ))}
                </div>
            </div>

            <div className='w-96 m-8'>
                <h3 className='m-3'>Tests:</h3>
                <div className='w-full bg-white'>
                    {tests.map((test) => (
                        <Link key={test.id} href={`${moduleId}/test/${test.id}`}>
                            <Card className='p-3'>{test.question}</Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
