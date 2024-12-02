"use client"

import * as React from "react"
import { Menu, Plus, Search, Filter, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

interface NavbarProps {
  onSearch?: (term: string) => void
  onFilter?: () => void
  onAdd?: () => void
}

export function Navbar({ onSearch, onFilter, onAdd }: NavbarProps) {
  // const [isSearching, setIsSearching] = React.useState(false)
  const pathname = usePathname()
  const showAddButton = pathname === "/workspace"


  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[80%] sm:w-[385px]">
              <nav className="flex flex-col gap-4">
                {/* Add your mobile menu items here */}
                <Button variant="ghost" className="w-full justify-start">
                  Dashboard
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Projects
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Settings
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
          {showAddButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onAdd}
              className="shrink-0 ml-4 bg-[--neutral] hover:bg-[--neutral]/80 hover:text-white text-white"
            >
              <Plus className="h-5 w-5" />
              <span className="sr-only">Add new</span>
            </Button>
          )}
        </div>

        <div className="flex flex-1 items-center gap-4 px-2 md:px-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onFilter}
            className="hidden sm:flex"
          >
            <Filter className="mr-2 h-4 w-4" />
            filter
          </Button>
          <Link href="/workspace/profile">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            // onClick={onUserMenu}
          >
            <User className="h-5 w-5" />
            <span className="sr-only">User menu</span>
          </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

