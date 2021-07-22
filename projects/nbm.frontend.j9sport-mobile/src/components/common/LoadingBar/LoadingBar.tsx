import React from 'react';
import { Icon } from 'antd-mobile';
import mergeClass from '../../../utils/mergeClass';

function LoadingBar (
  {
    style = {},
    size = 'md',
    className
  } : {
    style?: any,
    size?: 'md' | 'xxs' | 'xs' | 'sm' | 'lg',
    className?: string
  }
) {
  return (
    <div
      className={mergeClass('loading-bar', className)}
      style={style}
    >
      <Icon
        type="loading"
        color="#e3b574"
        size={size}
      />
    </div>
  );
}

export default LoadingBar;
