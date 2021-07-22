import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import mergeClass from '../../../utils/mergeClass';

function LoadingBar (
  { className }: {
    className?: string
  }
) {
  return (
    <div
      className={mergeClass([
        'loading-bar',
        className
      ])}
    >
      <LoadingOutlined />
    </div>
  );
}

export default LoadingBar;
