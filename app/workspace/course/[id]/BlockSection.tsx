import { Button } from "@/components/ui/button";
import {Block, BlockSectionProps} from "@/lib/definitions";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from "react";

export default function BlockSection({block, tests, materials, setModals, setCurrentBlockId, handleOpenBlockModal, handleOpenMaterialModal, handleOpenTestModal, setCurrentTest, currentBlockId,}: BlockSectionProps) {
    const handleOpenModal = (type: string, block: Block) => {
        setCurrentBlockId(block.id);
        setModals((prev: any) => ({...prev, [type]: true}));
    };

    return (
        <div className="my-4 p-4 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold">{block.name}</h2>
                <div>
                    <Button onClick={() => handleOpenBlockModal(block)}>Edit</Button>
                    <Button variant="destructive">Delete</Button>
                </div>
            </div>

            <Button
                onClick={() => handleOpenMaterialModal(null, block.id, setCurrentBlockId, () => null, () => '', () => '', setModals)}
                className="w-full mb-2">
                Create Material
            </Button>
            <Button
                onClick={() => handleOpenTestModal(null, currentBlockId, setCurrentTest, setCurrentBlockId, setModals)}>
                Create Test
            </Button>

            {tests?.map((test: { id: Key | null | undefined; question: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }) => (
                <div key={test.id} className="flex justify-between">
                    <span>Test: {test.question}</span>
                    <Button onClick={() => handleOpenTestModal(test, currentBlockId, setCurrentTest, setCurrentBlockId, setModals)}>
                        Edit
                    </Button>
                </div>
            ))}

            {materials?.map((material: { id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }) => (
                <div key={material.id} className="flex justify-between">
                    <span>Learning material: {material.title}</span>
                    <Button onClick={() => handleOpenMaterialModal(material, block.id, setCurrentBlockId, () => null, () => '', () => '', setModals)}>
                        Edit
                    </Button>
                </div>
            ))}
        </div>
    );
}
