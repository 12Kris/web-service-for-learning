import { redirect } from 'next/navigation';
import { getModulesByCourseId } from '@/lib/courses/actions';

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ModulesPage({ params }: PageProps) {
  const { id } = await params;
  
  const modules = await getModulesByCourseId(Number(id));
  
  if (modules.length > 0) {
    const firstModuleId = modules[0].id;
    redirect(`/workspace/courses/${id}/modules/${firstModuleId}`);
  } else {
    return ("No modules found for this course.");
  }
  
  return null;
}