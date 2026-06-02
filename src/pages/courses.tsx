import { Button, Card, CircularProgress, Typography } from "@mui/material";
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

    return <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
        {courses.map(course => {
            return <Course key={course._id} course={course} />;
        })}
    </div>;
}

export function Course({course}: {course: Course}) {
    const router = useRouter();

    return <Card style={{
        margin: 10,
        width: 300,
        minHeight: 200,
        padding: 20
    }}>
        <Typography textAlign={"center"} variant="h5">{course.title}</Typography>
        <Typography textAlign={"center"} variant="subtitle1">{course.description}</Typography>
        <img src={course.imageLink} style={{width: 300}} />
        <div style={{display: "flex", justifyContent: "center", marginTop: 20}}>
            <Button variant="contained" size="large" onClick={() => {
                router.push("/course/" + course._id);
            }}>Edit</Button>
        </div>
    </Card>;
}

export default Courses;
