"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/types/user";

import { getUser } from "@/utils/supabase/client";
import { editUser } from "@/utils/supabase/actions";
import { useRouter } from "next/navigation";

export default function ProfileEdit() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    getUser().then((userData) => setUser(userData));
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.currentTarget);
    const updatedUser = {
      email: formData.get("email") as string,
      data: {
        displayName: formData.get("name") as string,
        full_name: formData.get("full_name") as string,
        bio: formData.get("description") as string,
        location: formData.get("location") as string,
      },
    };
    await editUser(updatedUser);
    window.location.href = `/workspace/profile`;

    router.push("/workspace/profile");
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-0">
      <h3 className="text-xl font-semibold text-[--neutral] mb-4">Edit profile</h3>
      <form onSubmit={handleSubmit} className="space-y-6 mt-5">
        {/* <AvatarUpload user={user} /> */}

        <Input
          label="Full Name"
          type="text"
          id="full_name"
          name="full_name"
          defaultValue={user?.user_metadata.full_name || ""}
          required
          maxLength={30}
        />

        <Input
          type="text"
          id="name"
          label="Display Name"
          name="name"
          defaultValue={user?.user_metadata.displayName || ""}
          maxLength={30}
        />

        <Input
          type="email"
          id="email"
          label="Email"
          name="email"
          defaultValue={user?.email || ""}
          required
          maxLength={30}
        />

        <Textarea
          id="description"
          name="description"
          label="Biography"
          rows={3}
          defaultValue={user?.user_metadata.bio || ""}
          maxLength={100}
        />

        <Input
          type="text"
          id="location"
          label="Location"
          name="location"
          defaultValue={user?.user_metadata.location || ""}
          maxLength={50}
        />

        <Button size={"wide"} type="submit">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
