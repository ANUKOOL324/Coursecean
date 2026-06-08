import { CssBaseline, ThemeProvider } from "@mui/material";
import { courseceanTheme } from "./theme";

// Wraps the whole app with our MUI theme + global CSS reset.
// This is the single place that applies Coursecean's design system.

type AppThemeProviderProps = {
  children: React.ReactNode;
};

export default function AppThemeProvider({ children }: AppThemeProviderProps) {
  return (
    <ThemeProvider theme={courseceanTheme}>
      {/* CssBaseline gives consistent margins, background, and font defaults */}
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
