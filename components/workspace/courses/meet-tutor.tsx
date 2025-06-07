import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@/lib/types/course";

interface MeetTutorProps {
  course?: Course;
  coursesCreated?: Course[];
  completedCoursesCount?: number;
  userTotalPoints?: number;
}

const MeetTutor: React.FC<MeetTutorProps> = ({
  course,
  coursesCreated,
  completedCoursesCount,
  userTotalPoints
}) => {
  return (
    <section className="container text-[--neutral]">
        <div>
          <h2 className="text-2xl font-bold mb-6">Instructor</h2>
          <Card className="border bg-white">
            <CardHeader>
              <CardTitle className="text-2xl">{course?.creator?.full_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                {course?.creator?.bio || "No information..."}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 border-2 border-green-200 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{coursesCreated?.length || 0}</div>
                  <div className="text-sm text-gray-600">Courses created</div>
                </div>
                <div className="text-center p-4 border-2 border-blue-200 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{completedCoursesCount || 0}</div>
                  <div className="text-sm text-gray-600">Courses completed</div>
                </div>
                <div className="text-center p-4 border-2 border-purple-200 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{userTotalPoints || 0}</div>
                  <div className="text-sm text-gray-600">Total points</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </section>
  );
};

export default MeetTutor;