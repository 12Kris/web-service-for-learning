// // import { Card, CardContent, CardHeader } from "@/components/ui/card";
// // import { Badge } from "@/components/ui/badge";

// // interface CourseCardProps {
// //   title: string;
// //   topic: string;
// //   thermsCount: number;
// //   description: string;
// //   author: string;
// // }

// // export function CourseCard({
// //   title,
// //   topic,
// //   thermsCount,
// //   description,
// //   author,
// // }: CourseCardProps) {
// //   return (
// //     <Card className="w-full h-full flex flex-col justify-between ">
// //       <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 ">
// //         <h3 className="text-xl font-semibold">{title}</h3>
// //       </CardHeader>
// //       <CardContent className="space-y-4">
// //         <div className="flex items-center gap-2">
// //           <Badge variant="secondary">{topic}</Badge>
// //           <p className="text-sm font-medium">{thermsCount} students</p>
// //         </div>
// //         <p className="text-sm text-muted-foreground line-clamp-2">
// //           {description}
// //         </p>
// //         <div className="flex items-center justify-end">
// //           <Badge variant="outline">{author}</Badge>
// //         </div>
// //       </CardContent>
// //     </Card>
// //   );
// // }

// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// interface CourseCardProps {
//   title: string;
//   topic: string;
//   thermsCount: number;
//   description: string;
//   author: string;
// }

// export function CourseCard({
//   title,
//   topic,
//   thermsCount,
//   description,
//   author,
// }: CourseCardProps) {
//   return (
//     <Card className="flex flex-col justify-center p-4 space-y-3 h-[170px]">
//       <CardHeader className="p-0">
//         <h3 className="text-lg font-semibold">{title}</h3>
//       </CardHeader>

//       <CardContent className="p-0 space-y-2">
//         <div className="flex items-center gap-2 text-sm">
//           <Badge variant="secondary">{topic}</Badge>
//           <span className="text-muted-foreground">{thermsCount} students</span>
//         </div>

//         {/* Limit the description lines if it's long */}
//         <p className="text-sm text-muted-foreground line-clamp-2">
//           {description}
//         </p>

//         <div className="flex items-center justify-end">
//           <Badge variant="outline">{author}</Badge>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Clock, Users } from 'lucide-react'

interface CourseCardProps {
  title?: string;
  topic?: string;
  studentsCount?: number;
  description?: string;
  instructor?: string;
  duration?: string;
  image?: string;
  price?: string;
}

export function CourseCard({
  title = "No Title",
  topic = "No Topic",
  // thermsCount = 0,
  // studentsCount = 0,
  studentsCount = 0,
  description = "No Description",
  instructor = "No Instructor",
  // topic,
  // studentsCount,
  // description,
  // instructor,
  duration = "8 weeks",
  image = "/placeholder.svg?height=200&width=400",
  price = "Free",
}: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card 
      className="flex flex-col overflow-hidden transition-all duration-300 h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden bg-slate-300">
        {/* <img 
          src={image || "/placeholder.svg"} 
          alt={title} 
          className={`w-full h-[200px] object-cover transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}
        /> */}
        <div className="w-full h-[45px] bg-slate-500" />
        <Badge className="absolute top-3 right-3 bg-white/90 hover:bg-white">{topic}</Badge>
      </div>

      <div className="flex flex-col overflow-hidden ">
      
      <CardHeader className="p-4 pb-2">
        <h3 className="text-xl font-semibold line-clamp-1">{title}</h3>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-grow h-[75px]">
      <p className="text-sm text-muted-foreground line-clamp-3 mb-4 ">
          {description}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col">
 

        <div className=" flex flex-wrap gap-3 text-sm text-muted-foreground w-full">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span className="line-clamp-1">{instructor}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{studentsCount}</span>
          </div>
        </div>

        <div className="flex items-center justify-between w-full mt-4">
          <span className="font-semibold">{price}</span>
        <Button>Enroll Now</Button>
        </div>
        
        
      </CardFooter>
      </div>
    </Card>
  )
}
