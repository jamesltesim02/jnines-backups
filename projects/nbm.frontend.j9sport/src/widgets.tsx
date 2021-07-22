import React from 'react';
import ReactDOM from 'react-dom';

import 'antd/dist/antd.less';

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
    console.log('in entry.');
    if (!window['__J9S_CONFIG__' as any]) {
      throw new Error('九游体育配置信息加载失败');
    }
    const settings: WidgetSettings = event.detail;
    if (!settings.el) {
      throw Error('参数 el 不能为空, 请传入用于显示组件的容器选择器值, 如: #qbContainer');
    }

    const container = document.querySelector(settings.el);
    if (!container || container.nodeType !== 1) {
      throw new Error(`元素 ${settings.el} 未找到,或格式不正确, 建议使用div`)
    }

    widgetStore.settings = settings;

    const WidgetComponent = WidgetMap[settings.widgetName];

    ReactDOM.render(
      <WidgetComponent />,
      container
    );
  }
);
