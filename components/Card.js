import classnames from 'classnames';
import React from 'react';

export default function Card({ title, children, className }) {
  return (
    <div
      className={classnames(
        'w-full rounded overflow-hidden shadow-lg',
        className
      )}
    >
      <div className="px-6 py-4">
        <h3 className="font-bold text-4xl mb-2 text-right border-b-2 border-gray-600">
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}
