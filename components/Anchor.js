import classnames from 'classnames';
import React from 'react';

export default React.forwardRef((props, ref) => {
  const { className, children, ...rest } = props;

  return (
    <a
      ref={ref}
      className={classnames(
        'cursor-pointer underline text-blue-600',
        className
      )}
      {...rest}
    >
      {children}
    </a>
  );
});
