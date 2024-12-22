"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createCourse } from "@/lib/courses/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { mockCards, mockTests } from "@/app/workspace/mock_data/mock_data";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function CreateCourseForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [cards, setCards] = useState([]);
  const [tests, setTests] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const newCourse = await createCourse({ name, description, type });
      if (newCourse) {
        router.push(`/workspace/course/${newCourse.id}`);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create New Course</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Course Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Course Type</Label>
            <Input
              id="type"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cards">Select cards</Label>
            <Input
              id="cards"
              type="select"
              value={cards}
              options={mockCards}
              onChange={(e) => setCards(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tests">Select tests</Label>
            <Input
              id="tests"
              type="select"
              value={tests}
              options={mockTests}
              onChange={(e) => setTests(e.target.value)}
            />
            <div>
              <Link
                href="/workspace/tests/add"
                key="add-tests"
                className={cn("w-full font-semibold text-lg")}
              >
                <Button className="px-1">
                  Add tests
                </Button>
              </Link>
              <Link
                href="/workspace/tests/edit"
                key="edit-tests"
                className={cn("w-full font-semibold text-lg")}
              >
                <Button type="button" className="px-1">
                  Edit tests
                </Button>
              </Link>
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" className="w-full">
            Create Course
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
