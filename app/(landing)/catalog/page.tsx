import Image from "next/image";
import Link from "next/link";

const courses = [
    { id: 1, title: "Programming Basics", description: "Learn fundamental programming concepts.", image: "/images/catalog/programming_v1.png" },
    { id: 2, title: "Machine Learning", description: "Master the basics of machine learning.", image: "/images/catalog/machine-learning_v2.jpg" },
    { id: 3, title: "Algorithms & Data Structures", description: "Deep dive into algorithms.", image: "/images/catalog/data_structure_and_algorithms.png" }
];

export default function Catalog() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Course Catalog</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
            <Image src={course.image} width={500} height={300} alt={course.title}></Image>
            <div className="p-4">
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-gray-600 mt-2">{course.description}</p>
              <Link href={`/workspace`}>
                <span className="block mt-4 text-blue-600 hover:underline">Learn More</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}