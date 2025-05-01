"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Book, Users, Award } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { signOut } from "@/utils/supabase/actions";

import type { Profile } from "@/lib/types/user";
import { getProfileById } from "@/utils/supabase/actions";
import type { Course } from "@/lib/types/course";

import { getUserCourses, getUserCreatedCourses } from "@/lib/courses/actions";
import { getUser } from "@/utils/supabase/server";
import ProfileEdit from "./edit/page";

export default function UserProfile() {
  const [activeMenuItem, setActiveMenuItem] = useState("profile");

  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [createdCourses, setCreatedCourses] = useState<Course[] | null>(null);
  const [studyingCourses, setStudyingCourses] = useState<Course[] | null>(null);

  useEffect(() => {


    async function fetchData() {
      setIsLoading(true);
      const currentUser = await getUser();
      console.log(
        "Current display name:",
        currentUser?.user_metadata?.displayName
      );

      try {
        if (!currentUser) {
          throw new Error("User not authenticated");
        }

        setUser(await getProfileById(currentUser.id));
        setCreatedCourses(await getUserCreatedCourses());
        setStudyingCourses(await getUserCourses());
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner className="mx-auto" />;
  }

  const menuItems = [
    { id: "profile", label: "Profile" },
    { id: "analytics", label: "Analytics" },
    { id: "courses-enrolled", label: "Courses Enrolled" },
    { id: "courses-created", label: "Courses Created" },
    { id: "certificates", label: "Certificates" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="w-full h-[90vh] max-w-6xl mx-auto border rounded-3xl overflow-hidden flex flex-col md:flex-row">
      <div className="w-full md:w-[300px] lg:w-[380px] border-b md:border-b-0 md:border-r">
        <div className="flex flex-col items-center pt-10 pb-6">
          <div className="rounded-full p-6 ">
            <Avatar className="w-16 h-16 md:w-24 md:h-24">
              <AvatarImage
                src={user?.avatar_url || "/placeholder.svg"}
                alt={user?.username || "User"}
              />
              <AvatarFallback className="bg-[#e0f2e9] text-[#5c7d73] text-4xl">
                {user?.username
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <h2 className="text-2xl font-medium text-[#5c7d73] mb-1">
            {user?.username}
          </h2>
          <p className="text-sm text-gray-500">
            {user?.email || "Unknown Email"}
          </p>
        </div>

        <nav className="mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`w-full text-left px-4 md:px-8 py-3 md:py-4 text-base md:text-lg ${
                activeMenuItem === item.id
                  ? "bg-[#5c7d73] text-white"
                  : "text-[#5c7d73] hover:bg-gray-100"
              }`}
              onClick={() => setActiveMenuItem(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-8 py-6">
          <Button
            variant="outline"
            className="w-full border-[#5c7d73] text-[#5c7d73] rounded-full"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </div>

      <div className="flex-1 px-4 ">
        {activeMenuItem === "profile" && <ProfileEdit />}

        {activeMenuItem === "courses-created" && (
          <ScrollArea className="h-[90vh]">
            <div className="grid grid-cols-1 md:grid-cols-1 px-3">
              {createdCourses?.map((course) => (
                <Link key={course.id} href={`/workspace/courses/${course.id}`}>
                  <Card className="shadow-md hover:shadow-lg transition-shadow mt-6">
                    <CardHeader>
                      <CardTitle className="text-xl truncate">
                        {course.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between mb-2">
                        <Badge variant="secondary">
                          <Book className="w-4 h-4 mr-1" />
                          {course.type}
                        </Badge>
                        <Badge variant="secondary">
                          <Users className="w-4 h-4 mr-1" />
                          {course.student_count || 0} Students
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        <Award className="w-5 h-5 text-yellow-500 mr-1" />
                        <span className="font-bold">
                          {course.rating?.toFixed(1) || "N/A"}
                        </span>
                        <span className="text-muted-foreground ml-1">
                          / 5.0
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </ScrollArea>
        )}

        {activeMenuItem === "courses-enrolled" && (
          <div className="flex items-center justify-center overflow-y-scroll h-full px-3 mb-4">
            <ScrollArea className="h-[90vh]">
              {studyingCourses?.map((course) => (
                <Link
                  className=""
                  key={course.id}
                  href={`/workspace/courses/${course.id}`}
                >
                  <Card className="shadow-md hover:shadow-lg transition-shadow mt-6">
                    <CardHeader>
                      <CardTitle className="text-xl">{course.name}</CardTitle>
                      <CardDescription>
                        {/* Instructor: {course.creator?.full_name} */}
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2">
                        <div className="flex justify-between mb-1">
                          <Badge variant="secondary">
                            <Book className="h-4 mr-1" />
                            {course.type}
                          </Badge>
                          <Badge variant="secondary">
                            <Users className="h-4 mr-1" />
                            {course.creator?.full_name}
                          </Badge>
                        </div>
                        <Progress value={course.progress} className="w-full" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </ScrollArea>
          </div>
        )}

        {activeMenuItem !== "profile" &&
          activeMenuItem !== "courses-created" &&
          activeMenuItem !== "courses-enrolled" && (
            <div className="flex items-center justify-center h-full">
              <p className="text-lg text-gray-500">
                {activeMenuItem.charAt(0).toUpperCase() +
                  activeMenuItem.slice(1).replace("-", " ")}{" "}
                content will be displayed here
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
