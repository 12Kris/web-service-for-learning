"use client";

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
    <header className="text-black">
      <nav className="container mx-auto px-4 py-0 pt-4">
        <ul className="flex space-x-4">
          <li>
            <Link
              href={getHref("")}
              className={`px-4 py-2 transition-colors ${
                isActive("") ? "border-b-2 border-black border-solid" : ""
              }`}
            >
              Tasks
            </Link>
          </li>
          <li>
            <Link
              href={getHref("description")}
              className={`px-4 py-2 transition-colors ${
                isActive("description")
                  ? "border-b-2 border-black border-solid"
                  : ""
              }`}
            >
              Description
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
