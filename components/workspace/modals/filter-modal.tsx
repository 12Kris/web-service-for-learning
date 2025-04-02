"use client";

import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import type { Course } from "@/lib/types/course";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onFilter: (filteredCourses: Course[], activeTypes: string[]) => void; // Оновлюємо сигнатуру
}

export function FilterModal({ isOpen, onClose, courses, onFilter }: FilterModalProps) {
  const [searchText, setSearchText] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<Record<string, boolean>>({});

  const uniqueTypes = Array.from(
    new Set(courses.map((course) => course.type || "Uncategorized").map((type) => type.toLowerCase())),
  ).map((type) => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1),
  }));

  useEffect(() => {
    const initialSelectedTypes: Record<string, boolean> = {};
    uniqueTypes.forEach((type) => {
      initialSelectedTypes[type.value] = false;
    });
    setSelectedTypes(initialSelectedTypes);
  }, [courses]);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const applyFilters = () => {
    let filteredCourses = [...courses];

    // Filter by search text
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filteredCourses = filteredCourses.filter(
        (course) =>
          course.name.toLowerCase().includes(searchLower) ||
          (course.type && course.type.toLowerCase().includes(searchLower)),
      );
    }

    // Filter by selected types
    const activeTypes = Object.entries(selectedTypes)
      .filter(([, isSelected]) => isSelected)
      .map(([type]) => type);

    if (activeTypes.length > 0) {
      filteredCourses = filteredCourses.filter((course) =>
        activeTypes.includes((course.type || "Uncategorized").toLowerCase()),
      );
    }

    // Передаємо відфільтровані курси та обрані типи
    onFilter(filteredCourses, activeTypes);
    onClose();
  };

  const resetFilters = () => {
    setSearchText("");
    const resetTypes: Record<string, boolean> = {};
    uniqueTypes.forEach((type) => {
      resetTypes[type.value] = false;
    });
    setSelectedTypes(resetTypes);
    onFilter(courses, []); // Скидаємо фільтри, передаємо всі курси і порожній масив типів
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Filter Courses</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by course name or type"
                className="pl-8"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Course Types</Label>
            <div className="max-h-[200px] overflow-y-auto space-y-2 border rounded-md p-3">
              {uniqueTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type.value}`}
                    checked={selectedTypes[type.value]}
                    onCheckedChange={() => handleTypeToggle(type.value)}
                  />
                  <Label htmlFor={`type-${type.value}`} className="cursor-pointer">
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AlertDialogFooter className="flex justify-between">
          <AlertDialogAction onClick={applyFilters}>Apply Filters</AlertDialogAction>
          <Button className="bg-red-200 text-red-600 hover:bg-red-300 border-red-600" onClick={resetFilters}>
            Reset
          </Button>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}