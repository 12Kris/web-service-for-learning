import { Check, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseDetails, WhatWillLearn } from "@/lib/definitions";

interface CourseInfo {
  course_details: CourseDetails[];
  what_you_learn: WhatWillLearn[];
  course_rating: number;
  reviews: number;
}

const CourseInfo: React.FC<CourseInfo> = ({
  course_details,
  what_you_learn,
  course_rating,
  reviews,
}) => {
  return (
    <div className="container mx-auto pt-0 py-6">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Course Details Card */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Course details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {course_details.length > 0 ? course_details.map((detail, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="h-5 w-5 flex-shrink-0" />
                <span>{detail.course_detail}</span>
              </div>
              ))
              : <div className="col-span-2 text-center text-gray-500">
              No information available.
            </div>
            }
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
              {what_you_learn.length > 0 ? what_you_learn.map((item, index) => (
                <li key={index} className="text-sm">
                  • {item.description}
                </li>
              ))
              : <div className="col-span-2 text-center text-gray-500">
              No information available.
            </div>
          }
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
                {[1, 2, 3, 4, 5].map((course_rating) => (
                  <Star
                    key={course_rating}
                    className={`h-6 w-6 ${
                      course_rating <= 4
                        ? "fill-current text-primary"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold">{course_rating}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {reviews} reviews
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseInfo;
