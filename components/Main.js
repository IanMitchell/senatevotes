import classnames from 'classnames';
import React from 'react';
import Footer from './Footer';

export default function Main({ className, children }) {
  return (
    <main
      className={classnames(
        'container mx-auto p-5 lg:p-0 w-full m:w-3/4 lg:w-2/3 min-w-full lg:min-w-0',
        className
      )}
    >
      {children}
      <Footer />
    </main>
  );
}
