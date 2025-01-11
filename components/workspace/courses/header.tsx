"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { isCourseAddedToUser } from "@/lib/courses/actions";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;

  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRegistration = async () => {
      if (courseId) {
        try {
          const registered = await isCourseAddedToUser(courseId);
          setIsRegistered(registered);

          if (!registered && /^\/workspace\/course\/\d+$/.test(pathname)) {
            window.location.href = `/workspace/course/${courseId}/description`;
          }
        } catch (error) {
          console.error("Error checking user registration:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    checkUserRegistration();
  }, [courseId, pathname, router]);

  const shouldHideHeader = /\/workspace\/course\/\d+\/module\/\d+/.test(pathname);

  if (shouldHideHeader) {
    return null;
  }

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

  if (loading) {
    return null;
  }

  return (
      <header className="text-black">
        <nav className="container mx-auto px-4 py-0 pt-4">
          <ul className="flex space-x-4">
            {isRegistered ? (
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
            ) : null}
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
