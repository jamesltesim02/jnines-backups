import { Icon } from 'antd-mobile';
import React from 'react';
import mergeClass from '../../../utils/mergeClass';

function J9Button (
  {
    children,
    loading = false,
    submit = false,
    available = false,
    className,
    onClick,
  }: {
    children?: any,
    loading?: boolean,
    submit?: boolean,
    available?: boolean,
    className?: string,
    onClick?: () => void
  }
) {
  return (
    <button
      className={mergeClass({
        'j9s-button': true,
        'j9s-submit': submit,
        loading,
        available: available && !loading,
        [String(className)]: Boolean(className)
      })}
      onClick={onClick}
    >
      {
        loading
        ? <Icon type="loading" />
        : children
      }
    </button>
  );
}

export default J9Button;
