// import { PageHeader } from "@/components/ui/page-header";

// export default async function HomePage() {
//   return (
//     <div>
//       <PageHeader title="Home" />
//     </div>
//   );
// }


"use client"

import { useState, useEffect } from "react"
import { getCourses, getCoursesWithUserProgress } from "@/lib/courses/actions"
import { PageHeader } from "@/components/ui/page-header"
import { CourseCarousel } from "@/components/course-slider/course-slider"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Filter, Sparkles } from "lucide-react"
import { FilterModal } from "@/components/workspace/modals/filter-modal"
import type { Course } from "@/lib/types/course"

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [coursesWithUserProgress, setCoursesWithUserProgress] = useState<Course[]>([])
  const [repeatCourses, setRepeatCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  // Add a new state variable to track if filters are applied
  const [isFiltered, setIsFiltered] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const fetchedCourses = await getCourses()
        const fetchedCoursesWithProgress = await getCoursesWithUserProgress()

        // Sort courses by creation date
        fetchedCourses.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())

        setCourses(fetchedCourses)
        setFilteredCourses(fetchedCourses)
        setCoursesWithUserProgress(fetchedCoursesWithProgress)

        // Find courses to repeat today
        const today = new Date().toISOString().split("T")[0]
        const coursesToRepeat = fetchedCoursesWithProgress.filter((course) => {
          try {
            const spacedRepetition = course.user_progress?.[0]?.spaced_repetition
            return spacedRepetition && spacedRepetition.next_review_dates.includes(today)
          } catch (error) {
            console.error("Error accessing spaced_repetition for course", course.id, error)
            return false
          }
        })
        setRepeatCourses(coursesToRepeat)
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Update the handleFilterApply function
  const handleFilterApply = (newFilteredCourses: Course[]) => {
    setFilteredCourses(newFilteredCourses)
    // Set isFiltered to true if the filtered courses are different from the original courses
    setIsFiltered(newFilteredCourses.length !== courses.length)
  }

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="container mx-auto space-y-12">
          <div className="flex items-center justify-between mt-6 lg:sticky top-0 z-10 bg-[--background] backdrop-blur-sm border-b border-b-[--border] py-4 px-4">
            <PageHeader title="Home" />
            <div className="flex items-center space-x-4">
              <Link href="/workspace/courses/create">
                <Button variant="default" size="wide" className="flex">
                  <Plus strokeWidth={3} className="mr-0 h-4 w-4" />
                  Create New
                </Button>
              </Link>
              <Link href="/workspace/courses/create-ai">
                <Button variant="outline" size="wide" className="flex">
                  <Sparkles strokeWidth={3} className="mr-0 h-4 w-4" />
                  AI Generate
                </Button>
              </Link>
              <Button variant="default" size="wide" className="flex" onClick={() => setIsFilterModalOpen(true)}>
                <Filter strokeWidth={3} className="mr-0 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center text-lg">No courses available!</div>
          ) : (
            <>
              {isFiltered ? (
                // Show search results when filter is applied
                <CourseCarousel title="Search Results" courses={filteredCourses} />
              ) : (
                // Show default content when no filter is applied
                <>
                  <CourseCarousel title="Latest" courses={courses} />
                  <CourseCarousel title="Popular" courses={courses} />
                </>
              )}

              {/* Always show repeat courses if available */}
              {/* {repeatCourses.length >= 1 && <CourseCarousel title="Repeat Today" courses={repeatCourses} />} */}
            </>
          )}
        </div>
      )}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => {
          setIsFilterModalOpen(false)
          // If you want to reset filters when modal is closed, uncomment the next line
          // setIsFiltered(false)
        }}
        courses={courses}
        onFilter={handleFilterApply}
      />
    </div>
  )
}


