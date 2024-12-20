import {Button} from "@/components/ui/button";

export default function BlockSection({
                                         block,
                                         tests,
                                         materials,
                                         setModals,
                                         setCurrentBlockId,
                                         handleOpenBlockModal,
                                         handleOpenMaterialModal,
                                         handleOpenTestModal,
                                         setCurrentTest, currentBlockId
                                     }) {
    const handleOpenModal = (type, block) => {
        setCurrentBlockId(block.id);
        setModals((prev) => ({...prev, [type]: true}));
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

            <Button onClick={() => handleOpenMaterialModal(null)} className="w-full mb-2">
                Create Material
            </Button>
            <Button
                onClick={() => handleOpenTestModal(null, currentBlockId, setCurrentTest, setCurrentBlockId, setModals)}>
                Create Test
            </Button>


            {tests?.map((test) => (
                <div key={test.id} className="flex justify-between">
                    <span>Test: {test.question}</span>
                    <Button
                        onClick={() => handleOpenTestModal(test, currentBlockId, setCurrentTest, setCurrentBlockId, setModals)}>
                        Edit
                    </Button>
                </div>
            ))}


            {materials?.map((material) => (
                <div key={material.id} className="flex justify-between">
                    <span>Learning material: {material.title}</span>
                    <Button onClick={() => handleOpenMaterialModal(material)}>Edit</Button>
                </div>
            ))}
        </div>
    );
}
