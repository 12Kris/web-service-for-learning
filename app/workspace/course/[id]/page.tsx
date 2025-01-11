"use client";

import { CourseCard } from "@/components/course-card/course-card";

export default function FlashcardPage() {
    return (
        <div className="flex flex-wrap gap-4">
            <CourseCard
                title="Module title"
                topic="Topic"
                thermsCount={10}
                description="Course description"
                author="Author"
                onLike={() => console.log("Liked")}
            />
            <CourseCard
                title="Module title"
                topic="Topic"
                thermsCount={10}
                description="Course description"
                author="Author"
                onLike={() => console.log("Liked")}
            />
            <CourseCard
                title="Module title"
                topic="Topic"
                thermsCount={10}
                description="Course description"
                author="Author"
                onLike={() => console.log("Liked")}
            />
            <CourseCard
                title="Module title"
                topic="Topic"
                thermsCount={10}
                description="Course description"
                author="Author"
                onLike={() => console.log("Liked")}
            />
            <CourseCard
                title="Module title"
                topic="Topic"
                thermsCount={10}
                description="Course description"
                author="Author"
                onLike={() => console.log("Liked")}
            />
            <CourseCard
                title="Module title"
                topic="Topic"
                thermsCount={10}
                description="Course description"
                author="Author"
                onLike={() => console.log("Liked")}
            />
            <CourseCard
                title="Module title"
                topic="Topic"
                thermsCount={10}
                description="Course description"
                author="Author"
                onLike={() => console.log("Liked")}
            />
        </div>
    );
}