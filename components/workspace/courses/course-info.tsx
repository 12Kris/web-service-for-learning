"use client";

import { Award, BookOpen, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CourseDetails, WhatWillLearn } from "@/lib/types/course";

interface CourseInfoProps {
  course_details: CourseDetails[];
  what_you_learn: WhatWillLearn[];
}

const CourseInfo: React.FC<CourseInfoProps> = ({
  course_details,
  what_you_learn,
}) => {
  return (
    <div className="mx-auto space-y-12 text-[--neutral]">
      <div>
        <h2 className="text-2xl font-bold mb-6">Description</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {`What you'll learn`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {what_you_learn.length > 0 ? (
                  what_you_learn.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{item.description}</span>
                    </li>
                  ))
                ) : (
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">No information...</span>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card className="border bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Course details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {course_details.length > 0 ? (
                  course_details.map((detail, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{detail.course_detail}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">No information...</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseInfo;