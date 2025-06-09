import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { 
  Code2,
  Database,
  Cpu,
  Globe,
  Clock, 
  Users, 
  Star,
  Search,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

const courses = [
  {
    id: 1,
    title: "Programming Basics",
    description: "Learn fundamental programming concepts and start your coding journey.",
    type: "Programming",
    duration: "8 weeks",
    students: 1200,
    rating: 4.8,
    image: "/images/catalog/programming_v1.png",
    tags: ["Beginner", "Programming", "Web Development"]
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    description: "Master the basics of machine learning and artificial intelligence.",
    type: "Data Science",
    duration: "12 weeks",
    students: 850,
    rating: 4.9,
    image: "/images/catalog/machine-learning_v2.jpg",
    tags: ["Intermediate", "AI", "Data Science"]
  },
  {
    id: 3,
    title: "Algorithms and Data Structures",
    description: "Deep dive into algorithms and data structures for technical interviews.",
    type: "Computer Science",
    duration: "10 weeks",
    students: 1500,
    rating: 4.7,
    image: "/images/catalog/data_structure_and_algorithms.png",
    tags: ["Advanced", "Algorithms", "Computer Science"]
  }
];

const categories = [
  { name: "Programming", icon: Code2, count: 15 },
  { name: "Data Science", icon: Database, count: 8 },
  { name: "Computer Science", icon: Cpu, count: 12 },
  { name: "Web Development", icon: Globe, count: 10 }
];

const topBarColors = [
  "border-yellow-200",
  "border-blue-200",
  "border-purple-200",
  "border-pink-200",
  "border-oragne-200",
  "border-green-200",
  "border-cyan-200",
]

export default function Catalog() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[--neutral] mb-4">Course Catalog</h1>
        <p className="text-lg text-[--neutral] max-w-2xl mx-auto">
          Explore our comprehensive collection of courses designed to help you achieve your learning goals.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[--neutral]" />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[--neutral]"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          <Link href={`/workspace/courses/browse`}>
            Search
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-12">
        {categories.map((category, idx) => (
          <Card key={category.name} className={`hover:shadow-lg transition-shadow cursor-pointer text-[--neutral] border-2 ${topBarColors[idx % topBarColors.length]}`}>
            <CardContent className="p-3 sm:p-6">
              <Link href={`/workspace/courses/browse`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg text-[--neutral]">{category.name}</h3>
                    <p className="text-xs sm:text-sm text-[--neutral]">{category.count} courses</p>
                  </div>
                  <category.icon className="w-6 h-6 sm:w-8 sm:h-8 text-[--neutral]" />
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow text-[--neutral]">
            <div className="aspect-video relative">
              <Image
                src={course.image}
                alt={course.title}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-4 right-4">
                <Badge variant="outline" className="bg-white text-[--neutral]">
                  {course.type}
                </Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-xl text-[--neutral]">{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[--neutral] mb-4">{course.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-[#e0f2e9]">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm text-[--neutral] mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[--neutral]" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[--neutral]" />
                  {course.students} students
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-[--neutral]" />
                  {course.rating}
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href={`/workspace/courses/${course.id}`} className="flex items-center justify-center gap-2">
                  View Course
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}