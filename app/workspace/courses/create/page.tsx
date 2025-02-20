import CreateCourseForm from "@/components/workspace/courses/create-course-form";

export default function CreateCoursePage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Create a New Course</h1>
      <CreateCourseForm />
    </div>
  );
}
