import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

interface FlashcardProps {
  frontContent: string
  backContent: string
  isFlipped: boolean
  onClick: () => void
}

export default function Flashcard({ frontContent, backContent, isFlipped, onClick }: FlashcardProps) {
  return (
    <div className="w-full h-full aspect-[4/3] perspective" onClick={onClick}>
      <motion.div
        className="w-full h-full relative preserve-3d cursor-pointer"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <AnimatePresence initial={false} mode="wait">
          {!isFlipped ? (
            <motion.div
              key="front"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              {/* <Card className="w-full h-full bg-white-900/50 border-zinc-800"> */}
              <Card className="w-full h-full bg-background shadow-custom rounded-3xl">
                <CardContent className="flex items-center justify-center h-full">
                  <p className="text-2xl text-black font-script">{frontContent}</p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="back"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 [transform:rotateY(180deg)]"
            >
              {/* <Card className="w-full h-full border-zinc-800 bg-white-900/50 shadow-custom"> */}
              <Card className="w-full h-full bg-background shadow-custom rounded-3xl">
                <CardContent className="flex items-center justify-center h-full">
                  <p className="text-2xl font-script">{backContent}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}