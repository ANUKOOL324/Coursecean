import { Button, Card, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";

function Cancel() {
    const router = useRouter();

    return <div style={{display: "flex", justifyContent: "center", paddingTop: 100, paddingInline: 16}}>
        <Card style={{maxWidth: 560, width: "100%", padding: 24}}>
            <Stack spacing={2}>
                <Typography variant="h4">Checkout cancelled</Typography>
                <Typography variant="body1">
                    No payment was taken, so you can try again whenever you’re ready.
                </Typography>
                <Button variant="contained" onClick={() => router.push("/courses")}>
                    Back to courses
                </Button>
            </Stack>
        </Card>
    </div>;
}

export default Cancel;
