import { Jumbotron } from "@/components/jumbotron";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MetricsShowcase } from "@/components/metrics-showcase";

export default function Home() {
  const metrics = [
    {
      value: "5k+",
      label: "Students total",
    },
    {
      value: "1.6k+",
      label: "Created courses",
    },
    {
      value: "9.3",
      label: "Satisfaction rate",
      hasStar: true,
    },
  ];
  return (
    <div className="bg-[--background]">
      <Jumbotron
        title="Unlock Your Potential: Learn New Skills, Shape Your Future"
        description="Discover a unique approach to learning that fits your lifestyle. Our courses are designed to help you grow, succeed, and reach new heights in your career."
        primaryButtonText="Get Started"
        primaryButtonLink="/login"
        secondaryButtonText="Learn More"
        secondaryButtonLink="/about"
      />

      <MetricsShowcase
        title="Our numbers tell more about us"
        metrics={metrics}
      />

      <div className="flex flex-col items-center mt-10 justify-center">
        <Link href="/courses">
          <Button>Courses (To Check DB Connection)</Button>
        </Link>
      </div>
    </div>
  );
}
