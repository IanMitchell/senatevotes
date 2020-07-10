import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import * as Fathom from 'fathom-client';
import ColorContext, { COLORS } from '../contexts/ColorContext';
import useLocalStorage from '../hooks/useLocalStorage';
import ColorPickerTrigger from '../components/ColorPickerTrigger';
import '../styles/main.css';

const DynamicColorManager = dynamic(
  () => import('../components/ColorManager'),
  {
    ssr: false,
    loading: () => <ColorPickerTrigger disabled />,
  }
);

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [colors, setColors] = useLocalStorage('colors', COLORS);

  useEffect(() => {
    // Initialize Fathom when the app loads
    Fathom.load('SKGURDXV', {
      includedDomains: ['senatevotes.us'],
      url: 'https://iguana.senatevotes.us/script.js',
    });

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }
    // Record a pageview when route changes
    router.events.on('routeChangeComplete', onRouteChangeComplete);

    // Unassign event listener
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
  }, [router]);

  return (
    <ColorContext.Provider value={colors}>
      <Head>
        <meta name="twitter:card" content="summary" key="twitter-card" />
        <meta
          name="twitter:creator"
          content="@IanMitchel1"
          key="twitter-handle"
        />

        <meta
          property="og:url"
          content={`https://senatevotes.us${router.asPath}`}
          key="og-url"
        />
        <meta property="og:image" content="/logo.png" key="og-image" />
        <meta
          property="og:site_name"
          content="Senate Votes"
          key="og-site-name"
        />
      </Head>
      <DynamicColorManager onChange={setColors} />
      <Component {...pageProps} />
    </ColorContext.Provider>
  );
}
