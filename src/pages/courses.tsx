import { Alert, Button, Card, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router.js";
import { Course } from "@/store/atoms/course.js";

function Courses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [purchasedCourseIds, setPurchasedCourseIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

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

    const buyCourse = async (course: Course) => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/signin");
            return;
        }

        try {
            const response = await axios.post(`/api/stripe/create-checkout-session`, {
                course,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (err) {
            alert("Could not start checkout right now.");
        }
    };

    if (loading) {
        return <div style={{display: "flex", justifyContent: "center", paddingTop: 80}}>
            <CircularProgress />
        </div>;
    }

    if (error) {
        return <div style={{maxWidth: 560, margin: "80px auto 0", padding: "0 16px"}}>
            <Alert severity="error" action={<Button onClick={init}>Retry</Button>}>
                {error}
            </Alert>
        </div>;
    }

    if (!courses.length) {
        return <div style={{display: "flex", justifyContent: "center", paddingTop: 80}}>
            <Typography variant="h6">No courses available right now.</Typography>
        </div>;
    }

    return <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, padding: 16}}>
        {courses.map(course => {
            return <Course
                key={course._id}
                course={course}
                bought={purchasedCourseIds.includes(course._id)}
                onBuy={() => buyCourse(course)}
            />;
        })}
    </div>;
}

export function Course({course, bought, onBuy}: {course: Course, bought?: boolean, onBuy: () => void}) {
    const router = useRouter();

    return <Card style={{
        width: 320,
        minHeight: 360,
        padding: 20,
        display: "flex",
        flexDirection: "column"
    }}>
        <Typography textAlign={"center"} variant="h5">{course.title}</Typography>
        <Typography textAlign={"center"} variant="subtitle1" sx={{minHeight: 56, mt: 1}}>
            {course.description}
        </Typography>
        <Stack direction="row" spacing={1} justifyContent="center" sx={{mt: 1, flexWrap: "wrap"}}>
            <Chip label={`₹${course.price.toLocaleString()}`} size="small" />
            <Chip label={course.published ? "Published" : "Draft"} size="small" color={course.published ? "success" : "default"} variant="outlined" />
            {bought ? <Chip label="Purchased" size="small" color="primary" /> : null}
        </Stack>
        <div style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 180,
            overflow: "hidden",
            borderRadius: 8
        }}>
            <img src={course.imageLink} alt={course.title} style={{width: "100%", objectFit: "cover"}} />
        </div>
        <Stack direction="row" spacing={1} justifyContent="center" sx={{mt: "auto"}}>
            <Button variant="outlined" size="large" onClick={onBuy} disabled={bought}>
                {bought ? "Purchased" : "Buy course"}
            </Button>
            <Button variant="contained" size="large" onClick={() => {
                router.push("/course/" + course._id);
            }}>Edit</Button>
        </Stack>
    </Card>;
}

export default Courses;
