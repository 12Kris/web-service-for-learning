import React from "react";
import { Button } from "../ui/button";
import Skeleton from "react-loading-skeleton";

interface CourseDescriptionJumbotronProps {
  title?: string;
  description?: string;
  type?: string;
  onLearnMore: () => void;
  onEnrollNow: () => void;
}

const CourseDescriptionJumbotron: React.FC<CourseDescriptionJumbotronProps> = ({
  title,
  description,
  type,
  onLearnMore,
  onEnrollNow,
}) => {
  return (
    <section className="w-full bg-slate-200 rounded-xl h-[40vh] flex flex-col justify-center items-center gap-7 p-4">
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
          <p className="text-sm md:text-base px-3 py-1 bg-slate-300 text-slate-700 rounded-full whitespace-nowrap">
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

      <div className="flex gap-2">
        <Button variant="classic" onClick={onLearnMore}>
          Learn more
        </Button>
        <Button variant="classic_filled" onClick={onEnrollNow}>
          Enroll Now
        </Button>
      </div>
    </section>
  );
};

export default CourseDescriptionJumbotron;