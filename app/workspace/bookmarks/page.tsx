"use client"

import { useState, useEffect } from "react"
import { getCourses, getCoursesWithUserProgress, getUserCourses } from "@/lib/courses/actions"
import { PageHeader } from "@/components/ui/page-header"
import { CourseCarousel } from "@/components/course-slider/course-slider"
import { CourseGrid } from "@/components/course-grid"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Filter, Sparkles } from "lucide-react"
import { FilterModal } from "@/components/workspace/modals/filter-modal"
import type { Course } from "@/lib/types/course"

export default function BookmarksPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [coursesWithUserProgress, setCoursesWithUserProgress] = useState<Course[]>([])
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([])
  const [filteredEnrolledCourses, setFilteredEnrolledCourses] = useState<Course[]>([])
  const [repeatCourses, setRepeatCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const fetchedCourses = await getCourses()
        const fetchedCoursesWithProgress = await getCoursesWithUserProgress()
        const fetchedEnrolledCourses = await getUserCourses()

        // Sort courses by creation date
        fetchedCourses.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())

        setCourses(fetchedCourses)
        setFilteredCourses(fetchedCourses)
        setCoursesWithUserProgress(fetchedCoursesWithProgress)
        setEnrolledCourses(fetchedEnrolledCourses)
        setFilteredEnrolledCourses(fetchedEnrolledCourses)

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

  const handleFilterApply = (newFilteredCourses: Course[]) => {
    // Filter both all courses and enrolled courses
    setFilteredCourses(newFilteredCourses)

    // Filter enrolled courses based on the same criteria
    const enrolledIds = new Set(enrolledCourses.map((course) => course.id))
    const newFilteredEnrolled = newFilteredCourses.filter((course) => enrolledIds.has(course.id))
    setFilteredEnrolledCourses(newFilteredEnrolled)
  }

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="container mx-auto space-y-12">
          <div className="flex items-center justify-between mt-6 lg:sticky top-0 z-10 bg-[--background] backdrop-blur-sm border-b border-b-[--border] py-4 px-4">
            <PageHeader className="mt-0" title="Bookmarks" />
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
              {repeatCourses.length >= 1 && <CourseCarousel title="Repeat Today" courses={repeatCourses} />}

              {filteredEnrolledCourses.length > 0 ? (
                <CourseGrid title="Enrolled Courses" courses={filteredEnrolledCourses} />
              ) : (
                <div className="text-center text-lg mt-8">
                  You haven't enrolled in any courses yet.
                  <div className="mt-4">
                    <Link href="/workspace/courses/browse">
                      <Button variant="default">Browse Courses</Button>
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        courses={courses}
        onFilter={handleFilterApply}
      />
    </div>
  )
}

