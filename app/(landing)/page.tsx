import Gradient from "@/components/gradient-tittle/gradient";
import { Jumbotron } from "@/components/landing/jumbotron";
import { MetricsShowcase } from "@/components/landing/metrics-showcase";
import ProblemsTable from "@/components/problems-table/page";
import { StudyCarousel } from "@/components/study-carousel/study-carousel";
import { getCourses, getTotalStudents } from "@/lib/courses/actions";

const studyTopics = [
  {
    id: "1",
    title: "Math Basics",
    description: "Arithmetic, algebra, and key formulas",
    image: "/images/Robot.png",
    backgroundColor: "#FCAFB7",
    textColor: "#FFFFFF",
    variant: "bottom" as const,
    imagePosition: "top" as const,
    arrowPosition: "top-left" as const,
  },
  {
    id: "2",
    title: "Science Fundamentals",
    description: "Physics, Chemistry Basics",
    image: "/images/Science.png",
    backgroundColor: "#A9DDFF",
    textColor: "#FFFFFF",
    variant: "top" as const,
    imagePosition: "bottom" as const,
    arrowPosition: "bottom-left" as const,
  },
  {
    id: "3",
    title: "Coding Languages",
    description: "Key commands and syntax rules",
    image: "/images/Group.png",
    backgroundColor: "#DCBEFF",
    textColor: "#FFFFFF",
    variant: "bottom" as const,
    imagePosition: "top" as const,
    arrowPosition: "top-left" as const,
  },
  {
    id: "4",
    title: "Medical Terminology",
    description: "Anatomy and Definitions",
    image: "/images/Medicines.png",
    backgroundColor: "#ACEAC7",
    textColor: "#FFFFFF",
    variant: "top" as const,
    imagePosition: "bottom" as const,
    arrowPosition: "bottom-left" as const,
  },
  {
    id: "5",
    title: "Art and Creativity",
    description: "Techniques and famous artworks.",
    image: "/images/Art&creativity.png",
    backgroundColor: "#FCAFB7",
    textColor: "#FFFFFF",
    variant: "bottom" as const,
    imagePosition: "top" as const,
    arrowPosition: "top-left" as const,
  },
  {
    id: "6",
    title: "History Insights",
    description: "Key events and influential figures.",
    image: "/images/History.png",
    backgroundColor: "#A9DDFF",
    textColor: "#FFFFFF",
    variant: "top" as const,
    imagePosition: "bottom" as const,
    arrowPosition: "bottom-left" as const,
  },
];

export default async function Home() {
  const courses = await getCourses(0, 50000000);
  const totalStudents = await getTotalStudents();

  const totalCreatedCourses = courses.length;

  const totalRatings = courses.reduce((sum, course) => {
    return course.rating && course.rating > 1 ? sum + course.rating : sum;
  }, 0);
  const ratedCoursesCount = courses.filter(course => course.rating && course.rating > 1).length;
  const satisfactionRate = ratedCoursesCount > 0 ? (totalRatings / ratedCoursesCount).toFixed(1) : "0.0";

  const metrics = [
    {
      value: totalStudents.toString(),
      label: "Students total",
    },
    {
      value: totalCreatedCourses.toString(),
      label: "Created courses",
    },
    {
      value: satisfactionRate,
      label: "Satisfaction rate",
      hasStar: true,
    },
  ];
  return (
    <div className="bg-[--background]">
      <Jumbotron
        title="Unlock Your Potential: Learn New Skills, Shape Your Future"
        description="Discover a unique approach to learning that fits your lifestyle. Our courses are designed to help you grow, succeed, and reach new heights in your career."
        primaryButtonText="Get Started"
        primaryButtonLink="/login"
        secondaryButtonText="Learn More"
        secondaryButtonLink="/about"
      />
      <ProblemsTable />
      <MetricsShowcase
        title="Our numbers tell more about us"
        metrics={metrics}
      />

      <div className="mx-auto my-32">
        <StudyCarousel title="Directions of Education" topics={studyTopics} />
      </div>

      <Gradient />
    </div>
  );
}
