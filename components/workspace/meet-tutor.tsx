import React from "react";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";

interface MeetTutorProps {
  name?: string;
  description?: string;
  imageUrl?: string;
}

const MeetTutor: React.FC<MeetTutorProps> = ({
  name = "John Doe",
  description = "John Doe is a seasoned web developer with over 10 years of experience in the industry. He has worked with startups and Fortune 500 companies, bringing a wealth of real-world knowledge to the course.",
  imageUrl = "/placeholder.svg",
}) => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold">
            {name ? "Meet your tutor" : <Skeleton />}
          </h2>
          <p className="text-lg leading-relaxed max-w-xl">
            {description || <Skeleton count={3} />}
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <div className="relative w-72 h-72">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`Portrait of ${name}`}
                fill
                className="rounded-full object-cover "
                priority
              />
            ) : (
              <div className="w-full h-full rounded-full bg-zinc-100" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetTutor;
