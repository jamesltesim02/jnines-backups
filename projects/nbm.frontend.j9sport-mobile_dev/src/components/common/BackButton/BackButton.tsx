import React from 'react';
import { Icon } from 'antd-mobile';

import appStore from '../../../stores/app';
import { useHistory } from 'react-router-dom';

function BackButton (
  { onBack }: {
    onBack?: () => boolean | undefined
  }
) {
  const history = useHistory();

  const handleBackClick = () => {
    if (onBack && !onBack()) {
      return;
    }
    if (appStore.firstRoute) {
      history.push('/');
      return;
    }
    history.goBack();
  };

  return (
    <button
      className="back-button"
      onClick={handleBackClick}
    >
      <Icon
        type="left"
        size="lg"
      />
    </button>
  );
}

export default BackButton;
