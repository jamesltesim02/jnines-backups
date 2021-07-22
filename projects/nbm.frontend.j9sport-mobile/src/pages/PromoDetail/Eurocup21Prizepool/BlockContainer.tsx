import React from 'react';
import mergeClass from '../../../utils/mergeClass';

function BlockContainer (
  {
    children,
    title,
    className
  }: {
    title?: any,
    children?: any,
    className?: string
  },
  ref: any
) {
  return (
    <div
      ref={ref}
      className={mergeClass('block-container', className)}
    >
      {
        title ? (
          <header className="block-header">{title}</header>
        ) : undefined
      }
      {children}
    </div>
  );
}

export default React.forwardRef(BlockContainer);
