"use server";
import { Navbar } from "@/components/workspace/navbar";
import Footer from "@/components/landing/footer";
import { DesktopMenu } from "@/components/workspace/workspace-desktop-menu";
import { Jura } from "next/font/google";
import "../globals.css";
import React from "react";

const jura = Jura({
  subsets: ["latin"],
});

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div
      className={`${jura.className} bg-[#fcfcfc] flex w-full flex-col min-h-screen md:flex-row`}
    >
      <DesktopMenu menuItems={menuItems} />
      <div className="flex flex-col w-full min-h-screen">
        <Navbar menuItems={menuItems} />

        <main className="bg-[#fcfcfc] mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
