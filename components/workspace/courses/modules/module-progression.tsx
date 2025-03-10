import { Module } from "@/lib/types/modules";
import Link from "next/link"; // added import

interface ModuleProgressionProps {
  modules: Module[]
  currentModuleId: number
  courseId: number // added prop
}

export function ModuleProgression({ modules, currentModuleId, courseId }: ModuleProgressionProps) {
  // Ensure the currentModuleId is an integer.
  const currentModuleIdInt = Math.floor(currentModuleId);
  
  return (
    <div className="relative flex justify-between items-center mb-16">
      {/* Connecting Lines */}
      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[--accent-light] -translate-y-1/2" />
      
      {/* Modules */}
      {modules.map((module) => {
        // Convert module.id to an integer for comparison.               ${module.isCompleted ? 'text-white bg-[--accent] border-[--accent]' : 'bg-[--background]'}

        const moduleIdInt = Math.floor(module.id);
        const isActive = moduleIdInt === currentModuleIdInt;
        return (
          <Link key={module.id} href={`/workspace/courses/${courseId}/modules/${module.id}`}>
            <div className="relative z-10 cursor-pointer">
              <div 
                className={`px-4 py-2 rounded-full font-bold border-2 hover:bg-[--accent] hover:text-white ${
                  isActive
                    ? 'text-[--accent] border-[--accent] bg-[--accent] text-white '
                    : 'text-[--accent] border-[--accent] bg-[--background]'
                }
                `}
              >
                {module.title}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  )
}

export default ModuleProgression