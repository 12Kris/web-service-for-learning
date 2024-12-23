'use client';

import {useState, useEffect} from 'react';
import Link from 'next/link';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Badge} from "@/components/ui/badge";
import {Progress} from "@/components/ui/progress";
import {Book, Users, Clock, Award} from 'lucide-react';
import {getUserCourses, getUserCreatedCourses} from '@/lib/courses/actions';
import {getUser} from '@/lib/auth/actions';
import {Course, User} from "@/lib/definitions";
import { Edit } from "lucide-react";


export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("created");
  const [user, setUser] = useState<User | null>(null);
  const [createdCourses, setCreatedCourses] = useState<Course[]>([]);
  const [studyingCourses, setStudyingCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const currentUser = await getUser();
        if (!currentUser) {
          throw new Error("User not authenticated");
        }

        setUser({
          id: currentUser.id,
          email: currentUser.email || "",
          full_name: currentUser.user_metadata?.name || "Unknown User",
          name: currentUser.user_metadata?.displayName || "Unknown User",
          avatar: currentUser.user_metadata?.avatar_url || "/placeholder.svg",
          role: "Instructor & Student",
          created_at: currentUser.created_at,
          user_metadata: currentUser.user_metadata || {},
          joinDate: new Date(currentUser.created_at).toLocaleDateString(),
        });
        setCreatedCourses(await getUserCreatedCourses());
        setStudyingCourses(await getUserCourses());
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }


    fetchData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-1/3">
            <Card className="shadow-lg md:sticky top-[75px] z-10">
              <CardHeader className="text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"}
                               alt={user?.name || "Unknown User"}/>
                  <AvatarFallback>{user?.name?.split(' ').map(n => n[0]).join('') || "?"}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-3xl font-bold">{user?.name || "Unknown User"}</CardTitle>
                <CardDescription
                    className="text-lg">{user?.role || "Instructor & Student"}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">{user?.email}</p>
                <div className="flex justify-center space-x-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{createdCourses.length}</p>
                    <p className="text-sm text-muted-foreground">Courses Created</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{studyingCourses.length}</p>
                    <p className="text-sm text-muted-foreground">Courses Enrolled</p>
                  </div>
                </div>
                <Badge variant="secondary" className="mb-2">
                  <Clock className="w-4 h-4 mr-1"/>
                  Joined {user?.joinDate || "Unknown Date"}
                </Badge>
              </CardContent>

              <CardFooter>
                <Button className="w-full"><Edit />Edit Profile</Button>
              </CardFooter>
            </Card>
          </aside>
          <main className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid sticky top-[75px] z-10 w-full grid-cols-2 h-13 mb-8">
                <TabsTrigger value="created" className="text-lg py-2">Courses Created</TabsTrigger>
                <TabsTrigger value="studying" className="text-lg py-2">Courses Studying</TabsTrigger>
              </TabsList>
              <TabsContent value="created">
                <div className="grid gap-6 md:grid-cols-2">
                  {createdCourses.map(course => (
                      <Card key={course.id} className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-xl">{course.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between mb-2">
                            <Badge variant="secondary">
                              <Book className="w-4 h-4 mr-1"/>
                              {course.lessons} Lessons
                            </Badge>
                            <Badge variant="secondary">
                              <Users className="w-4 h-4 mr-1"/>
                              {course.student_count || 0} Students
                            </Badge>
                          </div>
                          <div className="flex items-center">
                            <Award className="w-5 h-5 text-yellow-500 mr-1"/>
                            <span className="font-bold">{course.rating || "N/A"}</span>
                            <span className="text-muted-foreground ml-1">/ 5.0</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button asChild className="w-full">
                            <Link href={`/courses/${course.id}`}>Manage Course</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="studying">
                <div className="space-y-6">
                  {studyingCourses.map(course => (
                      <Card key={course.id} className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-xl">{course.name}</CardTitle>
                          <CardDescription>Instructor: {course.creator_id}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-primary">Progress</span>
                              <span
                                  className="text-sm font-medium text-primary">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="w-full"/>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button asChild className="w-full">
                            <Link href={`/courses/${course.id}`}>Continue Learning</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
  );
}