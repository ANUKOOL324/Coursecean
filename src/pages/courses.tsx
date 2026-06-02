import { Button, Card, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router.js";
import { Course } from "@/store/atoms/course.js";

function Courses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    const init = async () => {
        try {
            const response = await axios.get(`/api/admin/courses/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setCourses(response.data.courses);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        init();
    }, []);

    if (loading) {
        return <div style={{display: "flex", justifyContent: "center", paddingTop: 80}}>
            <CircularProgress />
        </div>;
    }

    if (!courses.length) {
        return <div style={{display: "flex", justifyContent: "center", paddingTop: 80}}>
            <Typography variant="h6">No courses available right now.</Typography>
        </div>;
    }

    return <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, padding: 16}}>
        {courses.map(course => {
            return <Course key={course._id} course={course} />;
        })}
    </div>;
}

export function Course({course}: {course: Course}) {
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
        <Stack direction="row" justifyContent="center" sx={{mt: "auto"}}>
            <Button variant="contained" size="large" onClick={() => {
                router.push("/course/" + course._id);
            }}>Edit</Button>
        </Stack>
    </Card>;
}

export default Courses;
