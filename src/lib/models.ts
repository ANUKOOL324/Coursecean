import mongoose from "mongoose";

// ==========================================
// 1. User Schema & Model
// ==========================================
const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ["STUDENT", "ADMIN"], 
    default: "STUDENT" 
  },
  profile: {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" }
  },
  // Open-ended metadata object for settings, notifications, progress tracking, etc.
  metadata: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {} 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// ==========================================
// 2. Course Curriculum Sub-schemas
// ==========================================

// Sub-schema for resources attached to a lecture (e.g. PDFs, external links)
const LectureResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, default: "link" } // Resource type, defaults to a standard web link
});

// Sub-schema for individual lectures containing video links and notes
const CourseLectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  orderIndex: { type: Number, default: 0 }, // For manual re-ordering support
  published: { type: Boolean, default: true }, // Draft status flag
  videoUrl: { type: String, default: "" }, // Lecture video player link
  videoProvider: { type: String, default: "html5" }, // Providers like "youtube", "vimeo", "html5"
  notes: { type: String, default: "" }, // Protected notes for paid users
  resources: [LectureResourceSchema] // Embedded subdocuments for resources
});

// Sub-schema for chapters containing grouped lectures
const CourseChapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  orderIndex: { type: Number, default: 0 }, // For manual chapter re-ordering support
  lectures: [CourseLectureSchema] // Embedded subdocuments for lectures
});

// ==========================================
// 3. Course Schema & Model
// ==========================================
const CourseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  imageLink: { 
    type: String, 
    required: true 
  },
  published: { 
    type: Boolean, 
    default: true 
  },
  author: { 
    type: String, 
    default: "Harkirat Singh" 
  },
  category: { 
    type: String, 
    default: "Development" 
  },
  tags: [{ 
    type: String 
  }],
  videoLink: { 
    type: String, 
    default: "" 
  },
  // Extensible mixed type for syllabus, FAQs, ratings, learning outcomes, etc.
  metadata: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {} 
  },
  curriculum: [CourseChapterSchema],
  postedDate: { 
    type: Date, 
    default: Date.now 
  }
});

// ==========================================
// 3. Purchase Schema & Model
// ==========================================
const PurchaseSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    index: true,
    trim: true,
    lowercase: true
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course", 
    required: true 
  },
  stripeSessionId: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  status: { 
    type: String, 
    enum: ["pending", "paid", "failed"], 
    default: "paid" 
  },
  amountPaid: { 
    type: Number, 
    required: true,
    min: 0
  },
  // Extensible mixed type for full billing receipt details, stripe payload, etc.
  metadata: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {} 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Compound index to ensure a student can only purchase a specific course once
PurchaseSchema.index({ username: 1, courseId: 1 }, { unique: true });

// Export the compiled models, reusing existing ones if already registered during Dev HMR
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);
export const Purchase = mongoose.models.Purchase || mongoose.model("Purchase", PurchaseSchema);
