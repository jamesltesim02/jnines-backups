import React from 'react';

import SearchBar from "../../common/SearchBar";

import Cart from "../../cart";
import RecommendLive from '../RecommendLive';
import MatchCount from '../MatchCount';
import MoreSuggest from '../../../pages/MoreSuggest';

function RightBar (
  {
    showLive = true,
    sportId
	}: {
    combo?: boolean,
    showLive?: boolean,
    sportId?: number
	}
) {
  return (
    <div
      className="right-bar"
    >
      <SearchBar/>
      <div className="right-bar-content">
        <Cart />
        {
          sportId ? (
            <MatchCount sportId={sportId} />
          ) : null
        }
        {
          showLive
            ? (<RecommendLive />)
            : null
        }
        <MoreSuggest />
      </div>
    </div>
  )
}

export default RightBar;
