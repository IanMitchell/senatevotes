import React from 'react';
import classnames from 'classnames';

export default function Paragraph({ className, children }) {
  return <p className={classnames('mb-10 text-xl', className)}>{children}</p>;
}
