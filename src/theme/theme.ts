import { createTheme } from "@mui/material/styles";

// Coursecean design system — inspired by clean education platforms (Coursera / modern SaaS).
// All shared colors, fonts, spacing, and component defaults live here so the app stays consistent.

const primaryBlue = "#0056D2";
const primaryBlueDark = "#004099";
const accentIndigo = "#4F46E5";
const pageBackground = "#F5F7FB";
const textPrimary = "#1A1F36";
const textSecondary = "#5B6478";
const borderSubtle = "rgba(26, 31, 54, 0.08)";

export const courseceanTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: primaryBlue,
      light: "#3B7FE8",
      dark: primaryBlueDark,
      contrastText: "#FFFFFF",
    },
    // Secondary accent for admin badges and highlights.
    secondary: {
      main: accentIndigo,
      light: "#7C75F0",
      dark: "#3730A3",
      contrastText: "#FFFFFF",
    },
    background: {
      default: pageBackground,
      paper: "#FFFFFF",
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
    },
    divider: borderSubtle,
    success: {
      main: "#16A34A",
    },
    error: {
      main: "#DC2626",
    },
    warning: {
      main: "#D97706",
    },
    info: {
      main: "#0284C7",
    },
  },

  // 8px base grid — MUI spacing(1) = 8px, spacing(2) = 16px, etc.
  spacing: 8,

  // Slightly rounded corners feel modern without looking playful.
  shape: {
    borderRadius: 12,
  },

  typography: {
    // Inter is loaded in _document.tsx for a clean SaaS / education look.
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.03em",
      lineHeight: 1.15,
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      lineHeight: 1.6,
    },
    body1: {
      lineHeight: 1.7,
    },
    body2: {
      lineHeight: 1.6,
    },
    // Buttons should read like labels, not shouting ALL CAPS.
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.01em",
    },
  },

  components: {
    // Global page defaults (background, font smoothing).
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: pageBackground,
          color: textPrimary,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "8px 20px",
          fontSize: "0.9375rem",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 14px rgba(0, 86, 210, 0.28)",
          },
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px",
            backgroundColor: "rgba(0, 86, 210, 0.04)",
          },
        },
        sizeLarge: {
          padding: "10px 28px",
          fontSize: "1rem",
        },
      },
    },

    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${borderSubtle}`,
          boxShadow: "0 1px 3px rgba(26, 31, 54, 0.06)",
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
          "&:hover": {
            boxShadow: "0 10px 28px rgba(26, 31, 54, 0.1)",
          },
        },
      },
    },

    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        rounded: {
          borderRadius: 16,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
        filled: {
          border: "1px solid transparent",
        },
        outlined: {
          borderColor: borderSubtle,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: "#FFFFFF",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 86, 210, 0.4)",
          },
        },
        notchedOutline: {
          borderColor: borderSubtle,
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: textSecondary,
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: 3,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.95rem",
          minHeight: 48,
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          border: `1px solid ${borderSubtle}`,
          boxShadow: "0 20px 50px rgba(26, 31, 54, 0.15)",
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
        standardSuccess: {
          backgroundColor: "#ECFDF3",
          color: "#166534",
        },
        standardError: {
          backgroundColor: "#FEF2F2",
          color: "#991B1B",
        },
        standardInfo: {
          backgroundColor: "#EFF6FF",
          color: "#1D4ED8",
        },
        standardWarning: {
          backgroundColor: "#FFFBEB",
          color: "#92400E",
        },
      },
    },

    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: primaryBlue,
        },
      },
    },

    MuiTypography: {
      defaultProps: {
        color: "text.primary",
      },
    },
  },
});
