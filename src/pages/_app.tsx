import Appbar from '@/components/Appbar';
import { InitUser } from '@/components/InitUser';
import AppThemeProvider from '@/theme/AppThemeProvider';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';

// Site-wide branding — used in the browser tab title and SEO meta description.
const SITE_TITLE = "Coursecean";
const SITE_DESCRIPTION = "Learn. Grow. Master new skills with high-quality courses.";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAuthPage = router.pathname === "/signin" || router.pathname === "/signup";

  return (
    <RecoilRoot>
      <AppThemeProvider>
        {/* Default title and description for every page */}
        <Head>
          <title>{SITE_TITLE}</title>
          <meta name="description" content={SITE_DESCRIPTION} />
        </Head>
        <Appbar />
        <InitUser />
        {isAuthPage ? (
          <Component {...pageProps} />
        ) : (
          <Box sx={{ pt: { xs: "56px", md: "68px" } }}>
            <Component {...pageProps} />
          </Box>
        )}
      </AppThemeProvider>
    </RecoilRoot>
  );
}
