import { Jumbotron } from "@/components/jumbotron";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="">
      <Jumbotron title="Welcome to Our Amazing App" description="Discover the power of innovation and creativity" buttonText="Get Started" buttonLink="/login" />
      <div className="flex flex-col items-center mt-10 justify-center">
        <Link href="/courses">
          <Button>Courses (To Check DB Connection)</Button>
        </Link>
      </div>
    </div>
  );
}
