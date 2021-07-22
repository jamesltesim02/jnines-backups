import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import MatchDetail from './MatchDetail';

import './MatchDetail.less';

import appStore from '../../stores/app';

function MatchDetailPage () {
  const { mid }: { mid: string } = useParams();
  const history = useHistory();

  if (!mid) {
    if (appStore.firstRoute) {
      history.replace('/');
    } else {
      history.goBack()
    }
    return null;
  }

  return (
    <MatchDetail
      key={mid}
      mid={mid as string}
    />
  );
}

export default MatchDetailPage;
