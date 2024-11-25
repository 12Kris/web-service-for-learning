'use client';

import { useEffect, useState } from 'react';
import { getUserAndCourses } from './server-actions';
import { useRouter } from 'next/navigation';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { user, courses, error } = await getUserAndCourses(userId);
      if (error) {
        setError(error);
      } else {
        setUser(user);
        setCourses(courses);
      }
    };

    fetchData();
  }, [userId]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!user || courses.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <h2>Your Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <button onClick={() => router.push(`/courses/${course.id}`)}>
              {course.title}
            </button>
          </li>
        ))}
      </ul>
      <div>
        <button onClick={() => router.push('/courses')}>
          View All Courses
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
