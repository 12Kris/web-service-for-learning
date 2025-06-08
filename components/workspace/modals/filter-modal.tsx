"use client";

import { useState, useEffect, useMemo } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Course } from "@/lib/types/course";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onFilter: (filteredCourses: Course[], activeTypes: string[]) => void;
}

export function FilterModal({ isOpen, onClose, courses, onFilter }: FilterModalProps) {
  const [selectedTypes, setSelectedTypes] = useState<Record<string, boolean>>({});

  const uniqueTypes = useMemo(() => {
    return Array.from(
      new Set(courses.map((course) => course.type || "Uncategorized").map((type) => type.toLowerCase()))
    ).map((type) => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    }));
  }, [courses]);

  useEffect(() => {
    const initialSelectedTypes: Record<string, boolean> = {};
    uniqueTypes.forEach((type) => {
      initialSelectedTypes[type.value] = false;
    });
    setSelectedTypes(initialSelectedTypes);
  }, [uniqueTypes]);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const applyFilters = () => {
    let filteredCourses = [...courses];

    const activeTypes = Object.entries(selectedTypes)
      .filter(([, isSelected]) => isSelected)
      .map(([type]) => type);

    if (activeTypes.length > 0) {
      filteredCourses = filteredCourses.filter((course) =>
        activeTypes.includes((course.type || "Uncategorized").toLowerCase()),
      );
    }

    onFilter(filteredCourses, activeTypes);
    onClose();
  };

  const resetFilters = () => {
    const resetTypes: Record<string, boolean> = {};
    uniqueTypes.forEach((type) => {
      resetTypes[type.value] = false;
    });
    setSelectedTypes(resetTypes);
    onFilter(courses, []);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[425px] text-[--neutral]">
        <AlertDialogHeader>
          <AlertDialogTitle>Filter Courses</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-6 py-4">
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
          <Button className="rounded-full inline-flex font-bold items-center justify-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--neutral] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none text-[--accent] border-2 border-[--accent] hover:text-white hover:bg-[--accent] w-full sm:w-auto bg-white" onClick={resetFilters}>
            Reset
          </Button>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}