import React from 'react';
import classnames from 'classnames';

export default function ColorPickerTrigger({ disabled, onClick }) {
  const classes = classnames('bg-gray-100 font-bold py-2 px-4 rounded m-4', {
    'text-gray-800': !disabled,
    'hover:bg-gray-300': !disabled,
    'text-gray-300': disabled,
  });

  return (
    <aside className="flex flex-row justify-end sticky top-0">
      <div className="flex flex-column content-end">
        <button
          className={classes}
          onClick={onClick}
          aria-label={!disabled ? 'Change Chart Colors' : undefined}
          data-microtip-position="bottom-left"
          role="tooltip"
          disabled={disabled}
        >
          <svg
            className="fill-current h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9 20v-1.7l.01-.24L15.07 12h2.94c1.1 0 1.99.89 1.99 2v4a2 2 0 0 1-2 2H9zm0-3.34V5.34l2.08-2.07a1.99 1.99 0 0 1 2.82 0l2.83 2.83a2 2 0 0 1 0 2.82L9 16.66zM0 1.99C0 .9.89 0 2 0h4a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zM4 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
