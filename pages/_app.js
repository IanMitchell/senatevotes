import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
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
  const [colors, setColors] = useLocalStorage('colors', COLORS);

  useEffect(() => {
    let tracker = window.document.createElement('script');
    let firstScript = window.document.getElementsByTagName('script')[0];
    tracker.defer = true;
    tracker.setAttribute('site', 'SKGURDXV');
    tracker.setAttribute('spa', 'auto');
    tracker.setAttribute('excluded-domains', 'localhost');
    tracker.src = 'https://cdn.usefathom.com/script.js';
    firstScript.parentNode.insertBefore(tracker, firstScript);
  }, []);

  return (
    <ColorContext.Provider value={colors}>
      <DynamicColorManager onChange={setColors} />
      <Component {...pageProps} />
    </ColorContext.Provider>
  );
}
