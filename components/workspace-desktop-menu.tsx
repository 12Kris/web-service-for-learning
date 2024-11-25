import Link from 'next/link'
import { Home, Book, Bookmark, Settings, HelpCircle } from 'lucide-react'
import { cn } from "@/lib/utils"

const menuItems = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'Courses', icon: Book, href: '/workspace' },
  { name: 'Bookmarks', icon: Bookmark, href: '/bookmarks' },
  { name: 'Settings', icon: Settings, href: '/settings' },
  { name: 'Help', icon: HelpCircle, href: '/help' },
]

export function DesktopMenu() {
  return (
    <div className="hidden lg:flex flex-col h-screen w-64 bg-background border-r">
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2">
         
          <span className="text-2xl text-[--neutral] font-light">Memoria</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium",
              "hover:bg-accent hover:text-accent-foreground",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-ring"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

