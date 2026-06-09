import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Course } from "@/store/atoms/course";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80";

interface CourseDetailModalProps {
  open: boolean;
  course: Course | null;
  bought?: boolean;
  loading?: boolean;
  onClose: () => void;
  onBuy: () => void;
  onViewCurriculum?: () => void; // Triggered when navigating to the full details/syllabus
  isAdmin?: boolean;
}

export default function CourseDetailModal({
  open,
  course,
  bought,
  loading,
  onClose,
  onBuy,
  onViewCurriculum,
  isAdmin,
}: CourseDetailModalProps) {
  const [imageSrc, setImageSrc] = useState(course?.imageLink || FALLBACK_IMAGE);

  useEffect(() => {
    setImageSrc(course?.imageLink || FALLBACK_IMAGE);
  }, [course?._id, course?.imageLink]);

  if (!course) {
    return null;
  }

  const isPurchasedCourse = bought && !isAdmin;
  const shouldShowGoToCourseButton = bought || isAdmin;

  let actionButtonText = "Buy course";
  if (loading) {
    actionButtonText = "Processing...";
  } else if (shouldShowGoToCourseButton) {
    actionButtonText = "Go to Course";
  }

  const actionButtonVariant = shouldShowGoToCourseButton ? "outlined" : "contained";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700, color: "#1A1F36" }}>{course.title}</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          {/* Full description */}
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {course.description}
          </Typography>

          {/* Price and status chips */}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label={`₹${course.price.toLocaleString()}`} color="primary" sx={{ fontWeight: 600 }} />
            <Chip
              label={course.published ? "Published" : "Draft"}
              color={course.published ? "success" : "default"}
              variant="outlined"
            />
            {isPurchasedCourse && <Chip label="Purchased" color="secondary" />}
          </Stack>

          {/* Larger image */}
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              maxHeight: 280,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "grey.100",
            }}
          >
            <Box
              component="img"
              src={imageSrc}
              alt={course.title}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              onError={() => setImageSrc(FALLBACK_IMAGE)}
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: "space-between" }}>
        <Button onClick={onClose} sx={{ fontWeight: 600, color: "text.secondary" }}>
          Close
        </Button>
        <Stack direction="row" spacing={1.5}>
          {onViewCurriculum && (
            <Button
              variant="outlined"
              onClick={onViewCurriculum}
              sx={{
                fontWeight: 600,
                borderColor: "#CBD5E1",
                color: "#1A1F36",
                textTransform: "none",
              }}
            >
              {shouldShowGoToCourseButton ? "Go to Course" : "Preview Curriculum"}
            </Button>
          )}
          {!shouldShowGoToCourseButton && (
            <Button
              variant={actionButtonVariant}
              onClick={onBuy}
              disabled={loading}
              sx={{
                fontWeight: 600,
                bgcolor: "#C2FFD1",
                color: "#1A1F36",
                textTransform: "none",
                "&:hover": { bgcolor: "#A9FFBE" }
              }}
            >
              {actionButtonText}
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
}