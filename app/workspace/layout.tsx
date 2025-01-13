import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/workspace/navbar";
import Footer from "@/components/landing/footer";
import { DesktopMenu } from "@/components/workspace/workspace-desktop-menu";
const inter = Inter({ subsets: ["latin"] });

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
    { name: "Home", icon: "Home", href: "/" },
    { name: "Courses", icon: "Book", href: "/workspace" },
    { name: "Bookmarks", icon: "Bookmark", href: "/workspace/bookmarks" },
    { name: "Profile", icon: "User", href: "/workspace/profile" },
    { name: "Help", icon: "HelpCircle", href: "/workspace/help" },
  ];

  return (
    <div
      className={`${inter.className} bg-white flex w-full flex-col min-h-screen md:flex-row`}
    >
      <DesktopMenu menuItems={menuItems} />
      <div className="flex flex-col w-full">
        <Navbar menuItems={menuItems} />

        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
