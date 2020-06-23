import MicroModal from 'micromodal';
import React, { Fragment, useContext } from 'react';
import ColorContext from '../contexts/ColorContext';
import ColorPickerTrigger from './ColorPickerTrigger';
import Modal from './Modal';

export default function ColorManager({ onChange }) {
  const colors = useContext(ColorContext);

  return (
    <Fragment>
      <ColorPickerTrigger onClick={() => MicroModal.show('color-picker')} />
      <Modal id="color-picker" title="Choose Chart Colors">
        <p>You can set custom chart colors below.</p>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-sm text-white font-bold py-2 px-2 rounded w-full mt-4"
          onClick={() => {
            onChange(COLORS);
            MicroModal.close('color-picker');
          }}
        >
          Use Default
        </button>

        <div className="flex flex-col flex-auto mt-8">
          <div className="flex">
            <p className="text-bold w-24">Yes Votes:</p>
            <input
              type="color"
              defaultValue={colors.YES}
              onChange={(event) =>
                onChange({ ...colors, YES: event.target.value })
              }
            />
          </div>

          <div className="flex mt-4">
            <p className="text-bold w-24">No Votes:</p>
            <input
              type="color"
              defaultValue={colors.NO}
              onChange={(event) =>
                onChange({ ...colors, NO: event.target.value })
              }
            />
          </div>

          <div className="flex mt-4">
            <p className="text-bold w-24">Tie Votes:</p>
            <input
              type="color"
              defaultValue={colors.NEUTRAL}
              onChange={(event) =>
                onChange({ ...colors, NEUTRAL: event.target.value })
              }
            />
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}
