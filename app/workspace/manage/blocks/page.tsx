"use client";
import { useEffect, useState } from "react";
import { getBlocks, deleteBlock } from "@/lib/tests/actions";
import Link from "next/link";

export default function BlocksPage() {
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        getBlocks().then(setBlocks);
    }, []);

    const handleDelete = async (id: number) => {
        await deleteBlock(id);
        setBlocks(blocks.filter((block) => block.id !== id));
    };

    return (
        <div>
            <h1>Blocks</h1>
            <Link href={"/workspace/manage/blocks/new"}>Create new</Link>
            <ul>
                {blocks.map((block) => (
                    <li key={block.id}>
                        {block.name} | Course: {block.Course.name} | Type: {block.Course.type } |
                        <Link href={`/workspace/manage/blocks/${block.id}`}> Edit | </Link>
                        <button onClick={() => handleDelete(block.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
