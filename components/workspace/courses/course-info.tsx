// import { Check, Star } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { CourseDetails, WhatWillLearn } from "@/lib/types/course";

// interface CourseInfo {
//   course_details: CourseDetails[];
//   what_you_learn: WhatWillLearn[];
//   course_rating: number;
//   reviews: number;
// }

// const CourseInfo: React.FC<CourseInfo> = ({
//   course_details,
//   what_you_learn,
//   course_rating,
//   reviews,
// }) => {
//   return (
//     <div className="container mx-auto pt-0 py-6">
//       <div className="grid gap-6 md:grid-cols-3">
//         {/* Course Details Card */}
//         <Card className="h-full">
//           <CardHeader>
//             <CardTitle className="text-xl font-bold">Course details</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {course_details.length > 0 ? course_details.map((detail, index) => (
//               <div key={index} className="flex items-center gap-2">
//                 <Check className="h-5 w-5 flex-shrink-0" />
//                 <span>{detail.course_detail}</span>
//               </div>
//               ))
//               : <div className="col-span-2 text-center text-gray-500">
//               No information available.
//             </div>
//             }
//           </CardContent>
//         </Card>

//         {/* What You'll Learn Card */}
//         <Card className="h-full">
//           <CardHeader>
//             <CardTitle className="text-xl font-bold">
//               What you will learn
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="list-inside space-y-3">
//               {what_you_learn.length > 0 ? what_you_learn.map((item, index) => (
//                 <li key={index} className="text-sm">
//                   • {item.description}
//                 </li>
//               ))
//               : <div className="col-span-2 text-center text-gray-500">
//               No information available.
//             </div>
//           }
//             </ul>
//           </CardContent>
//         </Card>

//         {/* Course Rating Card */}
//         <Card className="h-full">
//           <CardHeader>
//             <CardTitle className="text-xl font-bold">Course Rating</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center gap-2">
//               <div className="flex">
//                 {[1, 2, 3, 4, 5].map((course_rating) => (
//                   <Star
//                     key={course_rating}
//                     className={`h-6 w-6 ${
//                       course_rating <= 4
//                         ? "fill-current text-primary"
//                         : "text-muted"
//                     }`}
//                   />
//                 ))}
//               </div>
//               <span className="text-2xl font-bold">{course_rating}</span>
//             </div>
//             <p className="text-sm text-muted-foreground">
//               Based on {reviews} reviews
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default CourseInfo;



// import type React from "react"
// import { Check, Star } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import type { CourseDetails, WhatWillLearn } from "@/lib/types/course"

// interface CourseInfoProps {
//   course_details: CourseDetails[]
//   what_you_learn: WhatWillLearn[]
//   course_id: number
//   course_rating?: number
//   reviews?: number
// }

// const CourseInfo: React.FC<CourseInfoProps> = ({
//   course_details,
//   what_you_learn,
//   // course_id,
//   course_rating = 0,
//   reviews = 0,
// }) => {
//   return (
//     <div className="container mx-auto pt-0 py-6">
//       <div className="grid gap-6 md:grid-cols-3">
//         {/* Course Details Card */}
//         <Card className="h-full">
//           <CardHeader>
//             <CardTitle className="text-xl font-bold">Course details</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {course_details.length > 0 ? (
//               course_details.map((detail, index) => (
//                 <div key={index} className="flex items-center gap-2">
//                   <Check className="h-5 w-5 flex-shrink-0" />
//                   <span>{detail.course_detail}</span>
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-2 text-center text-gray-500">No information available.</div>
//             )}
//           </CardContent>
//         </Card>

//         {/* What You'll Learn Card */}
//         <Card className="h-full">
//           <CardHeader>
//             <CardTitle className="text-xl font-bold">What you will learn</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="list-inside space-y-3">
//               {what_you_learn.length > 0 ? (
//                 what_you_learn.map((item, index) => (
//                   <li key={index} className="text-sm">
//                     • {item.description}
//                   </li>
//                 ))
//               ) : (
//                 <div className="col-span-2 text-center text-gray-500">No information available.</div>
//               )}
//             </ul>
//           </CardContent>
//         </Card>

//         {/* Course Rating Card */}
//         <Card className="h-full">
//           <CardHeader>
//             <CardTitle className="text-xl font-bold">Course Rating</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center gap-2">
//               <div className="flex">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <Star
//                     key={star}
//                     className={`h-6 w-6 ${star <= course_rating ? "fill-current text-yellow-500" : "text-muted"}`}
//                   />
//                 ))}
//               </div>
//               <span className="text-2xl font-bold">{course_rating > 0 ? course_rating.toFixed(1) : "N/A"}</span>
//             </div>
//             <p className="text-sm text-muted-foreground">Based on {reviews} reviews</p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

// export default CourseInfo



"use client";

import { useState, useEffect } from "react";
import { Check, Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CourseDetails, WhatWillLearn } from "@/lib/types/course";
import { getCourseRating, getUserRating, hasUserRatedCourse, rateCourse } from "@/lib/courses/rating-actions";

interface CourseInfoProps {
  course_details: CourseDetails[];
  what_you_learn: WhatWillLearn[];
  course_rating: number;
  reviews: number;
  courseId: number; // Додаємо courseId для використання в оцінці
}

const CourseInfo: React.FC<CourseInfoProps> = ({
  course_details,
  what_you_learn,
  course_rating: initialRating,
  reviews: initialReviews,
  courseId,
}) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [reviews, setReviews] = useState<number>(initialReviews);
  const [userRating, setUserRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [hoverRating, setHoverRating] = useState<number>(0);

  // Завантажуємо середній рейтинг курсу та оцінку користувача при завантаженні компонента
  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        // Отримуємо середній рейтинг курсу
        const courseRatingData = await getCourseRating(courseId);
        setRating(courseRatingData.rating);
        setReviews(courseRatingData.count);

        // Перевіряємо, чи користувач уже оцінив курс
        const hasRatedResult = await hasUserRatedCourse(courseId);
        setHasRated(hasRatedResult);

        // Якщо користувач оцінив, отримуємо його оцінку
        if (hasRatedResult) {
          const userRatingData = await getUserRating(courseId);
          setUserRating(userRatingData);
        }
      } catch (error) {
        console.error("Error fetching rating data:", error);
      }
    };

    fetchRatingData();
  }, [courseId]);

  // Обробка натискання на зірочку
  const handleRatingClick = async (selectedRating: number) => {
    try {
      const result = await rateCourse(courseId, selectedRating);
      if (result.success) {
        // Оновлюємо середній рейтинг і кількість відгуків після оцінки
        const updatedRating = await getCourseRating(courseId);
        setRating(updatedRating.rating);
        setReviews(updatedRating.count);
        setUserRating(selectedRating);
        setHasRated(true);
      } else {
        console.error("Failed to rate course:", result.message);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  return (
    <div className="container mx-auto pt-0 py-6">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Course Details Card */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Course details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {course_details.length > 0 ? (
              course_details.map((detail, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-5 w-5 flex-shrink-0" />
                  <span>{detail.course_detail}</span>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-500">
                No information available.
              </div>
            )}
          </CardContent>
        </Card>

        {/* What You'll Learn Card */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              What you will learn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside space-y-3">
              {what_you_learn.length > 0 ? (
                what_you_learn.map((item, index) => (
                  <li key={index} className="text-sm">
                    • {item.description}
                  </li>
                ))
              ) : (
                <div className="col-span-2 text-center text-gray-500">
                  No information available.
                </div>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Course Rating Card */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Course Rating</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer ${
                      star <= (hoverRating || userRating || rating)
                        ? "fill-current text-primary"
                        : "text-muted"
                    }`}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold">{rating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {reviews} reviews
            </p>
            {hasRated && (
              <p className="text-sm text-muted-foreground">
                Your rating: {userRating}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseInfo;