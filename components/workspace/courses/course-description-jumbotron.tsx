"use client";

import { useEffect, useState } from "react";
import { UserPlus, UserCheck, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SpacedRepetitionModal } from "@/components/workspace/modals/spaced-repetition";
import { addCourseToUser, isCourseAddedToUser, removeCourseFromUser } from "@/lib/courses/actions";
import { Course } from "@/lib/types/course";

const hexToRgba = (hex: string, alpha: number = 0.5): string => {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface CourseDescriptionJumbotronProps {
  course: Course;
  id: number;
  courseRating?: number;
  reviews?: number;
  color?: string;
  onLearnMore?: () => void;
  onSubscriptionChange?: () => void;
}

const CourseDescriptionJumbotron: React.FC<CourseDescriptionJumbotronProps> = ({
  course,
  courseRating,
  reviews,
  id,
  color,
  onSubscriptionChange,
}) => {
  const [isCourseAdded, setIsCourseAdded] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const result = await isCourseAddedToUser(id);
        setIsCourseAdded(result);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [id]);

  async function handleAddCourse(id: number) {
    if (!id) return;
    await addCourseToUser(id);
    setIsCourseAdded(true);
    if (onSubscriptionChange) {
      onSubscriptionChange();
    }
  }

  async function handleRemoveCourse(id: number) {
    if (!id) return;
    await removeCourseFromUser(id);
    setIsCourseAdded(false);
    if (onSubscriptionChange) {
      onSubscriptionChange();
    }
  }

  const bgColor = color ? hexToRgba(color) : "#a8e6cf";

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <section
      className="rounded-xl"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="relative px-6 py-16 text-center text-black rounded-t-xl"
        style={{ backgroundColor: course.color || "#a8e6cf" }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.name}</h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">{course.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isCourseAdded !== null && (
              <div className="flex flex-col md:flex-row gap-2">
                {isCourseAdded && (
                  <Link href={`/workspace/courses/${id}/modules`}>
                    <Button size="lg"
                     variant={"solid"} className=" hover:text-[--neutral] hover:bg-white">
                      Go to Modules
                    </Button>
                  </Link>
                )}
                <Button
                  size="lg"
                  variant={isCourseAdded ? "destructive" : "solid"}
                  className={isCourseAdded ? "bg-white" : "hover:bg-white hover:text-[--neutral]"}
                  onClick={() => (isCourseAdded ? handleRemoveCourse(id) : handleAddCourse(id))}
                >
                  {isCourseAdded ? (
                    <>
                      <UserCheck /> Subscribed
                    </>
                  ) : (
                    <>
                      <UserPlus /> Subscribe
                    </>
                  )}
                </Button>
                {isCourseAdded && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white"
                    onClick={() => setIsModalOpen(true)}
                  >
                    View Spaced Repetition Plan
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white border rounded-b-xl flex justify-center text-[--neutral]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <span className="font-medium">{course.creator?.full_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.student_count} Students Enrolled</span>
            </div>
            <div className="flex items-center gap-1">
              {renderStars(courseRating || 0)}
              <span className="ml-1 font-medium">{courseRating?.toFixed(1)}</span>
              <span>({reviews} reviews)</span>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <SpacedRepetitionModal
          courseId={id}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
};

export default CourseDescriptionJumbotron;

// import React from "react";
// import { Button } from "../../ui/button";
// import Skeleton from "react-loading-skeleton";
// import { UserPlus, UserCheck } from "lucide-react";
// import { useEffect, useState } from "react";
// import {
//   addCourseToUser,
//   isCourseAddedToUser,
//   removeCourseFromUser,
// } from "@/lib/courses/actions";
// import Link from "next/link";
// import { SpacedRepetitionModal } from "@/components/workspace/modals/spaced-repetition";

// const hexToRgba = (hex: string, alpha: number = 0.5): string => {
//   const cleanHex = hex.replace("#", "");
//   const r = parseInt(cleanHex.substring(0, 2), 16);
//   const g = parseInt(cleanHex.substring(2, 4), 16);
//   const b = parseInt(cleanHex.substring(4, 6), 16);
//   return `rgba(${r}, ${g}, ${b}, ${alpha})`;
// };

// interface CourseDescriptionJumbotronProps {
//   title?: string;
//   description?: string;
//   type?: string;
//   id: number;
//   color?: string;
//   onLearnMore?: () => void;
//   onSubscriptionChange?: () => void;
// }

// const CourseDescriptionJumbotron: React.FC<CourseDescriptionJumbotronProps> = ({
//   title,
//   description,
//   type,
//   id,
//   color,
//   onSubscriptionChange,
// }) => {
//   const [isCourseAdded, setIsCourseAdded] = useState<boolean | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     async function fetchData() {
//       if (!id) return;
      
//       try {
//         const result = await isCourseAddedToUser(id);
//         setIsCourseAdded(result);
//       } catch (err) {
//         console.error(err);
//       }
//     }

//     fetchData();
//   }, [id]);

//   async function handleAddCourse(id: number) {
//     if (!id) return;
//     await addCourseToUser(id);
//     setIsCourseAdded(true);
//     if (onSubscriptionChange) {
//       onSubscriptionChange();
//     }
//   }

//   async function handleRemoveCourse(id: number) {
//     if (!id) return;
//     await removeCourseFromUser(id);
//     setIsCourseAdded(false);
//     if (onSubscriptionChange) {
//       onSubscriptionChange();
//     }
//   }

//   const bgColor = color ? hexToRgba(color, 0.5) : "rgba(98, 255, 187, 0.5)";

//   return (
//     // <section className="w-full border mb-2 rounded-xl min-h-[40vh] flex flex-col justify-center items-center gap-7 p-4 py-10" style={{backgroundColor: bgColor}}>
//         <section className="w-full border mb-2 rounded-xl min-h-[40vh] flex flex-col justify-center items-center gap-7 p-4 py-10 border-2 bg-white" style={{borderColor: bgColor}}>
//       <div className="flex flex-col items-center gap-2">
//         <h1 className="text-5xl font-bold text-center">
//           {title || (
//             <Skeleton
//               baseColor="#e2e8f0"
//               highlightColor="white"
//               width={300}
//               count={1}
//             />
//           )}
//         </h1>
//         {type && (
//           <p className="text-sm md:text-base px-3 py-1 bg-[#d5e2de] text-slate-700 rounded-full whitespace-nowrap border border-[--neutral]">
//             {type}
//           </p>
//         )}
//         {!type && (
//           <Skeleton
//             baseColor="#e2e8f0"
//             highlightColor="white"
//             width={100}
//             count={1}
//           />
//         )}
//       </div>

//       <p className="text-xl md:max-w-[70%] text-center">
//         {description || (
//           <Skeleton
//             baseColor="#e2e8f0"
//             highlightColor="white"
//             width={300}
//             count={3}
//           />
//         )}
//       </p>

//       {isCourseAdded === null && (
//         <Skeleton
//           baseColor="#a2d5c6"
//           highlightColor="#d8f8e3"
//           width={300}
//           height={32}
//           count={1}
//         />
//       )}
//       {isCourseAdded !== null && (
//         <div className="flex flex-col md:flex-row gap-2">
//           {isCourseAdded && (
//             <Link href={`/workspace/courses/${id}/modules`}>
//               <Button variant={"solid"} className=" hover:text-[--neutral] hover:bg-white">
//                 Go to modules
//               </Button>
//             </Link>
//           )}
//           <Button
//             variant={isCourseAdded ? "destructive" : "solid"}
//             onClick={() =>
//               isCourseAdded ? handleRemoveCourse(id) : handleAddCourse(id)
//             }
//           >
//             {isCourseAdded ? (
//               <>
//                 <UserCheck /> Subscribed
//               </>
//             ) : (
//               (
//                 <>
//                   <UserPlus /> Subscribe
//                 </>
//               ) || (
//                 <Skeleton
//                   baseColor="#e2e8f0"
//                   highlightColor="white"
//                   width={300}
//                   count={1}
//                 />
//               )
//             )}
//           </Button>
//           {isCourseAdded && (
//             <Button variant="outline" onClick={() => setIsModalOpen(true)}>
//               View Spaced Repetition plan
//             </Button>
//           )}
//         </div>
//       )}
//       {isModalOpen && (
//         <SpacedRepetitionModal
//           courseId={id}
//           onClose={() => setIsModalOpen(false)}
//         />
//       )}
//     </section>
//   );
// };

// export default CourseDescriptionJumbotron;