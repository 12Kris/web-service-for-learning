"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Zap,
  Database,
  Cpu,
  Network,
  BookOpen,
  Target,
  Lightbulb,
} from "lucide-react";

interface AILoaderProps {
  isVisible: boolean;
  stage: "analyzing" | "processing" | "generating" | "finalizing";
}

const stages = {
  analyzing: {
    title: "Analyzing Your Request",
    description: "Understanding course requirements and objectives",
    icon: Brain,
    color: "from-blue-500 to-cyan-500",
  },
  processing: {
    title: "Processing Knowledge",
    description: "Structuring content and learning pathways",
    icon: Cpu,
    color: "from-purple-500 to-pink-500",
  },
  generating: {
    title: "Generating Content",
    description: "Creating modules, tests, and materials",
    icon: BookOpen,
    color: "from-green-500 to-emerald-500",
  },
  finalizing: {
    title: "Finalizing Course",
    description: "Optimizing structure and preparing delivery",
    icon: Target,
    color: "from-orange-500 to-red-500",
  },
};

const NeuralNode = ({
  x,
  y,
  delay,
  isActive,
}: {
  x: number;
  y: number;
  delay: number;
  isActive: boolean;
}) => (
  <motion.circle
    cx={x}
    cy={y}
    r="3"
    fill="currentColor"
    initial={{ opacity: 0.3, scale: 0.8 }}
    animate={{
      opacity: isActive ? [0.3, 1, 0.3] : 0.3,
      scale: isActive ? [0.8, 1.2, 0.8] : 0.8,
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    }}
    className="text-current"
  />
);

const NeuralConnection = ({
  x1,
  y1,
  x2,
  y2,
  delay,
  isActive,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
  isActive: boolean;
}) => (
  <motion.line
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    stroke="currentColor"
    strokeWidth="1"
    initial={{ opacity: 0.1 }}
    animate={{
      opacity: isActive ? [0.1, 0.8, 0.1] : 0.1,
    }}
    transition={{
      duration: 1.5,
      delay,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    }}
  />
);

const DataParticle = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute w-2 h-2 bg-current rounded-full opacity-60"
    initial={{ x: -10, y: 50 }}
    animate={{
      x: [0, 100, 200, 300],
      y: [50, 30, 70, 50],
      opacity: [0, 1, 1, 0],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    }}
  />
);

export default function AILoader({ isVisible, stage }: AILoaderProps) {
  const [currentStage, setCurrentStage] =
    useState<keyof typeof stages>("analyzing");

  const [activeNodes, setActiveNodes] = useState<number[]>([]);

  useEffect(() => {
    if (!isVisible) return;

    setCurrentStage(stage);

    const nodeInterval = setInterval(() => {
      setActiveNodes(() => {
        const newActive = Array.from({ length: 3 }, () =>
          Math.floor(Math.random() * 12)
        );
        return newActive;
      });
    }, 1000);

    return () => {
      clearInterval(nodeInterval);
    };
  }, [isVisible, stage]);

  const stageInfo = stages[currentStage];
  const StageIcon = stageInfo.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center text-[--neutral]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
          >
            <div className="text-center mb-8">
              <motion.div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${stageInfo.color} mb-4`}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <StageIcon className="w-8 h-8 text-white" />
              </motion.div>

              <motion.h2
                key={currentStage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-bold dark:text-white mb-2"
              >
                {stageInfo.title}
              </motion.h2>

              <motion.p
                key={`${currentStage}-desc`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm"
              >
                {stageInfo.description}
              </motion.p>
            </div>

            <div className="relative mb-6 h-32 overflow-hidden rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              <svg className="absolute inset-0 w-full h-full">
                <NeuralConnection
                  x1={20}
                  y1={40}
                  x2={80}
                  y2={60}
                  delay={0}
                  isActive={activeNodes.includes(0)}
                />
                <NeuralConnection
                  x1={20}
                  y1={80}
                  x2={80}
                  y2={60}
                  delay={0.2}
                  isActive={activeNodes.includes(1)}
                />
                <NeuralConnection
                  x1={80}
                  y1={60}
                  x2={140}
                  y2={40}
                  delay={0.4}
                  isActive={activeNodes.includes(2)}
                />
                <NeuralConnection
                  x1={80}
                  y1={60}
                  x2={140}
                  y2={80}
                  delay={0.6}
                  isActive={activeNodes.includes(3)}
                />
                <NeuralConnection
                  x1={140}
                  y1={40}
                  x2={200}
                  y2={60}
                  delay={0.8}
                  isActive={activeNodes.includes(4)}
                />
                <NeuralConnection
                  x1={140}
                  y1={80}
                  x2={200}
                  y2={60}
                  delay={1.0}
                  isActive={activeNodes.includes(5)}
                />

                <NeuralNode
                  x={20}
                  y={40}
                  delay={0}
                  isActive={activeNodes.includes(0)}
                />
                <NeuralNode
                  x={20}
                  y={80}
                  delay={0.1}
                  isActive={activeNodes.includes(1)}
                />
                <NeuralNode
                  x={80}
                  y={60}
                  delay={0.2}
                  isActive={activeNodes.includes(2)}
                />
                <NeuralNode
                  x={140}
                  y={40}
                  delay={0.3}
                  isActive={activeNodes.includes(3)}
                />
                <NeuralNode
                  x={140}
                  y={80}
                  delay={0.4}
                  isActive={activeNodes.includes(4)}
                />
                <NeuralNode
                  x={200}
                  y={60}
                  delay={0.5}
                  isActive={activeNodes.includes(5)}
                />
              </svg>

              <div className="absolute inset-0 text-blue-500">
                <DataParticle delay={0} />
                <DataParticle delay={1} />
                <DataParticle delay={2} />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[Database, Network, Lightbulb, Zap].map((Icon, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                  animate={{
                    scale: activeNodes.includes(index) ? 1.05 : 1,
                    backgroundColor: activeNodes.includes(index)
                      ? "rgba(59, 130, 246, 0.1)"
                      : undefined,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon
                    className={`w-4 h-4 mb-1 ${
                      activeNodes.includes(index)
                        ? "text-blue-500"
                        : "text-[--neutral]"
                    }`}
                  />
                  <motion.div
                    className="w-1 h-1 rounded-full bg-current"
                    animate={{
                      opacity: activeNodes.includes(index)
                        ? [0.3, 1, 0.3]
                        : 0.3,
                    }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
