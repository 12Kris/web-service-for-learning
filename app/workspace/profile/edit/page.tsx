"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import defaultProfileImage from "@/public/images/115-1150152_default-profile-picture-avatar-png-green.png";
import { PageHeader } from "@/components/ui/page-header";
import AvatarUpload from "@/components/workspace/avatar-upload";
import { User } from "@/lib/types/user";

import { getUser } from "@/utils/supabase/client";
import { editUser } from "@/utils/supabase/actions";



export default function ProfileEdit() {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    getUser().then((userData) => setUser(userData));
  }, []);

  // function handeleEdit() {
  //   console.log('Edit');
  //   editUser({ data: { displayName: 'Mykhailo Nyskohuz changed' } });
  // }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return; // ensure user is loaded
    const formData = new FormData(e.currentTarget);
    const updatedUser = {
      // id: user.id,
      email: formData.get("email") as string,
      // created_at: user.created_at,
      data: {
        display_name: formData.get("name") as string,
        full_name: formData.get("full_name") as string,
        bio: formData.get("description") as string,
        location: formData.get("location") as string,
      },
    };
    const { error, user: updated } = await editUser(updatedUser);
    if (error) {
      console.error("Error updating user:", error);
    } else {
      console.log("User updated successfully:", updated);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Edit profile" />
      <form onSubmit={handleSubmit} className="space-y-6 mt-5">
        {/* <AvatarUpload user={user} /> */}

        <Input
          label="Full Name"
          type="text"
          id="full_name"
          name="full_name"
          defaultValue={user?.user_metadata.full_name || ""}
          // onChange={handleInputChange}
          required
        />

        <Input
          type="text"
          id="name"
          label="Name"
          name="name"
          defaultValue={user?.user_metadata.display_name || ""}
          // onChange={handleInputChange}
        />

        <Input
          type="email"
          id="email"
          label="Email"
          name="email"
          defaultValue={user?.email || ""}
          // onChange={handleInputChange}
          required
        />

        <Textarea
          id="description"
          name="description"
          label="Biography"
          rows={3}
          defaultValue={user?.user_metadata.bio || ""}
          // onChange={handleInputChange}
        />

        <Input
          type="text"
          id="location"
          label="Location"
          name="location"
          defaultValue={user?.user_metadata.location || ""}
          // onChange={handleInputChange}
          required
        />

        <Button  size={"wide"} type="submit">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
