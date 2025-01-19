import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface JumbotronProps {
  title: string
  description: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText: string
  secondaryButtonLink: string
}

export function Jumbotron({
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
}: JumbotronProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between py-20 px-4 ">
      <div className="text-center gap-5 flex flex-col md:text-left md:w-1/2">
        <h1 className="text-5xl font-bold mb-4 text-[--neutral]">{title}</h1>
        <p className="text-lg mb-6 text-[--neutral]">{description}</p>
        <div className="flex justify-center md:justify-start gap-4">
          <Button className="text-[--neutral] bg-transparent hover:text-[--neutral-foreground] px-6 py-2  border-2 border-[--neutral] border-solid rounded-full" asChild size="lg">
            <Link href={primaryButtonLink}>{primaryButtonText}</Link>
          </Button>
          <Button className="text-white border-2 border-[--accent] bg-[--accent] px-6 py-2 hover:text-white hover:bg-[--accent-foreground]/80 shadow-none rounded-full" asChild variant="outline" size="lg">
            <Link href={secondaryButtonLink}>{secondaryButtonText}</Link>
          </Button>
        </div>
      </div>
      <div className="mt-8 md:mt-0 md:w-1/2">
        <Image
          src="/images/2-people.png"
          alt="Illustration of learning and growth"
          width={400}
          height={400}
          className="mx-auto"
          
        />
      </div>
    </div>
  )
}

