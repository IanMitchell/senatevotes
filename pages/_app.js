import React, { useEffect, useState } from 'react';
import ColorPickerTrigger from '../components/ColorPickerTrigger';
import Modal from '../components/Modal';
import ColorContext, { COLORS } from '../contexts/ColorContext';
import useLocalStorage from '../hooks/useLocalStorage';
import '../styles/main.css';

export default function MyApp({ Component, pageProps }) {
  const [colors, setColors] = useLocalStorage('colors', COLORS);
  const [MicroModal, setMicroModal] = useState(null);

  useEffect(() => {
    async function loadLib() {
      const lib = await import('micromodal');
      setMicroModal(lib.default);
    }
    loadLib();
  }, []);

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
      <ColorPickerTrigger
        disabled={!Boolean(MicroModal)}
        onClick={() => MicroModal?.show('color-picker')}
      />

      <Component {...pageProps} />

      <Modal id="color-picker" title="Choose Chart Colors">
        <p>You can set custom chart colors below.</p>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-sm text-white font-bold py-2 px-2 rounded w-full mt-4"
          onClick={() => {
            setColors(COLORS);
            MicroModal?.close('color-picker');
          }}
        >
          Colorblind? Reset to the defaults
        </button>

        <div className="flex flex-col flex-auto mt-8">
          <div className="flex">
            <p className="text-bold w-24">Yes Votes:</p>
            <input
              type="color"
              defaultValue={colors.YES}
              onChange={(event) =>
                setColors({ ...colors, YES: event.target.value })
              }
            />
          </div>

          <div className="flex mt-4">
            <p className="text-bold w-24">No Votes:</p>
            <input
              type="color"
              defaultValue={colors.NO}
              onChange={(event) =>
                setColors({ ...colors, NO: event.target.value })
              }
            />
          </div>

          <div className="flex mt-4">
            <p className="text-bold w-24">Tie Votes:</p>
            <input
              type="color"
              defaultValue={colors.NEUTRAL}
              onChange={(event) =>
                setColors({ ...colors, NEUTRAL: event.target.value })
              }
            />
          </div>
        </div>
      </Modal>
    </ColorContext.Provider>
  );
}
