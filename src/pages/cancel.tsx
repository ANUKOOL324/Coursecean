import { Alert, Button, Card, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";

function Cancel() {
    const router = useRouter();

    // Dedicated cancel landing page for Stripe Checkout.
    //
    // In the current payment flow:
    // - create-checkout-session sets cancel_url to /courses?checkout=cancelled
    //   (keeps the user on the course list with a message so they can retry easily).
    //
    // This /cancel page is a clean fallback if cancel_url ever points here,
    // or if someone opens the link directly.
    //
    // Important: on cancel we NEVER mark anything as purchased.

    return (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 80, paddingInline: 16 }}>
            <Card style={{ maxWidth: 520, width: "100%", padding: 32 }}>
                <Stack spacing={3} alignItems="center">
                    <Typography variant="h4" textAlign="center">
                        Checkout Cancelled
                    </Typography>

                    <Alert severity="info" sx={{ width: "100%" }}>
                        No payment was taken. You can go back to the courses page and try again whenever you are ready.
                    </Alert>

                    <Button
                        variant="contained"
                        onClick={() => router.push("/courses")}
                        fullWidth
                    >
                        Back to Courses
                    </Button>
                </Stack>
            </Card>
        </div>
    );
}

export default Cancel;