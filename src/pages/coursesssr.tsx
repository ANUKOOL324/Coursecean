import { Button, Card, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router.js";
import { Course } from "@/store/atoms/course.js";
import type { GetServerSidePropsContext } from "next";

function Courses({courses}: {courses: Course[]}) {
    return <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
        {courses.map(course => {
            return <Course course={course} />}
        )}
    </div>
}

function Course({course}: {course: Course}) {
    const router = useRouter();

    return <Card style={{
        margin: 10,
        width: 300,
        minHeight: 200,
        padding: 20
    }}>
        <Typography textAlign={"center"} variant="h5">{course.title}</Typography>
        <Typography textAlign={"center"} variant="subtitle1">{course.description}</Typography>
        <img src={course.imageLink} style={{width: 300}} ></img>
        <div style={{display: "flex", justifyContent: "center", marginTop: 20}}>
            <Button variant="contained" size="large" onClick={() => {
                router.push("/course/" + course._id);
            }}>Edit</Button>
        </div>
    </Card>
}

export default Courses;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    console.log("hit here")
    const forwardedProto = context.req.headers["x-forwarded-proto"];
    const protocol = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto ?? "http";
    const host = context.req.headers.host ?? "localhost:3000";

    const response = await axios.get(`${protocol}://${host}/api/admin/courses/`, {
        headers: {
            // Authorization: `Bearer ${localStorage.getItem('token')}`  //can't use u need to understand the use of the cookies here
        }
    })
    console.log(response.data);

    return {
      props: {
        courses: response.data.courses,
      },
    };
  }
  
