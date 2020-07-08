import dynamic from 'next/dynamic';
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
      <DynamicColorManager onChange={setColors} />
      <Component {...pageProps} />
    </ColorContext.Provider>
  );
}
