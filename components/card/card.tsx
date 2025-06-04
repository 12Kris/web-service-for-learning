"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface FlashcardProps {
  frontContent: string;
  backContent: string;
  isFlipped: boolean;
  onClick: () => void;
  className?: string;
}

export default function Flashcard({
  frontContent,
  backContent,
  isFlipped,
  onClick,
  className = "",
}: FlashcardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClick]);

  return (
    <div
      className={`w-full max-w-md mx-auto aspect-[4/3]  ${className} select-none`}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="w-full h-full relative cursor-pointer focus:outline-none  rounded-3xl"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{
          rotateY: isFlipped ? 180 : 0,
          scale: isPressed ? 0.95 : isHovered ? 1.02 : 1,
        }}
        transition={{
          rotateY: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
          scale: { duration: 0.2, ease: "easeOut" },
        }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        tabIndex={0}
        role="button"
        aria-label={`Flashcard: ${
          isFlipped ? "showing back" : "showing front"
        }. Press to flip.`}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          initial={false}
          animate={{
            rotateY: 0,
          }}
        >
          <Card className="w-full h-full bg-gradient-to-br bg-white border border-blue-200 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="flex flex-col items-center justify-center h-full p-8 relative">
              <div className="text-center space-y-4">
                <p className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed">
                  {frontContent}
                </p>
                <div className="text-sm text-gray-500 font-medium">
                  TAP TO REVEAL
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          initial={false}
          animate={{
            rotateY: 180,
          }}
        >
          <Card className="w-full h-full bg-gradient-to-br bg-white border border-emerald-200 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="flex flex-col items-center justify-center h-full p-8 relative">
              <div className="text-center space-y-4">
                <p className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed">
                  {backContent}
                </p>
                <div className="text-sm text-gray-500 font-medium">
                  TAP TO FLIP BACK
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-black opacity-1 rounded-3xl -z-10"
          style={{
            filter: "blur(30px)",
            transform: "translateY(10px) scale(0.95)",
          }}
          animate={{
            opacity: isHovered ? 0.15 : 0.1,
            transform: isHovered
              ? "translateY(15px) scale(0.98)"
              : "translateY(10px) scale(0.95)",
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </div>
  );
}
