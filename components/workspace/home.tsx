"use client"

import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Flame, Plus, Sparkles } from "lucide-react";
import type { Course } from "@/lib/types/course";
import Link from "next/link";

interface HomePageProps {
  weeklyStreak: {
    points: number;
    weeks: number;
    courseMinutes: { completed: number; total: number };
    cardsStudied: { completed: number; total: number };
    dateRange: string;
  };
  createdCourses: Course[] | null;
  coursesInProgress: Course[] | null;
  upcomingEvents: Course[];
  leaderboard: { rank: number; initials: string; name: string; totalPoints?: number; color: string }[];
  completedCoursesCount: number;
}

export default function HomePage({
  weeklyStreak,
  createdCourses,
  coursesInProgress,
  upcomingEvents,
  leaderboard,
  completedCoursesCount,
}: HomePageProps) {

  const stats = [
    { 
      title: "Courses Completed",
      value: String(completedCoursesCount),
      color: "border-blue-200",
    },
    {
      title: "Courses in progress",
      value: coursesInProgress ? String(coursesInProgress.length) : "0",
      color: "border-green-200",
    },
    {
      title: "Courses created",
      value: createdCourses ? String(createdCourses.length) : "0",
      color: "border-purple-200",
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row justify-between md:mt-6 md:sticky top-0 z-10 bg-[--background] backdrop-blur-sm border-b border-b-[--border] py-4 px-0 pt-0 md:pt-4">
        <PageHeader className="mt-0 mb-3 md:mb-0 text-[--neutral]" title="Home" />
        <div className="grid grid-cols-3 md:gap-0 gap-2 w-full sm:w-auto sm:flex sm:flex-row sm:items-center sm:space-x-4 sm:mt-0">
          <Link href="/workspace/courses/create" className="col-span-1">
            <Button
              variant="default"
              className="w-full sm:w-auto sm:size-wide flex items-center justify-center"
            >
              <Plus strokeWidth={3} className="h-4 w-4" />
              <span className="hidden sm:inline">Create Course</span>
            </Button>
          </Link>

          <Link href="/workspace/courses/create-ai" className="col-span-1">
            <Button
              variant="outline"
              className="w-full sm:w-auto sm:size-wide flex items-center justify-center"
            >
              <Sparkles strokeWidth={3} className="h-4 w-4" />
              <span className="hidden sm:inline">AI Generate</span>
            </Button>
          </Link>
        </div>
      </div>

      <Card className="border border-gray-200 rounded-xl shadow-sm">
        <CardContent className="p-6 text-[--neutral]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-medium">Weekly streak</h2>
                <span className="text-[#ff9b87] font-medium">
                  +{weeklyStreak.weeks > 0 ? 20 : 0} points
                </span>
              </div>
              <p className="text-sm">{`You've made productivity experts proud!`}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <div className="bg-[#fff9f5] p-3 rounded-full">
                  <Flame className="h-6 w-6 text-[#ff9b87]" />
                </div>
                <div className="text-center">
                  <div className="font-semibold">{weeklyStreak.weeks} week</div>
                  <div className="text-sm">Current streak</div>
                </div>
              </div>

              <div className="hidden md:block w-px h-12 bg-gray-200 mx-2"></div>

              <div className="flex gap-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="items-center flex">
                    <div className="items-center align-center">
                      <div className="items-center mb-1">
                        <span className="text-xs border-b-2 py-1">
                          Weekly study plan
                        </span>
                      </div>
                      <div className="items-center">
                        <span className="text-xs">
                          {weeklyStreak.courseMinutes.completed} / 210 course minutes
                        </span>
                      </div>
                      <div className="items-center">
                        <span className="text-xs">
                          {weeklyStreak.cardsStudied.completed} / 35 card sets studied
                        </span>
                      </div>
                    </div>
                  </div>
                  
                </div>
                  <div>
                    <div className="relative w-16 h-16 flex m-auto">
                      <svg className="w-16 h-16 transform -rotate-90 m-auto">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="#f0f0f0"
                          strokeWidth="6"
                          fill="transparent"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="#ff9b87"
                          strokeWidth="6"
                          strokeDasharray={`${
                            (weeklyStreak.courseMinutes.completed /
                              210) *
                            175.9
                          } 175.9`}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="22"
                          stroke="#e6ede6"
                          strokeWidth="6"
                          fill="transparent"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="22"
                          stroke="#b0c5b0"
                          strokeWidth="6"
                          strokeDasharray={`${
                            (weeklyStreak.cardsStudied.completed /
                              35) *
                            138.2
                          } 138.2`}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                    </div>                  
                    <span className="text-xs">{weeklyStreak.dateRange}</span>
                  </div>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={`border-2 ${stat.color} rounded-xl shadow-sm text-[--neutral]`}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-bold">{stat.value}</span>
              <span className="text-sm">{stat.title}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className="border border-gray-200 rounded-xl shadow-sm text-[--neutral]"
        >
          <CardContent className="p-6 h-[600px]">
            <h2 className="text-lg font-medium mb-4">Courses in progress</h2>
            <div
              className="space-y-5 overflow-y-scroll mb-6 px-5"
              style={{ height: "90%" }}
            >
              {coursesInProgress != null && coursesInProgress.length > 0 ? (
                coursesInProgress?.map((course) => (
                  <Link
                    key={course.id}
                    href={`/workspace/courses/${course.id}`}
                    className="flex items-center gap-4"
                  >
                    <div
                      style={{ backgroundColor: course.color || "#dbeafe" }}
                      className="w-10 h-10 rounded-lg flex-shrink-0"
                    ></div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <div className="w-5/6">
                          <h3 className="font-medium">{course.name}</h3>
                          <p className="text-xs">{course.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-sm text-gray-500">
                  No courses in progress.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card
          className="border border-gray-200 rounded-xl shadow-sm text-[--neutral]"
        >
          <CardContent className="p-6 h-[600px]">
            <h2 className="text-lg font-medium mb-4">Leader board</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-12 text-sm mb-2">
                <div className="col-span-1">Rank</div>
                <div className="col-span-7">Name</div>
                <div className="col-span-4 text-right">Total points</div>
              </div>
              {leaderboard.length > 0 ? (
                leaderboard.map((user) => (
                  <div
                    key={user.rank}
                    className="grid grid-cols-12 items-center"
                  >
                    <div className="col-span-1 font-medium">{user.rank}</div>
                    <div className="col-span-7 flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs`}
                      >
                        {user.initials}
                      </div>
                      <span>{user.name}</span>
                    </div>
                    <div className="col-span-4 text-right font-medium">
                      {user.totalPoints}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">
                  No users found in the leaderboard.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 rounded-xl shadow-sm text-[--neutral]">
        <CardContent className="p-6">
          <h2 className="text-lg font-medium mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents != null && upcomingEvents.length > 0 ? (
              upcomingEvents.map((course) => (
                <Link
                  key={course.id}
                  href={`/workspace/courses/${course.id}`}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: course.color || "#dbeafe" }}
                    ></div>
                    <div>
                      <h3 className="font-medium">{course.name}</h3>
                      <p className="text-xs">{course.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-sm text-gray-500">No events here.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}