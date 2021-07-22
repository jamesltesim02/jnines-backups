import React from 'react';
import { useHistory } from 'react-router-dom';

import M from '../../../../components/common/m';
import IconBack from "../Icons/IconBack";

function Back(
  {
    title
  }: {
    title?: any
  }
) {
  const history = useHistory()
  return (
    <div className="settings-back">
      <button onClick={() => history.goBack()}>
        <IconBack />
        <M id="match.back" />
      </button>
      <p>{title}</p>
    </div>
  );
}

export default Back;