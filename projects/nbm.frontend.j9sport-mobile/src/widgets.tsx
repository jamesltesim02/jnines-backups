import React from 'react';
import ReactDOM from 'react-dom';
import WidgetSettings from './widgets/WidgetSettings';

import QuickBet from './widgets/QuickBet';
import widgetStore from './stores/widgets';

const WidgetMap: Record<string, any> = {
  'QUICK_BET': QuickBet
};

/** 添加页面就绪事件,将组件添加到页面指定容器中 */
window.addEventListener(
  'J9SportAddWidget',
  (event: any) => {
    if (!window['__J9S_CONFIG__' as any]) {
      throw new Error('九游体育配置信息加载失败');
    }
    const settings: WidgetSettings = event.detail;
    if (!settings.el) {
      throw Error('参数 el 不能为空, 请传入用于显示组件的容器选择器值, 如: #qbContainer');
    }

    const container = document.querySelector(settings.el);
    if (!container) {
      throw Error(`容器${settings.el}对应的DOM未找到, 请检查是否正确`);
    }

    widgetStore.settings = settings;
    const WidgetComponent = WidgetMap[settings.widgetName];

    ReactDOM.render(
      <>
        {/* 开发调试工具 */}
        {
          process.env.NODE_ENV !== 'production'
          ? React.createElement(
            require('./components/common/DevTools').default
          ) : null
        }
        <WidgetComponent settings={settings} />
      </>,
      container
    );

    if (settings.on?.widgetReady) {
      settings.on.widgetReady();
    }
  }
);
