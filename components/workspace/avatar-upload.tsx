"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

interface User {
  avatar: string | null;
}

export default function AvatarUpload({ user }: { user: User }) {
  const [avatarUrl, setAvatarUrl] = useState(user.avatar || "/placeholder.svg");

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target?.result as string);
        // Here you would typically upload the file to your server or cloud storage
        // and update the user's avatar URL in your database
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mt-2">
      <label
        htmlFor="avatar-upload"
        className="group relative block w-24 h-24 rounded-full overflow-hidden bg-gray-100 cursor-pointer"
      >
        <Image
          src={avatarUrl || "/placeholder.svg"}
          alt="Profile picture"
          width={96}
          height={96}
          className="w-full h-full object-cover transition-opacity group-hover:opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <input
          type="file"
          id="avatar-upload"
          name="avatar"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />
      </label>
      <p className="mt-2 text-sm text-gray-500">Click to upload new avatar</p>
    </div>
  );
}
