"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { MenuItems } from "@/lib/definitions";
import * as Icons from "lucide-react";
type IconNames = keyof typeof Icons; 

  
function DynamicIcon({ name }: { name: IconNames }) {
  const IconComponent = Icons[name] as React.ElementType;
  if (!IconComponent) {
    console.warn(`Icon "${name}" does not exist in lucide-react.`);
    return null;
  }
  return <IconComponent className="h-5 w-5" />;
}

export function DesktopMenu({ menuItems }: { menuItems: MenuItems[] }) {
  const pathname = usePathname();
  return (
    <div className="hidden lg:flex sticky top-0 flex-col h-screen w-64 bg-background border-r">
      <div className="p-6">
        <Link href="/workspace" className="flex items-center space-x-2">
          <span className="text-2xl text-[--neutral] font-black">Memoria</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-bold",
                "hover:bg-black/10 ",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-ring",
                isActive && "bg-[--neutral] text-white hover:bg-[--neutral]/90"
              )}
            >
              <DynamicIcon name={item.icon as IconNames} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
