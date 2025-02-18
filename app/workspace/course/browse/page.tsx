import { getCourses } from "@/lib/courses/actions";
import { PageHeader } from "@/components/ui/page-header";
import { CourseCarousel } from "@/components/course-slider/course-slider";
import { CourseGrid } from "@/components/course-grid";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import ButtonsProvider from "@/components/ButtonsProvider";

export default async function Page() {
  const courses = await getCourses();

  return (
    <div>
      <ButtonsProvider>
        <>
          <Link href="/workspace/course/create">
            <Button variant="default" size="wide" className="flex">
              <Plus strokeWidth={3} className="mr-0 h-4 w-4" />
              Create New
            </Button>
          </Link>
          <Button variant="default" size="wide" className="hidden sm:flex">
            <Filter strokeWidth={3} className="mr-0 h-4 w-4" />
            Filter
          </Button>

          <div className="relative hidden sm:block">
            <Input
              placeholder="Search..."
              icon={
                <Search
                  style={{ color: `var(--neutral)` }}
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 "
                />
              }
              className="w-[300px] hidden sm:block"
            />
          </div>
        </>
      </ButtonsProvider>

      <Suspense fallback={<LoadingSpinner />}>
        <div className="container bg-[--background] mx-auto space-y-12">
          <PageHeader title="Browse courses" />
          <CourseCarousel title="Latest" courses={courses} />
          <CourseCarousel title="Popular" courses={courses} />
          <CourseGrid title="All courses" courses={courses} />
        </div>
      </Suspense>
    </div>
  );
}
