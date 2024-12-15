"use client";
import { useEffect, useState } from "react";
import { getTestById, updateTest } from "@/lib/tests/actions";
import { useRouter, useParams } from "next/navigation";

export default function EditTestPage() {
    const [test, setTest] = useState({ question: "" });
    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        getTestById(Number(params.id)).then(setTest);
    }, [params.id]);

    const handleSave = async () => {
        await updateTest(Number(params.id), test);
        router.push("/manage/tests");
    };

    return (
        <div>
            <h1>Редактирование теста</h1>
            <input
                type="text"
                value={test.question}
                onChange={(e) => setTest({ ...test, question: e.target.value })}
                placeholder="Вопрос теста"
            />
            <button onClick={handleSave}>Save</button>
        </div>
    );
}
