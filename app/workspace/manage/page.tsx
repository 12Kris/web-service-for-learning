// "use client";
//
// import { useState, useEffect } from "react";
// import {
//     getBlocks,
//     createTest,
//     deleteTest,
//     createMaterial,
//     deleteMaterial,
// } from "@/lib/tests/actions";
// import { getMaterialsByBlockId, getTestsByBlockId } from "@/lib/courses/actions";
// import { Block, Test, LearningMaterial } from "@/lib/definitions";
//
// export default function BlockManagePage() {
//     const [blocks, setBlocks] = useState<Block[]>([]);
//     const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
//     const [tests, setTests] = useState<Test[]>([]);
//     const [materials, setMaterials] = useState<LearningMaterial[]>([]);
//     const [newTest, setNewTest] = useState({ question: "", answers: [{ text: "", isCorrect: false }] });
//     const [newMaterial, setNewMaterial] = useState({ title: "", content: "" });
//
//     // Fetch all blocks
//     useEffect(() => {
//         getBlocks().then(setBlocks);
//     }, []);
//
//     // Fetch tests and materials for the selected block
//     useEffect(() => {
//         if (selectedBlock) {
//             getTestsByBlockId(selectedBlock).then(setTests);
//             getMaterialsByBlockId(selectedBlock).then(setMaterials);
//         }
//     }, [selectedBlock]);
//
//     // Handlers for Tests
//     const handleAddTest = async () => {
//         if (!selectedBlock) return;
//         await createTest({ question: newTest.question, answers: newTest.answers, block_id: selectedBlock });
//         setNewTest({ question: "", answers: [{ text: "", isCorrect: false }] });
//         reloadData();
//     };
//
//     const handleDeleteTest = async (testId: number) => {
//         await deleteTest(testId);
//         reloadData();
//     };
//
//     // Handlers for Materials
//     const handleAddMaterial = async () => {
//         if (!selectedBlock) return;
//         await createMaterial({ ...newMaterial, block_id: selectedBlock });
//         setNewMaterial({ title: "", content: "" });
//         reloadData();
//     };
//
//     const handleDeleteMaterial = async (materialId: number) => {
//         await deleteMaterial(materialId);
//         reloadData();
//     };
//
//     // Reload tests and materials
//     const reloadData = () => {
//         if (selectedBlock) {
//             getTestsByBlockId(selectedBlock).then(setTests);
//             getMaterialsByBlockId(selectedBlock).then(setMaterials);
//         }
//     };
//
//     return (
//         <div style={{ padding: "20px" }}>
//             <h1>Manage Blocks</h1>
//
//             <select onChange={(e) => setSelectedBlock(Number(e.target.value))} value={selectedBlock || ""}>
//                 <option value="">-- Select Block --</option>
//                 {blocks.map((block) => (
//                     <option key={block.id} value={block.id}>
//                         {block.name}
//                     </option>
//                 ))}
//             </select>
//
//             {selectedBlock && (
//                 <>
//                     {/* Tests Section */}
//                     <section>
//                         <h2>Tests</h2>
//                         {tests.map((test) => (
//                             <div key={test.id}>
//                                 <p>{test.question}</p>
//                                 <button onClick={() => handleDeleteTest(test.id)}>Delete</button>
//                             </div>
//                         ))}
//
//                         <div>
//                             <input
//                                 placeholder="Test Question"
//                                 value={newTest.question}
//                                 onChange={(e) => setNewTest({ ...newTest, question: e.target.value })}
//                             />
//                             {newTest.answers.map((ans, idx) => (
//                                 <div key={idx}>
//                                     <input
//                                         placeholder={`Answer ${idx + 1}`}
//                                         value={ans.text}
//                                         onChange={(e) =>
//                                             setNewTest({
//                                                 ...newTest,
//                                                 answers: newTest.answers.map((a, i) =>
//                                                     i === idx ? { ...a, text: e.target.value } : a
//                                                 ),
//                                             })
//                                         }
//                                     />
//                                     <input
//                                         type="radio"
//                                         checked={ans.isCorrect}
//                                         onChange={() =>
//                                             setNewTest({
//                                                 ...newTest,
//                                                 answers: newTest.answers.map((a, i) => ({
//                                                     ...a,
//                                                     isCorrect: i === idx,
//                                                 })),
//                                             })
//                                         }
//                                     />
//                                 </div>
//                             ))}
//                             <button
//                                 onClick={() =>
//                                     setNewTest({
//                                         ...newTest,
//                                         answers: [...newTest.answers, { text: "", isCorrect: false }],
//                                     })
//                                 }
//                             >
//                                 Add Answer
//                             </button>
//                             <button onClick={handleAddTest}>Add Test</button>
//                         </div>
//                     </section>
//
//                     {/* Materials Section */}
//                     <section>
//                         <h2>Materials</h2>
//                         {materials.map((material) => (
//                             <div key={material.id}>
//                                 <p>{material.title}</p>
//                                 <button onClick={() => handleDeleteMaterial(material.id)}>Delete</button>
//                             </div>
//                         ))}
//
//                         <div>
//                             <input
//                                 placeholder="Material Title"
//                                 value={newMaterial.title}
//                                 onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
//                             />
//                             <textarea
//                                 placeholder="Material Content"
//                                 value={newMaterial.content}
//                                 onChange={(e) => setNewMaterial({ ...newMaterial, content: e.target.value })}
//                             />
//                             <button onClick={handleAddMaterial}>Add Material</button>
//                         </div>
//                     </section>
//                 </>
//             )}
//         </div>
//     );
// }
"use client";
import Link from "next/link";

export default function ManagePage() {
    return (
        <div>
            <h1>Manage</h1>
            <ul>
                <li><Link href="/workspace/manage/blocks">Blocks</Link></li>
                <li><Link href="/workspace/manage/materials">Materials</Link></li>
                <li><Link href="/workspace/manage/test">Tests</Link></li>
            </ul>
        </div>
    );
}
