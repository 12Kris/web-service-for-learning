"use client"

import { Clock, TrendingUp } from "lucide-react"
import Link from "next/link"

interface AnalyticsDashboardProps {
  userData?: {
    totalStudyTime: number;
    studyTimeChange: number;
    coursesCompleted: number;
    coursesInProgress: number;
    pointsEarned: number;
    pointsChange: number;
    dailyStudyData: Array<{ hour: string; minutes: number }>;
    weeklyStudyData: Array<{ day: string; hours: number }>;
  };
}

export default function AnalyticsDashboard({ userData }: AnalyticsDashboardProps) {
  return (
    <div className="flex min-h-screen bg-white">
      <main className="flex-1 p-8 bg-[#faf8f3]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-[#5c7d73] mb-4">Analytics</h3>
            <p className="text-[#5c7d73]">Track your learning progress and achievements.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-[#5c7d73]" />
                <span className="text-[#5c7d73] font-medium">Total Study Time</span>
              </div>
              <h3 className="text-4xl font-bold text-[#5c7d73] mb-2">{userData?.totalStudyTime ?? 24.5} Hours</h3>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-green-500 font-medium">{userData?.studyTimeChange ?? +12.5}% from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-2">
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
                <span className="text-[#5c7d73] font-medium">Courses Completed</span>
              </div>
              <h3 className="text-4xl font-bold text-[#5c7d73] mb-2">{userData?.coursesCompleted ?? 12}</h3>
              <span className="text-green-500">{userData?.coursesInProgress ?? 3} in progress</span>
            </div>

            <div className="bg-white rounded-3xl p-6 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-2">
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
                <span className="text-[#5c7d73] font-medium">Points Earned</span>
              </div>
              <h3 className="text-4xl font-bold text-[#5c7d73] mb-2">{userData?.pointsEarned ?? 1245}</h3>
              <span className="text-green-500">{userData?.pointsChange ?? +250} this month</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
              <button className="px-6 py-2 bg-white text-[#5c7d73] font-medium rounded-md shadow-sm border-b-2 border-[#5c7d73]">
                Daily
              </button>
              <button className="px-6 py-2 text-[#5c7d73] font-medium rounded-md hover:bg-gray-50">Weekly</button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#5c7d73] mb-2">Daily Study Time</h2>
              <p className="text-[#5c7d73]">Hours spent studying per day this week</p>
            </div>

            {/* TODO: Add chart */}
          </div>
        </div>
      </main>
    </div>
  );
}
