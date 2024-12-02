import { problems } from "@/lib/problems";

import Image from "next/image";

export default function InfoTable() {
    return (
        <div className="space-y-24 mb-14">
            <div className="text-right mb-8">
                <h2 className="text-5xl font-bold mb-4 text-[--neutral]">
                    Problems We Solve <br /> To Make You Happier
                </h2>
            </div>

            <div className="space-y-8">
                {problems.map((problem, index) => (
                    <div
                        key={problem.id}
                        className={`flex flex-col ${
                            index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                        }`}
                    >
                        <div
                            className={`w-full md:w-1/2 ${
                                index % 2 === 0 ? "md:pr-8" : "md:pl-8"
                            }`}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-6xl font-bold text-[#FF6B6B]">
                                    {String(problem.id).padStart(2, "0")}
                                </span>
                                <h3 className="text-2xl font-bold text-[--neutral]">
                                    {problem.title}
                                </h3>
                            </div>

                            <div>
                                <div className="flex items-start gap-4">
                                    <div>
                                        <Image
                                            src={problem.imageUrl}
                                            alt={problem.title}
                                            width={350}
                                            height={350}
                                        />
                                    </div>
                                    <p className="text-lg text-[--neutral]">
                                        {problem.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
