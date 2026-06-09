import { Box, Button, Chip, Stack, Typography, Avatar, Container, Tooltip, Drawer, List, ListItem, ListItemButton, ListItemText, Divider } from "@mui/material";
import { isAdminState } from "../store/selectors/isAdmin";
import { isUserLoading } from "../store/selectors/isUserLoading";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { userEmailState } from "../store/selectors/userEmail";
import { useRouter } from "next/router";
import { userState } from "@/store/atoms/user";
import React, { useState, useEffect, useRef } from "react";

function Appbar() {
    const router = useRouter();
    const userLoading = useRecoilValue(isUserLoading);
    const userEmail = useRecoilValue(userEmailState);
    const isAdmin = useRecoilValue(isAdminState);
    const setUser = useSetRecoilState(userState);

    const [scrolled, setScrolled] = useState(false);
    const [searchExpanded, setSearchExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Scroll listener to toggle header states
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Sync query string with URL if any
    useEffect(() => {
        if (router.query.search) {
            setSearchQuery(router.query.search as string);
            setSearchExpanded(true);
        }
    }, [router.query.search]);

    // Handle search submission
    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.push("/courses");
        }
    };

    // Helper to determine if search bar is currently expanded
    const isCurrentlyExpanded = () => {
        const isMobile = typeof window !== "undefined" && window.innerWidth < 600;
        if (isMobile) {
            return searchExpanded;
        } else {
            return !scrolled || searchExpanded;
        }
    };

    // Handle search icon click (collapsible on mobile/scrolled desktop, persistent on top desktop)
    const handleSearchIconClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isCurrentlyExpanded()) {
            setSearchExpanded(true);
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        } else if (searchQuery.trim()) {
            handleSearchSubmit();
        } else {
            const isMobile = typeof window !== "undefined" && window.innerWidth < 600;
            if (isMobile || scrolled) {
                setSearchExpanded(false);
            } else {
                searchInputRef.current?.focus();
            }
        }
    };

    // Handle search input blur
    const handleSearchInputBlur = () => {
        if (!searchQuery.trim()) {
            setSearchExpanded(false);
        }
    };

    const handleHome = () => {
        router.push("/");
    };

    const handleLogout = () => {
        localStorage.setItem("token", "");
        setUser({
            isLoading: false,
            userEmail: null,
            isAdmin: false,
        });
        setMobileMenuOpen(false);
        router.push("/");
    };

    const isLinkActive = (path: string, viewParam?: string) => {
        if (viewParam) {
            return router.pathname === path && router.query.view === viewParam;
        }
        return router.pathname === path && router.query.view !== "purchases";
    };

    // Hide Appbar on Auth screens (signin, signup) to prevent duplicates
    const isAuthPage = router.pathname === "/signin" || router.pathname === "/signup";
    if (userLoading || isAuthPage) {
        return <></>;
    }

    const navLinks = [
        { label: "Home", path: "/", param: undefined },
        { label: "Courses", path: "/courses", param: undefined },
        { label: "My Learning", path: "/courses", param: "purchases", authRequired: true }
    ];

    return (
        <>
            <Box
                component="header"
                id="top-app-bar"
                sx={{
                    position: "fixed",
                    top: 0,
                    width: "100%",
                    zIndex: 1000,
                    height: scrolled ? 48 : { xs: 56, md: 68 },
                    bgcolor: scrolled ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.9)", // Revert back to light/white color
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderBottom: "1px solid",
                    borderColor: scrolled ? "rgba(0, 0, 0, 0.05)" : "transparent",
                    boxShadow: scrolled ? "0 4px 20px -5px rgba(0, 0, 0, 0.05)" : "none",
                    display: "flex",
                    alignItems: "center",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    overflow: "hidden", // necessary for absolute grid overlay
                }}
            >
                {/* Math Grid Pattern Overlay - Dark/Grey lines for light background */}
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
                            linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
                        `,
                        pointerEvents: "none",
                    }}
                />

                <Container
                    maxWidth={false}
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: "100%",
                        px: { xs: 2, sm: 4, md: 6, lg: 8 },
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    {/* Left Brand, Hamburger & Navigation Links */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: { md: 4, lg: 5 }, height: "100%" }}>
                        {/* Brand and Hamburger Wrapper */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, height: "100%" }}>
                            {/* Hamburger Button (Mobile Only) */}
                            <Box
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                sx={{
                                    display: { xs: "flex", md: "none" },
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    width: 18,
                                    height: 12,
                                    cursor: "pointer",
                                    mr: 1,
                                    position: "relative",
                                    zIndex: 1100,
                                }}
                            >
                                <Box sx={{ width: 18, height: 2, bgcolor: "#1A1F36", transform: mobileMenuOpen ? "translateY(5px) rotate(45deg)" : "none", transition: "0.3s" }} />
                                <Box sx={{ width: 18, height: 2, bgcolor: "#1A1F36", opacity: mobileMenuOpen ? 0 : 1, transition: "0.3s" }} />
                                <Box sx={{ width: 18, height: 2, bgcolor: "#1A1F36", transform: mobileMenuOpen ? "translateY(-5px) rotate(-45deg)" : "none", transition: "0.3s" }} />
                            </Box>

                            {/* Logo and Brand Title */}
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                onClick={handleHome}
                                id="logo-text"
                                sx={{
                                    cursor: "pointer",
                                    userSelect: "none",
                                    transition: "all 0.3s ease",
                                    transform: scrolled ? "scale(0.95)" : "scale(1)",
                                    transformOrigin: "left center",
                                    "&:hover": { opacity: 0.85 },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        bgcolor: "rgba(0, 86, 210, 0.08)",
                                        border: "1px solid rgba(0, 86, 210, 0.16)",
                                        borderRadius: 1.5,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#0056D2" }}>
                                        school
                                    </span>
                                </Box>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 800,
                                        letterSpacing: "-0.03em",
                                        color: "primary.main",
                                        fontSize: "1.25rem",
                                        fontFamily: '"Montserrat Variable", -apple-system, system-ui, sans-serif'
                                    }}
                                >
                                    Coursecean
                                </Typography>
                            </Stack>
                        </Box>

                        {/* Navigation Links - Desktop Only */}
                        <Stack
                            direction="row"
                            spacing={3}
                            sx={{
                                display: { xs: "none", md: "flex" },
                                height: "100%",
                                alignItems: "stretch",
                            }}
                        >
                            {navLinks.map((link) => {
                                if (link.authRequired && !userEmail) return null;
                                const active = isLinkActive(link.path, link.param);
                                return (
                                    <Box
                                        key={link.label}
                                        onClick={() => {
                                            if (link.param) {
                                                router.push(`${link.path}?view=${link.param}`);
                                            } else {
                                                router.push(link.path);
                                            }
                                        }}
                                        sx={{
                                            height: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            cursor: "pointer",
                                            px: 0.5,
                                            "&:hover .nav-link-text": {
                                                color: "primary.main",
                                            },
                                            "&:hover .nav-link-text::after": {
                                                transform: "scaleX(1)",
                                                backgroundColor: active ? "primary.main" : "rgba(0, 86, 210, 0.4)",
                                            }
                                        }}
                                    >
                                        <Typography
                                            className="nav-link-text"
                                            component="span"
                                            sx={{
                                                position: "relative",
                                                color: active ? "primary.main" : "text.primary",
                                                fontWeight: 600,
                                                fontSize: "0.85rem", // Decreased font size a bit
                                                fontFamily: '"Montserrat Variable", -apple-system, system-ui, sans-serif',
                                                transition: "color 0.2s ease",
                                                // Underline Indicator close to the text
                                                "&::after": {
                                                    content: '""',
                                                    position: "absolute",
                                                    bottom: -6,
                                                    left: 0,
                                                    width: "100%",
                                                    height: "3px",
                                                    backgroundColor: "primary.main",
                                                    borderRadius: "3px 3px 0 0",
                                                    transform: active ? "scaleX(1)" : "scaleX(0)",
                                                    transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                                                    transformOrigin: "center",
                                                }
                                            }}
                                        >
                                            {link.label}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Stack>
                    </Box>

                    {/* Right Toolbar: Search and Auth */}
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ height: "100%" }}>
                        {/* Interactive Collapsible Search */}
                        <Box
                            component="form"
                            onSubmit={handleSearchSubmit}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                height: 40,
                                transition: "all 0.3s ease",
                                width: { xs: searchExpanded ? 150 : 40, sm: (!scrolled || searchExpanded) ? 200 : 40, md: (!scrolled || searchExpanded) ? 240 : 40 },
                                bgcolor: { xs: searchExpanded ? "rgba(0, 0, 0, 0.03)" : "transparent", sm: (!scrolled || searchExpanded) ? "rgba(0, 0, 0, 0.03)" : "transparent" },
                                border: { xs: searchExpanded ? "1px solid rgba(0, 0, 0, 0.08)" : "none", sm: (!scrolled || searchExpanded) ? "1px solid rgba(0, 0, 0, 0.08)" : "none" },
                                borderRadius: 99,
                                px: { xs: searchExpanded ? 1.5 : 0, sm: (!scrolled || searchExpanded) ? 1.5 : 0 },
                                overflow: "hidden",
                                "&:focus-within": {
                                    bgcolor: "#FFFFFF",
                                    borderColor: "primary.main",
                                    boxShadow: "0 0 0 3px rgba(0, 86, 210, 0.1)",
                                }
                            }}
                        >
                            <Box
                                component="span"
                                className="material-symbols-outlined"
                                onClick={handleSearchIconClick}
                                sx={{
                                    fontSize: 22,
                                    color: "text.secondary",
                                    cursor: "pointer",
                                    p: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    userSelect: "none",
                                }}
                            >
                                search
                            </Box>
                            <Box
                                component="input"
                                type="text"
                                ref={searchInputRef}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onBlur={handleSearchInputBlur}
                                placeholder="Search courses..."
                                sx={{
                                    display: { xs: searchExpanded ? "block" : "none", sm: (!scrolled || searchExpanded) ? "block" : "none" },
                                    width: "100%",
                                    bgcolor: "transparent",
                                    border: "none",
                                    outline: "none",
                                    fontSize: "0.875rem",
                                    color: "text.primary",
                                    ml: 1,
                                    "&::placeholder": {
                                        color: "text.secondary",
                                        opacity: 0.6,
                                    }
                                }}
                            />
                        </Box>

                        {/* Profile or Login Buttons */}
                        {userEmail ? (
                            <>
                                <Tooltip title={`Logged in as ${userEmail}`} arrow>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                        sx={{
                                            display: { xs: "none", sm: "flex" },
                                            bgcolor: "rgba(0, 86, 210, 0.04)",
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: "20px",
                                            border: "1px solid rgba(0, 86, 210, 0.08)",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                            "&:hover": {
                                                bgcolor: "rgba(0, 86, 210, 0.08)",
                                            }
                                        }}
                                    >
                                        <Avatar sx={{ bgcolor: "primary.main", width: 26, height: 26, fontSize: "12px", fontWeight: 700 }}>
                                            {userEmail.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", fontSize: "0.85rem" }}>
                                            Profile
                                        </Typography>
                                    </Stack>
                                </Tooltip>
                                {isAdmin && (
                                    <Chip
                                        label="Admin"
                                        size="small"
                                        color="secondary"
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: "10px",
                                            height: 18,
                                            borderRadius: "4px",
                                            letterSpacing: "0.02em",
                                            display: { xs: "none", sm: "inline-flex" }
                                        }}
                                    />
                                )}
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={handleLogout}
                                    sx={{
                                        height: 36,
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontSize: "0.85rem", // Decreased font size a bit
                                        fontFamily: '"Montserrat Variable", -apple-system, system-ui, sans-serif'
                                    }}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => router.push("/signup")}
                                    sx={{
                                        px: 2,
                                        height: 36,
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontSize: "0.85rem", // Decreased font size a bit
                                        fontFamily: '"Montserrat Variable", -apple-system, system-ui, sans-serif'
                                    }}
                                >
                                    Sign up
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => router.push("/signin")}
                                    sx={{
                                        px: 2,
                                        height: 36,
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontSize: "0.85rem", // Decreased font size a bit
                                        fontFamily: '"Montserrat Variable", -apple-system, system-ui, sans-serif'
                                    }}
                                >
                                    Log in
                                </Button>
                            </>
                        )}
                    </Stack>
                </Container>
            </Box>

            {/* Mobile Drawer Menu */}
            <Drawer
                anchor="left"
                open={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                PaperProps={{
                    sx: {
                        width: 280,
                        bgcolor: "background.paper",
                        p: 3,
                    }
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#0056D2" }}>
                        school
                    </span>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 800,
                            color: "primary.main",
                            fontSize: "1.25rem",
                            fontFamily: '"Montserrat Variable", -apple-system, system-ui, sans-serif'
                        }}
                    >
                        Coursecean
                    </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />

                <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {navLinks.map((link) => {
                        if (link.authRequired && !userEmail) return null;
                        const active = isLinkActive(link.path, link.param);
                        return (
                            <ListItem key={link.label} disablePadding>
                                <ListItemButton
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        if (link.param) {
                                            router.push(`${link.path}?view=${link.param}`);
                                        } else {
                                            router.push(link.path);
                                        }
                                    }}
                                    sx={{
                                        borderRadius: 2,
                                        bgcolor: active ? "rgba(0, 86, 210, 0.04)" : "transparent",
                                    }}
                                >
                                    <ListItemText
                                        primary={link.label}
                                        primaryTypographyProps={{
                                            fontWeight: active ? 700 : 500,
                                            color: active ? "primary.main" : "text.primary",
                                            fontSize: "0.95rem"
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>

                <Box sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {userEmail ? (
                        <>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1 }}>
                                <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32, fontSize: "14px", fontWeight: 700 }}>
                                    {userEmail.charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "text.secondary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {userEmail}
                                </Typography>
                            </Box>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleLogout}
                                sx={{
                                    py: 1,
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontFamily: '"Montserrat Variable", -apple-system, system-ui, sans-serif'
                                }}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    router.push("/signup");
                                }}
                                sx={{
                                    py: 1,
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontSize: "0.875rem",
                                    fontFamily: '"Montserrat Variable", -apple-system, system-ui, sans-serif'
                                }}
                            >
                                Sign up
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    router.push("/signin");
                                }}
                                sx={{
                                    py: 1,
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontSize: "0.875rem",
                                    fontFamily: '"Montserrat Variable", -apple-system, system-ui, sans-serif'
                                }}
                            >
                                Log in
                            </Button>
                        </>
                    )}
                </Box>
            </Drawer>
        </>
    );
}

export default Appbar;
