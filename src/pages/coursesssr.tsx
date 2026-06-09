import { Button, Card, Chip, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { Course } from "@/store/atoms/course";
import type { GetServerSidePropsContext } from "next";

function Courses({courses}: {courses: Course[]}) {
    if (!courses.length) {
        return <div style={{display: "flex", justifyContent: "center", paddingTop: 68}}>
            <Typography variant="h6">No courses available right now.</Typography>
        </div>;
    }

    return <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, padding: 16}}>
        {courses.map(course => {
            return <Course key={course._id} course={course} />;
        })}
    </div>;
}

function Course({course}: {course: Course}) {
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
            <Button
                variant="outlined"
                size="large"
                onClick={async () => {
                    const token = localStorage.getItem("token");

                    if (!token) {
                        router.push("/signin");
                        return;
                    }

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
                }}
            >
                Buy course
            </Button>
            <Button variant="contained" size="large" onClick={() => {
                router.push("/course/" + course._id);
            }}>Edit</Button>
        </Stack>
    </Card>;
}

export default Courses;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const forwardedProto = context.req.headers["x-forwarded-proto"];
    const protocol = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto ?? "http";
    const host = context.req.headers.host ?? "localhost:3000";

    const response = await axios.get(`${protocol}://${host}/api/admin/courses/`);

    return {
      props: {
        courses: response.data.courses,
      },
    };
}
