"use client"
import {useState, useEffect, useCallback} from "react";
import Skeleton from "react-loading-skeleton";
import {getMaterialsByBlockId, getTestsByBlockId} from "@/lib/courses/actions";
import {
    createTest,
    deleteTest,
    updateTest,
    createMaterial,
    deleteMaterial,
    updateMaterial,
    deleteBlock
} from "@/lib/tests/actions";
import {Button} from "@/components/ui/button";
import {MaterialModal} from "@/components/workspace/modals/material";
import {TestModal} from "@/components/workspace/modals/test";
import {
    BlockSectionProps,
    Card,
    LearningMaterial,
    MaterialData,
    TestData,
    TestDataWithQuestion
} from "@/lib/definitions";

export default function BlockSection({
                                         block,
                                         setModals,
                                         handleOpenBlockModal,
                                     }: BlockSectionProps) {
    const [materials, setMaterials] = useState<LearningMaterial[] | null>([]);
    const [tests, setTests] = useState<TestData[] | null>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMaterialModalOpen, setMaterialModalOpen] = useState(false);
    const [isTestModalOpen, setTestModalOpen] = useState(false);
    const [currentMaterial, setCurrentMaterial] = useState<LearningMaterial | null>(null);
    const [materialContents, setMaterialContents] = useState<Card[]>([]);
    const [currentTest, setCurrentTest] = useState<TestData | null>(null);

    const fetchBlockData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [fetchedMaterials, fetchedTests] = await Promise.all([
                getMaterialsByBlockId(block.id),
                getTestsByBlockId(block.id),
            ]);
            setMaterials(fetchedMaterials);
            setTests(fetchedTests);
        } catch (error) {
            console.error(`Error fetching data for block ${block.id}:`, error);
        } finally {
            setIsLoading(false);
        }
    }, [block.id]);

    useEffect(() => {
        fetchBlockData();
    }, [fetchBlockData]);

    const handleSaveMaterial = async (blockId: number, materialData: MaterialData, materialContents: {
        front: string;
        back: string
    }[]) => {
        setIsLoading(true);
        try {
            if (!currentMaterial?.id) {
                await createMaterial({title: materialData.title, block_id: blockId}, materialContents);
            } else {
                await updateMaterial(currentMaterial.id, {title: materialData.title}, materialContents);
            }
            await fetchBlockData();
            setMaterialModalOpen(false);
        } catch (error) {
            console.error("Error saving material:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteModule = async (blockId: number) => {
        try {
            await deleteBlock(blockId);
            // await fetchCourseData();
            window.location.reload(); // тимчасово
        } catch (error) {
            console.error("Error deleting module:", error);
        }
    };

    const handleSaveTest = async (testId: number | null, testData: TestDataWithQuestion) => {
        setIsLoading(true);
        try {
            if (testId) {
                await updateTest(testId, testData);
            } else {
                await createTest(testData);
            }
            await fetchBlockData();
            setTestModalOpen(false);
        } catch (error) {
            console.error("Error saving test:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || materials === null || tests === null) {
        return <Skeleton height={200} className="mb-4"/>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h3 className="font-bold text-lg mb-2">{block.name}</h3>
            <div className="mb-2">
                <strong>Materials:</strong>
                <ul>
                    {materials.map((material) => (
                        <li key={material.id}>
                            {material.title}
                            <Button
                                className="ml-3"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setCurrentMaterial(material);
                                    setMaterialModalOpen(true);
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                className="ml-1"
                                variant="destructive"
                                size="sm"
                                onClick={async () => {
                                    await deleteMaterial(material.id);
                                    fetchBlockData();
                                }}
                            >
                                Delete
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mb-2">
                <strong>Tests:</strong>
                <ul>
                    {tests.map((test) => (
                        <li key={test.id}>
                            {test.question}
                            <Button
                                className="ml-3"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setCurrentTest(test);
                                    setTestModalOpen(true);
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                className="ml-1"
                                variant="destructive"
                                size="sm"
                                onClick={async () => {
                                    await deleteTest(test.id);
                                    fetchBlockData();
                                }}
                            >
                                Delete
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex justify-between">
                <Button onClick={() => handleOpenBlockModal(block)}>Edit Block</Button>
                <Button
                    variant="destructive"
                    onClick={() => {
                        setModals((prev) => ({...prev, deleteBlock: block.id}));
                        deleteModule(block.id);
                    }}
                >
                    Delete Block
                </Button>
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <Button
                    onClick={() => {
                        setCurrentMaterial(null);
                        setMaterialModalOpen(true);
                    }}
                >
                    Add Material
                </Button>
                <Button
                    onClick={() => {
                        setCurrentTest(null);
                        setTestModalOpen(true);
                    }}
                >
                    Add Test
                </Button>
            </div>
            <MaterialModal
                isOpen={isMaterialModalOpen}
                onClose={() => setMaterialModalOpen(false)}
                onSave={(materialTitle: string, materialContents: Card[]) => {
                    handleSaveMaterial(block.id, { title: materialTitle }, materialContents);
                }}
                materialTitle={currentMaterial?.title || ""}
                setMaterialTitle={(title) =>
                    // setCurrentMaterial((prev) => prev ? ({ ...prev, title }) : null)
                    // setCurrentMaterial((prev) => ({...prev, title}))
                    
                    setCurrentMaterial((prev) => ({
                        id: prev?.id ?? 0,
                        title,
                        content: prev?.content ?? ""
                    }))
                }
                currentMaterial={currentMaterial}
                blockId={block.id}
                materialContents={materialContents}
                setMaterialContents={setMaterialContents}
            />

            <TestModal
                isOpen={isTestModalOpen}
                onClose={() => setTestModalOpen(false)}
                onSave={handleSaveTest}
                testId={currentTest?.id || null}
                blockId={block.id}
            />
        </div>
    );
}
