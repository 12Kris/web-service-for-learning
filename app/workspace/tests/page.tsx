import { getTests } from "@/lib/courses/actions";
import Link from "next/link";

export default async function Page() {
    const tests = await getTests();

    return (
        <main className="container mx-auto py-8 space-y-12">
            <h1 className="text-2xl font-bold">All Tests</h1>
            <ul>
                {tests.map((test) => (
                    <li key={test.id} className="mb-4">
                        <h2 className="text-xl font-semibold">
                            <Link href={`tests/${test.id}`}>{test.question}</Link>
                        </h2>
                        <p className="text-gray-600">
                            Course: {test.Block?.Course?.name || "No course"}
                        </p>
                    </li>
                ))}
            </ul>
        </main>
    );
}
