// import { motion, AnimatePresence } from 'framer-motion'
// import { Card, CardContent } from '@/components/ui/card'

// interface FlashcardProps {
//   frontContent: string
//   backContent: string
//   isFlipped: boolean
//   onClick: () => void
// }

// export default function Flashcard({ frontContent, backContent, isFlipped, onClick }: FlashcardProps) {
//   return (
//     <div className="w-full aspect-[4/3] perspective" onClick={onClick}>
//       <motion.div
//         className="w-full h-full relative preserve-3d cursor-pointer"
//         initial={false}
//         animate={{ rotateY: isFlipped ? 180 : 0 }}
//         transition={{ duration: 0.6, ease: "easeInOut" }}
//       >
//         <AnimatePresence initial={false} mode="wait">
//           {!isFlipped ? (
//             <motion.div
//               key="front"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.2 }}
//               className="absolute inset-0"
//             >
//               <Card className="w-full h-full bg-white-900/50 border-zinc-800">
//                 <CardContent className="flex items-center justify-center h-full">
//                   <p className="text-2xl text-black font-script">{frontContent}</p>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ) : (
//             <motion.div
//               key="back"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.2 }}
//               className="absolute inset-0 [transform:rotateY(180deg)]"
//             >
//               <Card className="w-full h-full bg-white-900/50 border-zinc-800">
//                 <CardContent className="flex items-center justify-center h-full">
//                   <p className="text-2xl text-black font-script">{backContent}</p>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     </div>
//   )
// }

'use client'

interface FlashcardProps {
  frontContent: string
  backContent: string
  isFlipped: boolean
  onClick: () => void
}

export default function Flashcard({
  frontContent,
  backContent,
  isFlipped,
  onClick,
}: FlashcardProps) {
  return (
    <div className="relative w-full h-full" onClick={onClick}>
      <div
        className={`absolute inset-0 w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* Front side */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
          <div className="h-full flex flex-col">
            {/* <h1 className="text-2xl font-semibold mb-2">Web Development FleshCards</h1>
            <p className="text-zinc-600 mb-8">Learn key web development terms and their definitions</p> */}
            <div className="flex-1 bg-white rounded-xl border border-zinc-200 p-8 flex items-center justify-center text-center">
              <p className="text-lg">{frontContent}</p>
            </div>
          </div>
        </div>

        {/* Back side */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="h-full flex flex-col">
            {/* <h1 className="text-2xl font-semibold mb-2">Web Development FleshCards</h1>
            <p className="text-zinc-600 mb-8">Learn key web development terms and their definitions</p> */}
            <div className="flex-1 bg-white rounded-xl border border-zinc-200 p-8 flex items-center justify-center text-center">
              <p className="text-lg">{backContent}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

