import { getUserAnalytics, getUserCertificates, getUserCourses, getUserCreatedCourses } from "@/lib/courses/actions";
import UserProfile from "@/components/workspace/profile";
import { getUser } from "@/utils/supabase/server";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default async function Page() {
  const currentUser = await getUser();
  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  const user = {
    id: currentUser.id,
    username: currentUser.user_metadata?.displayName || currentUser.email?.split("@")[0] || "Unknown",
    email: currentUser.email || "Unknown Email",
    avatar_url: currentUser.user_metadata?.avatar_url || "/placeholder.svg",
    full_name: currentUser.user_metadata?.full_name,
    total_points: 0,
  };

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Helsinki";

  const createdCourses = await getUserCreatedCourses(0, 10000);
  const studyingCourses = await getUserCourses(0, 10000);
  const analyticsData = await getUserAnalytics(currentUser.id, userTimeZone);
  const certificates = await getUserCertificates(currentUser.id);

  return (
    <Suspense fallback={<LoadingSpinner className="mx-auto" />}>
      <UserProfile
        user={user}
        createdCourses={createdCourses}
        studyingCourses={studyingCourses}
        analyticsData={analyticsData}
        certificates={certificates}
      />
    </Suspense>
  );
}