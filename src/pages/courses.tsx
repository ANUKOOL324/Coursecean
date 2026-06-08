import { Alert, Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Paper, Snackbar, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { Course } from "@/store/atoms/course";
import { isAdminState } from "@/store/selectors/isAdmin";
import { motion } from "motion/react";

// We import the reusable CourseCard component that we created in Step 2.
// This component lives in src/components/CourseCard.tsx
// Using a shared component means we don't repeat the card UI code.
import CourseCard from "@/components/CourseCard";
import CourseDetailModal from "@/components/CourseDetailModal";
import { filterCourses } from "@/lib/filterCourses";

function Courses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [purchasedCourseIds, setPurchasedCourseIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // This state controls whether we show a message when the user
    // comes back from Stripe after cancelling the payment.
    const [showCancelledMessage, setShowCancelledMessage] = useState(false);

    // This tracks the _id of the course the user is currently trying to buy.
    // We use it to show a loading state ONLY on that specific card's Buy button.
    // This makes the UI clear: other cards stay normal while one is "Processing...".
    const [buyingCourseId, setBuyingCourseId] = useState<string | null>(null);

    // Controls which list we show: every course, or only the ones the user bought.
    // We reuse the same purchasedCourseIds state — no extra API call needed.
    const [activeView, setActiveView] = useState<"all" | "purchases">("all");

    // Search and filter state — updates in real time as the user types or toggles.
    const [searchQuery, setSearchQuery] = useState("");
    const [publishedOnly, setPublishedOnly] = useState(false);

    // Snackbar state for friendly notifications instead of browser alert() popups.
    // We use MUI Snackbar + Alert because they match the rest of the app and feel modern.
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info" as "success" | "info" | "warning" | "error",
    });

    const router = useRouter();

    // Read admin status from Recoil (set by InitUser / login from /api/admin/me).
    const isAdmin = useRecoilValue(isAdminState);

    // Admin-only: dialog state for adding a new course.
    const [showAddCourseDialog, setShowAddCourseDialog] = useState(false);
    const [addingCourse, setAddingCourse] = useState(false);
    const [newCourseTitle, setNewCourseTitle] = useState("");
    const [newCourseDescription, setNewCourseDescription] = useState("");
    const [newCoursePrice, setNewCoursePrice] = useState("");
    const [newCourseImageLink, setNewCourseImageLink] = useState("");

    // Which course the user clicked to view full details (null = modal closed).
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    // Small helper so we don't repeat the same setState code everywhere.
    const showSnackbar = (
        message: string,
        severity: "success" | "info" | "warning" | "error" = "info"
    ) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const init = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            router.push("/signin");
            return;
        }

        try {
            const [coursesResponse, purchasesResponse] = await Promise.all([
                axios.get(`/api/admin/courses/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }),
                axios.get(`/api/purchases`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            ]);

            setCourses(coursesResponse.data.courses);
            setPurchasedCourseIds(purchasesResponse.data.courseIds ?? []);
            setError("");
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                localStorage.setItem("token", "");
                setLoading(false);
                router.push("/signin");
                return;
            }

            setError("Could not load courses right now. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            router.push("/signin");
            return;
        }

        init();
    }, []);

    // ============================================
    // CANCEL FLOW HANDLING (Step 1)
    // ============================================
    // When a user clicks "Buy course", we send them to Stripe Checkout.
    // If they cancel on Stripe's page, Stripe redirects them back using
    // the cancel_url we set in create-checkout-session.ts
    //
    // The URL they come back to looks like:
    //   /courses?checkout=cancelled
    //
    // Why do we need useEffect + router.query?
    // - router.query is not available on the very first render.
    // - Next.js needs a moment to read the URL and put the query values
    //   into the router object.
    // - useEffect runs after the component mounts and after the router
    //   has finished reading the URL. This is the safest place to check
    //   for query parameters like "checkout=cancelled".
    //
    // Why do we use router.replace?
    // - After we see the "cancelled" parameter, we show the message.
    // - Then we use router.replace() to remove "?checkout=cancelled"
    //   from the browser's address bar.
    // - We use { shallow: true } so it doesn't reload the page.
    // - This is important: if the user refreshes the page later,
    //   they won't see the cancelled message again (clean URL).
    useEffect(() => {
        // Wait until Next.js has finished reading the URL
        if (!router.isReady) {
            return;
        }

        // Check if Stripe sent us back with the cancelled flag
        if (router.query.checkout === 'cancelled') {
            // Show the friendly message to the user
            setShowCancelledMessage(true);

            // Remove the ?checkout=cancelled from the URL
            // so the message doesn't appear again on refresh.
            router.replace('/courses', undefined, { shallow: true });
            return;
        }

        // ============================================
        // SUCCESS / PURCHASE REFRESH HANDLING
        // ============================================
        // After a successful payment, the success page redirects the user here
        // using a query param: /courses?refreshPurchases=true
        //
        // Why is this needed?
        // - The Courses page fetches purchasedCourseIds once when it first loads (useEffect with []).
        // - When navigating with router.push("/courses?...") from the success page,
        //   Next.js often reuses the existing component instance instead of remounting.
        // - That means the original useEffect does NOT run again.
        // - Result without this: the just-purchased course would still show a "Buy course" button
        //   instead of "Purchased" until the user manually refreshes the browser.
        //
        // What we do here:
        // - Detect the refreshPurchases flag (set by success page after confirm).
        // - Re-run init() which re-fetches BOTH courses and purchased IDs from the API.
        // - This updates the UI so CourseCard immediately sees the course in purchasedCourseIds.
        // - Then clean the URL with router.replace (shallow) so a browser refresh later
        //   does not re-trigger the refetch unnecessarily.
        //
        // This is a simple, beginner-friendly way to keep purchase state fresh after
        // leaving the app for Stripe and coming back.
        if (router.query.refreshPurchases === 'true') {
            // Re-fetch purchases so the just-bought course shows "Purchased" right away.
            // Also switch to "My Purchases" so the user immediately sees what they bought.
            setActiveView("purchases");
            init().then(() => {
                showSnackbar("Your purchase was added! The course list is now up to date.", "success");
            });
            router.replace('/courses', undefined, { shallow: true });
        }

        if (router.query.view === 'purchases') {
            setActiveView("purchases");
        } else if (router.query.view === 'all') {
            setActiveView("all");
        }

        if (router.query.search) {
            setSearchQuery(String(router.query.search));
        }
    }, [router.isReady, router.query.checkout, router.query.refreshPurchases, router.query.view, router.query.search]);

    // ============================================
    // FOCUS REFETCH - keeps purchased status fresh (full payment flow reliability)
    // ============================================
    // After paying on Stripe, the user might:
    // - Close the success tab and come back to the courses tab later, or
    // - The webhook might mark the purchase while the tab is in background.
    //
    // When the browser tab regains focus, we quietly re-fetch only the purchased list.
    // This way the CourseCard buttons update to "Purchased" without the user having to click
    // the "Back to courses" button or manually refresh the page.
    //
    // This makes the "buy → Stripe → back → purchased status updated" experience solid.
    useEffect(() => {
        const handleFocus = () => {
            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }

            axios.get(`/api/purchases`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((res) => {
                    setPurchasedCourseIds(res.data.courseIds ?? []);
                })
                .catch(() => {
                    // Silently ignore - user can still use the page or refresh manually.
                });
        };

        window.addEventListener("focus", handleFocus);

        // Clean up the listener when the component unmounts
        return () => {
            window.removeEventListener("focus", handleFocus);
        };
    }, []);

    const resetAddCourseForm = () => {
        setNewCourseTitle("");
        setNewCourseDescription("");
        setNewCoursePrice("");
        setNewCourseImageLink("");
    };

    // Admin-only: create a new course via POST /api/admin/courses.
    // The server will reject this with 403 if the user is not an admin.
    const addCourse = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/signin");
            return;
        }

        const price = Number(newCoursePrice);
        if (!newCourseTitle.trim() || !newCourseDescription.trim() || !newCourseImageLink.trim()) {
            showSnackbar("Please fill in title, description, and image link.", "warning");
            return;
        }

        if (!Number.isFinite(price) || price <= 0) {
            showSnackbar("Please enter a valid price greater than 0.", "warning");
            return;
        }

        setAddingCourse(true);

        try {
            await axios.post(
                `/api/admin/courses`,
                {
                    title: newCourseTitle.trim(),
                    description: newCourseDescription.trim(),
                    price,
                    imageLink: newCourseImageLink.trim(),
                    published: true,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setShowAddCourseDialog(false);
            resetAddCourseForm();
            await init();
            showSnackbar("Course added successfully!", "success");
        } catch (err) {
            const serverMessage = axios.isAxiosError(err) && err.response?.data?.message
                ? err.response.data.message
                : "Could not add course. Please try again.";
            showSnackbar(serverMessage, "error");
        } finally {
            setAddingCourse(false);
        }
    };

    const buyCourse = async (course: Course) => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/signin");
            return;
        }

        // Safety check: if this course is already in our purchased list, don't start checkout.
        // The CourseCard should disable the button when "bought" is true, but this guard
        // makes the function robust (defense in depth). Useful if the function is called
        // from other places later, or during fast clicks, or if state is slightly out of date.
        // It also avoids creating unnecessary Stripe sessions for courses the user owns.
        if (purchasedCourseIds.includes(course._id)) {
            showSnackbar("You already own this course. No need to buy it again!", "info");
            // Make sure we don't leave a stale loading id if somehow it was set.
            setBuyingCourseId(null);
            return;
        }

        // Set the loading state for THIS course right before we call Stripe.
        // This will make its button show "Processing..." and stay disabled.
        // We only reset this on error. On success, the redirect (window.location)
        // will take the user away, so the loading state "stays" until navigation.
        setBuyingCourseId(course._id);

        try {
            const response = await axios.post(`/api/stripe/create-checkout-session`, {
                course,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.url) {
                // Start the redirect to Stripe checkout.
                // The button on this card will remain in "Processing..." state
                // until the browser actually leaves the page.
                window.location.href = response.data.url;
                return;
            }

            // Stripe should always give us a url. If not, tell the user clearly.
            showSnackbar(
                "Stripe did not return a checkout link. Please wait a moment and try again.",
                "error"
            );
            setBuyingCourseId(null);
        } catch (err) {
            // Show the actual error message from the server when possible.
            // This helps with setup issues (missing STRIPE_SECRET_KEY, wrong .env.local, etc.).
            const serverMessage = axios.isAxiosError(err) && err.response?.data?.message
                ? err.response.data.message
                : "Could not start checkout. Check your internet connection and try again.";
            showSnackbar(serverMessage, "error");
            // Only clear the loading state if something went wrong.
            // This lets the user try the Buy button again on this card.
            setBuyingCourseId(null);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                <CircularProgress size={44} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ maxWidth: 560, mx: "auto", mt: 10, px: 2 }}>
                <Alert severity="error" action={<Button onClick={init}>Retry</Button>}>
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!courses.length) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh", px: 2 }}>
                <Typography variant="h6" color="text.secondary">
                    No courses available right now.
                </Typography>
            </Box>
        );
    }

    // Step 1: pick courses for the active tab (All vs My Purchases).
    const purchasedCourses = courses.filter((course) =>
        purchasedCourseIds.includes(course._id)
    );
    const tabCourses = activeView === "purchases" ? purchasedCourses : courses;

    // Step 2: apply search + published filter on top of the tab list.
    const displayedCourses = filterCourses(tabCourses, searchQuery, publishedOnly);

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            sx={{
                maxWidth: 1200,
                mx: "auto",
                px: { xs: 2, sm: 3 },
                py: { xs: 3, md: 4 },
            }}
        >
            {/* Page header — gives context and a cleaner top section */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                        Explore Courses
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Browse, search, and purchase courses to grow your skills.
                    </Typography>
                </Box>

                {/* Admin-only: add new courses */}
                {isAdmin && (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setShowAddCourseDialog(true)}
                        sx={{ flexShrink: 0 }}
                    >
                        Add Course
                    </Button>
                )}
            </Stack>

            {/* Stripe cancel message — shown when user returns from cancelled checkout */}
            {showCancelledMessage && (
                <Alert
                    severity="info"
                    onClose={() => setShowCancelledMessage(false)}
                    sx={{ mb: 3 }}
                >
                    Checkout was cancelled. No payment was taken.
                    You can try buying the course again whenever you&apos;re ready.
                </Alert>
            )}

            {/* Search + filter panel — grouped in a card for a cleaner look */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 2.5 },
                    mb: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                }}
            >
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
                    Find a course
                </Typography>

                <TextField
                    placeholder="Search by title or description..."
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="medium"
                />

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    sx={{ mt: 1.5 }}
                >
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={publishedOnly}
                                onChange={(e) => setPublishedOnly(e.target.checked)}
                            />
                        }
                        label="Show only published courses"
                    />

                    <Typography variant="body2" color="text.secondary">
                        {displayedCourses.length} course{displayedCourses.length === 1 ? "" : "s"} shown
                    </Typography>
                </Stack>
            </Paper>

            {/* Tabs — All Courses vs My Purchases (same logic as before) */}
            <Paper
                elevation={0}
                sx={{
                    mb: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    overflow: "hidden",
                }}
            >
                <Tabs
                    value={activeView}
                    onChange={(_, newValue) => setActiveView(newValue)}
                    variant="fullWidth"
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                >
                    <Tab label={`All Courses (${courses.length})`} value="all" />
                    <Tab
                        label={`My Purchases (${purchasedCourseIds.length})`}
                        value="purchases"
                    />
                </Tabs>

                {activeView === "purchases" && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ px: 2, py: 1.5, bgcolor: "background.default" }}
                    >
                        Courses you have bought appear here.
                    </Typography>
                )}
            </Paper>

            {/* Empty states */}
            {activeView === "purchases" && tabCourses.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        py: 8,
                        px: 3,
                        textAlign: "center",
                        border: "1px dashed",
                        borderColor: "divider",
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        You have not purchased any courses yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Switch to &quot;All Courses&quot; to browse and buy.
                    </Typography>
                    <Button variant="contained" onClick={() => setActiveView("all")}>
                        Browse All Courses
                    </Button>
                </Paper>
            ) : displayedCourses.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        py: 8,
                        px: 3,
                        textAlign: "center",
                        border: "1px dashed",
                        borderColor: "divider",
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No courses match your search or filters
                    </Typography>
                    <Button
                        variant="outlined"
                        sx={{ mt: 1 }}
                        onClick={() => {
                            setSearchQuery("");
                            setPublishedOnly(false);
                        }}
                    >
                        Clear search and filters
                    </Button>
                </Paper>
            ) : (
                /* Responsive grid — cards align neatly on all screen sizes */
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            lg: "repeat(3, 1fr)",
                        },
                        gap: 3,
                    }}
                >
                    {displayedCourses.map((course) => {
                        const isBought = purchasedCourseIds.includes(course._id);

                        return (
                            <CourseCard
                                key={course._id}
                                course={course}
                                bought={isBought}
                                onBuy={() => buyCourse(course)}
                                loading={buyingCourseId === course._id}
                                onViewDetails={() => setSelectedCourse(course)}
                            />
                        );
                    })}
                </Box>
            )}

            {/* Course detail modal — opens when user clicks a card */}
            <CourseDetailModal
                open={selectedCourse !== null}
                course={selectedCourse}
                bought={selectedCourse ? purchasedCourseIds.includes(selectedCourse._id) : false}
                loading={selectedCourse ? buyingCourseId === selectedCourse._id : false}
                onClose={() => setSelectedCourse(null)}
                onBuy={() => {
                    if (selectedCourse) {
                        buyCourse(selectedCourse);
                    }
                }}
            />

            {/* Admin-only dialog for creating a new course */}
            <Dialog
                open={showAddCourseDialog}
                onClose={() => {
                    if (!addingCourse) {
                        setShowAddCourseDialog(false);
                        resetAddCourseForm();
                    }
                }}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Add a new course</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        fullWidth
                        margin="normal"
                        value={newCourseTitle}
                        onChange={(e) => setNewCourseTitle(e.target.value)}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        margin="normal"
                        value={newCourseDescription}
                        onChange={(e) => setNewCourseDescription(e.target.value)}
                    />
                    <TextField
                        label="Price (INR)"
                        fullWidth
                        margin="normal"
                        type="number"
                        value={newCoursePrice}
                        onChange={(e) => setNewCoursePrice(e.target.value)}
                    />
                    <TextField
                        label="Image URL"
                        fullWidth
                        margin="normal"
                        value={newCourseImageLink}
                        onChange={(e) => setNewCourseImageLink(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setShowAddCourseDialog(false);
                            resetAddCourseForm();
                        }}
                        disabled={addingCourse}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={addCourse}
                        disabled={addingCourse}
                    >
                        {addingCourse ? "Saving..." : "Save Course"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for buy errors and purchase refresh success — replaces browser alert() */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Courses;
