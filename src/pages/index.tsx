import { isAdminState } from '@/store/selectors/isAdmin';
import { isUserLoading } from '@/store/selectors/isUserLoading';
import { userEmailState } from '@/store/selectors/userEmail';
import { motion } from "motion/react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Avatar,
  AvatarGroup,
  Divider,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

export default function Home() {
  const router = useRouter();

  // Load auth state from Recoil to toggle CTAs dynamically
  const userEmail = useRecoilValue(userEmailState);
  const userLoading = useRecoilValue(isUserLoading);
  const isAdmin = useRecoilValue(isAdminState);

  // Search input state
  const [searchVal, setSearchVal] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      router.push('/courses');
    }
  };

  // Custom font family for the Top Rated Specializations section
  const specFontFamily = '"Montserrat Variable", "Montserrat", -apple-system, system-ui, sans-serif';

  // Shared mobile overflow / button guards
  const sectionMobileSx = {
    overflow: { xs: 'hidden', md: 'visible' },
    maxWidth: '100%',
    width: '100%',
  };

  const containerMobileSx = {
    px: { xs: 2, sm: 3 },
    maxWidth: '100%',
    overflow: { xs: 'hidden', md: 'visible' },
  };

  const btnMobileSx = {
    textTransform: 'none',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    minWidth: 0,
  };

  const cardMobileSx = {
    overflow: 'hidden',
    maxWidth: '100%',
  };

  // List of trusted partner companies for the infinite marquee ribbon (Academic Excellence Edition)
  const partnerCompanies = [
    { name: 'STANFORD', icon: 'school' },
    { name: 'Google', icon: 'search' },
    { name: 'IBM', icon: 'terminal' },
    { name: 'Meta', icon: 'language' },
    { name: 'MIT', icon: 'account_balance' },
    { name: 'HARVARD', icon: 'history_edu' },
    { name: 'Microsoft', icon: 'grid_view' },
    { name: 'Amazon', icon: 'shopping_cart' },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', overflowX: 'hidden', width: '100%' }}>
      
      {/* 1. Hero Section */}
      <Box
        component={motion.section}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.215, 0.61, 0.355, 1] }}
        sx={{
          ...sectionMobileSx,
          minHeight: { md: 'calc(100vh - 68px)', xs: 'auto' },
          display: 'flex',
          alignItems: 'center',
          py: { xs: 6, md: 8 },
          position: 'relative',
        }}
      >
        <Container maxWidth="lg" sx={containerMobileSx}>
          <Grid container spacing={3} alignItems="center" sx={{ minWidth: 0 }}>
            {/* Hero text and search */}
            <Grid item xs={12} md={7} sx={{ minWidth: 0 }}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' }, pr: { md: 3 }, maxWidth: '100%', overflow: { xs: 'hidden', md: 'visible' } }}>
                {/* Premium Introduction Badge */}
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '20px',
                    bgcolor: 'rgba(0, 86, 210, 0.06)',
                    border: '1px solid rgba(0, 86, 210, 0.12)',
                    mb: 1.5,
                    maxWidth: '100%',
                    overflow: 'hidden',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#0056D2' }}>school</span>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#0056D2',
                      fontSize: '0.7rem',
                      fontFamily: specFontFamily,
                    }}
                  >
                    Next-Gen Academic Excellence
                  </Typography>
                </Box>

                <Typography
                  component="h1"
                  sx={{
                    letterSpacing: '-0.03em',
                    lineHeight: 1.1,
                    color: '#1A1F36',
                    mb: 2,
                    textAlign: { xs: 'center', md: 'left' },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      display: 'block',
                      fontFamily: specFontFamily, // Montserrat Variable
                      fontWeight: 800,
                      fontSize: { xs: '1.85rem', sm: '2.25rem', md: '2.5rem', lg: '3rem' },
                      mb: 0.5,
                    }}
                  >
                    Accelerate Your Career with
                  </Box>
                  <Box 
                    component="span" 
                    sx={{ 
                      position: 'relative',
                      display: 'block',
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontStyle: 'italic',
                      fontWeight: 700,
                      fontSize: { xs: '1.85rem', sm: '2.75rem', md: '3.15rem', lg: '3.75rem' },
                      color: '#0056D2',
                      pb: { xs: '4px', md: '8px' },
                      maxWidth: '100%',
                      overflow: 'hidden',
                      wordBreak: 'break-word',
                    }}
                  >
                    Industry-Recognized Skills
                    <Box
                      component="svg"
                      viewBox="0 0 300 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '8px',
                        color: '#0056D2',
                        opacity: 0.25,
                        display: { xs: 'none', sm: 'block' },
                      }}
                    >
                      <path
                        d="M3 9C118.5 2.5 220.5 2.5 297 9"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </Box>
                  </Box>
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    lineHeight: 1.5,
                    mb: 3,
                    maxWidth: 580,
                    mx: { xs: 'auto', md: 0 },
                    fontFamily: specFontFamily,
                    px: { xs: 0.5, sm: 0 },
                    overflow: 'hidden',
                  }}
                >
                  Master in-demand skills from world-class universities and companies. Join 1M+ learners achieving their goals today.
                </Typography>

                {/* Dual Path CTA Buttons */}
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  justifyContent={{ xs: 'center', md: 'flex-start' }}
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  sx={{ mb: 3, width: '100%', overflow: { xs: 'hidden', md: 'visible' } }}
                >
                  <Button
                    variant="contained"
                    onClick={() => router.push(userEmail ? '/courses' : '/signup')}
                    sx={{
                      ...btnMobileSx,
                      px: 3,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: { xs: '0.875rem', sm: '0.95rem' },
                      minHeight: 44,
                      width: { xs: '100%', sm: 'auto' },
                      fontFamily: specFontFamily,
                    }}
                  >
                    Enroll for Free
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => router.push('/courses')}
                    startIcon={<span className="material-symbols-outlined">play_circle</span>}
                    sx={{
                      ...btnMobileSx,
                      px: 3,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: { xs: '0.875rem', sm: '0.95rem' },
                      minHeight: 44,
                      width: { xs: '100%', sm: 'auto' },
                      borderColor: 'divider',
                      color: 'text.primary',
                      fontFamily: specFontFamily,
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'rgba(0, 86, 210, 0.04)',
                      },
                      '& .MuiButton-startIcon': { flexShrink: 0 },
                    }}
                  >
                    Watch Preview
                  </Button>
                </Stack>

                {/* Trust Signals */}
                <Grid container spacing={2} sx={{ minWidth: 0 }}>
                  <Grid item xs={6} sm={4} sx={{ minWidth: 0 }}>
                    <Box sx={{ bgcolor: 'rgba(26, 31, 54, 0.02)', p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', textAlign: { xs: 'center', md: 'left' }, overflow: 'hidden' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', fontFamily: specFontFamily, fontSize: '1.15rem' }}>1M+</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontFamily: specFontFamily, fontSize: '0.7rem' }}>Active Students</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={4} sx={{ minWidth: 0 }}>
                    <Box sx={{ bgcolor: 'rgba(26, 31, 54, 0.02)', p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', textAlign: { xs: 'center', md: 'left' }, overflow: 'hidden' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', fontFamily: specFontFamily, fontSize: '1.15rem' }}>4.9/5</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontFamily: specFontFamily, fontSize: '0.7rem' }}>Course Rating</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ minWidth: 0 }}>
                    <Box sx={{ bgcolor: 'rgba(26, 31, 54, 0.02)', p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', textAlign: { xs: 'center', md: 'left' }, overflow: 'hidden' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', fontFamily: specFontFamily, fontSize: '1.15rem' }}>2000+</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontFamily: specFontFamily, fontSize: '0.7rem' }}>Partner Companies</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Collage & Glass Badge */}
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ position: 'relative', width: '100%', pl: 2 }}>
                {/* Main Hero Image */}
                <Box
                  sx={{
                    borderRadius: 6,
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                    border: '8px solid #FFFFFF',
                    height: 340, // optimized height to fit frame beautifully
                  }}
                >
                  <Box
                    component="img"
                    alt="Professional student learning online"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJIKaoBUZ297tyS-nKEcAMh6B4tOOSBXbHgjeeep4bML9pZv4_gnk-lTZns2DBzNXgFmS5CCZBA6iY1jEOykA0nxiCf2IFKaxCJaY4xFkMWE0cxl69q90sKOP4mQoWfyyI3EF9E-8i62nR7eItw5blQqjVE-NC8wMZndsi8bsB6L-6G0284Dx7Z7rV-JGA9swUQO2OX4oSmCiwvOs7z_IgQCE1aUnjGn4RXSNB1KgUJjw3ppeLFMqGQf3qdLwD00nG1y6Nj7G15zc"
                    sx={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
                  />
                </Box>

                {/* Floating Glassmorphic Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    zIndex: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.75)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    py: 1, // reduced vertical padding
                    px: 2, // wider horizontal padding for visual balance
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 32, // slightly smaller circle to match text baseline
                      height: 32,
                      bgcolor: 'secondary.light',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      flexShrink: 0,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                      verified
                    </span>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.25, fontFamily: specFontFamily, fontSize: '0.85rem' }}>
                      Verified Content
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px', fontFamily: specFontFamily, display: 'block', mt: 0.25 }}>
                      Industry Expert Led
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 2. Partners Ribbon */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.2, ease: [0.215, 0.61, 0.355, 1], delay: 0.05 }}
        sx={{
          ...sectionMobileSx,
          borderY: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          bgcolor: '#1A1F36',
          py: 3,
          position: 'relative',
        }}
      >
        <Container maxWidth="lg" sx={{ ...containerMobileSx, position: 'relative', zIndex: 1 }}>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontWeight: 700,
              color: '#EAF4FF',
              opacity: 0.9,
              fontSize: '0.65rem',
              mb: 2.5,
            }}
          >
            TRUSTED BY 2000+ COMPANIES
          </Typography>
        </Container>

        {/* Infinite Marquee Container */}
        <Box
          sx={{
            overflow: 'hidden',
            width: '100%',
            position: 'relative',
            // Fade out overlay on edges matching background (#1A1F36)
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: { xs: 40, sm: 80 },
              zIndex: 2,
              pointerEvents: 'none',
            },
            '&::before': {
              left: 0,
              background: 'linear-gradient(to right, #1A1F36 20%, rgba(26, 31, 54, 0))',
            },
            '&::after': {
              right: 0,
              background: 'linear-gradient(to left, #1A1F36 20%, rgba(26, 31, 54, 0))',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: 'max-content',
              animation: 'marqueePartners 65s linear infinite',
              '&:hover': {
                animationPlayState: 'paused',
              },
              '@keyframes marqueePartners': {
                '0%': {
                  transform: 'translateX(0)',
                },
                '100%': {
                  transform: 'translateX(-50%)',
                },
              },
            }}
          >
            {/* Group 1 */}
            <Stack direction="row" spacing={8} sx={{ pr: 8 }}>
              {partnerCompanies.map((partner, index) => (
                <Stack
                  key={`partner-g1-${index}`}
                  direction="row"
                  spacing={0.75}
                  alignItems="center"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 0.65,
                    transition: 'all 0.25s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.95,
                      color: '#88A9FF', // Theme pastel blue on hover
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
                    {partner.icon}
                  </span>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'inherit' }}>
                    {partner.name}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            {/* Group 2 (duplicate for seamless loop) */}
            <Stack direction="row" spacing={8} sx={{ pr: 8 }}>
              {partnerCompanies.map((partner, index) => (
                <Stack
                  key={`partner-g2-${index}`}
                  direction="row"
                  spacing={0.75}
                  alignItems="center"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 0.65,
                    transition: 'all 0.25s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.95,
                      color: '#88A9FF', // Theme pastel blue on hover
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
                    {partner.icon}
                  </span>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'inherit' }}>
                    {partner.name}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* 3. Bento Grid - Most Popular Courses */}
      <Box
        component={motion.section}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.3, ease: [0.215, 0.61, 0.355, 1] }}
        sx={{
          ...sectionMobileSx,
          py: { xs: 4, md: 6 },
          bgcolor: '#F5F7FB',
          borderY: '1px solid rgba(142, 146, 141, 0.15)',
          position: 'relative',
        }}
      >
        {/* Background Grid Layer */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
            backgroundImage: `
              linear-gradient(rgba(142, 146, 141, 0.16) 1px, transparent 1px),
              linear-gradient(90deg, rgba(142, 146, 141, 0.16) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Shaded cell layer removed per user request to simplify math background */}

        <Container maxWidth="lg" sx={{ ...containerMobileSx, position: 'relative', zIndex: 1 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
            spacing={1}
            sx={{ mb: 2.5, overflow: { xs: 'hidden', md: 'visible' } }}
          >
            <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em', fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2rem' } }}>
                Most Popular Courses
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                Top-rated pathways chosen by our community.
              </Typography>
            </Box>
            <Button
              variant="text"
              onClick={() => router.push('/courses')}
              endIcon={<span className="material-symbols-outlined">arrow_forward</span>}
              sx={{ ...btnMobileSx, fontWeight: 600, display: { xs: 'none', md: 'inline-flex' } }}
            >
              View all courses
            </Button>
          </Stack>

          <Grid container spacing={3} sx={{ minWidth: 0 }}>
            {/* Large Featured Course Card (Cybersecurity) */}
            <Grid item xs={12} md={8} sx={{ minWidth: 0 }}>
              <Card
                sx={{
                  ...cardMobileSx,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                  },
                }}
              >
                <Box sx={{ position: 'relative', height: { xs: 200, sm: 260 }, overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    image="https://lh3.googleusercontent.com/aida-public/AB6AXuB9yI2hNeup_S-A9xMCfIY3yM1gmWJXAP8G459kHiKaDYQvlNd6WSFQFLy4MwO207XPmjAeLbhsy1xdwtxkOagt5QYzrJuW-t-ijqARBbmm99nI-R_ShYMzYCfz8rkAhNy-frIuLFn76Ev0B5SNb_QfmjPpvHV6T3hEiK2776mG2usUJ9NuE6i3tyCtHbEvkwF3uMDcVr1gnwckoIp8uWydE7pMEE9GEHw9MO9qr3xeNpGSzsD3EO4YpuQbHeN_HSonYTgpmtu2upU"
                    alt="Cybersecurity essentials"
                    sx={{ height: '100%', objectFit: 'cover' }}
                  />
                  <Chip
                    label="Best Seller"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      fontWeight: 700,
                    }}
                  />
                </Box>
                <CardContent sx={{ p: { xs: 2, sm: 2.5 }, flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', rowGap: 0.5, overflow: 'hidden' }} alignItems="center">
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'warning.main', flexShrink: 0 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <Typography variant="body2" sx={{ fontWeight: 700, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                        4.9
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      (12.4k reviews)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      • 12 Weeks
                    </Typography>
                  </Stack>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      mb: 1,
                      fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                      overflow: 'hidden',
                      wordBreak: 'break-word',
                    }}
                  >
                    Cybersecurity Essentials & Ethical Hacking
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.6, fontSize: { xs: '0.8rem', sm: '0.875rem' }, overflow: 'hidden' }}>
                    Learn how to protect networks and systems from digital attacks with hands-on labs.
                  </Typography>
                  <Divider sx={{ mt: 'auto', mb: 1.5 }} />
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                    spacing={1.5}
                    sx={{ overflow: 'hidden' }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, overflow: 'hidden' }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: 12, flexShrink: 0 }}>SJ</Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        Dr. Sarah Jenkins
                      </Typography>
                    </Stack>
                    <Button
                      variant="contained"
                      onClick={() => router.push('/courses')}
                      sx={{
                        ...btnMobileSx,
                        bgcolor: '#C2FFD1',
                        color: '#1A1F36',
                        '&:hover': { bgcolor: '#9EFEB0' },
                        fontWeight: 700,
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        minHeight: 40,
                        width: { xs: '100%', sm: 'auto' },
                        flexShrink: 0,
                      }}
                    >
                      Enroll Now
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Sidebar Smaller Cards */}
            <Grid item xs={12} md={4} sx={{ minWidth: 0 }}>
              <Stack spacing={2} sx={{ height: '100%' }}>
                {/* Sidebar Card 1 */}
                <Card
                  sx={{
                    ...cardMobileSx,
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': { boxShadow: '0 12px 30px rgba(0,0,0,0.08)' },
                  }}
                >
                  <CardMedia
                    component="img"
                    image="https://lh3.googleusercontent.com/aida-public/AB6AXuAo-zV_q507UQBx1T6JdvoAIsrMl-OkNWhrXxO3_OAmudNDCJPOlNt5VkrJwfr6fVNFojn5zWMNk82isk52Fy4l1DwokZQ5tFdbhxAZApFqXWvSsxhVaAUjRu79Ly_vm7icUzJ9NJhNGnM4sOYIXCrh7rcVPdmvdafmESgUTKDgzUkN-FtRIdA7jfkkqndpiHiOUsEmZWn87Br5i6ckNSfIczfH1i7K5T2ZtCGOqQrWIxIHgh05QxYTyoXxtDVKIS2dB53SUWwjoEc"
                    alt="UI/UX"
                    sx={{ height: 115, objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: { xs: 1.5, sm: 2 }, overflow: 'hidden' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '0.95rem', sm: '1.1rem' }, overflow: 'hidden', wordBreak: 'break-word' }}>
                      UI/UX Design Systems
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' }, overflow: 'hidden' }}>
                      Master Figma and modern design principles.
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                      $89.99
                    </Typography>
                  </CardContent>
                </Card>

                {/* Sidebar Card 2 */}
                <Card
                  sx={{
                    ...cardMobileSx,
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': { boxShadow: '0 12px 30px rgba(0,0,0,0.08)' },
                  }}
                >
                  <CardMedia
                    component="img"
                    image="https://lh3.googleusercontent.com/aida-public/AB6AXuCGKa6JdO4h1fkXBnxdA1GGKRV6LHvPfjNZ79pVUv6EYd8UhbxhE2M5AtJsem25-mZqzK0hN-dSCikT1o6T433IhaKArtRkgLXYzy-5MXF98FUZEtjBRSkYBbiYKthM1hKQibKLi3TgFmSrjc9ti8xgVz75Gphq5arAM9Q3HcBWXObBI94FtjvGDzg6ZBJzEzzaJItCjSzXWR7x6Ry9REkn2Jf4bdBRn_JqgS7IB_ajThty68J04cud-xiWfJIa3NE90-Ecn4d8qC0"
                    alt="Data Science"
                    sx={{ height: 115, objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: { xs: 1.5, sm: 2 }, overflow: 'hidden' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '0.95rem', sm: '1.1rem' }, overflow: 'hidden', wordBreak: 'break-word' }}>
                      Data Science with Python
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' }, overflow: 'hidden' }}>
                      Analyze complex datasets and build models.
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                      $94.00
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 4. Top Rated Specializations (Horizontal Scroll) */}
      <Box
        component={motion.section}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.3, ease: [0.215, 0.61, 0.355, 1] }}
        sx={{ ...sectionMobileSx, py: { xs: 4, md: 6 }, bgcolor: '#1A1F36', borderY: '1px solid rgba(255, 255, 255, 0.06)' }}
      >
        <Container maxWidth="lg" sx={containerMobileSx}>
          <Box sx={{ mb: 2.5, overflow: 'hidden' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF', fontFamily: specFontFamily, fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2rem' } }}>
              Top Rated Specializations
            </Typography>
          </Box>

          {/* Infinite Marquee Container */}
          <Box
            sx={{
              overflow: 'hidden',
              width: '100%',
              position: 'relative',
              py: 0.5,
              // Fade out overlay on edges
              '&::before, &::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: { xs: 30, sm: 60 },
                zIndex: 2,
                pointerEvents: 'none',
              },
              '&::before': {
                left: 0,
                background: 'linear-gradient(to right, #1A1F36 20%, rgba(26, 31, 54, 0))',
              },
              '&::after': {
                right: 0,
                background: 'linear-gradient(to left, #1A1F36 20%, rgba(26, 31, 54, 0))',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                width: 'max-content',
                animation: 'marqueeSpec 65s linear infinite',
                '&:hover': {
                  animationPlayState: 'paused',
                },
                '@keyframes marqueeSpec': {
                  '0%': {
                    transform: 'translateX(0)',
                  },
                  '100%': {
                    transform: 'translateX(-50%)',
                  },
                },
              }}
            >
              {/* Group 1 */}
              <Box sx={{ display: 'flex', gap: 3, pr: 3 }}>
                {[
                  {
                    title: 'AI & Machine Learning',
                    desc: 'Comprehensive path from foundational math to advanced neural networks.',
                    count: '8 Courses',
                    icon: 'psychology',
                    iconBg: 'rgba(136, 169, 255, 0.15)',
                    iconColor: '#88A9FF',
                  },
                  {
                    title: 'Financial Engineering',
                    desc: 'Master quantitative finance, risk management, and algorithmic trading.',
                    count: '5 Courses',
                    icon: 'payments',
                    iconBg: 'rgba(194, 255, 209, 0.15)',
                    iconColor: '#C2FFD1',
                  },
                  {
                    title: 'Digital Marketing',
                    desc: 'SEO, Content Strategy, and Social Media Analytics from scratch.',
                    count: '6 Courses',
                    icon: 'campaign',
                    iconBg: 'rgba(255, 255, 255, 0.1)',
                    iconColor: '#E0E3E6',
                  },
                  {
                    title: 'Cloud Architecture',
                    desc: 'Architect scalable solutions using AWS, Azure, and Google Cloud.',
                    count: '7 Courses',
                    icon: 'cloud',
                    iconBg: 'rgba(136, 169, 255, 0.15)',
                    iconColor: '#88A9FF',
                  },
                ].map((spec, index) => (
                  <Card
                    key={`g1-${index}`}
                    sx={{
                      ...cardMobileSx,
                      width: { xs: 240, sm: 320 },
                      flexShrink: 0,
                      p: { xs: 2, sm: 2.5 },
                      bgcolor: '#222944',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: '#88A9FF',
                        boxShadow: '0 8px 24px rgba(136, 169, 255, 0.15)',
                      },
                    }}
                    onClick={() => router.push('/courses')}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: spec.iconBg,
                        color: spec.iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1.5,
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
                        {spec.icon}
                      </span>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#FFFFFF', fontFamily: specFontFamily, fontSize: { xs: '0.95rem', sm: '1.1rem' }, overflow: 'hidden', wordBreak: 'break-word' }}>
                      {spec.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1.5, minHeight: { xs: 32, sm: 40 }, lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.7)', fontFamily: specFontFamily, fontSize: { xs: '0.75rem', sm: '0.875rem' }, overflow: 'hidden' }}>
                      {spec.desc}
                    </Typography>
                    <Divider sx={{ mb: 1, borderColor: 'rgba(255, 255, 255, 0.08)' }} />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFFFFF', fontFamily: specFontFamily }}>
                        {spec.count}
                      </Typography>
                      <span className="material-symbols-outlined" style={{ color: '#88A9FF' }}>
                        arrow_right_alt
                      </span>
                    </Stack>
                  </Card>
                ))}
              </Box>

              {/* Group 2 (duplicate for seamless loop) */}
              <Box sx={{ display: 'flex', gap: 3, pr: 3 }}>
                {[
                  {
                    title: 'AI & Machine Learning',
                    desc: 'Comprehensive path from foundational math to advanced neural networks.',
                    count: '8 Courses',
                    icon: 'psychology',
                    iconBg: 'rgba(136, 169, 255, 0.15)',
                    iconColor: '#88A9FF',
                  },
                  {
                    title: 'Financial Engineering',
                    desc: 'Master quantitative finance, risk management, and algorithmic trading.',
                    count: '5 Courses',
                    icon: 'payments',
                    iconBg: 'rgba(194, 255, 209, 0.15)',
                    iconColor: '#C2FFD1',
                  },
                  {
                    title: 'Digital Marketing',
                    desc: 'SEO, Content Strategy, and Social Media Analytics from scratch.',
                    count: '6 Courses',
                    icon: 'campaign',
                    iconBg: 'rgba(255, 255, 255, 0.1)',
                    iconColor: '#E0E3E6',
                  },
                  {
                    title: 'Cloud Architecture',
                    desc: 'Architect scalable solutions using AWS, Azure, and Google Cloud.',
                    count: '7 Courses',
                    icon: 'cloud',
                    iconBg: 'rgba(136, 169, 255, 0.15)',
                    iconColor: '#88A9FF',
                  },
                ].map((spec, index) => (
                  <Card
                    key={`g2-${index}`}
                    sx={{
                      ...cardMobileSx,
                      width: { xs: 240, sm: 320 },
                      flexShrink: 0,
                      p: { xs: 2, sm: 2.5 },
                      bgcolor: '#222944',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: '#88A9FF',
                        boxShadow: '0 8px 24px rgba(136, 169, 255, 0.15)',
                      },
                    }}
                    onClick={() => router.push('/courses')}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: spec.iconBg,
                        color: spec.iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1.5,
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
                        {spec.icon}
                      </span>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#FFFFFF', fontFamily: specFontFamily, fontSize: { xs: '0.95rem', sm: '1.1rem' }, overflow: 'hidden', wordBreak: 'break-word' }}>
                      {spec.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1.5, minHeight: { xs: 32, sm: 40 }, lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.7)', fontFamily: specFontFamily, fontSize: { xs: '0.75rem', sm: '0.875rem' }, overflow: 'hidden' }}>
                      {spec.desc}
                    </Typography>
                    <Divider sx={{ mb: 1, borderColor: 'rgba(255, 255, 255, 0.08)' }} />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFFFFF', fontFamily: specFontFamily }}>
                        {spec.count}
                      </Typography>
                      <span className="material-symbols-outlined" style={{ color: '#88A9FF' }}>
                        arrow_right_alt
                      </span>
                    </Stack>
                  </Card>
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* 5. Features Section (Bento Style) */}
      <Box
        component={motion.section}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.3, ease: [0.215, 0.61, 0.355, 1] }}
        sx={{ ...sectionMobileSx, py: { xs: 4, md: 6 } }}
      >
        <Container maxWidth="lg" sx={containerMobileSx}>
          <Grid container spacing={4} alignItems="center" sx={{ minWidth: 0 }}>
            {/* Left Bento Card: Mobile App Promotion */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, minWidth: 0 }}>
              <Box
                sx={{
                  ...cardMobileSx,
                  position: 'relative',
                  width: '100%',
                  maxWidth: { xs: 280, sm: 380, md: '100%' },
                  height: { xs: 200, sm: 280, md: 320 },
                  borderRadius: { xs: 4, sm: 5, md: 6 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'end',
                  p: { xs: 1.75, sm: 2.5, md: 3 },
                  mx: { xs: 'auto', md: 0 },
                  boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                }}
              >
                {/* Background image & gradient overlay */}
                <Box
                  component="img"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZTwpzI6Fmkd3vjc6GL62Z5kMd3EKS5dMRnDJg7nTmHvpUBhEyLVAWaTglbxvKSch6wBdsF31664Bclwp61Mt2Ek0E0DjnQzgIQWhclqljbEwWgfQvpVQa550EXyqsBmAK89BxQRzhhP0AzqV4xOov2zxvgU7cHOWHHXfUM8B5WD66JiY7BxvrYDht6OacWxRfYqy84FAOlgHhfArZovj-hVa6tCISBXQvszNSKfCO9UT59EVxkOLZ26RcmHJZpEDnRqdHJR2ZM1k"
                  alt="App Promotion"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to top, rgba(0, 86, 210, 0.95) 0%, rgba(0, 86, 210, 0.4) 60%, rgba(0, 0, 0, 0) 100%)',
                    zIndex: 1,
                  }}
                />

                {/* Card Content */}
                <Box sx={{ position: 'relative', zIndex: 2, color: '#FFFFFF', textAlign: 'center', overflow: 'hidden' }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      mb: { xs: 0.5, sm: 1 },
                      color: '#FFFFFF',
                      fontSize: { xs: '1rem', sm: '1.35rem', md: '1.5rem' },
                      lineHeight: 1.2,
                      overflow: 'hidden',
                    }}
                  >
                    Learn Anytime, Anywhere
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: { xs: 'none', sm: 'block' },
                      opacity: 0.9,
                      mb: { sm: 1.5, md: 2 },
                      color: '#FFFFFF',
                      lineHeight: 1.4,
                      mx: 'auto',
                      maxWidth: 360,
                      fontSize: { sm: '0.8rem', md: '0.875rem' },
                    }}
                  >
                    Download lectures and study offline on the go.
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={{ xs: 1, sm: 1.5 }}
                    justifyContent="center"
                    sx={{ flexWrap: 'wrap', rowGap: 1 }}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        ...btnMobileSx,
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        '&:hover': { bgcolor: '#f3f4f6' },
                        fontWeight: 700,
                        px: { xs: 1.25, sm: 2.5 },
                        py: { xs: 0.5, sm: 0.75 },
                        fontSize: { xs: '0.7rem', sm: '0.85rem' },
                        flexShrink: 0,
                        '& .material-symbols-outlined': { fontSize: { xs: 14, sm: 20 } },
                        '& .MuiButton-startIcon': { mr: { xs: 0.5, sm: 1 } },
                      }}
                      startIcon={<span className="material-symbols-outlined">apps</span>}
                    >
                      App Store
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        ...btnMobileSx,
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        '&:hover': { bgcolor: '#f3f4f6' },
                        fontWeight: 700,
                        px: { xs: 1.25, sm: 2.5 },
                        py: { xs: 0.5, sm: 0.75 },
                        fontSize: { xs: '0.7rem', sm: '0.85rem' },
                        flexShrink: 0,
                        '& .material-symbols-outlined': { fontSize: { xs: 14, sm: 20 } },
                        '& .MuiButton-startIcon': { mr: { xs: 0.5, sm: 1 } },
                      }}
                      startIcon={<span className="material-symbols-outlined">android</span>}
                    >
                      Play Store
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Grid>

            {/* Right Side: Why Choose Us checklist */}
            <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
              <Box sx={{ overflow: { xs: 'hidden', md: 'visible' }, maxWidth: '100%' }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'primary.main',
                    letterSpacing: '0.15em',
                    mb: 0.5,
                    display: 'block',
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  }}
                >
                  Why Choose Us
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: '-0.025em',
                    mb: 2,
                    fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2.25rem' },
                    overflow: 'hidden',
                    wordBreak: 'break-word',
                  }}
                >
                  Built for the future of work
                </Typography>

                <Stack spacing={2.25}>
                  {[
                    {
                      title: 'Accredited Certificates',
                      desc: 'Earn industry-recognized credentials that top employers value globally.',
                      icon: 'verified',
                    },
                    {
                      title: 'Live Mentorship',
                      desc: 'Connect with experts for weekly Q&A sessions and portfolio reviews.',
                      icon: 'groups',
                    },
                    {
                      title: 'Career Coaching',
                      desc: 'Get personalized career paths and resume building assistance.',
                      icon: 'trending_up',
                    },
                  ].map((feat, index) => (
                    <Stack key={index} direction="row" spacing={2} alignItems="start" sx={{ minWidth: 0, overflow: 'hidden' }}>
                      <Box
                        sx={{
                          width: { xs: 36, sm: 40 },
                          height: { xs: 36, sm: 40 },
                          borderRadius: '50%',
                          bgcolor: 'rgba(0, 86, 210, 0.06)',
                          color: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                          {feat.icon}
                        </span>
                      </Box>
                      <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.25, fontSize: { xs: '0.95rem', sm: '1.1rem' } }}>
                          {feat.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, fontSize: { xs: '0.8rem', sm: '0.875rem' }, overflow: 'hidden' }}>
                          {feat.desc}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 6. CTA Section */}
      <Box
        sx={{
          ...sectionMobileSx,
          py: { xs: 5, sm: 5, md: 6 },
          px: { xs: 2, sm: 0 },
          bgcolor: '#0056cc',
          color: '#FFFFFF',
          position: 'relative',
          textAlign: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '60%',
            height: '80%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-10%',
            left: '-5%',
            width: '40%',
            height: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            filter: 'blur(40px)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 1,
          }
        }}
      >
        {/* Math Grid Pattern Overlay */}
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            opacity: 0.8,
            backgroundSize: '40px 40px',
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
            `
          }}
        />

        <Container maxWidth="md" sx={{ ...containerMobileSx, position: 'relative', zIndex: 2 }}>
          <Typography
            component="h2"
            sx={{
              fontWeight: 800,
              mb: { xs: 1, sm: 1.5 },
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              lineHeight: { xs: 1.15, sm: 1.1 },
              textAlign: 'center',
              px: { xs: 0.5, sm: 0 },
              overflow: 'hidden',
            }}
          >
            <Box
              component="span"
              sx={{
                fontFamily: specFontFamily,
                fontWeight: 800,
                fontSize: { xs: '1.35rem', sm: '2.25rem', md: '2.5rem', lg: '2.85rem' },
                display: 'block',
              }}
            >
              Ready to start
            </Box>
            <Box
              component="span"
              sx={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: { xs: '1.55rem', sm: '2.65rem', md: '3rem', lg: '3.45rem' },
                color: '#C2FFD1',
                display: 'block',
                mt: { xs: 0.25, sm: 0 },
                overflow: 'hidden',
                wordBreak: 'break-word',
              }}
            >
              your journey?
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: { xs: 2, sm: 3.5 },
              opacity: 0.9,
              maxWidth: 520,
              mx: 'auto',
              color: '#FFFFFF',
              fontFamily: specFontFamily,
              fontSize: { xs: '0.85rem', sm: '1rem', md: '1.05rem' },
              lineHeight: 1.6,
              px: { xs: 0.5, sm: 0 },
              overflow: 'hidden',
            }}
          >
            Join over a million students learning and growing every day on Coursecean.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1.25, sm: 2 }}
            justifyContent="center"
            alignItems={{ xs: 'stretch', sm: 'center' }}
            sx={{ width: '100%', overflow: { xs: 'hidden', md: 'visible' } }}
          >
            {userEmail ? (
              <Button
                variant="contained"
                onClick={() => router.push('/courses')}
                sx={{
                  ...btnMobileSx,
                  bgcolor: '#C2FFD1',
                  color: '#1A1F36',
                  borderRadius: 2,
                  minHeight: { xs: 44, sm: 48 },
                  px: { xs: 2.5, sm: 4 },
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  '&:hover': { bgcolor: '#9EFEB0' },
                  fontWeight: 700,
                  width: { xs: '100%', sm: 'auto' },
                  fontFamily: specFontFamily,
                  flexShrink: 0,
                }}
              >
                Go to Courses
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  onClick={() => router.push('/signup')}
                  sx={{
                    ...btnMobileSx,
                    bgcolor: '#C2FFD1',
                    color: '#1A1F36',
                    borderRadius: 2,
                    minHeight: { xs: 44, sm: 48 },
                    px: { xs: 2.5, sm: 4 },
                    py: { xs: 1.25, sm: 1.5 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    '&:hover': { bgcolor: '#9EFEB0' },
                    fontWeight: 700,
                    width: { xs: '100%', sm: 'auto' },
                    fontFamily: specFontFamily,
                    flexShrink: 0,
                  }}
                >
                  <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                    Get Started
                  </Box>
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    Get Started for Free
                  </Box>
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/signin')}
                  sx={{
                    ...btnMobileSx,
                    borderColor: '#FFFFFF',
                    color: '#FFFFFF',
                    borderRadius: 2,
                    minHeight: { xs: 44, sm: 48 },
                    px: { xs: 2.5, sm: 4 },
                    py: { xs: 1.25, sm: 1.5 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    '&:hover': { borderColor: '#f3f4f6', bgcolor: 'rgba(255,255,255,0.1)' },
                    fontWeight: 700,
                    width: { xs: '100%', sm: 'auto' },
                    fontFamily: specFontFamily,
                    flexShrink: 0,
                  }}
                >
                  Sign In
                </Button>
              </>
            )}
          </Stack>
        </Container>
      </Box>

      {/* 7. Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: '#1A1F36',
          color: '#FFFFFF',
          borderTop: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          pt: { xs: 2.5, md: 4 },
          pb: { xs: 2, md: 3 },
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, overflow: 'hidden' }}>
          {/* Mobile / tablet — compact footer */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <Stack alignItems="center" spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#88A9FF' }}>
                  school
                </span>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#88A9FF', fontSize: '1.1rem' }}>
                  Coursecean
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={2}
                sx={{
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  rowGap: 1,
                  maxWidth: '100%',
                }}
              >
                {[
                  { label: 'Courses', action: () => router.push('/courses') },
                  { label: 'Privacy', action: undefined },
                  { label: 'Help', action: undefined },
                ].map((link) => (
                  <Typography
                    key={link.label}
                    variant="body2"
                    onClick={link.action}
                    sx={{
                      cursor: link.action ? 'pointer' : 'default',
                      color: 'rgba(255, 255, 255, 0.65)',
                      fontSize: '0.8rem',
                      whiteSpace: 'nowrap',
                      transition: 'color 0.2s',
                      '&:hover': { color: '#88A9FF' },
                    }}
                  >
                    {link.label}
                  </Typography>
                ))}
              </Stack>

              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.45)',
                  textAlign: 'center',
                  fontSize: '0.7rem',
                  lineHeight: 1.5,
                  px: 1,
                }}
              >
                © {new Date().getFullYear()} Coursecean. All rights reserved.
              </Typography>
            </Stack>
          </Box>

          {/* Desktop — full footer */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Branding column */}
            <Grid item md={4}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.2 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#88A9FF' }}>
                  school
                </span>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#88A9FF' }}>
                  Coursecean
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  mb: 1.5,
                  maxWidth: 280,
                  lineHeight: 1.6,
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Empowering learners around the globe through world-class educational content and innovative technology.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                <Box
                  component="span"
                  className="material-symbols-outlined"
                  sx={{ cursor: 'pointer', transition: 'color 0.2s', '&:hover': { color: '#88A9FF' } }}
                >
                  public
                </Box>
                <Box
                  component="span"
                  className="material-symbols-outlined"
                  sx={{ cursor: 'pointer', transition: 'color 0.2s', '&:hover': { color: '#88A9FF' } }}
                >
                  forum
                </Box>
                <Box
                  component="span"
                  className="material-symbols-outlined"
                  sx={{ cursor: 'pointer', transition: 'color 0.2s', '&:hover': { color: '#88A9FF' } }}
                >
                  mail
                </Box>
              </Stack>
            </Grid>

            {/* Links columns */}
            <Grid item md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.2, color: '#FFFFFF' }}>
                Explore
              </Typography>
              <Stack spacing={1}>
                {['Courses', 'Specializations', 'Degrees', 'For Business'].map((link) => (
                  <Typography
                    key={link}
                    variant="body2"
                    sx={{ cursor: 'pointer', color: 'rgba(255, 255, 255, 0.7)', transition: 'color 0.2s', '&:hover': { color: '#88A9FF' } }}
                    onClick={() => router.push('/courses')}
                  >
                    {link}
                  </Typography>
                ))}
              </Stack>
            </Grid>

            <Grid item md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.2, color: '#FFFFFF' }}>
                Support
              </Typography>
              <Stack spacing={1}>
                {['Help Center', 'Privacy Policy', 'Terms of Service', 'Contact'].map((link) => (
                  <Typography
                    key={link}
                    variant="body2"
                    sx={{ cursor: 'pointer', color: 'rgba(255, 255, 255, 0.7)', transition: 'color 0.2s', '&:hover': { color: '#88A9FF' } }}
                  >
                    {link}
                  </Typography>
                ))}
              </Stack>
            </Grid>

            {/* Newsletter column */}
            <Grid item md={4}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.2, color: '#FFFFFF' }}>
                Stay Updated
              </Typography>
              <Typography variant="body2" sx={{ mb: 1.2, lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.7)' }}>
                Subscribe to our newsletter for the latest course updates and career tips.
              </Typography>
              <Box component="form" sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  placeholder="Email address"
                  size="small"
                  fullWidth
                  InputProps={{ sx: { bgcolor: 'rgba(255, 255, 255, 0.05)', color: '#FFFFFF', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' } } }}
                />
                <Button
                  variant="contained"
                  sx={{
                    px: 3,
                    bgcolor: '#88A9FF',
                    color: '#1A1F36',
                    flexShrink: 0,
                    '&:hover': { bgcolor: '#b8ccff' },
                  }}
                >
                  Join
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              © {new Date().getFullYear()} Coursecean Institute. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
              <Typography variant="body2" sx={{ cursor: 'pointer', color: 'rgba(255, 255, 255, 0.5)', '&:hover': { color: '#88A9FF' } }}>
                About Us
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer', color: 'rgba(255, 255, 255, 0.5)', '&:hover': { color: '#88A9FF' } }}>
                Privacy
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer', color: 'rgba(255, 255, 255, 0.5)', '&:hover': { color: '#88A9FF' } }}>
                Help
              </Typography>
            </Stack>
          </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
