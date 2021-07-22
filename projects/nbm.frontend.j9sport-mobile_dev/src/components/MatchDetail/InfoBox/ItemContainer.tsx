import React from 'react';
import mergeClass from '../../../utils/mergeClass';

function ItemContainer (
  {
    active = false,
    children,
    className,
    style
  }: {
    children: any,
    active?: boolean,
    className?: string,
    style?: any
  }
) {
  return (
    <div
      className={mergeClass({
        'media-info-item': true,
        active,
        [className as string]: Boolean(className)
      })}
      style={style}
    >
      {children}
    </div>
  );
}

export default ItemContainer;
