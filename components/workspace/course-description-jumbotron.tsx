import React from "react";
import { Button } from "../ui/button";
import Skeleton from "react-loading-skeleton";


interface CourseDescriptionJumpotronProps {
    title?: string;
    description?: string;
    onLearnMore: () => void;
    onEnrollNow: () => void;
}

const CourseDescriptionJumpotron: React.FC<CourseDescriptionJumpotronProps> = ({ title, description, onLearnMore, onEnrollNow }) => {
    return (
        <section className="w-full bg-zinc-100 h-[40vh] flex flex-col justify-center items-center gap-7">
            <h1 className="text-5xl font-bold">{title || <Skeleton count={1}/>}</h1>
            <p className="text-xl max-w-[70%] text-center">
          {description || <Skeleton count={3} />}
            </p>
            <div className="flex gap-2">
                <Button variant="classic" onClick={onLearnMore}>Learn more</Button>
                <Button variant="classic_filled" onClick={onEnrollNow}>Enroll Now</Button>
            </div>
        </section>
    );
};

export default CourseDescriptionJumpotron;
