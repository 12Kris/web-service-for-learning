"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Download, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Certificate {
  id: number
  courseName: string
  issueDate: string
  certificateId: string
  status: "completed" | "in-progress"
}

const topBarColors = [
  "bg-yellow-200",
  "bg-blue-200",
  "bg-purple-200",
  "bg-pink-100"
]

export default function Certificates() {
  // backend
  const certificates: Certificate[] = [
    {
      id: 1,
      courseName: "Web Development Fundamentals",
      issueDate: "2025-04-15",
      certificateId: "CERT-001",
      status: "completed"
    },
    {
      id: 2,
      courseName: "JavaScript Mastery",
      issueDate: "2025-03-22",
      certificateId: "CERT-002",
      status: "completed"
    },
    {
      id: 3,
      courseName: "UI/UX Design Basics",
      issueDate: "2025-02-10",
      certificateId: "CERT-003",
      status: "completed"
    },
    {
      id: 4,
      courseName: "Machine Learning Fundamentals",
      issueDate: "2025-01-05",
      certificateId: "CERT-004",
      status: "completed"
    }
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-[#5c7d73] mb-4">Your Certificates</h1>
        <Button 
          variant="outline" 
          className="text-[#5c7d73] border border-2 border-[#5c7d73] rounded-full px-8 py-3 text-lg font-semibold hover:bg-[#5c7d73] hover:text-white transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Download All
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.slice(0, 4).map((certificate, idx) => (
           <Card key={certificate.id} className="shadow-md hover:shadow-lg transition-shadow">
            <div className={`h-8 w-full rounded-t-xl ${topBarColors[idx % topBarColors.length]}`}></div>
            <CardHeader className="pt-4 pb-2">
              <CardTitle className="text-lg truncate">{certificate.courseName}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="mb-2 text-sm font-semibold text-[#5c7d73]">{certificate.status === "completed" ? "Completed" : "In Progress"}</div>
              <div className="flex items-center gap-2 text-gray-600 mb-2 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Completed on {new Date(certificate.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 mb-4 text-sm">
                <Award className="w-4 h-4 text-[#5c7d73]" />
                <span>Certificate ID: {certificate.certificateId}</span>
              </div>
              <div className="flex justify-end mt-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-[#5c7d73] border border-2 border-[#5c7d73] rounded-full px-4 py-2 text-sm font-semibold hover:bg-[#5c7d73] hover:text-white transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 