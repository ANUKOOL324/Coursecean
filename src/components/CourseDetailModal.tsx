import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Course } from "@/store/atoms/course";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80";

// Simple modal to show full course details before the user buys.
// The parent (courses.tsx) controls which course is open and handles the Buy action.

interface CourseDetailModalProps {
  // Whether the modal is visible.
  open: boolean;

  // The course to display. Can be null when closed.
  course: Course | null;

  // If the user already owns this course.
  bought?: boolean;

  // True while Stripe checkout is starting for this course.
  loading?: boolean;

  // Called when the user closes the modal (X, backdrop, or Close button).
  onClose: () => void;

  // Called when the user clicks Buy inside the modal.
  onBuy: () => void;
}

export default function CourseDetailModal({
  open,
  course,
  bought,
  loading,
  onClose,
  onBuy,
}: CourseDetailModalProps) {
  const [imageSrc, setImageSrc] = useState(course?.imageLink || FALLBACK_IMAGE);

  // Reset the image when the user opens a different course in the modal.
  useEffect(() => {
    setImageSrc(course?.imageLink || FALLBACK_IMAGE);
  }, [course?._id, course?.imageLink]);

  // Don't render content if no course is selected.
  if (!course) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{course.title}</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          {/* Full description — not truncated like on the small card */}
          <Typography variant="body1" color="text.secondary">
            {course.description}
          </Typography>

          {/* Price and status chips — same info as the card, but easier to read */}
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label={`₹${course.price.toLocaleString()}`} color="primary" />
            <Chip
              label={course.published ? "Published" : "Draft"}
              color={course.published ? "success" : "default"}
              variant="outlined"
            />
            {bought && <Chip label="Purchased" color="secondary" />}
          </Stack>

          {/* Larger image so users can preview the course */}
          <div
            style={{
              borderRadius: 8,
              overflow: "hidden",
              maxHeight: 280,
            }}
          >
            <img
              src={imageSrc}
              alt={course.title}
              style={{ width: "100%", objectFit: "cover" }}
              onError={() => setImageSrc(FALLBACK_IMAGE)}
            />
          </div>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          onClick={onBuy}
          disabled={bought || loading}
        >
          {loading ? "Processing..." : bought ? "Purchased" : "Buy course"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}