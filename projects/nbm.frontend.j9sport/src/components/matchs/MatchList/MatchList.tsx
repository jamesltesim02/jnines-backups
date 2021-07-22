import React from 'react';
import { MatchState, StateExtra } from '../../../consts/match';

import NormalList from './NormalList';
import SuggestList from './SuggestList';
import ResultList from './ResultList';
import LiveList from './LiveList';

const LIST_MAPPING: any = {
  [StateExtra.SUGGEST]: SuggestList,
  [MatchState.LIVE]: NormalList,
  [MatchState.TODAY]: NormalList,
  [MatchState.EARLY]: NormalList,
  [StateExtra.COMBO]: NormalList,
  [StateExtra.RESULT]: ResultList,
  [StateExtra.LIVE_LIST]: LiveList,
};

function MatchList (
  {
    filter,
    params
  }: {
    filter: any,
    params: any
  }
) {

  const List = LIST_MAPPING[params.matchState]

  return (
    <div className="match-list">
      <header className="filter">
        {filter}
      </header>
      <List params={params} />
    </div>
  );
}

export default MatchList;
