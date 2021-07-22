import { LeftOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import React from 'react';
import { useHistory } from 'react-router-dom';

import appStore from '../../stores/app';

function BackButton (
  {
    children
  }: {
    children?: any
  }
) {
  const history = useHistory();

  const handleClick = () => {
    if (appStore.firstRoute) {
      history.push('/');
      return;
    }
    history.goBack();
  };

  return (
    <button
      className="back-button"
      onClick={handleClick}
    >
      <LeftOutlined />
      {children}
    </button>
  );
}

export default observer(BackButton);
