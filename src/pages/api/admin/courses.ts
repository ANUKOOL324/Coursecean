import { requireAdmin, requireAuth } from "@/lib/authHelpers";
import { connectToDatabase } from "@/lib/db";
import { Course } from "@/lib/models";
import { isAdminUser } from "@/lib/authStore";
import { getPurchasedCourseIds } from "@/lib/purchaseStore";
import type { NextApiRequest, NextApiResponse } from "next";

// Helper to validate the course request payload sent by client during course creation/update
function isValidCoursePayload(requestBody: any): requestBody is {
  title: string;
  description: string;
  price: number;
  imageLink: string;
  published?: boolean;
  author?: string;
  category?: string;
  tags?: string[];
  videoLink?: string;
} {
  const isBodyMissing = !requestBody || typeof requestBody !== "object";
  if (isBodyMissing) {
    return false;
  }

  const hasValidTitle = typeof requestBody.title === "string";
  const hasValidDescription = typeof requestBody.description === "string";
  const hasValidImageLink = typeof requestBody.imageLink === "string";
  const hasValidPrice = typeof requestBody.price === "number";

  return hasValidTitle && hasValidDescription && hasValidImageLink && hasValidPrice;
}

// Initial default courses for database auto-population (seeding) if collection is empty
const defaultCourses = [
  {
    _id: "64ac35fe420a74308d6db047",
    title: "Full Stack Development",
    description: "Full stack dev course by harkirat",
    price: 5999,
    imageLink: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    published: true,
  },
  {
    _id: "64afd077657e0e701d309a44",
    title: "Full stack development new",
    description: "rat singh",
    price: 5999,
    imageLink: "https://d33g7sdvsfd029.cloudfront.net/subject/2023-01-17-0.3698267942851394.jpg",
    published: true,
  },
  {
    _id: "64b38b1f05d8af81b769d90d",
    title: "full stack ",
    description: "full stack course by kirat",
    price: 599,
    imageLink: "https://images.pexels.com/photos/17445669/pexels-photo-17445669/free-photo-of-city-landscape-fashion-man.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    published: true,
    postedDate: new Date("2023-07-16T06:15:59.466Z"),
  },
  {
    _id: "64b4e53e820df2ea9d38aa6a",
    title: "Html oo yeah",
    description: "Learn the freaking html",
    price: 2222,
    imageLink: "https://th.bing.com/th/id/OIP.PVOhIhZ2cfFJVWI3U9WG6AHaE7?w=234&h=180&c=7&r=0&o=5&pid=1.7",
    published: true,
  },
  {
    _id: "64b4e739820df2ea9d38aa7f",
    title: "Html22",
    description: "Learn the freaking html",
    price: 222211,
    imageLink: "https://th.bing.com/th/id/OIP.PVOhIhZ2cfFJVWI3U9WG6AHaE7?w=234&h=180&c=7&r=0&o=5&pid=1.7",
    published: true,
  },
  {
    _id: "64b500903b9acfe518a51eca",
    title: "Full Stack MERN",
    description: "harkirat",
    price: 5999,
    imageLink: "https://d33g7sdvsfd029.cloudfront.net/subject/2023-01-17-0.3698267942851394.jpg",
    published: true,
  },
  {
    _id: "64b5b1cf030c38aba1d47ed1",
    title: "testAdmin",
    description: "test",
    price: 25,
    imageLink: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    published: true,
  }
];

// Helper to check if a specific course has been purchased by a user
function isCoursePurchasedByUser(purchasedCourseIds: string[], courseId: string): boolean {
  return purchasedCourseIds.includes(courseId);
}

// Redacts sensitive info for a lecture if the user hasn't paid
function redactLectureForLockedUser(lecture: any) {
  const redactedLecture = {
    _id: lecture._id,
    title: lecture.title,
    orderIndex: lecture.orderIndex,
    published: lecture.published,
    // Sensitive video and notes contents are cleared out
    videoUrl: "",
    videoProvider: "",
    notes: "",
    resources: [],
  };

  return redactedLecture;
}

// Redacts sensitive info for a chapter if the user hasn't paid
function redactChapterForLockedUser(chapter: any) {
  const redactedChapter = {
    ...chapter,
    lectures: Array.isArray(chapter.lectures)
      ? chapter.lectures.map(redactLectureForLockedUser)
      : [],
  };

  return redactedChapter;
}

// Redacts sensitive info for a course if the user hasn't paid
function redactCourseForLockedUser(course: any) {
  // Convert Mongoose document to a plain JavaScript object
  const courseObject = course.toObject();

  if (courseObject.curriculum) {
    courseObject.curriculum = courseObject.curriculum.map(redactChapterForLockedUser);
  }

  return courseObject;
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const requestMethod = request.method;

  // GET: Retrieve courses. Any authenticated user can view them, but unpaid users get redacted versions.
  if (requestMethod === "GET") {
    const username = requireAuth(request, response);
    if (!username) {
      return;
    }

    try {
      await connectToDatabase();
      
      let courses = await Course.find({});
      
      // Auto-seed if database is currently empty
      if (courses.length === 0) {
        await Course.insertMany(defaultCourses);
        courses = await Course.find({});
      }

      // Check if caller is Admin
      const isAdmin = isAdminUser(username);
      
      let processedCourses: any[] = courses;
      if (!isAdmin) {
        // Retrieve purchases to redact content for unpurchased courses
        const purchasedCourseIds = await getPurchasedCourseIds(username);
        
        processedCourses = courses.map((course) => {
          const courseIdString = course._id.toString();
          const isPurchased = isCoursePurchasedByUser(purchasedCourseIds, courseIdString);
          
          if (isPurchased) {
            return course;
          }
          
          const redactedCourse = redactCourseForLockedUser(course);
          return redactedCourse;
        });
      }

      return response.status(200).json({ courses: processedCourses });
    } catch (error) {
      console.error("GET courses error:", error);
      return response.status(500).json({ message: "Internal server error" });
    }
  }

  // POST: Create a new course. Only admins can do this.
  if (requestMethod === "POST") {
    const adminUsername = requireAdmin(request, response);
    if (!adminUsername) {
      return;
    }

    const requestBody = request.body;
    if (!isValidCoursePayload(requestBody)) {
      return response.status(400).json({
        message: "Invalid course data. Need title, description, price (number), and imageLink.",
      });
    }

    try {
      await connectToDatabase();
      
      const newCourse = new Course({
        title: requestBody.title,
        description: requestBody.description,
        price: requestBody.price,
        imageLink: requestBody.imageLink,
        published: requestBody.published ?? true,
        postedDate: new Date(),
        metadata: {
          author: requestBody.author || "Harkirat Singh",
          category: requestBody.category || "Development",
          tags: requestBody.tags || [],
          videoLink: requestBody.videoLink || ""
        }
      });

      await newCourse.save();

      return response.status(201).json({
        message: "Course added successfully.",
        course: newCourse,
      });
    } catch (error) {
      console.error("POST course error:", error);
      return response.status(500).json({ message: "Internal server error" });
    }
  }

  // PUT: Update an existing course details. Only admins can do this.
  if (requestMethod === "PUT") {
    const adminUsername = requireAdmin(request, response);
    if (!adminUsername) {
      return;
    }

    const requestBody = request.body;
    const courseId = requestBody?._id;
    if (typeof courseId !== "string" || !courseId) {
      return response.status(400).json({ message: "Course _id is required to update a course." });
    }

    if (!isValidCoursePayload(requestBody)) {
      return response.status(400).json({
        message: "Invalid course data. Need title, description, price (number), and imageLink.",
      });
    }

    try {
      await connectToDatabase();

      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        {
          title: requestBody.title,
          description: requestBody.description,
          price: requestBody.price,
          imageLink: requestBody.imageLink,
          published: requestBody.published ?? true,
          "metadata.author": requestBody.author,
          "metadata.category": requestBody.category,
          "metadata.tags": requestBody.tags,
          "metadata.videoLink": requestBody.videoLink
        },
        { new: true }
      );

      if (!updatedCourse) {
        return response.status(404).json({ message: "Course not found." });
      }

      return response.status(200).json({
        message: "Course updated successfully.",
        course: updatedCourse,
      });
    } catch (error) {
      console.error("PUT course error:", error);
      return response.status(500).json({ message: "Internal server error" });
    }
  }

  return response.status(405).json({ message: "Method not allowed" });
}
