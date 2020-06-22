import React from 'react';
import classnames from 'classnames';

export default function FigCaption({ className, children }) {
  return (
    <figcaption
      className={classnames('italic text-xs text-center mt-5', className)}
    >
      {children}
    </figcaption>
  );
}
