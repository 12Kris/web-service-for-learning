"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    const pathParts = pathname?.split("/") || [];
    const lastPart = pathParts[pathParts.length - 1];

    if (pathname === "/" || pathname === "") {
      return path === "";
    }

    if (!isNaN(Number(lastPart))) {
      return path === "";
    }

    return lastPart === path;
  };

  const getHref = (path: string) => {
    const pathParts = pathname?.split("/") || [];
    const lastPart = pathParts[pathParts.length - 1];

    if (!isNaN(Number(lastPart))) {
      return `${pathname}/${path}`;
    } else {
      return `${pathParts.slice(0, -1).join("/")}/${path}`;
    }
  };

  return (
    <nav className="mx-auto mt-4">
      <ul className="flex space-x-4 justify-center">
        <li>
          <Link href={getHref("")} className={`transition-colors `}>
            <Button
              size={"lg"}
              variant={`${isActive("") ? "secondary" : "ghost"}`}
            >
              Modules
            </Button>
          </Link>
        </li>
        <li>
          <Link href={getHref("description")} className={`transition-colors `}>
            <Button
              size={"lg"}
              variant={`${isActive("description") ? "secondary" : "ghost"}`}
            >
              Description
            </Button>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
