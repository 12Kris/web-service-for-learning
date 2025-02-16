"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import defaultProfileImage from "@/public/images/115-1150152_default-profile-picture-avatar-png-green.png"

interface UserMetadata {
  // Add any specific fields that might be in user_metadata
  // For example:
  bio?: string
  location?: string
}

interface User {
  id: string
  email: string
  full_name: string
  description: string
  name?: string
  avatar: string
  role: string
  created_at: string
  joinDate?: string
  user_metadata: UserMetadata
}

export default function ProfileEdit() {
  const [user, setUser] = useState<User>({
    id: "",
    email: "",
    full_name: "",
    description: "",
    name: "",
    avatar: defaultProfileImage.src,
    role: "",
    created_at: "",
    user_metadata: {},
  })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUser((prev) => {
      if (name.startsWith("user_metadata.")) {
        const metadataField = name.split(".")[1]
        return {
          ...prev,
          user_metadata: {
            ...prev.user_metadata,
            [metadataField]: value,
          },
        }
      }
      return { ...prev, [name]: value }
    })
  }

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, avatar: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("User data:", user)
    // Add your API call or state update logic here
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label className="text-sm mb-4" htmlFor="avatar">Profile Picture</Label>
          <div className="flex items-center space-x-6">
            <div className="shrink-0">
              <Image
                className="h-16 w-16 object-cover rounded-full"
                src={user.avatar || "/placeholder.svg"}
                alt="Profile picture"
                width={64}
                height={64}
              />
            </div>
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className=""
              />
            </label>
          </div>
        </div>
        <div>
       
          <Input
            label="Full Name"
            type="text"
            id="full_name"
            name="full_name"
            value={user.full_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>

          <Input
            type="text"
            id="name"
            label="Name"
            name="name"
            value={user.name || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>

          <Input
            type="email"
            id="email"
            label="Email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>

          <Textarea
            id="description"
            name="description"
            label="Biography"
            rows={3}
            value={user.description}
            onChange={handleInputChange}
          />
        </div>
        <div>


          <Input
            type="text"
            id="role"
            label="Role"
            name="role"
            value={user.role}
            onChange={handleInputChange}
            required
          />
        </div>
        
       
        <div>
         <Button size={"wide"} type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  )
}

