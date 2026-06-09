import { requireAdmin } from "@/lib/authHelpers";
import { connectToDatabase } from "@/lib/db";
import { Course } from "@/lib/models";
import type { NextApiRequest, NextApiResponse } from "next";

async function handleGetCurriculum(
  courseId: string,
  response: NextApiResponse
) {
  const course = await Course.findById(courseId);

  if (!course) {
    return response.status(404).json({ message: "Course not found" });
  }

  const curriculum = course.curriculum ?? [];
  return response.status(200).json({ curriculum });
}

async function handleUpdateCurriculum(
  courseId: string,
  requestBody: any,
  response: NextApiResponse
) {
  const { curriculum } = requestBody;

  if (!Array.isArray(curriculum)) {
    return response.status(400).json({ message: "Curriculum must be an array" });
  }

  // Simple validation of curriculum structure
  for (const chapter of curriculum) {
    const isTitleValid = typeof chapter.title === "string" && chapter.title.trim().length > 0;
    if (!isTitleValid) {
      return response.status(400).json({ message: "Each chapter must have a valid title" });
    }

    if (!Array.isArray(chapter.lectures)) {
      return response.status(400).json({ message: "Each chapter must contain a lectures array" });
    }

    for (const lecture of chapter.lectures) {
      const isLectureTitleValid = typeof lecture.title === "string" && lecture.title.trim().length > 0;
      if (!isLectureTitleValid) {
        return response.status(400).json({ message: "Each lecture must have a valid title" });
      }
    }
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    { curriculum },
    { new: true, runValidators: true }
  );

  if (!updatedCourse) {
    return response.status(404).json({ message: "Course not found" });
  }

  return response.status(200).json({
    message: "Curriculum updated successfully",
    curriculum: updatedCourse.curriculum,
  });
}

export default async function curriculumHandler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const adminUsername = requireAdmin(request, response);
  if (!adminUsername) {
    return;
  }

  const requestMethod = request.method;
  const courseId = request.query.id;

  if (typeof courseId !== "string" || !courseId) {
    return response.status(400).json({ message: "Invalid course ID parameter" });
  }

  try {
    await connectToDatabase();

    if (requestMethod === "GET") {
      return await handleGetCurriculum(courseId, response);
    }

    if (requestMethod === "PUT") {
      return await handleUpdateCurriculum(courseId, request.body, response);
    }

    return response.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Admin curriculum API error:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
}
