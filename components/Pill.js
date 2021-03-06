import React from 'react';
import classnames from 'classnames';

export default function Pill({ className, children, type }) {
  const classes = classnames(
    'rounded-full px-2 mr-1 text-xs text-white font-bold',
    className,
    {
      'bg-green-400': type === 'success',
      'bg-red-400': type === 'failure',
    }
  );

  return <span className={classes}>{children}</span>;
}
