"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBlock } from "@/lib/tests/actions";
import { getCourses } from "@/lib/courses/actions";

export default function NewBlockPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        course_id: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createBlock({
                name: formData.name,
                course_id: formData.course_id
            });
            router.push("/workspace/manage/blocks");
        } catch (error) {
            console.error("Error creating block:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Create New Block</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ display: "block", margin: "10px 0" }}
                    />
                </label>
                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Block"}
                </button>
            </form>
        </div>
    );
}
