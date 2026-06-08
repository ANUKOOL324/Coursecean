import { Alert, Button, Card, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// Turn raw API error messages into friendlier text for the user.
function getFriendlyErrorMessage(serverMessage: string): string {
    if (serverMessage === "Payment not completed yet") {
        return "Your payment is still processing. Please wait a moment and refresh this page.";
    }

    if (serverMessage === "session_id is required") {
        return "No payment information was found. Please go back to the courses page and try again.";
    }

    if (serverMessage.includes("STRIPE_SECRET_KEY")) {
        return "Payment verification is not set up on the server. Please contact support.";
    }

    return serverMessage;
}

function Success() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [courseTitle, setCourseTitle] = useState("your course");
    const [message, setMessage] = useState("");

    // Only true when /api/stripe/confirm confirms payment_status === "paid".
    const [purchaseConfirmed, setPurchaseConfirmed] = useState(false);

    useEffect(() => {
        // router.query is empty on first render — wait until Next.js reads the URL.
        if (!router.isReady) {
            return;
        }

        const sessionId = router.query.session_id;

        if (typeof sessionId !== "string" || !sessionId) {
            setMessage("No payment information was found. Please go back to the courses page and try again.");
            setPurchaseConfirmed(false);
            setLoading(false);
            return;
        }

        const confirmPayment = async () => {
            try {
                const response = await axios.get(`/api/stripe/confirm?session_id=${sessionId}`);

                if (response.data.courseTitle) {
                    setCourseTitle(response.data.courseTitle);
                }

                setMessage("Your payment was confirmed. The course is now yours!");
                setPurchaseConfirmed(true);
            } catch (error) {
                // Read the helpful message from our API when available.
                let errorMessage =
                    "We could not verify your payment right now. If money was taken, please check your Stripe dashboard or contact support.";

                if (axios.isAxiosError(error) && error.response?.data?.message) {
                    errorMessage = getFriendlyErrorMessage(error.response.data.message);
                }

                setMessage(errorMessage);
                setPurchaseConfirmed(false);
            } finally {
                setLoading(false);
            }
        };

        confirmPayment();
    }, [router.isReady, router.query.session_id]);

    return (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 80, paddingInline: 16 }}>
            <Card style={{ maxWidth: 520, width: "100%", padding: 32 }}>
                <Stack spacing={3} alignItems="center">
                    {/* Simple status circle — no extra icon package needed */}
                    {loading ? (
                        <CircularProgress size={48} />
                    ) : (
                        <div
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 28,
                                fontWeight: "bold",
                                backgroundColor: purchaseConfirmed ? "#e8f5e9" : "#ffebee",
                                color: purchaseConfirmed ? "#2e7d32" : "#c62828",
                            }}
                        >
                            {purchaseConfirmed ? "✓" : "!"}
                        </div>
                    )}

                    <Typography variant="h4" textAlign="center">
                        {loading
                            ? "Verifying Payment"
                            : purchaseConfirmed
                              ? "Payment Successful!"
                              : "Verification Failed"}
                    </Typography>

                    {loading && (
                        <Typography variant="body1" textAlign="center" color="text.secondary">
                            Please wait while we confirm your payment with Stripe...
                        </Typography>
                    )}

                    {!loading && (
                        <Alert severity={purchaseConfirmed ? "success" : "error"} sx={{ width: "100%" }}>
                            {message}
                        </Alert>
                    )}

                    {purchaseConfirmed && (
                        <>
                            <Divider sx={{ width: "100%" }} />
                            <Stack spacing={1} alignItems="center">
                                <Typography variant="body1" textAlign="center">
                                    Thank you for your purchase!
                                </Typography>
                                <Typography variant="h6" textAlign="center" color="primary">
                                    {courseTitle}
                                </Typography>
                                <Typography variant="body2" textAlign="center" color="text.secondary">
                                    You can start learning right away from the courses page.
                                </Typography>
                            </Stack>
                        </>
                    )}

                    {/* 
                      Keep ?refreshPurchases=true so /courses re-fetches purchased IDs
                      and the just-bought course shows "Purchased" immediately.
                    */}
                    <Button
                        variant="contained"
                        onClick={() => router.push("/courses?refreshPurchases=true")}
                        fullWidth
                        disabled={loading}
                    >
                        {purchaseConfirmed ? "Go to My Courses" : "Back to Courses"}
                    </Button>
                </Stack>
            </Card>
        </div>
    );
}

export default Success;