'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllCourses } from '../server-actions/server-actions';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { courses, error } = await getAllCourses();
      if (error) {
        setError(error);
      } else {
        setCourses(courses);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (courses.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>All Courses</h1>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <button onClick={() => router.push(`/courses/${course.id}`)}>
              {course.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoursesPage;