"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { signOut } from "@/utils/supabase/actions";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Catalog", href: "/catalog" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function featchUser() {
      const supabase = await createClient();
      const user = (await supabase.auth.getUser()).data.user;

      if (user !== null) {
        setUser(user);
      }
      //   if (user) {
      //     const { user } = user;
      //   }

      // setUser(user);
    }
    featchUser();
  }, []);

  // useEffect(() => {
  //   // setuser(null);

  //   async function fetchuser() {
  //     const user = await getUser();
  //     console.log("user, ", user);
  //     // if (user) {
  //     //   const { user } = user;
  //     // }
  //     // setuser(user);
  //   }
  //   fetchuser();

  // });

  const handleLogout = async () => {
    try {
      signOut();
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="border-none bg-[--background] sticky top-0 z-50 md:py-4">
      <div className="flex items-center justify-between mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center">
          <Link href="/" className="text-2xl text-[--neutral] font-black">
            Memoria
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => (
            <Button
              key={item.href}
              size={"wide"}
              variant={pathname === item.href ? "primary" : "ghost"}
            >
              <Link href={item.href}>{item.name}</Link>
            </Button>
          ))}
        </div>
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <Button
              onClick={handleLogout}
              className="text-[--neutral] bg-[--primary] px-6 py-2 hover:bg-[--primary]/80 shadow-none rounded-full"
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                className="rounded-3xl"
                variant={"destructive"}
                asChild
                size={"wide"}
              >
                <Link href="/login">Log In</Link>
              </Button>
              <Button className="rounded-3xl" size={"wide"} variant={"secondary"} asChild>
              {/* <Button className="rounded-3xl text-[#517971] bg-[#ACEAC7]" size={"wide"} variant={"secondary"} asChild> */}
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] bg-[--background]"
            >
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm ${
                      pathname === item.href
                        ? "text-primary font-medium"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {user ? (
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="justify-start text-[--neutral] bg-[--primary] px-6 py-2 hover:bg-[--primary]/80 shadow-none rounded-full"
                  >
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      asChild
                      className="justify-start text-[--accent] hover:text-[--accent-foreground] px-6 py-2  border-2 border-[--accent] border-solid rounded-full"
                    >
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="justify-start text-[--neutral] bg-[--primary] px-6 py-2 hover:bg-[--primary]/80 shadow-none rounded-full"
                    >
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
