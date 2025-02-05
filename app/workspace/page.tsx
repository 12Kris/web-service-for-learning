// import { getCourses } from "@/lib/courses/actions";
// import PageClient from "@/app/workspace/PageClient";

// export default async function Page() {
//   const courses = await getCourses();
//   return <PageClient courses={courses} />;
// }

import { PageHeader } from "@/components/ui/page-header";

export default async function HomePage() {
  return (
    <div>
      <PageHeader title="Home" />
    </div>
  );
}
