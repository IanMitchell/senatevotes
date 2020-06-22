import classnames from 'classnames';
import React from 'react';

export default function Heading({ className, children }) {
  return (
    <h1
      className={classnames('text-5xl leading-tight font-semibold', className)}
    >
      {children}
    </h1>
  );
}
