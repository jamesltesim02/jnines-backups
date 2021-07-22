import React from 'react';
import { message } from 'antd';
import { useIntl } from 'react-intl';

function QuickBetToast () {
  const intl = useIntl();

  React.useEffect(
    () => {
      const handleToastEvent = (event: any) => {
        const {
          detail: {
            type = 'info',
            intl: i18nMessage,
            ...detail
          }
        } = event;
        
        if (i18nMessage) {
          detail.content = intl.formatMessage(i18nMessage);
        }

        (message as any)[type](detail);

        if (detail.key === 401) {
          window.dispatchEvent(new Event('j9s-quickbet-sign-request'));
        }
      };

      const toastContainer = document.querySelector('.j9s-quick-bet-container');
      if (!toastContainer) {
        return;
      }
      message.config({
        getContainer: () => toastContainer as HTMLElement
      });

      window.addEventListener('toast', handleToastEvent);
      return () => {
        window.removeEventListener('toast', handleToastEvent);
      };
    },
    []
  );
  return (null);
}

export default QuickBetToast;
