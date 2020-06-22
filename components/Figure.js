import React from 'react';
import classnames from 'classnames';

export default function Figure({ className, children }) {
  return (
    <figure
      className={classnames('p10 mt-5 flex-auto md:max-w-1/2', className)}
    >
      {children}
    </figure>
  );
}
