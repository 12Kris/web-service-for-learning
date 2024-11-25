import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getCourse(courseId) {
  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();

  if (error) throw new Error(error.message);

  return course;
}

const CoursePage = async ({ params }) => {
  const { courseId } = params;

  try {
    const course = await getCourse(courseId);

    return (
      <div>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
      </div>
    );
  } catch (error) {
    return <p>Error loading course: {error.message}</p>;
  }
};

export default CoursePage;