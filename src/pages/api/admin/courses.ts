
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { requireAdmin, requireAuth } from "@/lib/authHelpers";
import crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from 'next'

type CourseRecord = {
    _id: string;
    title: string;
    description: string;
    price: number;
    imageLink: string;
    published: boolean;
    __v: number;
    postedDate?: string;
};

declare global {
    // Keeps the in-memory course list alive during dev-server HMR.
    var courseceanCourseList: CourseRecord[] | undefined;
}

const courses = {
    "courses": [
        {
            "_id": "64ac35fe420a74308d6db047",
            "title": "Full Stack Development",
            "description": "Full stack dev course by harkirat",
            "price": 5999,
            "imageLink": "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",

            "published": true,
            "__v": 0
        },
        {
            "_id": "64afd077657e0e701d309a44",
            "title": "Full stack development new",
            "description": "rat singh",
            "price": 5999,
            "imageLink": "https://d33g7sdvsfd029.cloudfront.net/subject/2023-01-17-0.3698267942851394.jpg",
            "published": true,
            "__v": 0
        },
        {
            "_id": "64b38b1f05d8af81b769d90d",
            "title": "full stack ",
            "description": "full stack course by kirat",
            "price": 599,
            "imageLink": "https://images.pexels.com/photos/17445669/pexels-photo-17445669/free-photo-of-city-landscape-fashion-man.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
            "published": true,
            "postedDate": "2023-07-16T06:15:59.466Z",
            "__v": 0
        },
        {
            "_id": "64b4e53e820df2ea9d38aa6a",
            "title": "Html oo yeah",
            "description": "Learn the freaking html",
            "price": 2222,
            "imageLink": "https://th.bing.com/th/id/OIP.PVOhIhZ2cfFJVWI3U9WG6AHaE7?w=234&h=180&c=7&r=0&o=5&pid=1.7",
            "published": true,
            "__v": 0
        },
        {
            "_id": "64b4e739820df2ea9d38aa7f",
            "title": "Html22",
            "description": "Learn the freaking html",
            "price": 222211,
            "imageLink": "https://th.bing.com/th/id/OIP.PVOhIhZ2cfFJVWI3U9WG6AHaE7?w=234&h=180&c=7&r=0&o=5&pid=1.7",
            "published": true,
            "__v": 0
        },
        {
            "_id": "64b500903b9acfe518a51eca",
            "title": "Full Stack MERN",
            "description": "harkirat",
            "price": 5999,
            "imageLink": "https://d33g7sdvsfd029.cloudfront.net/subject/2023-01-17-0.3698267942851394.jpg",
            "published": true,
            "__v": 0
        },
        {
            "_id": "64b5b1cf030c38aba1d47ed1",
            "title": "testAdmin",
            "description": "test",
            "price": 25,
            "imageLink": "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
            "published": true,
            "__v": 0
        }
    ]
}

// Use a mutable in-memory list so admins can add/edit courses at runtime.
const courseList: CourseRecord[] = globalThis.courseceanCourseList ?? courses.courses;
globalThis.courseceanCourseList = courseList;

// Fix old debug course title still in memory from earlier dev sessions.
const legacyCourse = courseList.find((course) => course._id === "64ac35fe420a74308d6db047");
if (legacyCourse?.title.includes("Fix THE ISSUE")) {
    legacyCourse.title = "Full Stack Development";
    legacyCourse.price = 5999;
    legacyCourse.imageLink =
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";
}

function isValidCoursePayload(body: unknown): body is {
    title: string;
    description: string;
    price: number;
    imageLink: string;
    published?: boolean;
} {
    if (!body || typeof body !== "object") {
        return false;
    }

    const course = body as Record<string, unknown>;

    return (
        typeof course.title === "string" &&
        typeof course.description === "string" &&
        typeof course.imageLink === "string" &&
        typeof course.price === "number"
    );
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET: any logged-in user can browse courses (students need this to buy).
  if (req.method === "GET") {
    const username = requireAuth(req, res);
    if (!username) {
      return;
    }

    return res.status(200).json({ courses: courseList });
  }

  // POST: only admins can add a new course.
  if (req.method === "POST") {
    const adminUsername = requireAdmin(req, res);
    if (!adminUsername) {
      return;
    }

    if (!isValidCoursePayload(req.body)) {
      return res.status(400).json({
        message: "Invalid course data. Need title, description, price (number), and imageLink.",
      });
    }

    const newCourse: CourseRecord = {
      _id: crypto.randomBytes(12).toString("hex"),
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      imageLink: req.body.imageLink,
      published: req.body.published ?? true,
      postedDate: new Date().toISOString(),
      __v: 0,
    };

    courseList.push(newCourse);

    return res.status(201).json({
      message: "Course added successfully.",
      course: newCourse,
    });
  }

  // PUT: only admins can edit an existing course (matched by _id in body).
  if (req.method === "PUT") {
    const adminUsername = requireAdmin(req, res);
    if (!adminUsername) {
      return;
    }

    const courseId = req.body?._id;
    if (typeof courseId !== "string" || !courseId) {
      return res.status(400).json({ message: "Course _id is required to update a course." });
    }

    if (!isValidCoursePayload(req.body)) {
      return res.status(400).json({
        message: "Invalid course data. Need title, description, price (number), and imageLink.",
      });
    }

    const existingIndex = courseList.findIndex((course) => course._id === courseId);
    if (existingIndex === -1) {
      return res.status(404).json({ message: "Course not found." });
    }

    const updatedCourse: CourseRecord = {
      ...courseList[existingIndex],
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      imageLink: req.body.imageLink,
      published: req.body.published ?? courseList[existingIndex].published,
    };

    courseList[existingIndex] = updatedCourse;

    return res.status(200).json({
      message: "Course updated successfully.",
      course: updatedCourse,
    });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
