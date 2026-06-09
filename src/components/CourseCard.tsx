import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Course } from "@/store/atoms/course";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80";

interface CourseCardProps {
  course: Course;
  bought?: boolean;
  onBuy: () => void;
  loading?: boolean;
  onViewCourse?: () => void; // Main navigation to details/syllabus page
  onQuickView?: () => void;   // Triggers optional Quick View modal
  isAdmin?: boolean;
  onManageCurriculum?: () => void;
  onEdit?: () => void;
}

export default function CourseCard({
  course,
  bought,
  onBuy,
  loading,
  onViewCourse,
  onQuickView,
  isAdmin,
  onManageCurriculum,
  onEdit,
}: CourseCardProps) {
  const [imageSrc, setImageSrc] = useState(course.imageLink || FALLBACK_IMAGE);

  const isPurchasedCourse = bought && !isAdmin;
  const shouldShowGoToCourseButton = bought || isAdmin;
  const shouldShowCurriculumBuilderButton = isAdmin;

  let actionButtonText = "Buy course";
  if (loading) {
    actionButtonText = "Processing...";
  } else if (shouldShowGoToCourseButton) {
    actionButtonText = "Go to Course";
  }

  return (
    <Card
      onClick={onViewCourse}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: onViewCourse ? "pointer" : "default",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: onViewCourse ? "translateY(-4px)" : "none",
          boxShadow: "0 14px 32px rgba(26, 31, 54, 0.12)",
        },
      }}
    >
      {/* Course Image */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 200,
          overflow: "hidden",
          bgcolor: "grey.100",
        }}
      >
        <Box
          component="img"
          src={imageSrc}
          alt={course.title}
          onError={() => setImageSrc(FALLBACK_IMAGE)}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.3s ease",
            ".MuiCard-root:hover &": {
              transform: onViewCourse ? "scale(1.03)" : "none",
            },
          }}
        />

        {/* Price Badge */}
        <Chip
          label={`₹${course.price.toLocaleString()}`}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            fontWeight: 700,
            bgcolor: "background.paper",
            color: "primary.main",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            lineHeight: 1.3,
            mb: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            color: "#1A1F36",
          }}
        >
          {course.title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            minHeight: 40,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.6,
          }}
        >
          {course.description}
        </Typography>

        {/* Status Chips */}
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            label={course.published ? "Published" : "Draft"}
            size="small"
            color={course.published ? "success" : "default"}
            variant="outlined"
          />
          {isPurchasedCourse && (
            <Chip label="Purchased" size="small" color="primary" variant="filled" />
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0, mt: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
        {!isAdmin && (
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={(event) => {
              event.stopPropagation();
              onBuy();
            }}
            disabled={loading}
            sx={{
              py: 1,
              fontWeight: 600,
              bgcolor: "#C2FFD1",
              color: "#1A1F36",
              "&:hover": {
                bgcolor: "#A9FFBE",
              }
            }}
          >
            {actionButtonText}
          </Button>
        )}
        
        {!shouldShowGoToCourseButton && !isAdmin && (
          <Button
            fullWidth
            variant="outlined"
            size="medium"
            onClick={(event) => {
              event.stopPropagation();
              if (onViewCourse) onViewCourse();
            }}
            sx={{
              py: 0.8,
              fontWeight: 600,
              borderColor: "#88A9FF",
              color: "#1A1F36",
              textTransform: "none",
              "&:hover": {
                borderColor: "#88A9FF",
                bgcolor: "rgba(136, 169, 255, 0.08)"
              }
            }}
          >
            Preview Course
          </Button>
        )}


        {/* Admin Curriculum Builder Actions */}
        {shouldShowCurriculumBuilderButton && (
          <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={(event) => {
                event.stopPropagation();
                if (onManageCurriculum) {
                  onManageCurriculum();
                }
              }}
              sx={{
                py: 0.8,
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              Curriculum
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={(event) => {
                event.stopPropagation();
                if (onEdit) {
                  onEdit();
                }
              }}
              sx={{
                py: 0.8,
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              Edit
            </Button>
          </Stack>
        )}
      </CardActions>
    </Card>
  );
}
