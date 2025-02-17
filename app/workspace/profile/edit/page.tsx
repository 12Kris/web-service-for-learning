"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import defaultProfileImage from "@/public/images/115-1150152_default-profile-picture-avatar-png-green.png";
import { PageHeader } from "@/components/ui/page-header";
import AvatarUpload from "@/components/workspace/avatar-upload";
import { User } from "@/lib/definitions";

// interface UserMetadata {

//   bio?: string;
//   location?: string;
// }

// interface User {
//   id: string;
//   email: string;
//   full_name: string;
//   description: string;
//   name?: string;
//   avatar: string;
//   role: string;
//   created_at: string;
//   joinDate?: string;
//   user_metadata: UserMetadata;
// }

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
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUser((prev) => {
      if (name.startsWith("user_metadata.")) {
        const metadataField = name.split(".")[1];
        return {
          ...prev,
          user_metadata: {
            ...prev.user_metadata,
            [metadataField]: value,
          },
        };
      }
      return { ...prev, [name]: value };
    });
  };


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("User data:", user);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Edit profile" />
      <form onSubmit={handleSubmit} className="space-y-6 mt-5">
        <AvatarUpload user={user} />

        <Input
          label="Full Name"
          type="text"
          id="full_name"
          name="full_name"
          value={user.full_name}
          onChange={handleInputChange}
          required
        />

        <Input
          type="text"
          id="name"
          label="Name"
          name="name"
          value={user.name || ""}
          onChange={handleInputChange}
        />

        <Input
          type="email"
          id="email"
          label="Email"
          name="email"
          value={user.email}
          onChange={handleInputChange}
          required
        />

        <Textarea
          id="description"
          name="description"
          label="Biography"
          rows={3}
          value={user.description}
          onChange={handleInputChange}
        />

        <Input
          type="text"
          id="role"
          label="Role"
          name="role"
          value={user.role}
          onChange={handleInputChange}
          required
        />

        <Button size={"wide"} type="submit">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
