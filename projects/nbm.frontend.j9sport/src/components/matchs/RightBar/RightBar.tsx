import React from 'react';
import SimpleBar from "simplebar-react";

import SearchBar from "../../common/SearchBar";
import Cart from "../../cart";
import RecommendLive from '../RecommendLive';
import MatchCount from '../MatchCount';
import MoreSuggest from '../../../pages/MoreSuggest';
import Games from "./Games";
import HideForThird from '../../common/HideForThird';

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
      <SimpleBar className="right-bar-content">
        <Cart />
        <HideForThird>
          <Games />
        </HideForThird>
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
      </SimpleBar>
    </div>
  )
}

export default RightBar;
