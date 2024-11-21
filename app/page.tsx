import { Jumbotron } from "@/components/jumbotron";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="bg-[--background]">
      <Jumbotron title="Unlock Your Potential: Learn New Skills, Shape Your Future" description="Discover a unique approach to learning that fits your lifestyle. Our courses are designed to help you grow, succeed, and reach new heights in your career."
       primaryButtonText="Get Started" primaryButtonLink="/login" secondaryButtonText="Learn More" secondaryButtonLink="/about" />
      <div className="flex flex-col items-center mt-10 justify-center">
        <Link href="/courses">
          <Button>Courses (To Check DB Connection)</Button>
        </Link>
      </div>
    </div>
  );
}
