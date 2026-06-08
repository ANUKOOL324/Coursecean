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

// Shown when a course image URL is broken or missing.
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80";

interface CourseCardProps {
  course: Course;
  bought?: boolean;
  onBuy: () => void;
  loading?: boolean;
  onViewDetails?: () => void;
}

export default function CourseCard({
  course,
  bought,
  onBuy,
  loading,
  onViewDetails,
}: CourseCardProps) {
  const [imageSrc, setImageSrc] = useState(course.imageLink || FALLBACK_IMAGE);

  return (
    <Card
      onClick={onViewDetails}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: onViewDetails ? "pointer" : "default",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: onViewDetails ? "translateY(-4px)" : "none",
          boxShadow: "0 14px 32px rgba(26, 31, 54, 0.12)",
        },
      }}
    >
      {/* Image on top — common pattern on Coursera-style course cards */}
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
              transform: onViewDetails ? "scale(1.03)" : "none",
            },
          }}
        />

        {/* Price badge floating on the image */}
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
        {/* Title — max 2 lines so cards stay the same height */}
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
          }}
        >
          {course.title}
        </Typography>

        {/* Description — muted and truncated */}
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

        {/* Status chips */}
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            label={course.published ? "Published" : "Draft"}
            size="small"
            color={course.published ? "success" : "default"}
            variant="outlined"
          />
          {bought && (
            <Chip label="Purchased" size="small" color="primary" variant="filled" />
          )}
        </Stack>
      </CardContent>

      {/* Buy button pinned to the bottom of every card */}
      <CardActions sx={{ px: 2, pb: 2, pt: 0, mt: "auto" }}>
        <Button
          fullWidth
          variant={bought ? "outlined" : "contained"}
          size="large"
          onClick={(event) => {
            event.stopPropagation();
            onBuy();
          }}
          disabled={bought || loading}
          sx={{
            py: 1.2,
            fontWeight: 600,
          }}
        >
          {loading ? "Processing..." : bought ? "Purchased" : "Buy course"}
        </Button>
      </CardActions>
    </Card>
  );
}
