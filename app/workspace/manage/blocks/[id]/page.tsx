"use client";
import { useEffect, useState } from "react";
import { getBlockById, updateBlock } from "@/lib/tests/actions";
import { useRouter, useParams } from "next/navigation";

export default function EditBlockPage() {
    const [block, setBlock] = useState({ name: ""});
    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        getBlockById(Number(params.id)).then(setBlock);
    }, [params.id]);

    const handleSave = async () => {
        await updateBlock(Number(params.id), block);
        router.push("/workspace/manage/blocks");
    };

    return (
        <div>
            <h1>Edit block</h1>
            <input
                type="text"
                value={block.name}
                onChange={(e) => setBlock({ ...block, name: e.target.value })}
                placeholder="Block name"
            />
            <button onClick={handleSave}>Save</button>
        </div>
    );
}
