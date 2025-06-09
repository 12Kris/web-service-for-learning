"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "@/components/ui/chart"
import { Clock } from "lucide-react"

interface AnalyticsProps {
  userData?: {
    totalStudyTime?: number
    studyTimeChange?: number
    coursesCompleted?: number
    coursesInProgress?: number
    pointsEarned?: number
    pointsChange?: number
    dailyStudyData?: Array<{ hour: string; minutes: number }>
    weeklyStudyData?: Array<{ day: string; hours: number }>
  }
}

export default function Analytics({ userData }: AnalyticsProps) {
  const data = userData

  return (
    <div className="p-6">
      <div className="px-4">
      {/* <h3 className="text-lg font-medium text-[--neutral] mb-4">Track your learning progress and achievements.</h3> */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-[#5c7d73] mb-4">Analytics</h3>
        <p className="text-[#5c7d73]">Track your learning progress and achievements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <Card className="border-2 border-blue-200 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="text-sm text-[--neutral] mb-1 flex gap-3 items-center">
              <Clock className="w-4 h-4 text-[--neutral]" />
              <span>Total Study Time</span>
              </div>
            <div className="text-3xl font-bold">{data?.totalStudyTime ?? 0} Hours</div>
            <div className={`text-sm mt-1 ${(data?.studyTimeChange ?? 0) >= 0 ? "text-[--neutral]" : "text-red-500"}`}>
              {(data?.studyTimeChange ?? 0) >= 0 ? "+" : ""}
              {data?.studyTimeChange ?? 0}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="text-sm text-[--neutral] mb-1 flex gap-3 items-center">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-graduation-cap text-[#5c7d73]"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                </svg>
              <span>Courses Completed</span>
              </div>
            <div className="text-3xl font-bold">{data?.coursesCompleted ?? 0}</div>
            <div className="text-sm mt-1 text-[--neutral]">{data?.coursesInProgress ?? 0} in progress</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="text-sm text-[--neutral] mb-1 flex gap-3 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-star text-[#5c7d73]"
                >
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              <span>Points Earned</span>
            </div>
            <div className="text-3xl font-bold">{(data?.pointsEarned ?? 0).toLocaleString()}</div>
            <div className="text-sm mt-1 text-[--neutral]">+{data?.pointsChange ?? 0} this month</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily" className="mb-3">
        <TabsList className="mb-6">
          <TabsTrigger value="daily" className="px-8">
            Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" className="px-8">
            Weekly
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-0">
          <Card className="border-2 border-[#e0f2e9] shadow-sm rounded-xl">
            <CardContent className="p-6">
              <div className="mb-4">
                <h4 className="text-xl font-bold">Daily Study Time</h4>
                <p className="text-sm text-[--neutral]">Hours spent studying per day this week</p>
              </div>

              <div className="relative h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.dailyStudyData ?? []}>
                    <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} ticks={[0, 15, 30, 45, 60]} />
                    <Tooltip
                      cursor={false}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2 border shadow-sm text-xs">
                              <p>{`${payload[0].payload.hour}:00: ${payload[0].value} minutes`}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="minutes" fill="#c1e6d7" radius={[4, 4, 0, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="mt-0">
          <Card className="border-2 border-[#e0f2e9] shadow-sm rounded-xl">
            <CardContent className="p-6">
              <div className="mb-4">
                <h4 className="text-xl font-bold">Weekly Study Time</h4>
                <p className="text-sm text-[--neutral]">Hours spent studying per day this week</p>
              </div>

              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.weeklyStudyData ?? []}>
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                      cursor={false}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2 border shadow-sm text-xs">
                              <p>{`${payload[0].payload.day}: ${payload[0].value} hours`}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="hours" fill="#c1e6d7" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}