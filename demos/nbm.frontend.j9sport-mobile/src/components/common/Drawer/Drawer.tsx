import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import mergeClass from '../../../utils/mergeClass';

function Drawer (
  {
    open,
    children,
    unmountOnExit = false,
    className,
    onClose
  }: {
    open: boolean,
    children: any,
    unmountOnExit?: boolean,
    className?: string,
    onClose?: () => void
  }
) {
  React.useEffect(
    () => {
      document.body.style.overflow = open ? 'hidden' : '';
    },
    [open]
  );
  return ReactDOM.createPortal(
    <CSSTransition
      in={open}
      timeout={300}
      classNames="drawer-slider"
      unmountOnExit={unmountOnExit}
    >
      <div
        className={mergeClass('drawer-slider', className)}
        onClick={onClose}
      >
        <div
          className="drawer-content dark"
          onClick={event => event.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </CSSTransition>,
    document.body
  );
}

export default Drawer;
