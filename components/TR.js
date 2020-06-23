import classnames from 'classnames';
import React from 'react';

export default function TH({ className, children, offset = false }) {
  return (
    <tr
      className={classnames(
        'flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0',
        className,
        { 'bg-gray-100': offset }
      )}
    >
      {children}
    </tr>
  );
}
