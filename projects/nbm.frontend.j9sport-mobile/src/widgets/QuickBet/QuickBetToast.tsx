import React from 'react';
import { observer } from 'mobx-react';

// import {
//   CSSTransition,
//   TransitionGroup,
// } from 'react-transition-group';

import widgetStore, { Toast } from '../../stores/widgets';

function ToastItem (
  {
    toast
  }: {
    toast: Toast
  }
) {
  return (
    <div className="j9s-toast-item">
      {toast.msg}
    </div>
  );
}

function QuickBetToast () {
  return (
    <div className="j9s-quickbet-toast">
      <div className="j9s-toast-container">
      {
        widgetStore.toasts.map(toast => (
          <ToastItem
            key={toast.key}
            toast={toast}
          />
        ))
      }
      </div>
    </div>
  );
}

export default observer(QuickBetToast);
