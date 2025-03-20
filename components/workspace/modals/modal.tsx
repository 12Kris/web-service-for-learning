import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React, {useEffect, useState} from "react";

type CardType = {
    title?: string
    front?: string;
    back?: string;
};

type QuestionType = {
    title?: string
    question?: string;
};

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { title?: string; front?: string; back?: string; question?: string }) => void;
    type: "question" | "card";
    initialData?: CardType & QuestionType | null;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, type, initialData }) => {
    const [title] = useState(initialData?.question || "");
    const [front, setFront] = useState(initialData?.front || "");
    const [back, setBack] = useState(initialData?.back || "");
    const [question, setQuestion] = useState(initialData?.question || "");

    useEffect(() => {
        setFront(initialData?.front || "");
        setBack(initialData?.back || "");
        setQuestion(initialData?.question || "");
    }, [initialData]);

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {type === "question" ? "Edit Question" : "Edit Card"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {type === "question"
                            ? "Edit the question details."
                            : "Edit the card content."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="my-4">
                    {type === "question" ? (
                        <div>
                            <label className="font-medium">Question:</label>
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Enter question"
                                className="w-full p-2 border rounded-lg bg-[--card] my-2"
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="font-medium">Front:</label>
                            <input
                                type="text"
                                value={front}
                                onChange={(e) => setFront(e.target.value)}
                                placeholder="Front side of the card"
                                className="w-full p-2 border rounded-lg bg-[--card] my-2"
                            />
                            <label className="font-medium">Back:</label>
                            <input
                                type="text"
                                value={back}
                                onChange={(e) => setBack(e.target.value)}
                                placeholder="Back side of the card"
                                className="w-full p-2 border rounded-lg bg-[--card] my-2"
                            />
                        </div>
                    )}
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onSave({ title, front, back, question })}>
                        Save
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default Modal;