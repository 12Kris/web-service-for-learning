import type { Metadata } from "next";
import { Navbar } from "@/components/workspace/navbar";
import Footer from "@/components/landing/footer";
import { DesktopMenu } from "@/components/workspace/workspace-desktop-menu";
import { Jura } from "next/font/google";
import "../globals.css";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const jura = Jura({
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Workspace",
  description: "Workspace for learning",
};

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div
      className={`${jura.className} bg-[--background] flex w-full flex-col min-h-screen md:flex-row`}
    >
      <DesktopMenu menuItems={menuItems} />
      <div className="flex flex-col w-full">
        <Navbar menuItems={menuItems} />

        <main className="flex-1 bg-[--background] mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
}
