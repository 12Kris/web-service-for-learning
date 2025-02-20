"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {  useEffect } from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AccountDropdown } from "./account-dropdown";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import { MenuItems } from "@/lib/definitions";



import { getUser } from "@/lib/auth/actions";

interface NavbarProps {
  menuItems: MenuItems[];
  data: React.ReactNode | null;
}

export function Navbar({ menuItems, data }: NavbarProps) {
  const pathname = usePathname();


  useEffect(() => {
    async function fetchData() {
      try {
        const currentUser = await getUser();
        if (!currentUser) {
          throw new Error("User not authenticated");
        }

       
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <nav className="sticky bg-[--background] top-0 px-4 z-50 w-full border-b  lg:hidden">
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
            {data && data}

            <AccountDropdown  />
          </div>
        </div>
      </div>
    </nav>
  );
}
