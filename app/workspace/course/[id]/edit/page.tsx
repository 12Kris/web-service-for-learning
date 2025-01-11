"use client";
import { useEffect, useState } from "react";
import {
  getModulesByCourseId,
  getCourseById,
  getMaterialsByBlockId,
  getTestsByBlockId,
  isCourseAddedToUser
} from "@/lib/courses/actions";
import { Button } from "@/components/ui/button";
import { use } from "react";
import Link from "next/link";
import {Block, Course, LearningMaterial, ModalsState, Test} from "@/lib/definitions";
import { updateCourse } from "@/lib/courses/actions";
import {
  handleCloseMaterialModal,
  handleCloseModal, handleCloseTestModal,
  handleCreateOrEditBlock, handleCreateOrEditMaterial, handleCreateOrEditTest,
  handleOpenMaterialModal,
  handleOpenModal,
  handleOpenTestModal
} from "@/lib/tests/handlers";
import {BlockModal} from "@/components/workspace/modals/block";
import {MaterialModal} from "@/components/workspace/modals/material";
import {TestModal} from "@/components/workspace/modals/test";
import { getUser } from "@/lib/auth/actions";
import BlockSection from "../BlockSection";

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const { id } = use(params);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  // const [course, setCourse] = useState<Course | null>(null);
  const [isCourseAdded, setIsCourseAdded] = useState<boolean>(false);
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [tests, setTests] = useState<Record<number, Test[]>>({});
  const [materials, setMaterials] = useState<Record<number, LearningMaterial[]>>({});
  const [modals, setModals] = useState<ModalsState>({
    block: false,
    material: false,
    test: false
  });
  const [currentBlockId, setCurrentBlockId] = useState<number | null>(null);
  const [currentBlock, setCurrentBlock] = useState<Block | null>(null);
  const [blockName, setBlockName] = useState<string>("");

  const [currentMaterial, setCurrentMaterial] = useState<LearningMaterial | null>(null);
  const [materialTitle, setMaterialTitle] = useState<string>("");
  const [materialContent, setMaterialContent] = useState<string>("");

  const [currentTest, setCurrentTest] = useState<Test | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        const [courseData, user, blocksData] = await Promise.all([
          getCourseById(id),
          getUser(),
          getModulesByCourseId(id)
        ]);

        setCourse(courseData);
        setIsCreator(user?.id.toString() === courseData.creator_id?.toString());

        const isAdded = await isCourseAddedToUser(id);
        setIsCourseAdded(isAdded);

        const testsData: Record<number, Test[]> = {};
        const materialsData: Record<number, LearningMaterial[]> = {};
        const blocksPromises = blocksData.map(async (block) => {
          testsData[block.id] = await getTestsByBlockId(block.id);
          materialsData[block.id] = await getMaterialsByBlockId(block.id);
        });

        await Promise.all(blocksPromises);
        setBlocks(blocksData);
        setTests(testsData);
        setMaterials(materialsData);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setIsLoading(true);

      try {
        const courseData = await getCourseById(id);
        setCourse(courseData);
        setName(courseData?.name || "");
        setDescription(courseData?.description || "");
        setType(courseData?.type || "");
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id]);

  async function handleUpdateCourse() {
    if (!id) return;
    await updateCourse(id, {
      creator_id: course?.creator_id,
      name,
      description,
      type,
    });
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
      <div className="container mx-auto py-10 px-4 flex w-full gap-4">
        <div className="flex-1 bg-zinc-100 rounded-3xl p-6">
          <h1 className="text-3xl font-bold mb-6">
            <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
          </h1>
          <div className="mb-6">
            <input
                required
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <span className="font-bold">Type:</span>{" "}
          <input
              required
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
          />
          <div>
            <span className="font-bold">Instructor:</span>{" "}
            {course?.creator?.full_name}
          </div>
          <div className="my-4">
            <Link className="" href={`/workspace/course/${course?.id}`}>
              <Button variant="outline" className="bg-white">
                Cancel
              </Button>
            </Link>
            <Link className="ml-4" href={`/workspace/course/${course?.id}`}>
              <Button onClick={handleUpdateCourse}>Save</Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {blocks.map((block) => (
              <BlockSection
                  key={block.id}
                  block={block}
                  tests={tests[block.id]}
                  setCurrentTest={setCurrentTest}
                  materials={materials[block.id]}
                  setModals={setModals}
                  setCurrentBlockId={setCurrentBlockId}
                  currentBlockId={currentBlockId}
                  handleOpenMaterialModal={(material: any) =>
                      handleOpenMaterialModal(
                          material,
                          block.id,
                          setCurrentBlockId,
                          setCurrentMaterial,
                          setMaterialTitle,
                          setMaterialContent,
                          setModals
                      )
                  }
                  handleOpenTestModal={(test: any) =>
                      handleOpenTestModal(
                          test,
                          block.id,
                          setCurrentTest,
                          setCurrentBlockId,
                          setModals
                      )
                  }
                  handleOpenBlockModal={() =>
                      handleOpenModal(block, setCurrentBlock, setBlockName, setModals)
                  }
              />
          ))}
          <Button onClick={() => handleOpenModal(null, setCurrentBlock, setBlockName, setModals)}>
            Create Block
          </Button>
        </div>

        <BlockModal
            isOpen={modals.block}
            onClose={() => handleCloseModal(setModals, setCurrentBlock, setBlockName)}
            onSave={() =>
                handleCreateOrEditBlock(
                    blockName,
                    currentBlock,
                    id,
                    setModals,
                    setBlocks,
                    getBlocksByCourseId
                )
            }
            blockName={blockName}
            setBlockName={setBlockName}
        />
        <MaterialModal
            isOpen={modals.material}
            onClose={() =>
                handleCloseMaterialModal(setModals, setCurrentMaterial, setMaterialTitle, setMaterialContent)
            }
            onSave={() =>
                handleCreateOrEditMaterial(
                    materialTitle,
                    materialContent,
                    currentMaterial,
                    currentBlockId!,
                    setModals,
                    setMaterials
                )
            }
            materialTitle={materialTitle}
            setMaterialTitle={setMaterialTitle}
            materialContent={materialContent}
            setMaterialContent={setMaterialContent}
        />
        <TestModal
            isOpen={modals.test}
            onClose={() => handleCloseTestModal(setModals, setCurrentTest)}
            testId={currentTest?.id ?? ''}
            blockId={currentBlockId}
            onSave={(testData) => {
              handleCreateOrEditTest(testData, currentTest, setModals, setTests);
            }}
        />
      </div>
  );
}