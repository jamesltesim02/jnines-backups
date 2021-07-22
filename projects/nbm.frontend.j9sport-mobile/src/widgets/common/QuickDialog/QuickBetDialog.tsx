import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import mergeClass from '../../../utils/mergeClass';

import IconClose from '../../../components/member/Dialog/icons/IconClose';

function QuickBetDialog (
  {
    open,
    children,
    unmountOnExit = false,
    className,
    closeButton = false,
    onClose
  }: {
    open: boolean,
    children: any,
    unmountOnExit?: boolean,
    className?: string,
    closeButton?: boolean,
    onClose?: () => void
  }
) {
  return ReactDOM.createPortal(
    <CSSTransition
      in={open}
      timeout={300}
      classNames="j9s-quickbet-dialog"
      unmountOnExit={unmountOnExit}
    >
      <div
        className={mergeClass('j9s j9s-quickbet-dialog', className)}
        onClick={onClose}
      >
        <div
          className="j9s-dialog-content"
          onClick={event => event.stopPropagation()}
        >
          {
            closeButton ? (
              <button
                className="j9s-btn-close"
                onClick={onClose}
              >
                <IconClose />
              </button>
            ) : null
          }
          {children}
        </div>
      </div>
    </CSSTransition>,
    document.body
  );
}

export default QuickBetDialog;
