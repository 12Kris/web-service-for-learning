"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Clock, Users } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
  id: number;
  title?: string;
  topic?: string;
  color?: string;
  studentsCount?: number;
  description?: string;
  instructor?: string;
  duration?: string;
  image?: string;
  price?: string;
}

export function CourseCard({
  id,
  title = "No Title",
  topic = "No Topic",
  color,
  studentsCount = 0,
  description = "No Description",
  instructor = "No Instructor",
  duration = "8 weeks",
}: CourseCardProps) {

  return (
    <Card
      className="flex flex-col overflow-hidden transition-all duration-300 h-full rounded-xl text-[--neutral]"
    >
      <Link href={`/workspace/courses/${id}`}>
        <div className="relative overflow-hidden bg-slate-300">
          <div style={{ backgroundColor: color }} className={`w-full h-[45px]`} />
          <Badge className="absolute top-3 right-3 bg-white/90 hover:bg-white">
            {topic}
          </Badge>
        </div>

        <div className="flex flex-col overflow-hidden">
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
          </CardFooter>
        </div>
      </Link>
    </Card>
  );
}