import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CardProps {
  title: string;
  description: string;
  image: string;
  backgroundColor: string;
  textColor?: string;
  variant: "top" | "bottom";
  imagePosition: "top" | "bottom";
  arrowPosition: "top-left" | "bottom-left";
}

export function Card({
  title,
  description,
  image,
  backgroundColor,
  textColor = "white",
  variant,
  imagePosition,
  arrowPosition,
}: CardProps) {
  return (
    <div
      className="w-full max-w-md md:max-w-lg lg:w-96 aspect-[1.6] rounded-[2rem] p-4 md:p-8 overflow-hidden relative"
      style={{ backgroundColor }}
    >
      <div
        className={`absolute ${
          arrowPosition === "top-left" ? "top-4 md:top-8" : "bottom-4 md:bottom-8"
        } left-8 size-10 rounded-full bg-white p-2.5 flex items-center justify-center z-10`}
      >
        <Link href={`/login`}>
          <ArrowUpRight
            className="size-5"
            style={{ color: backgroundColor }}
            strokeWidth={3}
          />
        </Link>
      </div>

      <div
        className={`absolute ${
          imagePosition === "top" ? "top-4 md:top-8 right-4 md:right-8" : "bottom-4 md:bottom-8 right-4 md:right-8"
        }`}
      >
        <Image
          src={image}
          alt={`${title} illustration`}
          width={96}
          height={96}
          className="size-24"
        />
      </div>

      <div
        className={`absolute ${
          variant === "bottom" ? "bottom-4 md:bottom-8 left-4 md:left-8" : "top-4 md:top-8 left-4 md:left-8"
        } max-w-[60%]`}
      >
        <h1
          className="font-mono text-2xl md:text-3xl font-bold mb-2 whitespace-normal break-words"
          style={{ color: textColor }}
        >
          {title}
        </h1>
        <p
          className="font-mono text-base opacity-80 whitespace-normal break-words"
          style={{ color: textColor }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
