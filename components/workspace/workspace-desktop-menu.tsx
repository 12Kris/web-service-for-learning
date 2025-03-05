"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { MenuItems } from "@/lib/types/ui";
import * as Icons from "lucide-react";
import { AccountDropdown } from "./account-dropdown";
import { User } from "@/lib/types/user";
import { getUser } from "@/utils/supabase/client";
import { useState } from "react";
import React from "react";
import { useEffect } from "react";
type IconNames = keyof typeof Icons;

function DynamicIcon({ name }: { name: IconNames }) {
  const IconComponent = Icons[name] as React.ElementType;

  if (!IconComponent) {
    console.warn(`Icon "${name}" does not exist in lucide-react.`);
    return null;
  }
  return <IconComponent className="h-5 w-5" />;
}

export function DesktopMenu({ menuItems }: { menuItems: MenuItems[] }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const currentUser = await getUser();
        if (!currentUser) {
          return;
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
          description:
            currentUser.user_metadata?.description ||
            "No description available",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchData();
  }, []);

  const pathname = usePathname();
  return (
    <div className="hidden lg:flex sticky top-0 flex-col h-screen w-64 bg-background border-r">
      <div className="p-6">
        <Link href="/workspace" className="flex items-center space-x-2">
          <span className="text-2xl text-[--neutral] font-black">Memoria</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-bold",
                "hover:bg-black/10 ",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-ring",
                isActive && "bg-[--neutral] text-white hover:bg-[--neutral]/90"
              )}
            >
              <DynamicIcon name={item.icon as IconNames} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <Link
        // key={item.name}
        // href={item.href}
        href="/workspace/profile"
        className={cn(
          "flex items-center space-x-3 px-2 py-2 m-1 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-ring text-black hover:bg-black/10",
          pathname === "/workspace/profile" &&
            "bg-[--neutral] text-white hover:bg-[--neutral]/90"
        )}
      >
        {/* <DynamicIcon name={item.icon as IconNames} /> */}

        <AccountDropdown />

        <div
          style={{ marginLeft: 6 }}
          className="ml-0 whitespace-nowrap overflow-hidden text-ellipsis font-bold "
        >
          {user?.name || "Loading..."}
        </div>
      </Link>
    </div>
  );
}
