import { Course } from "@/store/atoms/course";

// Filter courses by search text and optional "published only" toggle.
// Used on the /courses page — runs on the client in real time as the user types.
export function filterCourses(
    courses: Course[],
    searchQuery: string,
    publishedOnly: boolean
): Course[] {
    // Case-insensitive search: we compare everything in lowercase.
    const query = searchQuery.trim().toLowerCase();

    return courses.filter((course) => {
        // Optional filter: hide draft courses when "Published only" is checked.
        if (publishedOnly && !course.published) {
            return false;
        }

        // No search text → keep the course (other filters already applied above).
        if (!query) {
            return true;
        }

        const titleMatches = course.title.toLowerCase().includes(query);
        const descriptionMatches = course.description.toLowerCase().includes(query);

        return titleMatches || descriptionMatches;
    });
}