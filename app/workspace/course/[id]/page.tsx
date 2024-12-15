// "use client";
// import { useEffect, useState } from "react";
// import {
//     addCourseToUser,
//     getCourseById,
//     isCourseAddedToUser,
//     getMaterialsByBlockId,
//     deleteCourse,
//     getBlocksByCourseId,
//     getTestsByBlockId,
// } from "@/lib/courses/actions";
// import { Button } from "@/components/ui/button";
// import { getUser } from "@/lib/auth/authActions";
// import Link from "next/link";
// import { Course, Block, LearningMaterial, Test } from "@/lib/definitions";
// import {useParams} from "next/navigation";
// interface CourseDetailPage {
//     params: { id: number };
// }
//
// export default function CourseDetailPage({ params }: CourseDetailPage) {
//     const [course, setCourse] = useState<Course | null>(null);
//     const [blocks, setBlocks] = useState<Block[]>([]);
//     const [materials, setMaterials] = useState<{ [key: number]: LearningMaterial[] }>({});
//     const [tests, setTests] = useState<{ [key: number]: Test[] }>({});
//     const [isCourseAdded, setIsCourseAdded] = useState<boolean>(false);
//     const [isCreator, setIsCreator] = useState<boolean>(false);
//     const [isLoading, setIsLoading] = useState<boolean>(true);
//
//     const { id } = useParams();
//
//     useEffect(() => {
//         async function fetchData() {
//             if (!id) return;
//             setIsLoading(true);
//
//             try {
//                 const courseData: Course = await getCourseById(id);
//                 setCourse(courseData);
//
//                 const user = await getUser();
//                 if (user && courseData) {
//                     setIsCreator(user.id.toString() === courseData.creator_id?.toString());
//                 }
//
//                 const result = await isCourseAddedToUser(id);
//                 setIsCourseAdded(result);
//
//                 const fetchedBlocks: Block[] = await getBlocksByCourseId(id);
//                 setBlocks(fetchedBlocks);
//
//                 const fetchedMaterials: { [key: number]: LearningMaterial[] } = {};
//                 const fetchedTests: { [key: number]: Test[] } = {};
//
//                 for (const block of fetchedBlocks) {
//                     fetchedMaterials[block.id] = await getMaterialsByBlockId(block.id);
//                     fetchedTests[block.id] = await getTestsByBlockId(block.id);
//                 }
//
//                 setMaterials(fetchedMaterials);
//                 setTests(fetchedTests);
//             } catch (err) {
//                 console.error("Error fetching data:", err);
//             } finally {
//                 setIsLoading(false);
//             }
//         }
//
//         fetchData();
//     }, [id]);
//
//     async function handleAddCourse() {
//         if (!id) return;
//         await addCourseToUser(id);
//         setIsCourseAdded(true);
//     }
//
//     async function handleDeleteCourse() {
//         if (!id) return;
//         const result = await deleteCourse(id);
//         if (result.success) {
//             window.location.href = "/workspace/";
//         } else {
//             alert(`Failed to delete course: ${result.message}`);
//         }
//     }
//
//     if (isLoading) {
//         return <div>Loading...</div>;
//     }
//
//     return (
//         <div className="container mx-auto py-10 px-4 flex w-full gap-4">
//             <div className="flex-1 bg-zinc-100 rounded-3xl p-6">
//                 <h1 className="text-3xl font-bold mb-6">{course?.name}</h1>
//                 <div className="mb-6">{course?.description}</div>
//                 <div>
//                     <span className="font-bold">Type:</span> {course?.type}
//                 </div>
//
//                 <div className="my-4">
//                     <Button onClick={handleAddCourse} disabled={isCourseAdded}>
//                         {isCourseAdded ? "Subscribed" : "Subscribe"}
//                     </Button>
//                     <Link className="ml-4" href={`/workspace/course/${course?.id}/cards`}>
//                         <Button>Take the test</Button>
//                     </Link>
//                 </div>
//             </div>
//             <div className="flex-3 bg-zinc-100 rounded-3xl p-6">
//                 Test
//             </div>
//
//             <div>
//                 {blocks.map((block) => (
//                     <div key={block.id} className="my-6">
//                         <h2 className="text-2xl font-bold">{block.name}</h2>
//
//                         {tests[block.id]?.length > 0 && (
//                             <div className="mt-4">
//                                 <h3 className="font-semibold">Tests:</h3>
//                                 {tests[block.id].map((test) => (
//                                     <div key={test.id} className="ml-4 my-2">
//                                         <a href={`/workspace/tests/${test.id}`}>{test.question}</a>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
"use client";
import {useEffect, useState} from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
    addCourseToUser, getBlocksByCourseId,
    getCourseById, getMaterialsByBlockId, getTestsByBlockId,
    isCourseAddedToUser,
} from "@/lib/courses/actions";
import {Button} from "@/components/ui/button";
import {getUser} from "@/lib/auth/authActions";
import {use} from "react";
import Link from "next/link";
import {Course} from "@/lib/definitions";
import {deleteCourse} from "@/lib/courses/actions";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CourseDetailPage({
                                             params,
                                         }: {
    params: Promise<{ id: string }>;
}) {
    const [course, setCourse] = useState<Course | null>(null);
    const [isCourseAdded, setIsCourseAdded] = useState(false);
    const {id} = use(params);
    const [blocks, setBlocks] = useState([]);
    const [tests, setTests] = useState({});
    const [materials, setMaterials] = useState({});
    const [isCreator, setIsCreator] = useState(false);

    useEffect(() => {
        async function fetchData() {
            if (!id) return;

            try {
                const courseData = await getCourseById(id);
                setCourse(courseData);

                const user = await getUser();
                if (user && courseData) {
                    setIsCreator(user.id.toString() === courseData.creator_id.toString());
                }

                const result = await isCourseAddedToUser(id);
                setIsCourseAdded(result);

                const blocksData = await getBlocksByCourseId(id);
                setBlocks(blocksData);

                const testsData = {};
                const materialsData = {};
                for (const block of blocksData) {
                    const blockTests = await getTestsByBlockId(block.id);
                    const blockMaterials = await getMaterialsByBlockId(block.id);
                    testsData[block.id] = blockTests;
                    materialsData[block.id] = blockMaterials;
                }
                setTests(testsData);
                setMaterials(materialsData);
            } catch (err) {
                console.error(err);
            }
        }

        fetchData();
    }, [id]);

    async function handleAddCourse() {
        if (!id) return;
        await addCourseToUser(id);
        setIsCourseAdded(true);
    }

    async function handleDeleteCourse() {
        if (!id) return;
        const result = await deleteCourse(id);
        if (result.success) {
            window.location.href = "/workspace/";
        } else {
            alert(`Failed to delete course: ${result.message}`);
        }
    }

    return (
        <div className="container mx-auto py-10 px-4 flex flex-col md:flex-row w-full gap-4" style={{display:"grid", gridTemplateColumns:"1fr 300px"}}>
            <div className="flex-1 bg-zinc-100 rounded-3xl p-6">
                <h1 className="text-3xl font-bold mb-6">
                    {course?.name || <Skeleton count={1}/>}
                </h1>
                <div className="mb-6">
                    {course?.description || <Skeleton count={3}/>}
                </div>
                <div>
                    <span className="font-bold">Type:</span>{" "}
                    {course?.type || <Skeleton width={130} inline={true} count={1}/>}
                </div>
                <div>
                    <span className="font-bold">Instructor:</span>{" "}
                    {course?.creator?.full_name || (
                        <Skeleton width={130} inline={true} count={1}/>
                    )}
                </div>

                <div className="my-4">
                    <Button onClick={handleAddCourse} disabled={isCourseAdded}>
                        {isCourseAdded ? "Subscribed" : "Subscribe"}
                    </Button>

                    <Link className="ml-4" href={`/workspace/course/${course?.id}/cards`}>
                        <Button>Take the test</Button>
                    </Link>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                {isCreator && (
                    <Link href={`/workspace/course/${course?.id}/edit`}>
                        <Button className="w-full">Edit</Button>
                    </Link>
                )}
                {isCreator && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">Delete Course</Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the
                                    course and remove the data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-500 hover:bg-red-600"
                                    onClick={handleDeleteCourse}
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
            <div className="flex-1">
                {blocks.length > 0 && (
                    <div>
                        {blocks.map((block) => (
                            <div key={block.id} className="my-6">
                                <h2 className="text-2xl font-bold">{block.name} | {isCreator ? <div>Edit | Delete</div> : ""}</h2>

                                {tests[block.id]?.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="font-semibold">Tests:</h3>
                                        {tests[block.id].map((test) => (
                                            <div key={test.id} className="ml-4 my-2">
                                                <Link href={`/workspace/tests/${test.id}`}>
                                                    {test.question}
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {materials[block.id]?.length > 0 && (
                                    <div className="mt-4">
                                        {materials[block.id].map((material) => (
                                            <div key={material.id} className="ml-4 my-2">
                                                <h4>{material.title} | {isCreator ? <div>Edit | Delete</div> : ""}</h4>
                                                <p>{material.content}</p>
                                                <p>{material.type}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}