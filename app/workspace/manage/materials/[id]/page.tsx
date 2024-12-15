"use client";
import { useEffect, useState } from "react";
import { getMaterialById, updateMaterial } from "@/lib/tests/actions";
import { useRouter, useParams } from "next/navigation";

export default function EditMaterialPage() {
    const [material, setMaterial] = useState({ title: "", content: "" });
    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        getMaterialById(Number(params.id)).then(setMaterial);
    }, [params.id]);

    const handleSave = async () => {
        await updateMaterial(Number(params.id), material);
        router.push("/manage/materials");
    };

    return (
        <div>
            <h1>Редактирование материала</h1>
            <input
                type="text"
                value={material.title}
                onChange={(e) => setMaterial({ ...material, title: e.target.value })}
                placeholder="Title"
            />
            <textarea
                value={material.content}
                onChange={(e) => setMaterial({ ...material, content: e.target.value })}
                placeholder="Content"
            />
            <button onClick={handleSave}>Save</button>
        </div>
    );
}
