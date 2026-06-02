import { Button, Card, CircularProgress, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function Success() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [courseTitle, setCourseTitle] = useState("your course");
    const [message, setMessage] = useState("Verifying your payment...");

    useEffect(() => {
        const sessionId = router.query.session_id;

        if (typeof sessionId !== "string") {
            return;
        }

        const confirmPayment = async () => {
            try {
                const response = await axios.get(`/api/stripe/confirm?session_id=${sessionId}`);
                if (response.data.courseTitle) {
                    setCourseTitle(response.data.courseTitle);
                }
                setMessage("Payment completed successfully.");
            } catch (error) {
                setMessage("Payment was completed, but we could not verify it right now.");
            } finally {
                setLoading(false);
            }
        };

        confirmPayment();
    }, [router.query.session_id]);

    return <div style={{display: "flex", justifyContent: "center", paddingTop: 100, paddingInline: 16}}>
        <Card style={{maxWidth: 560, width: "100%", padding: 24}}>
            <Stack spacing={2}>
                <Typography variant="h4">Purchase complete</Typography>
                {loading ? <CircularProgress /> : <Typography variant="body1">{message}</Typography>}
                <Typography variant="body1">
                    You now have access to <strong>{courseTitle}</strong>.
                </Typography>
                <Button variant="contained" onClick={() => router.push("/courses")}>
                    Back to courses
                </Button>
            </Stack>
        </Card>
    </div>;
}

export default Success;
