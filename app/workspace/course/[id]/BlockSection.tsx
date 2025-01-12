import { Button } from "@/components/ui/button";
import { Block, BlockSectionProps } from "@/lib/definitions";
import { deleteBlock, deleteMaterial, deleteTest } from "@/lib/tests/actions";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from "react";

export default function BlockSection({
    block,
    tests,
    materials,
    setModals,
    setCurrentBlockId,
    handleOpenBlockModal,
    handleOpenMaterialModal,
    handleOpenTestModal,
    setCurrentTest,
    currentBlockId,
}: BlockSectionProps) {
    const handleDelete = async (type: string, id: number) => {
        switch (type) {
            case "test":
                await deleteTest(id);
                console.log(`Deleted test with ID: ${id}`);
                break;
    
            case "block":
                await deleteBlock(id);
                console.log(`Deleted block with ID: ${id}`);
                break;
    
            case "material":
                await deleteMaterial(id);
                console.log(`Deleted material with ID: ${id}`);
                break;
    
            default:
                console.error(`Unknown type: ${type}`);
        }
    };    

    const handleOpenModal = (type: string, block: Block) => {
        setCurrentBlockId(block.id);
        setModals((prev: any) => ({ ...prev, [type]: true }));
    };

    return (
        <div className="my-4 p-4 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold">{block.name}</h2>
                <div>
                    <Button onClick={() => handleOpenBlockModal(block)}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDelete("block", block.id)}>Delete</Button>
                </div>
            </div>

            <Button
                onClick={() =>
                    handleOpenMaterialModal(
                        null,
                        block.id,
                        setCurrentBlockId,
                        () => null,
                        () => "",
                        () => "",
                        setModals
                    )
                }
                className="w-full mb-2"
            >
                Create Material
            </Button>
            <Button
                onClick={() =>
                    handleOpenTestModal(
                        null,
                        currentBlockId,
                        setCurrentTest,
                        setCurrentBlockId,
                        setModals
                    )
                }
            >
                Create Test
            </Button>

            {tests?.map((test: { id: Key | null | undefined; question: string | ReactNode }) => (
                <div key={test.id} className="flex justify-between items-center">
                    <span>Test: {test.question}</span>
                    <div>
                        <Button
                            onClick={() =>
                                handleOpenTestModal(
                                    test,
                                    currentBlockId,
                                    setCurrentTest,
                                    setCurrentBlockId,
                                    setModals
                                )
                            }
                        >
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleDelete("test", Number(test.id))}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            ))}

            {materials?.map((material: { id: Key | null | undefined; title: string | ReactNode }) => (
                <div key={material.id} className="flex justify-between items-center">
                    <span>Learning material: {material.title}</span>
                    <div>
                        <Button
                            onClick={() =>
                                handleOpenMaterialModal(
                                    material,
                                    block.id,
                                    setCurrentBlockId,
                                    () => null,
                                    () => "",
                                    () => "",
                                    setModals
                                )
                            }
                        >
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleDelete("material", Number(material.id))}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
