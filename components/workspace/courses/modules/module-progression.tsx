import {  Module } from "@/lib/types/modules";

interface ModuleProgressionProps {
  modules: Module[]
}

export function ModuleProgression({ modules }: ModuleProgressionProps) {
  return (
    <div className="relative flex justify-between items-center max-w-3xl  mb-16">
      {/* Connecting Lines */}
      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[--accent-light] -translate-y-1/2" />
      
      {/* Modules */}
      {modules.map((module) => (
        <div key={module.id} className="relative z-10">
          <div 
            className={`px-4 py-2 rounded-full   font-bold border-2  ${
              module.isActive 
                ? 'text-[--accent]  border-[--accent]' 
                : 'text-[--text-light]  border-[--text-light]'
            
            }
            ${module.isCompleted ? 'text-white bg-[--accent] border-[--accent]' : 'bg-[--background]'}

            `}
          >
            {module.title}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ModuleProgression