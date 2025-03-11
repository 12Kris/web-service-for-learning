"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil } from "lucide-react"
import type { User } from "@/lib/types/user"
import defaultProfileImage from "@/public/images/115-1150152_default-profile-picture-avatar-png-green.png"
import { useRouter } from "next/navigation"
import { signOut } from "@/utils/supabase/actions"
import { createClient } from "@/utils/supabase/client"

export default function UserProfile() {
  const [activeMenuItem, setActiveMenuItem] = useState("profile")
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      const supabase = await createClient()
      const currentUser = await (await supabase.auth.getUser()).data?.user

      try {
        if (!currentUser) {
          throw new Error("User not authenticated")
        }

        setUser({
          id: currentUser.id,
          email: currentUser.email || "",
          full_name: currentUser.user_metadata?.name || "Unknown User",
          name: currentUser.user_metadata?.displayName || "User Name",
          avatar: currentUser.user_metadata?.avatar_url || defaultProfileImage.src,
          role: "Instructor & Student",
          created_at: currentUser.created_at,
          user_metadata: currentUser.user_metadata || {},
          joinDate: new Date(currentUser.created_at).toLocaleDateString(),
          description: currentUser.user_metadata?.description || "No description available",
        })
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

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
    { id: "courses-enrolled", label: "Courses Enroled" },
    { id: "courses-created", label: "Courses Created" },
    { id: "certificates", label: "Certificates" },
    { id: "settings", label: "Settings" },
  ]

  return (
    <div className="w-full max-w-6xl mx-auto border rounded-3xl overflow-hidden flex">
      {/* Sidebar */}
      <div className="w-[380px] border-r">
        <div className="flex flex-col items-center pt-10 pb-6">
          <div className=" rounded-full p-10 mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
              <AvatarFallback className="bg-[#e0f2e9] text-[#5c7d73] text-4xl">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <h2 className="text-2xl font-medium text-[#5c7d73] mb-1">{user?.name}</h2>
          <p className="text-sm text-gray-500">joined {user?.joinDate || "11/29/2024"}</p>
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
      <div className="flex-1 p-12">
        {activeMenuItem === "profile" && (
          <div className="space-y-10">
            <div className="space-y-2">
              <label className="text-[#5c7d73] text-lg">Full Name</label>
              <div className="relative">
                <Input
                  className="border-gray-300 rounded-lg py-6 px-4 text-gray-700"
                  placeholder="Example"
                  value={user?.full_name || ""}
                  readOnly
                />
                <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                  <Pencil className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[#5c7d73] text-lg">Email Address</label>
              <div className="relative">
                <Input
                  className="border-gray-300 rounded-lg py-6 px-4 text-gray-700"
                  placeholder="Example"
                  value={user?.email || ""}
                  readOnly
                />
                <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                  <Pencil className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[#5c7d73] text-lg">Password</label>
              <div className="relative">
                <Input
                  className="border-gray-300 rounded-lg py-6 px-4 text-gray-700"
                  type="password"
                  value="**********"
                  readOnly
                />
                <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                  <Pencil className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <Button className="bg-[#f39d8e] text-white rounded-full px-10">Save</Button>
            </div>
          </div>
        )}

        {activeMenuItem !== "profile" && (
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

