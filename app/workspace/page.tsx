import { CourseCarousel } from "@/components/course-slider/course-slider"

const DUMMY_COURSES = [
  {
    id: "1",
    title: "Introduction to React",
    topic: "Web Development",
    thermsCount: 23,
    description: "Learn the basics of React, including components, state, and props. This course covers everything you need to get started with building modern web applications.",
    author: "Jane Doe"
  },
  {
    id: "2",
    title: "Advanced JavaScript Techniques",
    topic: "Programming",
    thermsCount: 18,
    description: "Dive deep into advanced JavaScript concepts such as closures, prototypes, and asynchronous programming. Enhance your skills and write more efficient code.",
    author: "John Smith"
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    topic: "Design",
    thermsCount: 15,
    description: "Explore the fundamental principles of user interface and user experience design. Learn how to create intuitive and visually appealing designs for web and mobile applications.",
    author: "Alice Johnson"
  },
  {
    id: "4",
    title: "Data Structures and Algorithms",
    topic: "Computer Science",
    thermsCount: 30,
    description: "Master essential data structures and algorithms. Improve your problem-solving skills and prepare for technical interviews with this comprehensive course.",
    author: "Bob Wilson"
  },
  {
    id: "5",
    title: "Machine Learning Fundamentals",
    topic: "AI",
    thermsCount: 25,
    description: "Get started with machine learning. Learn about supervised and unsupervised learning, neural networks, and practical applications of ML in various industries.",
    author: "Eva Brown"
  },
  {
    id: "6",
    title: "Full Stack Web Development",
    topic: "Web Development",
    thermsCount: 40,
    description: "Become a full stack developer. Learn both front-end and back-end technologies, including HTML, CSS, JavaScript, Node.js, and databases.",
    author: "Chris Green"
  },
]

export default function Page() {
  return (
    <main className="container py-8 space-y-12">
      <CourseCarousel title="Latest" courses={DUMMY_COURSES} />
      <CourseCarousel title="Popular" courses={DUMMY_COURSES} />
    </main>
  )
}

