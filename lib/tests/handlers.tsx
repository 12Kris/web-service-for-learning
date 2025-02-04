// import {
//     createBlock, createMaterial, createTest, deleteBlock, deleteTest,
//     getTestAnswers, updateBlock, updateMaterial, updateTest
// } from "@/lib/tests/actions";
// import {getTestsByBlockId} from "@/lib/courses/actions";
//
// export const handleOpenModal = (
//     block: Block,
//     setCurrentBlock: React.Dispatch<React.SetStateAction<Block | null>>,
//     setBlockName: React.Dispatch<React.SetStateAction<string>>,
//     setModals: React.Dispatch<React.SetStateAction<{ block: boolean; material: boolean; test: boolean }>>
// ) => {
//     setCurrentBlock(block);
//     setBlockName(block?.name || "");
//     setModals((prevState) => ({
//         ...prevState,
//         block: true,
//     }));
// };
//
// export const handleCloseModal = (
//     setIsModalOpen: (open: boolean) => void,
//     setCurrentBlock: (block: Block | null) => void,
//     setBlockName: (name: string) => void
// ) => {
//     setIsModalOpen(false);
//     setCurrentBlock(null);
//     setBlockName("");
// };
//
// export const handleCreateOrEditBlock = async (
//     blockName: string,
//     currentBlock: Block | null,
//     id: number | null,
//     setIsModalOpen: (open: boolean) => void,
//     setBlocks: (blocks: Block[]) => void,
//     getModulesByCourseId: (id: number | null) => Promise<Block[]>
// ) => {
//     if (!blockName) return;
//
//     if (currentBlock) {
//         await updateBlock(currentBlock.id, id, blockName);
//     } else {
//         await createBlock(id, blockName);
//     }
//
//     setBlocks(await getModulesByCourseId(id));
//     setIsModalOpen(false);
// };
//
// export const handleDeleteBlock = async (
//     blockId: number,
//     setBlocks: (blocks: Block[]) => void,
//     id: string,
//     getModulesByCourseId: (id: string) => Promise<Block[]>
// ) => {
//     await deleteBlock(blockId);
//     setBlocks(await getModulesByCourseId(id));
// };
//
// export const handleOpenMaterialModal = (
//     material: Material,
//     blockId: number,
//     setCurrentBlockId: React.Dispatch<React.SetStateAction<number | null>>,
//     setCurrentMaterial: React.Dispatch<React.SetStateAction<Material | null>>,
//     setMaterialTitle: React.Dispatch<React.SetStateAction<string>>,
//     setMaterialContent: React.Dispatch<React.SetStateAction<string>>,
//     setModals: React.Dispatch<React.SetStateAction<{ block: boolean; material: boolean; test: boolean }>>
// ) => {
//     setCurrentMaterial(material);
//     setMaterialTitle(material?.title || "");
//     setMaterialContent(material?.content || "");
//     setCurrentBlockId(blockId);
//     setModals((prevState) => ({
//         ...prevState,
//         material: true,
//     }));
// };
//
// export const handleCloseMaterialModal = (
//     setIsMaterialModalOpen: (open: boolean) => void,
//     setCurrentMaterial: (material: Material | null) => void,
//     setMaterialTitle: (title: string) => void,
//     setMaterialContent: (content: string) => void
// ) => {
//     setIsMaterialModalOpen(false);
//     setCurrentMaterial(null);
//     setMaterialTitle("");
//     setMaterialContent("");
// };
//
// export const handleCreateOrEditMaterial = async (
//     materialTitle: string,
//     materialContents: { front: string; back: string }[],
//     currentMaterial: Material | null,
//     currentBlockId: number,
//     setIsMaterialModalOpen: (open: boolean) => void,
//     setMaterials: (materials: Material[]) => void
// ) => {
//     if (!materialTitle || !materialContents.length) return;
//
//     const materialData = {
//         title: materialTitle,
//         block_id: currentMaterial?.block_id || currentBlockId,
//     };
//
//     try {
//         if (currentMaterial) {
//             await updateMaterial(currentMaterial.id, materialData, materialContents);
//         } else {
//             await createMaterial(materialData, materialContents);
//         }
//
//         setIsMaterialModalOpen(false);
//     } catch (error) {
//         console.error(`Error handling material: ${error.message}`);
//     }
// };
//
// export const handleCreateOrEditTest = async (
//     testData: TestData,
//     currentTest: Test | null,
//     setIsTestModalOpen: (open: boolean) => void,
//     setTests: (tests: Test[]) => void
// ) => {
//     try {
//         if (currentTest) {
//             await updateTest(currentTest.id, testData);
//         } else {
//             await createTest(testData);
//         }
//
//         const updatedTests = await getTestsByBlockId(testData.block_id);
//         setTests(updatedTests);
//
//         setIsTestModalOpen(false);
//     } catch (error) {
//         console.error("Error saving test:", error);
//     }
// };
//
// export const handleDeleteTest = async (
//     testId: number,
//     blockId: number,
//     setTests: (tests: Test[]) => void
// ) => {
//     await deleteTest(testId);
//     setTests((prevTests) => prevTests.filter((test) => test.id !== testId));
// };
//
// export const handleOpenTestModal = async (
//     test: Test | null,
//     blockId: number,
//     setCurrentTest: (test: Test | null) => void,
//     setCurrentBlockId: (id: number) => void,
//     setModals: (modals: { block: boolean; material: boolean; test: boolean }) => void
// ) => {
//     setCurrentBlockId(blockId);
//
//     if (test) {
//         try {
//             const answersData = await getTestAnswers(test.id);
//             if (!answersData) return;
//
//             const formattedAnswers = Array.isArray(answersData[0]?.answers)
//                 ? answersData[0]?.answers.map((ans: any) => ({
//                     id: ans.id,
//                     text: ans.answer,
//                     correct: ans.id === answersData[0]?.correctAnswer?.id,
//                 }))
//                 : [{ text: "", correct: false }, { text: "", correct: false }];
//
//             const formattedTest = {
//                 ...test,
//                 question: answersData[0]?.question || test.question,
//                 answers: formattedAnswers,
//             };
//
//             setCurrentTest(formattedTest);
//         } catch (error) {
//             console.error("Error fetching test answers:", error);
//             setCurrentTest(null);
//         }
//     } else {
//         setCurrentTest(null);
//     }
//     setModals((prev) => ({ ...prev, test: true }));
// };
//
// export const handleCloseTestModal = (
//     setIsTestModalOpen: (open: boolean) => void,
//     setCurrentTest: (test: Test | null) => void
// ) => {
//     setIsTestModalOpen(false);
//     setCurrentTest(null);
// };
