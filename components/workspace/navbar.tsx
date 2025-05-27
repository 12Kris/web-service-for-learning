"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";

import { useEffect } from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AccountDropdown } from "./account-dropdown";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import { MenuItems } from "@/lib/types/ui";

import { getUser } from "@/utils/supabase/client";

interface NavbarProps {
  menuItems: MenuItems[];
  data: React.ReactNode | null;
}

export function Navbar({ menuItems, data }: NavbarProps) {
  useEffect(() => {
    async function fetchData() {
      try {
        const currentUser = await getUser();
        if (!currentUser) {
          return;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <nav className="sticky bg-white top-0 px-4 z-50 w-full border-b  lg:hidden">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <Sheet>
            <SheetTrigger asChild>
              {/* <Button size="icon" variant="ghost" className="lg:hidden"> */}
              <div className="bg-white rounded-full p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-center">
                {/* <Menu style={{ height: "25px", width: "25px" }} /> */}
                <MenuIcon fontSize={"medium"} className="text-[--neutral]" />
                <span className="sr-only">Toggle menu</span>
              </div>

              {/* </Button> */}
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
                  return (
                    <Link
                      href={item.href}
                      key={item.name}
                      className={cn(
                        "w-full font-semibold text-lg justify-start"
                        // isActive &&
                        //   "bg-[--neutral] text-white hover:bg-[--neutral]/90 rounded-2xl"
                      )}
                    >
                      <Button
                        variant="link"
                        className={cn(
                          "w-full font-bold text-lg justify-start "
                          // isActive &&
                          //   "bg-[--neutral] text-white hover:bg-[--neutral]/90 rounded-md"
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
              <span className="text-2xl text-[--neutral] font-bold">
                Memoria
              </span>
            </Link>
          </div>
          {/* </div> */}

          <div className="flex items-center space-x-4">
            {data && data}

            <AccountDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
}
