import React from 'react';

import { Sports } from '../../../../consts/match';
import mergeClass from '../../../../utils/mergeClass';

import { withApi } from '../../../../apis';
import Pull from '../../../../apis/Pull';
import Match from '../../../../stores/matchs/Match';

import M from '../../../common/m';
import LoadingBar from '../../../common/LoadingBar';
import EmptyList from '../../../common/EmptyList';
import Info from '../../MatchItem/Info';

import SoccerResult from './SoccerResult';
import BasketballResult from './BasketballResult';
import TennisScore from './TennisResult';
import OtherResult from './OtherResult';

const SPORTS_RESULT: Record<number, { Title:any, Item: any}> = {
  [Sports.SOCCER]: SoccerResult,
  [Sports.BASKETBALL]: BasketballResult,
  [Sports.TENNIS]: TennisScore,
};

// TODO 针对各体育项适配赛果

function ResultList (
  {
    api: { pull },
    params: {
      sportId,
      dateTime: matchDay,
      tourIds
    },
  }: {
    api: { pull: Pull },
    params: any
  }
) {
  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState([]);

  React.useEffect(
    () => {
      setLoading(true);
      pull.getMatchResults({
        sportId,
        matchDay
      }).then(results => {
        setList(results);
      }).finally(
        () => setLoading(false)
      );
    },
    [pull, sportId, matchDay]
  );

  if (loading) {
    return (<LoadingBar />);
  }

  let results = list
  if (tourIds?.length > 0) {
    results = results.filter(
      (item: any) => tourIds.includes(item.tournamentId)
    )
  }

  if (!results.length) {
    return (<EmptyList />)
  }

  const Result = SPORTS_RESULT[sportId] || OtherResult;

  return (
    <section
      className={mergeClass(
        'result-list',
        `result-${sportId}`
      )}
    >
      <header>
        <div className="count">
          <M
            id="match.total_matchs"
            values={{ count: <b>{results.length}</b> }}
          />
        </div>
        <div className="title">
          <div className="common">
            <label><M id="match.list_title_tour" /></label>
            <label><M id="match.list_title_versus" /></label>
          </div>
          {
            Result
            ? (<Result.Title  />)
            : null
          }
        </div>
      </header>
      <div className="container">
        {
          results.map((item: any) => {
            const match = new Match(item);

            return (
              <div
                key={match.matchId}
                className="item"
              >
                <Info
                  match={match}
                  main
                />
                {
                  Result ? (
                    <Result.Item
                      key={match.matchId}
                      match={match}
                    />
                  ) : null
                }
              </div>
            );
          })
        }
      </div>
    </section>
  );
}


export default withApi({ pull: Pull })(ResultList);

