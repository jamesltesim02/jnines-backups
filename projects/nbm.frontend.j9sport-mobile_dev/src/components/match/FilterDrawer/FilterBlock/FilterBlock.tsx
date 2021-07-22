import React from 'react';
import mergeClass from '../../../../utils/mergeClass';

function FilterBlock (
  {
    title,
    className,
    children,
  }: {
    title: any,
    className?: string,
    children?: any
  }
) {
  return (
    <div className={mergeClass('filter-block', className)}>
      <header>{title}</header>
      {children}
    </div>
  );
}

export default FilterBlock;
