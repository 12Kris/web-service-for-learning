"use client";
import { useEffect, useState } from "react";
import { getTestById, deleteTest } from "@/lib/tests/actions";
import Link from "next/link";

export default function TestsPage() {
    const [tests, setTests] = useState([]);

    useEffect(() => {
        // Fetch tests here
        getTestById(1).then((data) => setTests([data]));

    }, []);

    const handleDelete = async (id: number) => {
        await deleteTest(id);
        setTests(tests.filter((test) => test.id !== id));

    };

    return (
        <div>
            <h1>Тесты</h1>
            <ul>
                {tests.map((test) => (
                    <li key={test.id}>
                        {test.question}
                        <Link href={`/workspace/manage/tests/${test.id}`}>Edit</Link>
                        <button onClick={() => handleDelete(test.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
