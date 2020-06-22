import classnames from 'classnames';
import React from 'react';

export default function TH({ className, children }) {
  return (
    <td className={classnames('border px-4 py-2', className)}>{children}</td>
  );
}
