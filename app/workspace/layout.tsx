"use client";
import { Navbar } from "@/components/workspace/navbar";
import Footer from "@/components/landing/footer";
import { DesktopMenu } from "@/components/workspace/workspace-desktop-menu";
import { Jura } from "next/font/google";
import "../globals.css";
import { Suspense, useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import React, { createContext, ReactNode } from "react";
import { usePathname } from "next/navigation";

const jura = Jura({
  subsets: ["latin"],
});

interface DataContextType {
  data: React.ReactNode | null;
  setData: (data: React.ReactNode) => void;
}

export const DataContext = createContext<DataContextType>({
  data: null,
  setData: () => {},
});

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<React.ReactNode | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  useEffect(() => {
    setData(null);
  }, [pathname]);

  const menuItems = [
    { name: "Home", icon: "Home", href: "/workspace" },
    {
      name: "Browse courses",
      icon: "Compass",
      href: "/workspace/course/browse",
    },
    { name: "Bookmarks", icon: "Bookmark", href: "/workspace/bookmarks" },
    { name: "Profile", icon: "User", href: "/workspace/profile" },
    { name: "Help", icon: "HelpCircle", href: "/workspace/help" },
  ];

  return (
    <DataContext.Provider key={pathname} value={{ data, setData }}>
      <div
        className={`${jura.className} bg-[--background] flex w-full flex-col min-h-screen md:flex-row`}
      >
        <DesktopMenu menuItems={menuItems} />
        <div className="flex flex-col w-full">
          <Navbar data={data} menuItems={menuItems} />

          <main className="flex-1 bg-[--background] mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
          </main>
          <Footer />
        </div>
      </div>
    </DataContext.Provider>
  );
}
