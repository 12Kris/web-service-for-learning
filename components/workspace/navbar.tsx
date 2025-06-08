"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AccountDropdown } from "./account-dropdown";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import { MenuItems } from "@/lib/types/ui";

interface NavbarProps {
  menuItems: MenuItems[];
}

export function Navbar({ menuItems }: NavbarProps) {
  return (
    <nav className="sticky bg-white top-0 px-4 z-50 w-full border-b lg:hidden">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <Sheet>
            <SheetTrigger asChild>
              <div className="bg-white rounded-full p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-center">
                <MenuIcon fontSize={"medium"} className="text-[--neutral]" />
                <span className="sr-only">Toggle menu</span>
              </div>
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
                      )}
                    >
                      <Button
                        variant="link"
                        className={cn("w-full font-bold text-lg justify-start")}
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

          <div className="flex items-center space-x-4">
            {/* {data && data} */}

            <AccountDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
}
