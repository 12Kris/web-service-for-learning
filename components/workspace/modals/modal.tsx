"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

type CardType = {
  title?: string
  front?: string
  back?: string
}

type QuestionType = {
  title?: string
  question?: string
  id?: number
  answers?: {
    id: number | string
    text: string
    correct: boolean | number
  }[]
}

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { title?: string; front?: string; back?: string; question?: string; answers?: 
    { id: string | number; text: string; correct: number | boolean; }[]
}) => void
  type: "question" | "card"
  initialData?: (CardType & QuestionType) | null
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, type, initialData }) => {
  const [title] = useState(initialData?.question || "")
  const [front, setFront] = useState(initialData?.front || "")
  const [back, setBack] = useState(initialData?.back || "")
  const [question, setQuestion] = useState(initialData?.question || "")
  const [answers, setAnswers] = useState<{ id: number | string; text: string; correct: boolean | number }[]>(
    initialData?.answers || [
      { id: 1, text: "", correct: false },
      { id: 2, text: "", correct: false },
    ],
  )

  useEffect(() => {
    setFront(initialData?.front || "")
    setBack(initialData?.back || "")
    setQuestion(initialData?.question || "")

    if (initialData?.answers && Array.isArray(initialData.answers)) {
      setAnswers(initialData.answers)
    } else {
      setAnswers([
        { id: 1, text: "", correct: false },
        { id: 2, text: "", correct: false },
      ])
    }
  }, [initialData])

  const handleAnswerChange = (id: number | string, text: string) => {
    setAnswers((prev) => prev.map((answer) => (answer.id === id ? { ...answer, text } : answer)))
  }

  const handleCorrectAnswerChange = (id: number | string) => {
    setAnswers((prev) => prev.map((answer) => ({ ...answer, correct: answer.id === id })))
  }

  const handleAddAnswer = () => {
    const newId = answers.length > 0 ? Math.max(...answers.map((a) => (typeof a.id === "number" ? a.id : 0))) + 1 : 1
    setAnswers([...answers, { id: newId, text: "", correct: false }])
  }

  const handleRemoveAnswer = (id: number | string) => {
    if (answers.length <= 2) {
      return
    }
    setAnswers(answers.filter((answer) => answer.id !== id))
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{type === "question" ? "Edit Question" : "Edit Card"}</AlertDialogTitle>
          <AlertDialogDescription>
            {type === "question" ? "Edit the question details and answers." : "Edit the card content."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 max-h-[60vh] overflow-y-auto">
          {type === "question" ? (
            <div className="space-y-4">
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

              <div className="space-y-2">
                <label className="font-medium">Answers:</label>
                {answers.map((answer) => (
                  <div key={answer.id} className="flex items-center gap-2 my-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={Boolean(answer.correct)}
                      onChange={() => handleCorrectAnswerChange(answer.id)}
                      className="mr-2"
                    />
                    <input
                      type="text"
                      value={answer.text}
                      onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
                      placeholder="Enter answer"
                      className="flex-1 p-2 border rounded-lg bg-[--card]"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleRemoveAnswer(answer.id)}
                      className="h-8 w-8 p-0 flex items-center justify-center"
                    >
                      -
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={handleAddAnswer} className="mt-2">
                  Add Answer
                </Button>
              </div>
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
          <AlertDialogAction
            onClick={() =>
              onSave({
                title,
                front,
                back,
                question,
                answers: type === "question" ? answers : undefined,
              })
            }
          >
            Save
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default Modal

