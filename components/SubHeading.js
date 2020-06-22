import classnames from 'classnames';
import React from 'react';

export default function SubHeading({ className, children }) {
  return (
    <h2
      className={classnames('text-2xl leading-tight font-semibold', className)}
    >
      {children}
    </h2>
  );
}
