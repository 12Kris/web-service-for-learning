"use client"

import {useParams} from "next/navigation"
import Link from "next/link"
import {useEffect, useState} from "react"
import {Card} from "@/components/ui/card"
import {getMaterialsByBlockId, getTestsByBlockId} from "@/lib/courses/actions"
import type {TestData} from "@/lib/types/test"
import type {LearningMaterial} from "@/lib/types/learning"
import {BookOpen, ClipboardCheck} from "lucide-react"
import {LoadingSpinner} from "@/components/ui/loading-spinner"

export default function ModulePage() {
    const params = useParams()
    const moduleId = Number(params.moduleId)

    const [materials, setMaterials] = useState<LearningMaterial[]>([])
    const [tests, setTests] = useState<TestData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const materialsData = await getMaterialsByBlockId(moduleId)
                const testsData = await getTestsByBlockId(moduleId)
                setMaterials(materialsData)
                setTests(testsData)
            } catch (error) {
                console.error("Error fetching module data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (moduleId) {
            fetchData()
        }
    }, [moduleId])

    return (
        <div className="container   mx-auto">
            <div className="space-y-8">
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="h-5 w-5 text-primary"/>
                        <h2 className="text-2xl font-semibold">Learning Materials</h2>
                    </div>
                    <div className="grid gap-3">
                        {isLoading ? (
                            <LoadingSpinner/>
                        ) : materials.length > 0 ? (
                            materials.map((material) => (
                                <Link key={material.id} href={`${moduleId}/card/${material.id}`}>
                                    <Card className={`p-4 hover:bg-accent transition-colors ${material.is_completed ? 'opacity-50 ' : ''}`}>
                                        <div className="text-left">
                                            <h3 className="font-medium">{material.title}</h3>
                                        </div>
                                    </Card>
                                </Link>
                            ))
                        ) : (
                            <p className="text-muted-foreground text-center py-4">No learning materials available</p>
                        )}
                    </div>
                </section>
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <ClipboardCheck className="h-5 w-5 text-primary"/>
                        <h2 className="text-2xl font-semibold">Tests</h2>
                    </div>
                    <div className="grid gap-3">
                        {isLoading ? (
                            <LoadingSpinner/>
                        ) : tests.length > 0 ? (
                            tests.map((test) => (
                                <Link key={test.id} href={`${moduleId}/test/${test.id}`}>
                                    <Card className={`p-4 hover:bg-accent transition-colors ${test.is_completed ? 'opacity-50 ' : ''}`}>
                                        <div className="text-left">
                                            <p>{test.question}</p>
                                        </div>
                                    </Card>
                                </Link>
                            ))
                        ) : (
                            <p className="text-muted-foreground text-center py-4">No tests available</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}