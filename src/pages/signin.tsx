import { fetchCurrentUser } from "@/lib/fetchCurrentUser";
import { userState } from "@/store/atoms/user";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";

function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const setUser = useSetRecoilState(userState);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            setError("Please enter both email and password.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`/api/admin/login`, {
                username: email,
                password: password
            }, {
                headers: {
                    "Content-type": "application/json"
                }
            });
            const data = res.data;

            localStorage.setItem("token", data.token);

            const currentUser = await fetchCurrentUser(data.token);
            setUser({
                userEmail: currentUser.username,
                isAdmin: currentUser.isAdmin,
                isLoading: false,
            });
            router.push("/courses");
        } catch (err) {
            setError("Signin failed. Please check your credentials and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box 
            component="main" 
            sx={{ 
                display: "flex", 
                flexDirection: { xs: "column", md: "row" }, 
                minHeight: "100vh",
                bgcolor: "white"
            }}
        >
            {/* Left Column: Visual Branding Panel */}
            <Box 
                sx={{ 
                    flex: 1, 
                    display: "flex", 
                    flexDirection: "column", 
                    justifyContent: "center", 
                    px: { xs: 4, md: 8 }, 
                    py: { xs: 8, md: 16 }, 
                    color: "white", 
                    position: "relative", 
                    overflow: "hidden", 
                    bgcolor: "#0056cc", // Brand Blue
                    minHeight: { xs: "40vh", md: "auto" },
                    // Radial glow gradients
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: "-20%",
                        right: "-10%",
                        width: "60%",
                        height: "80%",
                        background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
                        filter: "blur(60px)",
                        borderRadius: "50%",
                        pointerEvents: "none",
                        zIndex: 1,
                    },
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: "-10%",
                        left: "-5%",
                        width: "40%",
                        height: "50%",
                        background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                        filter: "blur(40px)",
                        borderRadius: "50%",
                        pointerEvents: "none",
                        zIndex: 1,
                    }
                }}
            >
                {/* Brand Logo & Symbol (Top Left) */}
                <Box 
                    onClick={() => router.push("/")}
                    sx={{ 
                        position: "absolute", 
                        top: 32, 
                        left: 32, 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 1.5, 
                        cursor: "pointer",
                        zIndex: 20
                    }}
                >
                    <Box 
                        sx={{ 
                            width: 36, 
                            height: 36, 
                            bgcolor: "rgba(255, 255, 255, 0.1)", 
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: 1.5, 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            backdropFilter: "blur(8px)"
                        }}
                    >
                        <svg style={{ width: 22, height: 22, color: "white" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                            <path d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                    </Box>
                    <Typography 
                        sx={{ 
                            fontWeight: 800, 
                            fontSize: "1.25rem", 
                            color: "white", 
                            letterSpacing: "-0.03em",
                            fontFamily: '"Montserrat Variable", -apple-system, system-ui, sans-serif'
                        }}
                    >
                        Coursecean
                    </Typography>
                </Box>

                {/* Math Grid Pattern Overlay */}
                <Box 
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 0,
                        opacity: 0.8,
                        backgroundSize: "40px 40px",
                        backgroundImage: `
                            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
                        `
                    }}
                />

                {/* Branding Text */}
                <Box sx={{ position: "relative", zIndex: 10, maxWidth: 512 }}>
                    <Typography 
                        variant="h1" 
                        sx={{ 
                            fontSize: { xs: "2.25rem", md: "3rem" }, 
                            fontWeight: 800, 
                            lineHeight: 1.2, 
                            mb: 4,
                            letterSpacing: "-0.02em",
                            color: "#FFFFFF",
                            fontFamily: '"Montserrat Variable", -apple-system, system-ui, sans-serif'
                        }}
                    >
                        Master In-Demand Skills with Industry Experts
                    </Typography>
                    <Box 
                        sx={{ 
                            borderLeft: "4px solid", 
                            borderColor: "#60A5FA", // blue-400
                            pl: 2, 
                            display: "flex",
                            flexDirection: "column",
                            gap: 1
                        }}
                    >
                        <Typography 
                            sx={{ 
                                fontSize: "1.25rem", 
                                fontStyle: "italic", 
                                fontWeight: 300, 
                                opacity: 0.9,
                                color: "#FFFFFF"
                            }}
                        >
                            "The beautiful thing about learning is that no one can take it away from you."
                        </Typography>
                        <Typography 
                            sx={{ 
                                fontSize: "1.125rem", 
                                fontWeight: 500, 
                                color: "#BFDBFE" // blue-200
                            }}
                        >
                            — B.B. King
                        </Typography>
                    </Box>
                </Box>

                {/* Brand Footer */}
                <Box 
                    component="footer" 
                    sx={{ 
                        position: "absolute", 
                        bottom: 24, 
                        left: 32, 
                        fontSize: "0.75rem", 
                        color: "rgba(255, 255, 255, 0.6)", 
                        pointerEvents: "none",
                        display: { xs: "none", md: "block" }
                    }}
                >
                    © {new Date().getFullYear()} Coursecean Inc. All rights reserved.
                </Box>
            </Box>

            {/* Right Column: Sign In Form Card */}
            <Box 
                sx={{ 
                    flex: 1, 
                    bgcolor: "white", 
                    p: { xs: 4, md: 8 }, 
                    display: "flex", 
                    flexDirection: "column", 
                    justifyContent: "center", 
                    alignItems: "center" 
                }}
            >
                <Box sx={{ width: "100%", maxWidth: 400 }}>
                    {/* Form Welcome Header */}
                    <Box sx={{ mb: 5, textAlign: "left" }}>
                        <Typography 
                            variant="h2" 
                            sx={{ 
                                fontSize: "1.875rem", 
                                fontWeight: 800, 
                                color: "#1A1F36", // theme dark navy
                                mb: 1,
                                letterSpacing: "-0.025em",
                                fontFamily: '"Montserrat Variable", -apple-system, system-ui, sans-serif'
                            }}
                        >
                            Welcome Back
                        </Typography>
                        <Typography 
                            sx={{ 
                                color: "#6B7280", // gray-500
                                fontSize: "1rem"
                            }}
                        >
                            Sign in to continue learning and growing.
                        </Typography>
                    </Box>

                    {/* Sign In Form */}
                    <Box 
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                    >
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                            <TextField
                                id="email"
                                type="email"
                                placeholder="Email Address *"
                                required
                                fullWidth
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 3, // rounded-xl (12px)
                                        bgcolor: "white",
                                        "& fieldset": {
                                            borderColor: "#E5E7EB", // gray-200
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#D1D5DB", // gray-300
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#0056cc", // Brand Blue
                                            borderWidth: "2px",
                                        },
                                    },
                                    "& .MuiInputBase-input": {
                                        py: 2,
                                        px: 2,
                                        color: "#1F2937", // gray-800
                                    }
                                }}
                            />

                            <TextField
                                id="password"
                                type="password"
                                placeholder="Password *"
                                required
                                fullWidth
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 3, // rounded-xl (12px)
                                        bgcolor: "white",
                                        "& fieldset": {
                                            borderColor: "#E5E7EB", // gray-200
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#D1D5DB", // gray-300
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#0056cc", // Brand Blue
                                            borderWidth: "2px",
                                        },
                                    },
                                    "& .MuiInputBase-input": {
                                        py: 2,
                                        px: 2,
                                        color: "#1F2937", // gray-800
                                    }
                                }}
                            />
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            sx={{
                                py: 1.8,
                                bgcolor: "#0056cc", // Matches left panel brand blue
                                color: "#FFFFFF", // White text
                                fontWeight: 700,
                                borderRadius: 3, // rounded-xl (12px)
                                fontSize: "1rem",
                                textTransform: "none",
                                fontFamily: '"Montserrat Variable", -apple-system, system-ui, sans-serif',
                                boxShadow: "0 10px 15px -3px rgba(0, 86, 204, 0.2), 0 4px 6px -2px rgba(0, 86, 204, 0.1)",
                                transition: "all 0.2s",
                                "&:hover": {
                                    bgcolor: "#004bb3", // slightly darker brand blue on hover
                                    boxShadow: "0 12px 20px -3px rgba(0, 86, 204, 0.35)",
                                },
                                "&:active": {
                                    transform: "scale(0.98)",
                                }
                            }}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </Box>

                    {/* Sign Up Redirect Link */}
                    <Box sx={{ mt: 4, textAlign: "left" }}>
                        <Typography sx={{ color: "#4B5563", fontSize: "0.95rem" }}>
                            New to Coursecean?{" "}
                            <Box
                                component="span"
                                onClick={() => router.push("/signup")}
                                sx={{
                                    color: "#0056cc",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    "&:hover": {
                                        textDecoration: "underline",
                                    }
                                }}
                            >
                                Create an account
                            </Box>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default Signin;
