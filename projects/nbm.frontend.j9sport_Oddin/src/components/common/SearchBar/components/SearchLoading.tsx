import React from 'react';
import {Spin} from "antd";

import M from '../../m';

function SearchLoading() {
  return (
    <div>
      <div className="loading">
        <Spin size="large" style={{marginBottom: 10}} />
        <M id="search.searching" />
      </div>
    </div>
  );
}

export default SearchLoading;