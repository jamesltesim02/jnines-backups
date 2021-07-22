import React from 'react';

import { Modal } from 'antd';
import mergeClass from '../../../utils/mergeClass';
import IconNotice from './icons/IconNotice';
// import IconClose from './icons/IconClose';

function Dialog (
  {
    open = false,
    className,
    children,
    noticeIcon = false,
    closeButton = false,
    imgbg = false,
    onClose = () => {},
    destroyOnClose
  }: {
    open: boolean,
    noticeIcon?: boolean,
    closeButton?: boolean,
    imgbg?: boolean,
    className?: string,
    children?: any,
    onClose?: () => void
    destroyOnClose?: boolean
  }
) {
  return (
    <Modal
      visible={open}
      className={mergeClass(
        'j9-dialog',
        imgbg ? 'img-bg' : undefined,
        className,
      )}
      // maskClosable
      closable={closeButton}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnClose={destroyOnClose}
    >
      {
        noticeIcon
        ? <IconNotice className="icon-notice" />
        : null
      }
      {children}
    </Modal>
  );
}

export default Dialog;
