import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface FlashcardProps {
  frontContent: string;
  backContent: string;
  isFlipped: boolean;
  onClick: () => void;
}

export default function Flashcard({
  frontContent,
  backContent,
  isFlipped,
  onClick,
}: FlashcardProps) {
  return (
    <div className="w-full h-[47vh] perspective" onClick={onClick}>
      <motion.div
        className="w-full h-full relative preserve-3d cursor-pointer "
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div className="absolute w-full h-full">
          <Card className="w-full h-full bg-background shadow-custom ">
            <CardContent className="flex items-center justify-center h-full">
              <p className="text-2xl  font-script">
                {isFlipped ? backContent : frontContent}
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
