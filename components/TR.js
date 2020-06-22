import classnames from 'classnames';
import React from 'react';

export default function TH({ className, children, offset = false }) {
  return (
    <tr className={classnames(className, { 'bg-gray-100': offset })}>
      {children}
    </tr>
  );
}
