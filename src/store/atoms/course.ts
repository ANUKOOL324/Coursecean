import { atom } from "recoil";

// Represents a resource file or link attached to a specific course lecture (e.g. PDF slides, link to GitHub, etc.)
export interface LectureResource {
  title: string;
  url: string;
  type?: string; // Optional field for resource type (e.g., "link", "pdf")
}

// Represents a single lecture within a chapter
export interface CourseLecture {
  _id?: string; // MongoDB document ID (optional when created on frontend)
  title: string;
  orderIndex: number; // For sorting and displaying lectures in sequence
  published: boolean; // Controls whether students can see this lecture
  videoUrl?: string; // Optional video embed URL (YouTube, Vimeo, etc.)
  videoProvider?: string; // Video provider (e.g., "youtube", "vimeo", "html5")
  notes?: string; // Optional rich-text/markdown lecture notes
  resources?: LectureResource[]; // List of downloadable resource links
}

// Represents a chapter/section containing a group of lectures
export interface CourseChapter {
  _id?: string; // MongoDB document ID
  title: string;
  orderIndex: number; // For sorting chapters in sequence
  lectures: CourseLecture[]; // Array of lectures belonging to this chapter
}

// Represents a complete course entity
export interface Course {
  _id: string; // Unique course ID
  id?: string; // Support optional/alternative client-side id field
  title: string;
  description: string;
  imageLink: string;
  price: number;
  published?: boolean;
  curriculum?: CourseChapter[]; // Embedded course syllabus/chapters
}

// Recoil state atom for holding the current course loaded in the course player
export const courseState = atom<{ isLoading: boolean; course: null | Course }>({
  key: "courseState",
  default: {
    isLoading: true,
    course: null,
  },
});

