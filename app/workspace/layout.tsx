"use client";
import { Navbar } from "@/components/workspace/navbar";
import Footer from "@/components/landing/footer";
import { DesktopMenu } from "@/components/workspace/workspace-desktop-menu";
import { Jura } from "next/font/google";
import "../globals.css";
import { useEffect, useState } from "react";
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
    setData(null);
  }, [pathname]);

  const menuItems = [
    { name: "Home", icon: "Home", href: "/workspace" },
    {
      name: "Browse courses",
      icon: "Compass",
      href: "/workspace/courses/browse",
    },
    { name: "Bookmarks", icon: "Bookmark", href: "/workspace/bookmarks" },
    { name: "Help", icon: "HelpCircle", href: "/workspace/help" },
  ];

  return (
    <DataContext.Provider key={pathname} value={{ data, setData }}>
      <div
        className={`${jura.className} bg-[--background] flex w-full flex-col min-h-screen md:flex-row`}
      >
        <DesktopMenu menuItems={menuItems} />
        <div className="flex flex-col w-full min-h-screen">
          <Navbar data={data} menuItems={menuItems} />

          <main className="bg-[--background] mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </DataContext.Provider>
  );
}
