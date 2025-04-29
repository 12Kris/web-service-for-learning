import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Clock, Flame, Plus } from "lucide-react"

export default async function HomePage() {
  const weeklyStreak = {
    points: 20,
    weeks: 1,
    courseMinutes: {
      completed: 22,
      total: 30,
    },
    cardsStudied: {
      completed: 12,
      total: 40,
    },
    dateRange: "Apr 20 - 26",
  }

  const stats = [
    { title: "Courses Completed", value: "02", color: "border-blue-200" },
    { title: "Courses in progress", value: "10", color: "border-green-200" },
    { title: "Courses created", value: "03", color: "border-purple-200" },
  ]

  const coursesInProgress = [
    {
      id: 1,
      title: "UX/UI Design",
      description: "Learn design fast",
      progress: 56,
      color: "bg-red-200",
    },
    {
      id: 2,
      title: "English B2",
      description: "Basic english..",
      progress: 72,
      color: "bg-pink-200",
    },
    {
      id: 3,
      title: "Math. Basic rules",
      description: "Main rules for math",
      progress: 36,
      color: "bg-green-200",
    },
    {
      id: 4,
      title: "Math. Basic rules",
      description: "Main rules for math",
      progress: 81,
      color: "bg-purple-200",
    },
    {
      id: 5,
      title: "Math. Basic rules",
      description: "Main rules for math",
      progress: 12,
      color: "bg-blue-200",
    },
  ]

  const leaderboard = [
    { rank: 1, initials: "ST", name: "Sam Taylor", cardsStudied: 214, color: "bg-blue-100" },
    { rank: 2, initials: "PS", name: "Pat Smith", cardsStudied: 125, color: "bg-blue-100" },
    { rank: 3, initials: "JL", name: "Jamie Lee", cardsStudied: 113, color: "bg-blue-100" },
    { rank: 4, initials: "MJ", name: "Maria Garcia", cardsStudied: 87, color: "bg-blue-100" },
    { rank: 5, initials: "AJ", name: "Alex Johnson", cardsStudied: 76, color: "bg-blue-100" },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Math. Basic rules",
      description: "Main rules for math",
      cards: 30,
      color: "bg-blue-200",
    },
    {
      id: 2,
      title: "English B2",
      description: "Basic english..",
      cards: 12,
      color: "bg-pink-200",
    },
    {
      id: 3,
      title: "Math. Basic rules",
      description: "Main rules for math",
      cards: 9,
      color: "bg-purple-200",
    },
    {
      id: 4,
      title: "UX/UI Design",
      description: "Learn design fast",
      cards: 16,
      color: "bg-red-200",
    },
    {
      id: 5,
      title: "Math. Basic rules",
      description: "Main rules for math",
      cards: 21,
      color: "bg-green-200",
    },
  ]

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row justify-between md:mt-6 md:sticky top-0 z-10 bg-[--background] backdrop-blur-sm border-b border-b-[--border] py-4 px-0 pt-0 md:pt-4">
        <PageHeader className="mt-0 mb-3 md:mb-0" title="Home" />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Activity
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Courses
          </Button>
        </div>
      </div>

      <Card className="border border-gray-200 rounded-3xl shadow-sm">
        <CardContent className="p-6 text-[#5c7d73]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-medium">Weekly streak</h2>
                <span className="text-[#ff9b87] font-medium">+{weeklyStreak.points} points</span>
              </div>
                <p className="text-sm">{`You've made productivity experts proud!`}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#fff9f5] p-3 rounded-full">
                  <Flame className="h-6 w-6 text-[#ff9b87]" />
                </div>
                <div>
                  <div className="font-semibold">{weeklyStreak.weeks} week</div>
                  <div className="text-sm">Current streak</div>
                </div>
              </div>

              <div className="hidden md:block w-px h-12 bg-gray-200 mx-2"></div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs">
                    {weeklyStreak.courseMinutes.completed}/{weeklyStreak.courseMinutes.total} course min
                  </span>
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle cx="32" cy="32" r="28" stroke="#f0f0f0" strokeWidth="6" fill="transparent" />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#ff9b87"
                        strokeWidth="6"
                        strokeDasharray={`${(weeklyStreak.courseMinutes.completed / weeklyStreak.courseMinutes.total) * 175.9} 175.9`}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                      <circle cx="32" cy="32" r="22" stroke="#e6ede6" strokeWidth="6" fill="transparent" />
                      <circle
                        cx="32"
                        cy="32"
                        r="22"
                        stroke="#b0c5b0"
                        strokeWidth="6"
                        strokeDasharray={`${(weeklyStreak.cardsStudied.completed / weeklyStreak.cardsStudied.total) * 138.2} 138.2`}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs">
                    {weeklyStreak.cardsStudied.completed}/{weeklyStreak.cardsStudied.total} cards studied
                  </span>
                  <span className="text-xs">{weeklyStreak.dateRange}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className={`border-2 ${stat.color} rounded-3xl shadow-sm text-[#5c7d73]`}>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-bold">{stat.value}</span>
              <span className="text-sm">{stat.title}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-gray-200 rounded-3xl shadow-sm text-[#5c7d73]">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-4">Courses in progress</h2>
            <div className="space-y-4">
              {coursesInProgress.map((course) => (
                <div key={course.id} className="flex items-center gap-4">
                  <div className={`${course.color} w-10 h-10 rounded-lg flex-shrink-0`}></div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{course.title}</h3>
                        <p className="text-xs">{course.description}</p>
                      </div>
                      <span className="font-medium text-lg">{course.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 rounded-3xl shadow-sm text-[#5c7d73]">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-4">Leader board</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-12 text-sm mb-2">
                <div className="col-span-1">Rank</div>
                <div className="col-span-7">Name</div>
                <div className="col-span-4 text-right">Cards Studied</div>
              </div>
              {leaderboard.map((user) => (
                <div key={user.rank} className="grid grid-cols-12 items-center">
                  <div className="col-span-1 font-medium">{user.rank}</div>
                  <div className="col-span-7 flex items-center gap-2">
                    <div className={`${user.color} w-8 h-8 rounded-full flex items-center justify-center text-xs`}>
                      {user.initials}
                    </div>
                    <span>{user.name}</span>
                  </div>
                  <div className="col-span-4 text-right font-medium">{user.cardsStudied}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 rounded-3xl shadow-sm text-[#5c7d73]">
        <CardContent className="p-6">
          <h2 className="text-lg font-medium mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`${event.color} w-10 h-10 rounded-lg flex-shrink-0`}></div>
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-xs">{event.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span>
                    {event.cards} {event.cards === 1 ? "card" : "cards"}
                  </span>
                  <ChevronRight className="h-5 w-5" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
