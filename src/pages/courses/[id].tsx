import { Alert, Box, Button, Chip, CircularProgress, Collapse, Divider, List, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Course, CourseChapter, CourseLecture } from "@/store/atoms/course";
import { isAdminState } from "@/store/selectors/isAdmin";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80";

function getVideoProvider(videoUrl: string): "youtube" | "vimeo" | "direct" {
  const lowercaseUrl = videoUrl.toLowerCase();
  if (lowercaseUrl.includes("youtube.com") || lowercaseUrl.includes("youtu.be")) {
    return "youtube";
  }
  if (lowercaseUrl.includes("vimeo.com")) {
    return "vimeo";
  }
  return "direct";
}

function getYouTubeEmbedUrl(videoUrl: string): string {
  let embedId = "";
  if (videoUrl.includes("youtube.com/watch?v=")) {
    embedId = videoUrl.split("v=")[1]?.split("&")[0];
  } else if (videoUrl.includes("youtu.be/")) {
    embedId = videoUrl.split("youtu.be/")[1]?.split("?")[0];
  }
  return `https://www.youtube.com/embed/${embedId}`;
}

function getVimeoEmbedUrl(videoUrl: string): string {
  const embedId = videoUrl.split("vimeo.com/")[1]?.split("?")[0];
  return `https://player.vimeo.com/video/${embedId}`;
}

export default function CourseViewer() {
  const router = useRouter();
  const { id } = router.query;

  const [course, setCourse] = useState<Course | null>(null);
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLecture, setSelectedLecture] = useState<CourseLecture | null>(null);
  const [imageSrc, setImageSrc] = useState(FALLBACK_IMAGE);
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  useEffect(() => {
    if (selectedLecture && course?.curriculum) {
      const parentChapter = course.curriculum.find(chapter =>
        (chapter.lectures || []).some(lecture => lecture._id === selectedLecture._id)
      );
      if (parentChapter && parentChapter._id) {
        setExpandedChapters(prev => ({
          ...prev,
          [parentChapter._id!]: true
        }));
      }
    }
  }, [selectedLecture, course]);

  const isAdmin = useRecoilValue(isAdminState);

  const init = async () => {
    if (!id) {
      return;
    }
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      const [coursesResponse, purchasesResponse] = await Promise.all([
        axios.get(`/api/admin/courses`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`/api/purchases`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const foundCourse = coursesResponse.data.courses.find(
        (courseItem: Course) => courseItem._id === id || courseItem.id === id
      );

      if (!foundCourse) {
        setError("Course not found.");
        return;
      }

      setCourse(foundCourse);
      if (foundCourse.imageLink) {
        setImageSrc(foundCourse.imageLink);
      }

      const boughtIds = purchasesResponse.data.courseIds ?? [];
      setPurchasedCourseIds(boughtIds);

      const courseId = foundCourse._id || foundCourse.id || "";
      const canUserAccessCourse = boughtIds.includes(courseId) || isAdmin;

      // Filter and sort chapters/lectures to select the first lecture
      const visibleChapters = (foundCourse.curriculum || [])
        .map((chapter: CourseChapter) => {
          const lectures = (chapter.lectures || []).filter(
            (lecture: CourseLecture) => isAdmin || lecture.published
          );
          const sortedLectures = [...lectures].sort(
            (a: CourseLecture, b: CourseLecture) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
          );
          return { ...chapter, lectures: sortedLectures };
        })
        .filter((chapter: CourseChapter) => isAdmin || chapter.lectures.length > 0)
        .sort((a: CourseChapter, b: CourseChapter) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

      if (canUserAccessCourse && visibleChapters.length > 0) {
        const firstChapter = visibleChapters[0];
        if (firstChapter.lectures && firstChapter.lectures.length > 0) {
          setSelectedLecture(firstChapter.lectures[0]);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      init();
    }
  }, [router.isReady, id]);

  const handleBuy = async () => {
    if (!course) {
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `/api/stripe/create-checkout-session`,
        { course },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      console.error(err);
      setError("Could not start checkout. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress size={44} />
      </Box>
    );
  }

  if (error || !course) {
    return (
      <Box sx={{ maxWidth: 560, mx: "auto", mt: 10, px: 2 }}>
        <Alert severity="error">{error || "Course not found."}</Alert>
      </Box>
    );
  }

  const courseId = course._id || course.id || "";
  const canUserAccessCourse = purchasedCourseIds.includes(courseId) || isAdmin;

  // Filter and sort the chapters and lectures based on visibility and orderIndex
  const getVisibleCurriculum = (curriculum: CourseChapter[] | undefined) => {
    if (!curriculum) return [];

    return curriculum
      .map((chapter: CourseChapter) => {
        const lectures = (chapter.lectures || []).filter(
          (lecture: CourseLecture) => isAdmin || lecture.published
        );
        const sortedLectures = [...lectures].sort(
          (a: CourseLecture, b: CourseLecture) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
        );
        return {
          ...chapter,
          lectures: sortedLectures,
        };
      })
      .filter((chapter: CourseChapter) => isAdmin || chapter.lectures.length > 0)
      .sort((a: CourseChapter, b: CourseChapter) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  };

  const visibleCurriculum = getVisibleCurriculum(course.curriculum);
  const hasCurriculum = visibleCurriculum.length > 0;

  const renderVideoPlayer = (videoUrl: string) => {
    if (!videoUrl) {
      return (
        <Box sx={{ bgcolor: "#1A1F36", color: "#FFF", p: 6, textAlign: "center", borderRadius: 2 }}>
          <Box
            component="span"
            className="material-symbols-outlined"
            sx={{ fontSize: 48, color: "#88A9FF", display: "inline-block" }}
          >
            video_library
          </Box>
          <Typography variant="h6" sx={{ mt: 1 }}>
            No Video Provided for this Lecture
          </Typography>
        </Box>
      );
    }

    const provider = getVideoProvider(videoUrl);

    if (provider === "youtube") {
      const embedUrl = getYouTubeEmbedUrl(videoUrl);
      return (
        <Box sx={{ borderRadius: 2, overflow: "hidden", width: "100%", height: 450 }}>
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title={selectedLecture?.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
      );
    }

    if (provider === "vimeo") {
      const embedUrl = getVimeoEmbedUrl(videoUrl);
      return (
        <Box sx={{ borderRadius: 2, overflow: "hidden", width: "100%", height: 450 }}>
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </Box>
      );
    }

    return (
      <Box
        component="video"
        src={videoUrl}
        controls
        sx={{
          width: "100%",
          maxHeight: 450,
          borderRadius: 2,
          bgcolor: "#000",
          display: "block"
        }}
      />
    );
  };

  const renderEmptyState = () => (
    <Paper
      variant="outlined"
      sx={{
        p: 4,
        textAlign: "center",
        borderRadius: 2,
        bgcolor: "#FFF",
        borderColor: "#E2E8F0",
      }}
    >
      <Box
        component="span"
        className="material-symbols-outlined"
        sx={{ fontSize: 48, color: "#88A9FF", mb: 1.5, display: "inline-block" }}
      >
        menu_book
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: "#1A1F36", mb: 0.5 }}>
        Curriculum will be added soon.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        This course does not have published lessons yet.
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ bgcolor: "#F5F7FB", minHeight: "100vh", py: { xs: 3, md: 5 } }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 } }}>
        
        {/* Back Link */}
        <Button 
          onClick={() => router.push("/courses")}
          startIcon={<Box component="span" className="material-symbols-outlined">arrow_back</Box>}
          sx={{ mb: 3, color: "#1A1F36", fontWeight: 600, textTransform: "none" }}
        >
          Back to Courses
        </Button>

        {/* Show Overview Layout for Unpaid users, or when there is no curriculum */}
        {!canUserAccessCourse || !hasCurriculum ? (
          <Stack direction={{ xs: "column", md: "row" }} spacing={4} sx={{ alignItems: "flex-start" }}>
            
            {/* Left Column: Course Overview */}
            <Box sx={{ flex: 1, width: "100%", maxWidth: { md: 720 } }}>
              <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, border: "1px solid #E2E8F0" }}>
                <Stack spacing={2.5}>
                  <Box
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      width: "100%",
                      height: { xs: 200, md: 250 },
                      bgcolor: "grey.100",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
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
                        display: "block"
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: "#1A1F36", mb: 1, fontSize: { xs: "1.5rem", md: "2rem" } }}>
                      {course.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1rem", lineHeight: 1.6 }}>
                      {course.description}
                    </Typography>
                  </Box>

                  <Divider />

                  {/* Enroll Box for unpaid users */}
                  {!canUserAccessCourse ? (
                    <Stack 
                      direction={{ xs: "column", sm: "row" }} 
                      justifyContent="space-between" 
                      alignItems="center" 
                      spacing={2} 
                      sx={{ p: 2.25, bgcolor: "#1A1F36", color: "#FFF", borderRadius: 2 }}
                    >
                      <Box>
                        <Typography variant="subtitle2" sx={{ opacity: 0.8, fontSize: "0.75rem" }}>COURSE PRICE</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: "#C2FFD1" }}>
                          ₹{course.price.toLocaleString()}
                        </Typography>
                      </Box>
                      <Button 
                        variant="contained" 
                        size="medium" 
                        onClick={handleBuy} 
                        sx={{ 
                          bgcolor: "#C2FFD1", 
                          color: "#1A1F36", 
                          fontWeight: 700, 
                          px: 3, 
                          py: 1, 
                          textTransform: "none",
                          "&:hover": { bgcolor: "#A9FFBE" } 
                        }}
                      >
                        Enroll Now
                      </Button>
                    </Stack>
                  ) : (
                    <Chip 
                      label={isAdmin ? "Administrator View" : "You are enrolled in this course"} 
                      color="success" 
                      sx={{ alignSelf: "flex-start", fontWeight: 600, py: 2, px: 1 }} 
                    />
                  )}
                </Stack>
              </Paper>
            </Box>

            {/* Right Column: Syllabus Preview */}
            <Box sx={{ width: { xs: "100%", md: 400 }, flexShrink: 0 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#1A1F36", mb: 2 }}>
                Course Syllabus
              </Typography>
              {hasCurriculum ? (
                <Stack spacing={2}>
                  {visibleCurriculum.map((chapter) => (
                    <Paper key={chapter._id} variant="outlined" sx={{ p: 2.5, borderRadius: 2, bgcolor: "#FFF" }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1A1F36", mb: 1.5 }}>
                        {chapter.title}
                      </Typography>
                      <List disablePadding>
                        {chapter.lectures.map((lecture) => (
                          <ListItemButton key={lecture._id} disabled sx={{ py: 1, borderRadius: 1 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <span className="material-symbols-outlined">lock</span>
                            </ListItemIcon>
                            <ListItemText 
                              primary={lecture.title} 
                              primaryTypographyProps={{ variant: "body2", fontWeight: 500 }} 
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                renderEmptyState()
              )}
            </Box>

          </Stack>
        ) : (
          
          /* Full Course Player Layout (Paid Student / Admin View) */
          <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ alignItems: "flex-start" }}>
            
            {/* Sidebar: Syllabus List */}
            <Paper 
              elevation={0} 
              sx={{ 
                width: { xs: "100%", md: 320 }, 
                flexShrink: 0, 
                p: 2, 
                borderRadius: 2, 
                border: "1px solid #E2E8F0", 
                maxHeight: "80vh", 
                overflowY: "auto" 
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1A1F36", mb: 2, px: 1 }}>
                Syllabus
              </Typography>
              <Stack spacing={2}>
                {visibleCurriculum.map((chapter) => {
                  const isExpanded = !!expandedChapters[chapter._id || ""];
                  return (
                    <Box key={chapter._id} sx={{ mb: 1 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        onClick={() => chapter._id && toggleChapter(chapter._id)}
                        sx={{
                          cursor: "pointer",
                          px: 1,
                          py: 0.75,
                          borderRadius: 1.5,
                          userSelect: "none",
                          "&:hover": {
                            bgcolor: "rgba(136, 169, 255, 0.08)",
                          },
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#88A9FF" }}>
                          {chapter.title}
                        </Typography>
                        <Box
                          component="span"
                          className="material-symbols-outlined"
                          sx={{
                            fontSize: 18,
                            color: "#88A9FF",
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        >
                          expand_more
                        </Box>
                      </Stack>
                      <Collapse in={isExpanded} timeout="auto">
                        <List disablePadding sx={{ mt: 0.5 }}>
                          {chapter.lectures.map((lecture) => (
                            <ListItemButton
                              key={lecture._id}
                              selected={selectedLecture?._id === lecture._id}
                              onClick={() => setSelectedLecture(lecture)}
                              sx={{
                                py: 1,
                                pl: 2,
                                pr: 1.5,
                                borderRadius: 1.5,
                                mb: 0.5,
                                "&.Mui-selected": {
                                  bgcolor: "rgba(136, 169, 255, 0.15)",
                                  color: "#1A1F36",
                                  "&:hover": {
                                    bgcolor: "rgba(136, 169, 255, 0.2)",
                                  },
                                },
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 28 }}>
                                <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 20 }}>
                                  play_circle
                                </Box>
                              </ListItemIcon>
                              <ListItemText
                                primary={lecture.title}
                                primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
                              />
                            </ListItemButton>
                          ))}
                        </List>
                      </Collapse>
                    </Box>
                  );
                })}
              </Stack>
            </Paper>

            {/* Main Content Area: Selected Lecture Player */}
            <Paper elevation={0} sx={{ flexGrow: 1, width: "100%", p: { xs: 2, md: 4 }, borderRadius: 2, border: "1px solid #E2E8F0" }}>
              {selectedLecture ? (
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#1A1F36" }}>
                      {selectedLecture.title}
                    </Typography>
                  </Box>

                  {/* Video Embed */}
                  {renderVideoPlayer(selectedLecture.videoUrl || "")}

                  {/* Notes Section */}
                  {selectedLecture.notes && (
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#1A1F36", mb: 1 }}>
                        Lecture Notes
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2, bgcolor: "#FAFAFA", borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                          {selectedLecture.notes}
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  {/* Resources Section */}
                  {selectedLecture.resources && selectedLecture.resources.length > 0 && (
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#1A1F36", mb: 1.5 }}>
                        Resources & Downloads
                      </Typography>
                      <Stack spacing={1}>
                        {selectedLecture.resources.map((resource, resourceIndex) => (
                          <Button
                            key={resourceIndex}
                            variant="outlined"
                            component="a"
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<Box component="span" className="material-symbols-outlined">download</Box>}
                            sx={{ 
                              justifyContent: "flex-start", 
                              textTransform: "none", 
                              borderColor: "#E2E8F0", 
                              color: "#1A1F36",
                              "&:hover": { borderColor: "#88A9FF", bgcolor: "rgba(136, 169, 255, 0.05)" }
                            }}
                          >
                            {resource.title}
                          </Button>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              ) : (
                <Box sx={{ py: 10, textAlign: "center" }}>
                  <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 48, color: "#CCD0D9" }}>
                    auto_stories
                  </Box>
                  <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                    Select a lecture from the syllabus to begin learning
                  </Typography>
                </Box>
              )}
            </Paper>

          </Stack>
        )}
      </Box>
    </Box>
  );
}
