"use client";
import { useEffect, useState } from "react";
import { getMaterialsByBlock, deleteMaterial } from "@/lib/tests/actions";
import Link from "next/link";

export default function MaterialsPage() {
    const [materials, setMaterials] = useState([]);

    useEffect(() => {
        getMaterialsByBlock(1).then(setMaterials);
    }, []);

    const handleDelete = async (id: number) => {
        await deleteMaterial(id);
        setMaterials(materials.filter((material) => material.id !== id));
    };

    return (
        <div>
            <h1>Материалы</h1>
            <ul>
                {materials.map((material) => (
                    <li key={material.id}>
                        {material.title}
                        <Link href={`/workspace/manage/materials/${material.id}`}>Edit</Link>
                        <button onClick={() => handleDelete(material.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}