"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Book, Users, Award } from "lucide-react"
import { useRouter } from "next/navigation"
import { signOut } from "@/utils/supabase/actions"
import type { Profile } from "@/lib/types/user"
import type { Course } from "@/lib/types/course"
import ProfileEdit from "@/app/workspace/profile/edit/page"
import Certificates from "./certificates"
// import Settings from "./settings"
import Analytics from "./analytics"
import { Certificate } from "@/lib/types/certificate"

export default function UserProfile({
  user,
  createdCourses,
  studyingCourses,
  analyticsData,
  certificates,
}: {
  user: Profile | null
  createdCourses: Course[] | null
  studyingCourses: Course[] | null
  analyticsData?: {
    totalStudyTime: number;
    studyTimeChange: number;
    coursesCompleted: number;
    coursesInProgress: number;
    pointsEarned: number;
    pointsChange: number;
    dailyStudyData: Array<{ hour: string; minutes: number }>;
    weeklyStudyData: Array<{ day: string; hours: number }>;
  };
  certificates: Certificate[] | null;
}) {
  const [activeMenuItem, setActiveMenuItem] = useState("profile")
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const menuItems = [
    { id: "profile", label: "Settings" },
    { id: "analytics", label: "Analytics" },
    { id: "courses-created", label: "Courses Created" },
    { id: "courses-enrolled", label: "Courses Enrolled" },
    { id: "certificates", label: "Certificates" },
  ]

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white border rounded-xl mb-6">
        <Avatar className="w-20 h-20 md:w-24 md:h-24">
          <AvatarImage src={user?.avatar_url || "/placeholder.svg"} alt={user?.username || "User"} />
          <AvatarFallback className="bg-[#e0f2e9] text-[--neutral] text-4xl">
            {user?.full_name
              ?.split(" ")
              .map((n) => n[0])
              .join("") || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl md:text-3xl font-medium text-[--neutral] mb-1">{user?.full_name}</h2>
          <p className="text-sm md:text-base text-gray-500 mb-4">{user?.email || "Unknown Email"}</p>
        </div>

        <Button variant="outline" size="wide" className="border-[--neutral] text-[--neutral] rounded-full w-full sm:w-auto" onClick={handleLogout}>
          Log out
        </Button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="border-b">
          <nav className="flex overflow-x-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`flex-shrink-0 px-4 md:px-6 py-4 text-sm md:text-base font-medium border-b-2 transition-colors ${
                  activeMenuItem === item.id
                    ? "border-[--neutral] text-[--neutral] bg-[#f8faf9]"
                    : "border-transparent text-gray-500 hover:text-[--neutral] hover:border-gray-300"
                }`}
                onClick={() => setActiveMenuItem(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="h-[60vh]">
          {activeMenuItem === "profile" && (
            <ScrollArea className="h-[60vh] p-6">
              <ProfileEdit />
            </ScrollArea>
          )}

          {activeMenuItem === "courses-created" && (
            <ScrollArea className="h-[60vh]">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[--neutral] mb-4">Courses You Created</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {createdCourses?.map((course) => (
                    <Link key={course.id} href={`/workspace/courses/${course.id}`}>
                      <Card className="shadow-md hover:shadow-lg transition-shadow border-2" style={{borderColor: course.color}}>
                        <CardHeader>
                          <CardTitle className="text-xl truncate">{course.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between mb-2">
                            <Badge variant="secondary" className="bg-white">
                              <Book className="w-4 h-4 mr-1" />
                              {course.type}
                            </Badge>
                            <Badge variant="secondary" className="bg-white">
                              <Users className="w-4 h-4 mr-1" />
                              {course.student_count || 0} Students
                            </Badge>
                          </div>
                          <div className="flex items-center">
                            <Award className="w-5 h-5 text-yellow-500 mr-1" />
                            <span className="font-bold">{course.rating?.toFixed(1) || "N/A"}</span>
                            <span className="text-muted-foreground ml-1">/ 5.0</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollArea>
          )}

          {activeMenuItem === "courses-enrolled" && (
            <ScrollArea className="h-[60vh]">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[--neutral] mb-4">Courses you are Enrolled In</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {studyingCourses?.map((course) => (
                    <Link key={course.id} href={`/workspace/courses/${course.id}`}>
                      {/* <Card className="shadow-md hover:shadow-lg transition-shadow h-full" style={{backgroundColor: course.color, opacity: 0.8}}> */}
                      <Card className="shadow-md hover:shadow-lg transition-shadow h-full border-2" style={{borderColor: course.color}}>
                        <CardHeader>
                          <CardTitle className="text-xl">{course.name}</CardTitle>
                          <CardDescription>{course.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-2">
                            <div className="flex justify-between mb-2">
                              <Badge variant="secondary" className="bg-white">
                                <Book className="h-4 mr-1" />
                                {course.type}
                              </Badge>
                              <Badge variant="secondary" className="bg-white">
                                <Users className="h-4 mr-1" />
                                {course.creator?.full_name}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollArea>
          )}

          {activeMenuItem === "certificates" && (
            <ScrollArea className="h-[60vh]">
              <Certificates certificates={certificates || []} user_full_name={user?.full_name || "John Doe"} />
            </ScrollArea>
          )}

          {activeMenuItem === "analytics" && (
            <ScrollArea className="h-[60vh]">
              <Analytics userData={analyticsData}/>
            </ScrollArea>
          )}

          {activeMenuItem !== "profile" &&
            activeMenuItem !== "courses-created" &&
            activeMenuItem !== "courses-enrolled" &&
            activeMenuItem !== "certificates" &&
            activeMenuItem !== "settings" &&
            activeMenuItem !== "analytics" && (
              <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-[--neutral] mb-2">
                    {activeMenuItem.charAt(0).toUpperCase() + activeMenuItem.slice(1).replace("-", " ")}
                  </h3>
                  <p className="text-gray-500">This section is coming soon</p>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
