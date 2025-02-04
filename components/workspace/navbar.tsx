"use client";

import * as React from "react";
import { Menu, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AccountDropdown } from "./account-dropdown";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import { MenuItems } from "@/lib/definitions";

import { User } from "@/lib/definitions";

import { getUser } from "@/lib/auth/actions";

interface NavbarProps {
  onSearch?: (term: string) => void;
  onFilter?: () => void;
  onAdd?: () => void;
  menuItems: MenuItems[];
}

export function Navbar({ onSearch, onFilter, onAdd, menuItems }: NavbarProps) {
  const pathname = usePathname();
  const showAddButton = pathname === "/workspace/course/browse";

  const [user, setUser] = useState<User | null>(null);

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

  return (
    <nav className="sticky bg-[--background] top-0 px-4 z-50 w-full border-b  ">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[300px] bg-white sm:w-[400px]"
              >
                <VisuallyHidden>
                  <DialogTitle>Menu</DialogTitle>
                </VisuallyHidden>
                <nav className="flex flex-col gap-4 mt-4">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        href={item.href}
                        key={item.name}
                        className={cn(
                          "w-full font-semibold text-lg justify-start",
                          isActive &&
                            "bg-[--neutral] text-white hover:bg-[--neutral]/90"
                        )}
                      >
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full font-semibold text-lg justify-start",
                            isActive &&
                              "bg-[--neutral] text-white hover:bg-[--neutral]/90"
                          )}
                        >
                          {item.name}
                        </Button>
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
            <div className="md:hidden">
              <Link href="/workspace" className=" space-x-2">
                <span className="text-2xl text-[--neutral] font-light">
                  Memoria
                </span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {showAddButton && (
              <Link href="/workspace/course/create">
                <Button
                  variant="default"
                  size="wide"
                  onClick={onAdd}
                  className="flex"
                >
                  <Plus strokeWidth={3} className="mr-0 h-4 w-4" />
                  Create New
                </Button>
              </Link>
            )}

            <Button
              variant={"default"}
              size="wide"
              onClick={onFilter}
              className="hidden sm:flex"
            >
              <Filter strokeWidth={3} className="mr-0 h-4 w-4" />
              Filter
            </Button>
            <div className="relative hidden sm:block">
              <Input
                placeholder="Search..."
                icon={
                  <Search
                    style={{ color: `var(--neutral)` }}
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 "
                  />
                }
                className="w-[300px]"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>

            <AccountDropdown name={user?.name} />
          </div>
        </div>
      </div>
    </nav>
  );
}
