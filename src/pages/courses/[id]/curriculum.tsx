import { Alert, Box, Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Paper, Snackbar, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { CourseChapter, CourseLecture, LectureResource, Course } from "@/store/atoms/course";
import { isAdminState } from "@/store/selectors/isAdmin";

export default function CurriculumBuilder() {
  const router = useRouter();
  const { id } = router.query;

  const isAdmin = useRecoilValue(isAdminState);

  // States
  const [courseTitle, setCourseTitle] = useState("");
  const [curriculum, setCurriculum] = useState<CourseChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSavingCurriculum, setIsSavingCurriculum] = useState(false);
  const [error, setError] = useState("");
  
  // Snackbar notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  // Dialog state for editing a lecture's details
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number | null>(null);
  const [selectedLectureIndex, setSelectedLectureIndex] = useState<number | null>(null);
  const [lectureFormData, setLectureFormData] = useState<CourseLecture | null>(null);
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);

  // Temporary state for adding a resource in the edit dialog
  const [newResourceTitle, setNewResourceTitle] = useState("");
  const [newResourceUrl, setNewResourceUrl] = useState("");

  const fetchCurriculum = async () => {
    if (!id) {
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      const [curriculumResponse, coursesResponse] = await Promise.all([
        axios.get(`/api/admin/courses/${id}/curriculum`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`/api/admin/courses/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      // Find course title
      const foundCourse = coursesResponse.data.courses.find(
        (courseItem: Course) => courseItem._id === id
      );
      if (foundCourse) {
        setCourseTitle(foundCourse.title);
      }

      // Sort chapters and lectures by orderIndex initially
      const sortedCurriculum = (curriculumResponse.data.curriculum as CourseChapter[]).map(
        (chapter: CourseChapter) => {
          const sortedLectures = [...chapter.lectures].sort(
            (firstLecture, secondLecture) => firstLecture.orderIndex - secondLecture.orderIndex
          );

          return {
            ...chapter,
            lectures: sortedLectures
          };
        }
      ).sort(
        (firstChapter, secondChapter) => firstChapter.orderIndex - secondChapter.orderIndex
      );

      setCurriculum(sortedCurriculum);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch course curriculum. Make sure you are an admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Gating check
    if (router.isReady) {
      if (!isAdmin) {
        router.push("/courses");
        return;
      }
      fetchCurriculum();
    }
  }, [router.isReady, id, isAdmin]);

  const showSnackbar = (message: string, severity: "success" | "error" = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Helper to re-index all chapters and lectures orderIndexes sequentially starting from 0
  const reindexCurriculum = (items: CourseChapter[]): CourseChapter[] => {
    return items.map((chapter, chapterIndex) => {
      const updatedLectures = chapter.lectures.map((lecture, lectureIndex) => {
        const lectureWithCorrectOrder = {
          ...lecture,
          orderIndex: lectureIndex
        };
        return lectureWithCorrectOrder;
      });

      const chapterWithCorrectOrder = {
        ...chapter,
        orderIndex: chapterIndex,
        lectures: updatedLectures
      };

      return chapterWithCorrectOrder;
    });
  };

  // ==========================================
  // Chapter Actions
  // ==========================================
  const handleAddChapter = () => {
    const newChapter: CourseChapter = {
      title: `New Chapter ${curriculum.length + 1}`,
      orderIndex: curriculum.length,
      lectures: []
    };

    const updatedCurriculum = [...curriculum, newChapter];
    setCurriculum(reindexCurriculum(updatedCurriculum));
    showSnackbar("Chapter added.");
  };

  const handleRenameChapter = (chapterIndex: number, newTitle: string) => {
    const updatedCurriculum = [...curriculum];
    updatedCurriculum[chapterIndex] = {
      ...updatedCurriculum[chapterIndex],
      title: newTitle
    };
    setCurriculum(updatedCurriculum);
  };

  const handleDeleteChapter = (chapterIndex: number) => {
    const updatedCurriculum = curriculum.filter((_, index) => index !== chapterIndex);
    setCurriculum(reindexCurriculum(updatedCurriculum));
    showSnackbar("Chapter deleted.");
  };

  const handleMoveChapterUp = (chapterIndex: number) => {
    if (chapterIndex === 0) {
      return;
    }

    const updatedCurriculum = [...curriculum];
    const targetIndex = chapterIndex - 1;
    
    // Swap positions
    const temporaryChapter = updatedCurriculum[chapterIndex];
    updatedCurriculum[chapterIndex] = updatedCurriculum[targetIndex];
    updatedCurriculum[targetIndex] = temporaryChapter;

    setCurriculum(reindexCurriculum(updatedCurriculum));
  };

  const handleMoveChapterDown = (chapterIndex: number) => {
    if (chapterIndex === curriculum.length - 1) {
      return;
    }

    const updatedCurriculum = [...curriculum];
    const targetIndex = chapterIndex + 1;

    // Swap positions
    const temporaryChapter = updatedCurriculum[chapterIndex];
    updatedCurriculum[chapterIndex] = updatedCurriculum[targetIndex];
    updatedCurriculum[targetIndex] = temporaryChapter;

    setCurriculum(reindexCurriculum(updatedCurriculum));
  };

  // ==========================================
  // Lecture Actions
  // ==========================================
  const handleAddLecture = (chapterIndex: number) => {
    const chapter = curriculum[chapterIndex];
    const newLecture: CourseLecture = {
      title: `New Lecture ${chapter.lectures.length + 1}`,
      orderIndex: chapter.lectures.length,
      published: true,
      videoUrl: "",
      videoProvider: "html5",
      notes: "",
      resources: []
    };

    const updatedCurriculum = [...curriculum];
    updatedCurriculum[chapterIndex] = {
      ...chapter,
      lectures: [...chapter.lectures, newLecture]
    };

    setCurriculum(reindexCurriculum(updatedCurriculum));
    showSnackbar("Lecture added.");
  };

  const handleDeleteLecture = (chapterIndex: number, lectureIndex: number) => {
    const updatedCurriculum = [...curriculum];
    const chapter = updatedCurriculum[chapterIndex];
    
    const filteredLectures = chapter.lectures.filter((_, index) => index !== lectureIndex);
    updatedCurriculum[chapterIndex] = {
      ...chapter,
      lectures: filteredLectures
    };

    setCurriculum(reindexCurriculum(updatedCurriculum));
    showSnackbar("Lecture deleted.");
  };

  const handleMoveLectureUp = (chapterIndex: number, lectureIndex: number) => {
    if (lectureIndex === 0) {
      return;
    }

    const updatedCurriculum = [...curriculum];
    const chapter = { ...updatedCurriculum[chapterIndex] };
    const updatedLectures = [...chapter.lectures];
    const targetIndex = lectureIndex - 1;

    // Swap positions
    const temporaryLecture = updatedLectures[lectureIndex];
    updatedLectures[lectureIndex] = updatedLectures[targetIndex];
    updatedLectures[targetIndex] = temporaryLecture;

    chapter.lectures = updatedLectures;
    updatedCurriculum[chapterIndex] = chapter;

    setCurriculum(reindexCurriculum(updatedCurriculum));
  };

  const handleMoveLectureDown = (chapterIndex: number, lectureIndex: number) => {
    const chapter = curriculum[chapterIndex];
    const lecturesList = chapter.lectures;
    if (lectureIndex === lecturesList.length - 1) {
      return;
    }

    const updatedCurriculum = [...curriculum];
    const updatedChapter = { ...chapter };
    const updatedLectures = [...lecturesList];
    const targetIndex = lectureIndex + 1;

    // Swap positions
    const temporaryLecture = updatedLectures[lectureIndex];
    updatedLectures[lectureIndex] = updatedLectures[targetIndex];
    updatedLectures[targetIndex] = temporaryLecture;

    updatedChapter.lectures = updatedLectures;
    updatedCurriculum[chapterIndex] = updatedChapter;

    setCurriculum(reindexCurriculum(updatedCurriculum));
  };

  // ==========================================
  // Save Action
  // ==========================================
  const handleSaveCurriculum = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    setIsSavingCurriculum(true);
    try {
      const cleanedCurriculum = reindexCurriculum(curriculum);
      await axios.put(
        `/api/admin/courses/${id}/curriculum`,
        { curriculum: cleanedCurriculum },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurriculum(cleanedCurriculum);
      showSnackbar("Curriculum saved successfully!", "success");
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to save curriculum. Please try again.", "error");
    } finally {
      setIsSavingCurriculum(false);
    }
  };

  // ==========================================
  // Lecture Edit Dialog Actions
  // ==========================================
  const handleOpenLectureModal = (chapterIndex: number, lectureIndex: number) => {
    setSelectedChapterIndex(chapterIndex);
    setSelectedLectureIndex(lectureIndex);
    
    const originalLecture = curriculum[chapterIndex].lectures[lectureIndex];
    // Create a deep copy to prevent mutating curriculum state in real-time
    const copiedLecture = JSON.parse(JSON.stringify(originalLecture));
    
    setLectureFormData(copiedLecture);
    setIsLectureModalOpen(true);
  };

  const handleCloseLectureModal = () => {
    setSelectedChapterIndex(null);
    setSelectedLectureIndex(null);
    setLectureFormData(null);
    setIsLectureModalOpen(false);
  };

  const handleUpdateLecture = () => {
    if (selectedChapterIndex === null || selectedLectureIndex === null || !lectureFormData) {
      return;
    }

    const updatedCurriculum = [...curriculum];
    const chapter = { ...updatedCurriculum[selectedChapterIndex] };
    const lectures = [...chapter.lectures];
    
    lectures[selectedLectureIndex] = lectureFormData;
    chapter.lectures = lectures;
    updatedCurriculum[selectedChapterIndex] = chapter;

    setCurriculum(updatedCurriculum);
    handleCloseLectureModal();
    showSnackbar("Lecture details updated locally.");
  };

  const handleAddResource = () => {
    if (!lectureFormData || !newResourceTitle.trim() || !newResourceUrl.trim()) {
      return;
    }

    const updatedResources = [...(lectureFormData.resources || [])];
    const newResource: LectureResource = {
      title: newResourceTitle.trim(),
      url: newResourceUrl.trim(),
      type: "link"
    };

    updatedResources.push(newResource);
    
    setLectureFormData({
      ...lectureFormData,
      resources: updatedResources
    });

    setNewResourceTitle("");
    setNewResourceUrl("");
  };

  const handleDeleteResource = (resourceIndex: number) => {
    if (!lectureFormData) {
      return;
    }

    const updatedResources = (lectureFormData.resources || []).filter(
      (_, index) => index !== resourceIndex
    );

    setLectureFormData({
      ...lectureFormData,
      resources: updatedResources
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress size={44} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 560, mx: "auto", mt: 10, px: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#F5F7FB", minHeight: "100vh", py: { xs: 4, md: 6 } }}>
      <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, md: 4 } }}>
        
        {/* Back Link */}
        <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
          <Button
            onClick={() => router.push("/courses")}
            startIcon={<Box component="span" className="material-symbols-outlined" sx={{ fontSize: "18px !important" }}>arrow_back</Box>}
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              textTransform: "none",
              fontSize: "0.875rem",
              py: 0.5,
              px: 1.5,
              borderRadius: 2,
              minWidth: "auto",
              "&:hover": {
                color: "primary.main",
                bgcolor: "rgba(0, 86, 210, 0.04)"
              }
            }}
          >
            Back to Courses
          </Button>
        </Box>

        {/* Header Stack */}
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#1A1F36", mb: 0.5 }}>
              Curriculum Builder
            </Typography>
            {courseTitle && (
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#88A9FF", mb: 1 }}>
                Course: {courseTitle}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              Organize chapters, lectures, and resources. Don&apos;t forget to click Save.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <Button 
              variant="outlined" 
              onClick={() => router.push("/courses")}
              sx={{ color: "#1A1F36", borderColor: "#CBD5E1", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSaveCurriculum} 
              disabled={isSavingCurriculum}
              sx={{ bgcolor: "#C2FFD1", color: "#1A1F36", fontWeight: 700, "&:hover": { bgcolor: "#A9FFBE" } }}
            >
              {isSavingCurriculum ? "Saving..." : "Save Changes"}
            </Button>
          </Stack>
        </Stack>

        {/* Chapters Outline */}
        <Stack spacing={3}>
          {curriculum.map((chapter, chapterIndex) => (
            <Card key={chapter._id || chapterIndex} variant="outlined" sx={{ p: 3, borderRadius: 3, borderColor: "#E2E8F0" }}>
              
              {/* Chapter Title & Reordering */}
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <TextField 
                  variant="standard" 
                  value={chapter.title} 
                  onChange={(event) => handleRenameChapter(chapterIndex, event.target.value)}
                  InputProps={{ style: { fontSize: "1.2rem", fontWeight: 700, color: "#1A1F36" } }}
                  placeholder="Chapter Title"
                  fullWidth
                />
                <IconButton onClick={() => handleMoveChapterUp(chapterIndex)} disabled={chapterIndex === 0}>
                  <Box component="span" className="material-symbols-outlined">arrow_upward</Box>
                </IconButton>
                <IconButton onClick={() => handleMoveChapterDown(chapterIndex)} disabled={chapterIndex === curriculum.length - 1}>
                  <Box component="span" className="material-symbols-outlined">arrow_downward</Box>
                </IconButton>
                <IconButton onClick={() => handleDeleteChapter(chapterIndex)} color="error">
                  <Box component="span" className="material-symbols-outlined">delete</Box>
                </IconButton>
              </Stack>

              <Divider sx={{ my: 1.5 }} />

              {/* Chapter Lectures list */}
              <Typography variant="subtitle2" sx={{ color: "#88A9FF", fontWeight: 700, mb: 1.5 }}>
                LECTURES
              </Typography>
              {chapter.lectures.length > 0 ? (
                <Stack spacing={1.5} sx={{ mb: 2 }}>
                  {chapter.lectures.map((lecture, lectureIndex) => (
                    <Paper key={lecture._id || lectureIndex} variant="outlined" sx={{ p: 2, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "#FAFAFA" }}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box component="span" className="material-symbols-outlined" sx={{ color: "#88A9FF" }}>
                          play_circle
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#1A1F36" }}>
                          {lecture.title} {!lecture.published && <Box component="span" sx={{ color: "orange" }}>(Draft)</Box>}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton size="small" onClick={() => handleOpenLectureModal(chapterIndex, lectureIndex)}>
                          <Box component="span" className="material-symbols-outlined">edit</Box>
                        </IconButton>
                        <IconButton size="small" onClick={() => handleMoveLectureUp(chapterIndex, lectureIndex)} disabled={lectureIndex === 0}>
                          <Box component="span" className="material-symbols-outlined">arrow_upward</Box>
                        </IconButton>
                        <IconButton size="small" onClick={() => handleMoveLectureDown(chapterIndex, lectureIndex)} disabled={lectureIndex === chapter.lectures.length - 1}>
                          <Box component="span" className="material-symbols-outlined">arrow_downward</Box>
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteLecture(chapterIndex, lectureIndex)} color="error">
                          <Box component="span" className="material-symbols-outlined">delete</Box>
                        </IconButton>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  No lectures in this chapter yet.
                </Typography>
              )}

              {/* Add Lecture Button */}
              <Button 
                variant="outlined" 
                onClick={() => handleAddLecture(chapterIndex)}
                startIcon={<Box component="span" className="material-symbols-outlined">add</Box>}
                sx={{ textTransform: "none", borderColor: "#CBD5E1", color: "#1A1F36", fontWeight: 600 }}
              >
                Add Lecture
              </Button>
            </Card>
          ))}
        </Stack>

        {/* Add Chapter Button */}
        <Button 
          variant="contained" 
          onClick={handleAddChapter} 
          startIcon={<Box component="span" className="material-symbols-outlined">add</Box>}
          sx={{ mt: 3, bgcolor: "#1A1F36", color: "#FFF", fontWeight: 700, px: 3, py: 1.2, "&:hover": { bgcolor: "#242B4C" } }}
        >
          Add Chapter
        </Button>
      </Box>

      {/* ==========================================
          Lecture Edit Dialog
          ========================================== */}
      {isLectureModalOpen && lectureFormData && (
        <Dialog 
          open={isLectureModalOpen} 
          onClose={handleCloseLectureModal}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Edit Lecture Details</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField 
                label="Lecture Title" 
                fullWidth 
                value={lectureFormData.title}
                onChange={(event) => setLectureFormData({
                  ...lectureFormData,
                  title: event.target.value
                })}
              />

              <TextField 
                label="Video URL" 
                fullWidth 
                placeholder="YouTube, Vimeo, or direct video link"
                value={lectureFormData.videoUrl || ""}
                onChange={(event) => setLectureFormData({
                  ...lectureFormData,
                  videoUrl: event.target.value
                })}
              />

              <TextField 
                label="Lecture Notes" 
                fullWidth 
                multiline
                rows={4}
                value={lectureFormData.notes || ""}
                onChange={(event) => setLectureFormData({
                  ...lectureFormData,
                  notes: event.target.value
                })}
              />

              <Divider />

              {/* Resource Downloads Section */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1A1F36" }}>
                RESOURCES & DOWNLOADS (PDF, Slides, Cheat-sheets)
              </Typography>
              {(lectureFormData.resources || []).length > 0 && (
                <Stack spacing={1}>
                  {(lectureFormData.resources || []).map((resource, resourceIndex) => (
                    <Paper key={resourceIndex} variant="outlined" sx={{ p: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#FAFAFA" }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{resource.title}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", wordBreak: "break-all" }}>
                          {resource.url}
                        </Typography>
                      </Box>
                      <IconButton size="small" onClick={() => handleDeleteResource(resourceIndex)} color="error">
                        <Box component="span" className="material-symbols-outlined">close</Box>
                      </IconButton>
                    </Paper>
                  ))}
                </Stack>
              )}

              {/* Resource Add Form */}
              <Paper variant="outlined" sx={{ p: 2, bgcolor: "#FAFAFA", borderRadius: 2 }}>
                <Typography variant="caption" sx={{ display: "block", fontWeight: 700, mb: 1, color: "text.secondary" }}>
                  ADD NEW RESOURCE
                </Typography>
                <Stack spacing={1.5}>
                  <TextField 
                    size="small" 
                    label="Resource Title" 
                    value={newResourceTitle} 
                    onChange={(event) => setNewResourceTitle(event.target.value)} 
                    placeholder="e.g. React Cheatsheet PDF"
                  />
                  <TextField 
                    size="small" 
                    label="Resource URL" 
                    value={newResourceUrl} 
                    onChange={(event) => setNewResourceUrl(event.target.value)}
                    placeholder="e.g. https://domain.com/notes.pdf"
                  />
                  <Button 
                    variant="outlined" 
                    onClick={handleAddResource}
                    sx={{ alignSelf: "flex-start", textTransform: "none", color: "#1A1F36", borderColor: "#CBD5E1" }}
                  >
                    Add Resource Link
                  </Button>
                </Stack>
              </Paper>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseLectureModal}>Discard</Button>
            <Button variant="contained" onClick={handleUpdateLecture} sx={{ bgcolor: "#1A1F36", color: "#FFF", "&:hover": { bgcolor: "#242B4C" } }}>
              Update Lecture
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
