import React from 'react';

import { Modal } from 'antd-mobile';
import mergeClass from '../../../utils/mergeClass';
import IconNotice from './icons/IconNotice';
import IconClose from './icons/IconClose';

export function Title (
  {
    size = 3,
    className,
    children
  } : {
    size?: 1 | 2 | 3 | 4 | 5 | 6 | 7
    className?: string,
    children?: any
  }
) {
  return React.createElement(
    `h${size}`,
    {
      className: mergeClass(
        'dialog-title',
        `header-${size}`,
        className
      )
    },
    children
  );
}

export function SubTitle (
  {
    className,
    children
  }: {
    className?: string,
    children?: any,
  }
) {
  return (
    <p
      className={mergeClass(
        'dialog-subtitle',
        className
      )}
    >{children}</p>
  );
};

export function FormField (
  {
    label,
    inline = false,
    prefix,
    suffix,
    className,
    children
  }: {
    label?: string,
    inline?: boolean,
    prefix?: any,
    suffix?: any,
    className?: string,
    children?: any
  }
) {
  return (
    <div
      className={mergeClass(
        'form-field',
        inline ? 'inline' : undefined,
        className
      )}
    >
      <label>{label}</label>
      <div className="input">
        {prefix}
        <span>{children}</span>
        {suffix}
      </div>
    </div>
  );
}

function Dialog (
  {
    open = false,
    className,
    children,
    noticeIcon = false,
    closeButton = false,
    onClose = () => {}
  }: {
    open: boolean,
    noticeIcon?: boolean,
    closeButton?: boolean,
    className?: string,
    children?: any,
    onClose?: () => void
  }
) {
  return (
    <Modal
      visible={open}
      className={mergeClass(
        'j9-dialog',
        className
      )}
      // maskClosable
      transparent
      onClose={onClose}
    >
      {
        noticeIcon
        ? <IconNotice className="icon-notice" />
        : null
      }
      {
        closeButton ? (
          <button
            className="btn-close"
            onClick={onClose}
          >
            <IconClose />
          </button>
        ) : null
      }
      {children}
    </Modal>
  );
}

Dialog.Title = Title;
Dialog.SubTitle = SubTitle;
Dialog.FormField = FormField;

export default Dialog;
