import { getCourses } from "@/lib/courses/actions";
import PageClient from "@/app/workspace/PageClient";

export default async function Page() {
    const courses = await getCourses();
    return (
        <PageClient courses={courses} />
    );
}
