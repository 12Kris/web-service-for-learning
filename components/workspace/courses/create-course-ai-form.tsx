// "use client"

// import { useState } from "react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"

// export default function CourseCreationForm() {
//   const [modules, setModules] = useState([{ id: 1, title: "", cardCount: "", testCount: "" }])
//   const [courseDetails, setCourseDetails] = useState([{ id: 1, description: "" }]);
//   const [learningOutcomes, setLearningOutcomes] = useState([{ id: 1, description: "" }]);


//   const addModule = () => {
//     const newId = modules.length > 0 ? Math.max(...modules.map((m) => m.id)) + 1 : 1
//     setModules([...modules, { id: newId, title: "", cardCount: "", testCount: "" }])
//   }

//   const addCourseDetails = () => {
//     const newId = courseDetails.length > 0 ? Math.max(...courseDetails.map((d) => d.id)) + 1 : 1;
//     setCourseDetails([...courseDetails, { id: newId, description: "" }]);
//   };

//   const addLearningOutcomes = () => {
//     const newId = learningOutcomes.length > 0 ? Math.max(...learningOutcomes.map((l) => l.id)) + 1 : 1;
//     setLearningOutcomes([...learningOutcomes, { id: newId, description: "" }]);
//   };
  

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="mb-8">
//         <h1 className="text-[#4a7a72] text-lg font-medium">Memorize</h1>
//       </div>

//       <div className="mb-12">
//         <h2 className="text-[#4a7a72] text-3xl font-medium mb-8">Create Course With AI</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           <div>
//             <label htmlFor="courseName" className="block text-[#4a7a72] mb-2">
//               Course Name
//             </label>
//             <Input
//               id="courseName"
//               placeholder="Example"
//               className="border-[#4a7a72] border-opacity-30 bg-transparent"
//             />
//           </div>

//           {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
//           <div>
//             <div>
//                 <label htmlFor="courseType" className="block text-[#4a7a72] mb-2">
//                     Course Type
//                 </label>
//                 <Input
//                     id="courseType"
//                     placeholder="Example"
//                     className="border-[#4a7a72] border-opacity-30 bg-transparent"
//                 />
//             </div>
//             {/* <div>
//               <label htmlFor="courseType" className="block text-[#4a7a72] mb-2">
//                 Course Type
//               </label>
//               <Select>
//                 <SelectTrigger className="border-[#4a7a72] border-opacity-30 bg-transparent">
//                   <SelectValue placeholder="Example" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="language">Language</SelectItem>
//                   <SelectItem value="programming">Programming</SelectItem>
//                   <SelectItem value="science">Science</SelectItem>
//                   <SelectItem value="math">Mathematics</SelectItem>
//                   <SelectItem value="history">History</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div> */}

//             {/* <div>
//               <label htmlFor="language" className="block text-[#4a7a72] mb-2">
//                 Language
//               </label>
//               <Select defaultValue="english">
//                 <SelectTrigger className="border-[#4a7a72] border-opacity-30 bg-transparent">
//                   <SelectValue placeholder="English" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="english">English</SelectItem>
//                   <SelectItem value="spanish">Spanish</SelectItem>
//                   <SelectItem value="french">French</SelectItem>
//                   <SelectItem value="german">German</SelectItem>
//                   <SelectItem value="chinese">Chinese</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div> */}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           <div>
//             <label htmlFor="description" className="block text-[#4a7a72] mb-2">
//               Description
//             </label>
//             <Textarea
//               id="description"
//               placeholder="Example"
//               className="border-[#4a7a72] border-opacity-30 bg-transparent"
//             />
//           </div>

//           <div>
//             <label htmlFor="level" className="block text-[#4a7a72] mb-2">
//               Level
//             </label>
//             <Select defaultValue="advanced">
//               <SelectTrigger className="border-[#4a7a72] border-opacity-30 bg-transparent">
//                 <SelectValue placeholder="Advanced" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="beginner">Beginner</SelectItem>
//                 <SelectItem value="intermediate">Intermediate</SelectItem>
//                 <SelectItem value="advanced">Advanced</SelectItem>
//                 <SelectItem value="expert">Expert</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {/* <div className="mb-12">
//             <label htmlFor="courseDetails" className="block text-[#4a7a72] mb-2">
//                 Course Details
//             </label>
//             <Textarea
//                 id="courseDetails"
//                 placeholder="Example"
//                 className="border-[#4a7a72] border-opacity-30 bg-transparent w-full mb-4"
//             />
//             <Button
//                 onClick={addCourseDetails}
//                 variant="outline"
//                 className="border-[#4a7a72] text-[#4a7a72] hover:bg-[#4a7a72] hover:text-white transition-colors w-1/4"
//                 >
//                 Add Course Details
//             </Button>
//         </div>

//         <div className="mb-12">
//             <label htmlFor="learningOutcomes" className="block text-[#4a7a72] mb-2">
//                 What Students Will Learn
//             </label>
//             <Textarea
//                 id="learningOutcomes"
//                 placeholder="Example"
//                 className="border-[#4a7a72] border-opacity-30 bg-transparent w-full mb-4"
//             />
//             </div>
//             <Button
//                 onClick={addLearningOutcomes}
//                 variant="outline"
//                 className="border-[#4a7a72] text-[#4a7a72] hover:bg-[#4a7a72] hover:text-white transition-colors w-1/4"
//                 >
//                 Add Learning Outcomes
//             </Button> */}

//         <div className="mb-12">
//                 <label className="block text-[#4a7a72] mb-2">Course Details</label>
//                     {courseDetails.map((detail) => (
//                 <Textarea
//                     key={detail.id}
//                     placeholder={`Course Detail ${detail.id}`}
//                     className="border-[#4a7a72] border-opacity-30 bg-transparent w-full mb-4"
//                 />
//                 ))}
//                 <Button onClick={addCourseDetails} variant="outline" className="border-[#4a7a72] text-[#4a7a72] w-1/4">
//                     Add Course Details
//                 </Button>
//             </div>

//             <div className="mb-12">
//                 <label className="block text-[#4a7a72] mb-2">What Students Will Learn</label>
//                 {learningOutcomes.map((outcome) => (
//                 <Textarea
//                     key={outcome.id}
//                     placeholder={`Learning Outcome ${outcome.id}`}
//                     className="border-[#4a7a72] border-opacity-30 bg-transparent w-full mb-4"
//                 />
//                 ))}
//                 <Button onClick={addLearningOutcomes} variant="outline" className="border-[#4a7a72] text-[#4a7a72] w-1/4">
//                 Add Learning Outcomes
//                 </Button>
//             </div>
//       </div>

//       <div className="mb-12">
//         <h2 className="text-[#4a7a72] text-3xl font-medium mb-8">Create Studying Material</h2>

//         {modules.map((module) => (
//           <div key={module.id} className="mb-6">
//             <div className="mb-4">
//               <label htmlFor={`module-${module.id}`} className="block text-[#4a7a72] mb-2">
//                 Module {module.id}
//               </label>
//               <Input
//                 id={`module-${module.id}`}
//                 placeholder="What is this module about?"
//                 className="border-[#4a7a72] border-opacity-30 bg-transparent"
//               />
//             </div>

//             <div className="flex gap-5">
//                 <div className="mb-6 w-1/2">
//                 <label htmlFor={`cards-${module.id}`} className="block text-[#4a7a72] mb-2">
//                     Card sets for Module {module.id}
//                 </label>
//                 <Textarea
//                     id={`cards-${module.id}`}
//                     placeholder="What is your desired amount of card sets for this module? (up to 5)"
//                     className="border-[#4a7a72] border-opacity-30 bg-transparent"
//                 />
//                 </div>

//                 <div className="mb-6 w-1/2">
//                 <label htmlFor={`cards-${module.id}`} className="block text-[#4a7a72] mb-2">
//                     Cards amount for each set {module.id}
//                 </label>
//                 <Textarea
//                     id={`cards-${module.id}`}
//                     placeholder="What is your desired amount of cards for each card set? (up to 30)"
//                     className="border-[#4a7a72] border-opacity-30 bg-transparent"
//                 />
//                 </div>
//             </div>

//             <div className="flex gap-5">
//                 <div className="mb-6 w-1/2">
//                 <label htmlFor={`tests-${module.id}`} className="block text-[#4a7a72] mb-2">
//                     Test sets for Module {module.id}
//                 </label>
//                 <Textarea
//                     id={`tests-${module.id}`}
//                     placeholder="What is your desired amount of test sets for this module? (up to 5)"
//                     className="border-[#4a7a72] border-opacity-30 bg-transparent"
//                 />
//                 </div>

//                 <div className="mb-6 w-1/2">
//                 <label htmlFor={`tests-${module.id}`} className="block text-[#4a7a72] mb-2">
//                     Tests amount for each set {module.id}
//                 </label>
//                 <Textarea
//                     id={`tests-${module.id}`}
//                     placeholder="What is your desired amount of tests for each test set? (up to 30)"
//                     className="border-[#4a7a72] border-opacity-30 bg-transparent"
//                 />
//                 </div>
//             </div>
//           </div>
//         ))}

//         <Button
//           onClick={addModule}
//           variant="outline"
//           className="border-[#4a7a72] text-[#4a7a72] hover:bg-[#4a7a72] hover:text-white transition-colors w-full"
//         >
//           Add New Module
//         </Button>
//       </div>

//       <div className="flex justify-center">
//         <Button className="bg-[#4a7a72] hover:bg-[#3a6a62] text-white px-12 py-2 h-auto rounded-full">
//           Generate Course
//         </Button>
//       </div>
//     </div>
//   )
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { createCourseWithAI } from "@/lib/courses/ai-actions";
import { GenerationProgress } from "@/components/ui/generation-progress";

export default function CreateCourseAIForm() {
  const [prompt, setPrompt] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [coursesAmount, setCoursesAmount] = useState<number>(1);
  const [difficultyLevel, setDifficultyLevel] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!prompt.trim()) {
      setError("Please enter a course topic");
      return;
    }

    try {
      setIsLoading(true);
      const result = await createCourseWithAI(
        prompt,
        coursesAmount,
        difficultyLevel
      );

      if (result.success && result.courseId) {
        router.push(`/workspace/courses/${result.courseId}`);
      } else {
        setError(result.message || "Failed to create course");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Generate Course with AI</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 mb-0">
            <label className="block text-sm font-medium">
              Describe the course you want to create
            </label>
            <Textarea
              placeholder="Enter a topic or description for your course (e.g., 'Introduction to JavaScript', 'Basic Photography Techniques', 'Web Development for Beginners')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              className="w-full"
              disabled={isLoading}
            />
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label
                  htmlFor="coursesAmount"
                  className="block text-sm font-medium"
                >
                  Courses Amount
                </label>
                <input
                  id="coursesAmount"
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  value={coursesAmount}
                  onChange={(e) => setCoursesAmount(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  disabled={isLoading}
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="difficultyLevel"
                  className="block text-sm font-medium"
                >
                  Difficulty Level
                </label>
                <select
                  id="difficultyLevel"
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  disabled={isLoading}
                >
                  <option value="">Select difficulty</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              The AI will generate a complete course structure including
              modules, learning outcomes, and course details.
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-sm" role="alert">
              {error}
            </div>
          )}

          <CardFooter className="px-0 mb-0 pb-0 flex flex-col gap-4">
            {isLoading && (
              <div className="mb-0">
                <GenerationProgress
                  isLoading={isLoading}
                  label={`Generating ${coursesAmount} course${
                    coursesAmount > 1 ? "s" : ""
                  }...`}
                />
              </div>
            )}
            {!isLoading && (
              <Button
                type="submit"
                className="w-full mb-0 "
                disabled={isLoading}
              >
                {isLoading ? "Generation in progress..." : "Generate Course"}
              </Button>
            )}
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}