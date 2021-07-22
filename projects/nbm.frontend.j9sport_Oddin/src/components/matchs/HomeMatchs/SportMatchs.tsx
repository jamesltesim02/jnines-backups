import React from 'react';

import { SportType } from '../../../consts/match';
import Match from '../../../stores/matchs/Match';

import M from '../../common/m';
import BlockHeader from '../../common/BlockHeader';
import ListMarketTitle from '../ListMarketTitle';
import MatchItem from '../MatchItem';

function FocusMatchItem (
  {
    sportId,
    list = []
  }: {
    sportId: SportType,
    list?: Array<any>
  }
) {
  return (
    <section className="home-match-item">
      <ListMarketTitle
        sportId={sportId}
        beforeLabels={
          <>
            <label><M id={`sports.${sportId}`} /></label>
            <label><M id="match.list_title_versus" /></label>
          </>
        }
      />
      {
        list.map(
          (match: Match) => (
            <MatchItem
              key={match.matchId}
              match={match}
            />
          )
        )
      }
    </section>
  )
}

function FocusMatchs (
  {
    title,
    titleKey,
    matchs
  }: {
    title?: string,
    titleKey?: string,
    matchs: Array<{ sportId: SportType, list?: Array<any> }>
  }
) {

  return (
    <div className="home-matchs">
      <BlockHeader
        title={title}
        titleKey={titleKey}
      />
      {
        matchs.map(item => (
          (item.list && item.list.length) ? (
            <FocusMatchItem
              key={item.sportId}
              {...item}
            />
          ) : null
        ))
      }
    </div>
  );
}

export default FocusMatchs
