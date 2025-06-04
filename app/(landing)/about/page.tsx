import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PM from "./img/PM.jpg"
import BA from "./img/BA.jpg"
import FrontendDev from "./img/FrontendDev.jpg"
import BackendDev from "./img/BackendDev.jpg"
import FullStack from "./img/FullStack.jpg"
import Designer from "./img/Designer.jpg"
import QA from "./img/QA.jpg"
import Mentor from "./img/Mentor.jpg"

export default function AboutUs() {
  const teamMembers = [
    {
      name: "Isaienko Volodymyr",
      role: "Project Manager",
      image:  PM,
      initials: "IV",
    },
    {
      name: "Virt Mykhailo",
      role: "Business Analysis",
      image: BA,
      initials: "VM",
    },
    {
      name: "Mamchur Chrystyna",
      role: "Front-end developer",
      image: FrontendDev,
      initials: "MC",
    },
    {
      name: "Bikbulatov Bogdan",
      role: "Back-end developer",
      image: BackendDev,
      initials: "BB",
    },
    {
      name: "Nyskohuz Mykhailo",
      role: "Full-stack developer",
      image: FullStack,
      initials: "MN",
    },
    {
      name: "Novikova Yana",
      role: "Designer",
      image: Designer,
      initials: "NY",
    },
    {
      name: "Dubas Roman",
      role: "Quality assurance",
      image: QA,
      initials: "DR",
    },
    {
      name: "Koldovskyy Vyacheslav",
      role: "Mentor",
      image: Mentor,
      initials: "VK",
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl text-[--neutral]">
      <div className="space-y-4 text-center mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">About Us</h1>
        <p className="text-xl max-w-3xl mx-auto mt-4">
          We are enthusiastic students from IT Step University, passionate about technology and innovation. 
          Together, we are developing Memoria — a smart online platform for learning through flashcards and quizzes. 
          We are grateful to be guided by our mentor, Vyacheslav Koldovskyi, whose expertise and support 
          inspire us throughout the project.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 p-1">
          <Card className="h-full border-0 bg-background/80 backdrop-blur-sm text-purple-600">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-600 dark:text-purple-400"
                >
                  <path d="m12 14 4-4"></path>
                  <path d="M3.34 19a10 10 0 1 1 17.32 0"></path>
                </svg>
              </div>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
              <CardDescription>What drives us every day</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                To create a user-friendly online platform for learning a wide range of topics through flashcards and quizzes.
                We combine the power of Spaced Repetition with Artificial Intelligence to make education personalized, effective, 
                and engaging.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-1">
          <Card className="h-full border-0 bg-background/80 backdrop-blur-sm text-emerald-600">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-emerald-600 dark:text-emerald-400"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="m16 10-4 4-4-4"></path>
                </svg>
              </div>
              <CardTitle className="text-2xl">Our Vision</CardTitle>
              <CardDescription>{`Where we're headed`}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                We are a team that proves learning can be engaging and enjoyable.
                Our vision is to revolutionize education by creating innovative, AI-powered tools that make mastering new topics an exciting journey for learners of all ages.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Our Team</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the talented individuals who make Memoria possible. Our diverse team brings together expertise from
            various fields.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="overflow-hidden border bg-background hover:shadow-md transition-all  text-[#5c7d73]">
              <div className="aspect-square relative bg-muted">
                <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-xl">{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">
                  Part of the Memoria team, bringing expertise and passion to our mission.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
