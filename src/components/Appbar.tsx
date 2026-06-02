import { Button, Stack, Typography } from "@mui/material";
import { isUserLoading } from "../store/selectors/isUserLoading";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { userEmailState } from "../store/selectors/userEmail";
import { useRouter } from "next/router";
import { userState } from "@/store/atoms/user";

function Appbar() {
    const router = useRouter();
    const userLoading = useRecoilValue(isUserLoading);
    const userEmail = useRecoilValue(userEmailState);
    const setUser = useSetRecoilState(userState);

    if (userLoading) {
        return <></>;
    }

    const handleHome = () => {
        router.push("/");
    };

    const handleLogout = () => {
        localStorage.setItem("token", "");
        setUser({
            isLoading: false,
            userEmail: null
        });
        router.push("/");
    };

    return <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        background: "#fff",
        zIndex: 1
    }}>
        <Typography
            variant="h6"
            onClick={handleHome}
            sx={{cursor: "pointer", fontWeight: 700}}
        >
            Coursera
        </Typography>

        {userEmail ? <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" sx={{display: {xs: "none", sm: "block"}}}>
                {userEmail}
            </Typography>
            <Button
                variant="outlined"
                onClick={() => {
                    router.push("/courses");
                }}
            >
                Courses
            </Button>
            <Button
                variant="contained"
                onClick={handleLogout}
            >
                Logout
            </Button>
        </Stack> : <Stack direction="row" spacing={1} alignItems="center">
            <Button
                variant="outlined"
                onClick={() => {
                    router.push("/signup");
                }}
            >
                Signup
            </Button>
            <Button
                variant="contained"
                onClick={() => {
                    router.push("/signin");
                }}
            >
                Signin
            </Button>
        </Stack>}
    </div>;
}

export default Appbar;
