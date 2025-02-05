// import { useState } from 'react'
// import { Heart } from 'lucide-react'
// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// interface CourseCardProps {
//   title: string
//   topic: string
//   thermsCount: number
//   description: string
//   author: string
//   onLike: () => void
// }

// export function CourseCard({ title, topic, thermsCount, description, author, onLike }: CourseCardProps) {
//   const [isLiked, setIsLiked] = useState(false)

//   const handleLike = () => {
//     setIsLiked(!isLiked)
//     onLike()
//   }


//   return (
//     <Card className="w-full h-full flex flex-col justify-between">
//       <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 ">
//         <h3 className="text-xl font-semibold">{title}</h3>
//         <TooltipProvider>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button 
//                 variant="ghost" 
//                 size="icon" 
//                 className={`h-9 w-9 rounded-full ${isLiked ? 'text-red-500' : ''}`} 
//                 onClick={handleLike}
//               >
//                 <Heart className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} />
//                 <span className="sr-only">Add to favorites</span>
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>
//               <p>{isLiked ? 'Remove from favorites' : 'Add to favorites'}</p>
//             </TooltipContent>
//           </Tooltip>
//         </TooltipProvider>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="flex items-center gap-2">
//           <Badge variant="secondary">{topic}</Badge>
//           <p className="text-sm font-medium">{thermsCount} therms</p>
//         </div>
//         <p className="text-sm text-muted-foreground line-clamp-2">
//           {description}
//         </p>
//         <div className="flex items-center justify-end">
//           <Badge variant="outline">{author}</Badge>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  title: string;
  topic: string;
  thermsCount: number;
  description: string;
  author: string;
}

export function CourseCard({
  title,
  topic,
  thermsCount,
  description,
  author,
}: CourseCardProps) {
  return (
    <Card className="w-full h-full flex flex-col justify-between ">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 ">
        <h3 className="text-xl font-semibold">{title}</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{topic}</Badge>
          <p className="text-sm font-medium">{thermsCount} students</p>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
        <div className="flex items-center justify-end">
          <Badge variant="outline">{author}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}