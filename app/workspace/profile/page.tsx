// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import LoadingSpinner from "@/components/ui/loading-spinner";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Book, Users, Clock, Award } from "lucide-react";
// import { getUserCourses, getUserCreatedCourses } from "@/lib/courses/actions";
// // import { getUser } from "@/lib/auth/utils";
// import { Course } from "@/lib/types/course";
// import { Edit } from "lucide-react";
// // import { logoutUser } from "@/lib/auth/utils";
// import { useRouter } from "next/navigation";
// import { LogOut } from "lucide-react";
// import { signOut } from "@/utils/supabase/actions";
// // import { supabase } from "@/utils/supabase/client";
// import { getUser } from "@/utils/supabase/server";
// import { getProfileById } from "@/utils/supabase/actions";
// import type { Profile } from "@/lib/types/user";

// export default function UserProfile() {
//   const [activeTab, setActiveTab] = useState("created");
//   const [user, setUser] = useState<Profile | null>(null);
//   const [createdCourses, setCreatedCourses] = useState<Course[] | null>(null);
//   const [studyingCourses, setStudyingCourses] = useState<Course[] | null>(null);

//   useEffect(() => {
//     async function fetchData() {

//       // const user = await getUser();

//       const currentUser = await getUser(); 
//       // await (await supabase.auth.getUser()).data?.user;
//       console.log('Current display name:', currentUser?.user_metadata?.displayName);

//       // editUser({ data: { displayName: 'Mykhailo Nyskohuz changed' } });

   

//       try {

//         if (!currentUser) {
//           throw new Error("User not authenticated");
//         }

//         // setUser({
//         //   id: currentUser.id,
//         //   email: currentUser.email || "",
//         //   full_name: currentUser.user_metadata?.name || "Unknown User",
//         //   name: currentUser.user_metadata?.displayName || "Unknown User",
//         //   avatar:
//         //     currentUser.user_metadata?.avatar_url || defaultProfileImage.src,
//         //   role: "Instructor & Student",
//         //   created_at: currentUser.created_at,
//         //   user_metadata: currentUser.user_metadata || {},
//         //   joinDate: new Date(currentUser.created_at).toLocaleDateString(),
//         //   description:
//         //     currentUser.user_metadata?.description ||
//         //     "No description available",
//         // });
//         setUser(await getProfileById(currentUser.id));
//         setCreatedCourses(await getUserCreatedCourses());
//         setStudyingCourses(await getUserCourses());
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     }

//     fetchData();
//   }, []);

//   const router = useRouter();
//   const handleLogout = async () => {
//     try {
//       await signOut();
//       router.push("/");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   if (!user || !createdCourses || !studyingCourses) {
//     return <LoadingSpinner className="mx-auto" />;
//   }

//   return (
//     <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
//       <div className="flex flex-col lg:flex-row gap-8">
//         <aside className="w-full lg:w-1/3">
//           <Card className="shadow-lg md:sticky top-[75px] z-10">
//             <CardHeader className="text-center">
//               <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary">
//                 <AvatarImage
//                   src={user?.avatar_url || "/placeholder.svg"}
//                   alt={user?.full_name || "Unknown User"}
//                 />
//                 <AvatarFallback>
//                   {user?.full_name
//                     ?.split(" ")
//                     .map((n) => n[0])
//                     .join("") || "?"}
//                 </AvatarFallback>
//               </Avatar>
//               <CardTitle className="text-3xl font-bold">
//                 {user?.full_name || "Unknown User"}
//               </CardTitle>
//               <CardDescription className="text-lg">
//                 {user?.location || "Instructor & Student"}
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="text-center">
//               <p className="text-muted-foreground mb-4">{user?.email}</p>
//               <div className="flex justify-center space-x-4 mb-4">
//                 <div className="text-center">
//                   <p className="text-2xl font-bold">{createdCourses.length}</p>
//                   <p className="text-sm text-muted-foreground">
//                     Courses Created
//                   </p>
//                 </div>
//                 <div className="text-center">
//                   <p className="text-2xl font-bold">{studyingCourses.length}</p>
//                   <p className="text-sm text-muted-foreground">
//                     Courses Enrolled
//                   </p>
//                 </div>
//               </div>
//               <Badge variant="secondary" className="mb-2">
//                 <Clock className="w-4 h-4 mr-1" />
//                 Joined {user?.website || "Unknown Website"}
//               </Badge>
//             </CardContent>

//             <CardFooter className="flex gap-2">
//               <Button asChild className="w-full">
//                 <Link href="/workspace/profile/edit">
//                   <Edit />
//                   Edit Profile
//                 </Link>
//               </Button>
//               <Button onClick={handleLogout} className="w-full">
//                 <LogOut />
//                 Log Out
//               </Button>
//             </CardFooter>
//           </Card>
//         </aside>
//         <main className="flex-1">
//           <Tabs
//             value={activeTab}
//             onValueChange={setActiveTab}
//             className="w-full"
//           >
//             <TabsList className="grid sticky top-[75px] z-10 w-full grid-cols-2 h-13 mb-8">
//               <TabsTrigger value="created" className="text-lg py-2">
//                 Courses Created
//               </TabsTrigger>
//               <TabsTrigger value="studying" className="text-lg py-2">
//                 Courses Studying
//               </TabsTrigger>
//             </TabsList>
//             <TabsContent value="created">
//               <div className="grid gap-6 md:grid-cols-2">
//                 {createdCourses.map((course) => (
//                   <Card
//                     key={course.id}
//                     className="shadow-md hover:shadow-lg transition-shadow"
//                   >
//                     <CardHeader>
//                       <CardTitle className="text-xl">{course.name}</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="flex justify-between mb-2">
//                         <Badge variant="secondary">
//                           <Book className="w-4 h-4 mr-1" />
//                           {course.lessons} Lessons
//                         </Badge>
//                         <Badge variant="secondary">
//                           <Users className="w-4 h-4 mr-1" />
//                           {course.student_count || 0} Students
//                         </Badge>
//                       </div>
//                       <div className="flex items-center">
//                         <Award className="w-5 h-5 text-yellow-500 mr-1" />
//                         <span className="font-bold">
//                           {course.rating || "N/A"}
//                         </span>
//                         <span className="text-muted-foreground ml-1">
//                           / 5.0
//                         </span>
//                       </div>
//                     </CardContent>
//                     <CardFooter>
//                       <Button asChild className="w-full">
//                         <Link href={`/workspace/courses/${course.id}`}>
//                           Manage Course
//                         </Link>
//                       </Button>
//                     </CardFooter>
//                   </Card>
//                 ))}
//               </div>
//             </TabsContent>
//             <TabsContent value="studying">
//               <div className="space-y-6">
//                 {studyingCourses.map((course) => (
//                   <Card
//                     key={course.id}
//                     className="shadow-md hover:shadow-lg transition-shadow"
//                   >
//                     <CardHeader>
//                       <CardTitle className="text-xl">{course.name}</CardTitle>
//                       <CardDescription>
//                         Instructor: {course.creator_id}
//                       </CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="mb-2">
//                         <div className="flex justify-between mb-1">
//                           <span className="text-sm font-medium text-primary">
//                             Progress
//                           </span>
//                           <span className="text-sm font-medium text-primary">
//                             {course.progress}%
//                           </span>
//                         </div>
//                         <Progress value={course.progress} className="w-full" />
//                       </div>
//                     </CardContent>
//                     <CardFooter>
//                       <Button asChild className="w-full">
//                         <Link href={`/workspace/courses/${course.id}`}>
//                           Continue Learning
//                         </Link>
//                       </Button>
//                     </CardFooter>
//                   </Card>
//                 ))}
//               </div>
//             </TabsContent>
//           </Tabs>
//         </main>
//       </div>
//     </div>
//   );
// }


"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Pencil } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
// import { Book, Users, Award } from "lucide-react";
import { Book, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation"
import { signOut } from "@/utils/supabase/actions"
// import { createClient } from "@/utils/supabase/client"
import type { Profile } from "@/lib/types/user"
import { getProfileById } from "@/utils/supabase/actions";
import { Course } from "@/lib/types/course"
import { getUserCourses, getUserCreatedCourses } from "@/lib/courses/actions"
import { getUser } from "@/utils/supabase/server";
import ProfileEdit from "./edit/page"
// import ProfileEdit from "./edit/page"

export default function UserProfile() {
  const [activeMenuItem, setActiveMenuItem] = useState("profile")
  // const [user, setUser] = useState<User | null>(null)
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [createdCourses, setCreatedCourses] = useState<Course[] | null>(null);
  const [studyingCourses, setStudyingCourses] = useState<Course[] | null>(null);


  // useEffect(() => {
  //   async function fetchData() {
  //     setIsLoading(true)
  //     const supabase = await createClient()
  //     const currentUser = await (await supabase.auth.getUser()).data?.user

  //     try {
  //       if (!currentUser) {
  //         throw new Error("User not authenticated")
  //       }

  //       // setUser({
  //       //   id: currentUser.id,
  //       //   email: currentUser.email || "",
  //       //   full_name: currentUser.user_metadata?.name || "Unknown User",
  //       //   username: currentUser.user_metadata?.displayName || "User Name",
  //       //   avatar_url: currentUser.user_metadata?.avatar_url || defaultProfileImage.src,
  //       //   role: "Instructor & Student",
  //       //   created_at: currentUser.created_at,
  //       //   user_metadata: currentUser.user_metadata || {},
  //       //   joinDate: new Date(currentUser.created_at).toLocaleDateString(),
  //       //   description: currentUser.user_metadata?.description || "No description available",
  //       // })
  //       setUser(await getProfileById(currentUser.id));
  //       setCreatedCourses(await getUserCreatedCourses());
  //       setStudyingCourses(await getUserCourses());
  //     } catch (error) {
  //       console.error("Error fetching user data:", error)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }

  //   fetchData()
  // }, [])

  useEffect(() => {
    async function fetchData() {

      setIsLoading(true)
      const currentUser = await getUser(); 
      console.log('Current display name:', currentUser?.user_metadata?.displayName);

      try {

        if (!currentUser) {
          throw new Error("User not authenticated");
        }

        // setUser({
        //   id: currentUser.id,
        //   email: currentUser.email || "",
        //   full_name: currentUser.user_metadata?.name || "Unknown User",
        //   name: currentUser.user_metadata?.displayName || "Unknown User",
        //   avatar:
        //     currentUser.user_metadata?.avatar_url || defaultProfileImage.src,
        //   role: "Instructor & Student",
        //   created_at: currentUser.created_at,
        //   user_metadata: currentUser.user_metadata || {},
        //   joinDate: new Date(currentUser.created_at).toLocaleDateString(),
        //   description:
        //     currentUser.user_metadata?.description ||
        //     "No description available",
        // });
        setUser(await getProfileById(currentUser.id));
        setCreatedCourses(await getUserCreatedCourses());
        setStudyingCourses(await getUserCourses());
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      finally {
        setIsLoading(false)
      }
    }

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (isLoading) {
    return <LoadingSpinner className="mx-auto" />
  }

  const menuItems = [
    { id: "profile", label: "Profile" },
    { id: "analytics", label: "Analytics" },
    { id: "courses-enrolled", label: "Courses Enrolled" },
    { id: "courses-created", label: "Courses Created" },
    { id: "certificates", label: "Certificates" },
    { id: "settings", label: "Settings" },
  ]
    
  // if (!user || !createdCourses || !studyingCourses) {
  //   return <LoadingSpinner className="mx-auto" />;
  // }

  return (
    <div className="w-full max-w-6xl mx-auto border rounded-3xl overflow-hidden flex">
      {/* Sidebar */}
      <div className="w-[380px] border-r">
        <div className="flex flex-col items-center pt-10 pb-6">
          <div className=" rounded-full p-10 mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user?.avatar_url || "/placeholder.svg"} alt={user?.username || "User"} />
              <AvatarFallback className="bg-[#e0f2e9] text-[#5c7d73] text-4xl">
                {user?.username
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <h2 className="text-2xl font-medium text-[#5c7d73] mb-1">{user?.username}</h2>
          <p className="text-sm text-gray-500">{user?.email || "Unknown Email"}</p>
        </div>

        <nav className="mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`w-full text-left px-8 py-4 text-lg ${
                activeMenuItem === item.id ? "bg-[#5c7d73] text-white" : "text-[#5c7d73] hover:bg-gray-100"
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

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeMenuItem === "profile" && (

          <ProfileEdit />
          // <div className="space-y-10">
          //   <div className="space-y-2">
          //     <label className="text-[#5c7d73] text-lg">Full Name</label>
          //     <div className="relative">
          //       <Input
          //         className="border-gray-300 rounded-lg py-6 px-4 text-gray-700"
          //         placeholder="Example"
          //         value={user?.full_name || ""}
          //         readOnly
          //       />
          //       <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
          //         <Pencil className="h-5 w-5" />
          //       </Button>
          //     </div>
          //   </div>

          //   <div className="space-y-2">
          //     <label className="text-[#5c7d73] text-lg">Email Address</label>
          //     <div className="relative">
          //       <Input
          //         className="border-gray-300 rounded-lg py-6 px-4 text-gray-700"
          //         placeholder="Example"
          //         value={user?.email || ""}
          //         readOnly
          //       />
          //       <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
          //         <Pencil className="h-5 w-5" />
          //       </Button>
          //     </div>
          //   </div>

          //   <div className="space-y-2">
          //     <label className="text-[#5c7d73] text-lg">Password</label>
          //     <div className="relative">
          //       <Input
          //         className="border-gray-300 rounded-lg py-6 px-4 text-gray-700"
          //         type="password"
          //         value="**********"
          //         readOnly
          //       />
          //       <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
          //         <Pencil className="h-5 w-5" />
          //       </Button>
          //     </div>
          //   </div>

          //   <div>
          //     <Button className="bg-[#f39d8e] text-white rounded-full px-10">Save</Button>
          //   </div>
          // </div>
        )}


        {activeMenuItem === "courses-created" && (
          <div className="flex items-center justify-center mt-4">
              <div className="grid gap-6 md:grid-cols-2">
                 {createdCourses?.map((course) => (
                   <Card
                    key={course.id}
                    className="shadow-md hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="text-xl">{course.name}</CardTitle>
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
                        {/* <Award className="w-5 h-5 text-yellow-500 mr-1" />
                        <span className="font-bold">
                          {course.rating || "N/A"}
                        </span>
                        <span className="text-muted-foreground ml-1">
                          / 5.0
                        </span> */}
                        {/* <span className="font-bold">
                          {course.type}
                        </span> */}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link href={`/workspace/courses/${course.id}`}>
                          Manage Course
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>              
          </div>
        )}

        {activeMenuItem === "courses-enrolled" && (
                <div className="flex items-center justify-center mt-4">
                  <div className="space-y-6">
                {studyingCourses?.map((course) => (
                  <Card
                    key={course.id}
                    className="shadow-md hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="text-xl">{course.name}</CardTitle>
                      <CardDescription>
                        {/* Instructor: {course.creator_id} */}
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2">
                        <div className="flex justify-between mb-1">
                          {/* <span className="text-sm font-medium text-primary">
                            Progress
                          </span>
                          <span className="text-sm font-medium text-primary">
                            {course.progress}%
                          </span> */}
                          <span className="text-sm font-medium text-primary">
                            Type:
                          </span>
                          <span className="text-sm font-medium text-primary">
                            {course.type}
                          </span>
                        </div>
                        <Progress value={course.progress} className="w-full" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link href={`/workspace/courses/${course.id}`}>
                          Continue Learning
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
                </div>
        )}

        {activeMenuItem !== "profile" && activeMenuItem !== "courses-created" && activeMenuItem !== "courses-enrolled" && (
          <div className="flex items-center justify-center h-full">
            <p className="text-lg text-gray-500">
              {activeMenuItem.charAt(0).toUpperCase() + activeMenuItem.slice(1).replace("-", " ")} content will be
              displayed here
            </p>
          </div>
        )}


        
      </div>
    </div>
  )
}
