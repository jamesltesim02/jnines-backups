import React from 'react';
import mergeClass from '../../../utils/mergeClass';

function SubPage (
  {
    children,
    className,
    style
  }: {
    children?: any,
    className?: string,
    style?: any
  }
) {
  return (
    <section
      className={mergeClass(
        'sub-page',
        className
      )}
      style={style}
    >
      {children}
    </section>
  );
}

export default SubPage;