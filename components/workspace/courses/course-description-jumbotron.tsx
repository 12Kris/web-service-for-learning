import React from "react";
import { Button } from "../../ui/button";
import Skeleton from "react-loading-skeleton";
import { UserPlus, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import {
  addCourseToUser,
  isCourseAddedToUser,
  removeCourseFromUser,
} from "@/lib/courses/actions";
import Link from "next/link";
import {SpacedRepetitionModal} from "@/components/workspace/modals/spaced-repetition";

interface CourseDescriptionJumbotronProps {
  title?: string;
  description?: string;
  type?: string;
  id: number;
  onLearnMore?: () => void;
}

const CourseDescriptionJumbotron: React.FC<CourseDescriptionJumbotronProps> = ({
  title,
  description,
  type,
  id,
}) => {
  const [isCourseAdded, setIsCourseAdded] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      try {
        const result = await isCourseAddedToUser(id);
        setIsCourseAdded(result);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [id]);

  async function handleAddCourse(id: number) {
    if (!id) return;
    await addCourseToUser(id);
    setIsCourseAdded(true);
  }
  async function handleRemoveCourse(id: number) {
    if (!id) return;
    await removeCourseFromUser(id);
    setIsCourseAdded(false);
  }

  return (
    <section className="w-full bg-[--primary-light] border mb-2 rounded-xl h-[40vh] flex flex-col justify-center items-center gap-7 p-4">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-5xl font-bold text-center">
          {title || (
            <Skeleton
              baseColor="#e2e8f0"
              highlightColor="white"
              width={300}
              count={1}
            />
          )}
        </h1>
        {type && (
          <p className="text-sm md:text-base px-3 py-1 bg-[#d5e2de] text-slate-700 rounded-full whitespace-nowrap">
            {type}
          </p>
        )}
        {!type && (
          <Skeleton
            baseColor="#e2e8f0"
            highlightColor="white"
            width={100}
            count={1}
          />
        )}
      </div>

      <p className="text-xl max-w-[70%] text-center">
        {description || (
          <Skeleton
            baseColor="#e2e8f0"
            highlightColor="white"
            width={300}
            count={3}
          />
        )}
      </p>

      {isCourseAdded === null && (
        <Skeleton
          baseColor="#a2d5c6"
          highlightColor="#d8f8e3"
          width={300}
          height={32}
          count={1}
        />
      )}
    {
      isCourseAdded !== null && (
      <div className="flex gap-2">
        {
          isCourseAdded && <Button variant={"solid"}>
            <Link href={`/workspace/courses/${id}/modules`}>
              Go to modules
            </Link>
          </Button>
        }
        <Button
          variant={isCourseAdded ? "destructive" : "solid"}
          onClick={() =>
            isCourseAdded ? handleRemoveCourse(id) : handleAddCourse(id)
          }
        >
          {isCourseAdded ? (
            <>
              <UserCheck /> Subscribed
            </>
          ) : (
            (
              <>
                <UserPlus /> Subscribe
              </>
            ) || (
              <Skeleton
                baseColor="#e2e8f0"
                highlightColor="white"
                width={300}
                count={1}
              />
            )
          )}
        </Button>
        {isCourseAdded && (
            <Button variant="outline" onClick={() => setIsModalOpen(true)}>
              Edit Spaced Repetition
            </Button>
        )}
      </div>
      )}
      {isModalOpen && <SpacedRepetitionModal courseId={id} onClose={() => setIsModalOpen(false)} />}
    </section>
  );
};

export default CourseDescriptionJumbotron;