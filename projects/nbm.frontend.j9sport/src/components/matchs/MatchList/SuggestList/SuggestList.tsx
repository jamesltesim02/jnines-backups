import React from 'react';
import { observer } from 'mobx-react';
import SimpleBar from "simplebar-react";

import { LIST_MARKETS } from '../../../../consts/match';
import { withApi } from '../../../../apis';
import Pull from '../../../../apis/Pull';
import matchStore from '../../../../stores/matchs';
import Match from '../../../../stores/matchs/Match';

import M from '../../../common/m';
import LoadingBar from '../../../common/LoadingBar';
import BlockHeader from '../../../common/BlockHeader';
import ListMarketTitle from '../../ListMarketTitle';
import MatchItem from '../../MatchItem';
import EmptyList from '../../../common/EmptyList';

const LIST_STORE_KEY = 'suggest';

const LIST_TYPE = [
  // 滚球
  'live',
  // 精选比赛
  'select'
];

function SuggestList(
  {
    api: {pull},
    params
  }: {
    api: { pull: Pull },
    params: any
  }
) {

  const [loading, setLoading] = React.useState(false);

  React.useEffect(
    () => {
      setLoading(true);
      const timer = setTimeout(
        () => {
          pull.getSuggest({
            sportId: params.sportId,
            marketTypes: LIST_MARKETS.getMarkets(params.sportId)
          }).then(
            result => {
              LIST_TYPE.forEach(type => {
                const list = result[type];
                if (list && list.length) {
                  matchStore.setData({[`${LIST_STORE_KEY}_${type}`]: list});
                }
              });
            }
          ).finally(
            () => setLoading(false)
          );
        },
        100
      );

      return () => {
        clearTimeout(timer);
        matchStore.clear(
          ...LIST_TYPE.map(type => (`${LIST_STORE_KEY}_${type}`))
        );
      };
    },
    [pull, params, setLoading]
  );

  if (loading) {
    return (<LoadingBar/>);
  }

  // TODO 无比赛
  if (
    LIST_TYPE.reduce(
      (previous, type) => (
        previous + matchStore.list(`${LIST_STORE_KEY}_${type}`).length
      ),
      0
    ) === 0
  ) {
    return (
      <EmptyList/>
    );
  }

  return (
    <SimpleBar className="suggest-list list">
      {
        LIST_TYPE.map(type => {
          const list = matchStore.list(`${LIST_STORE_KEY}_${type}`);
          if (!list?.length) {
            return null;
          }

          return (
            <section key={type}>
              <BlockHeader title={<M id={`match.${type}`}/>}/>
              <ListMarketTitle
                sportId={params.sportId}
                beforeLabels={
                  <>
                    <label><M id="match.list_title_tour"/></label>
                    <label><M id="match.list_title_versus"/></label>
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
        })
      }
    </SimpleBar>
  );
}

export default withApi({pull: Pull})(
  observer(SuggestList)
);
