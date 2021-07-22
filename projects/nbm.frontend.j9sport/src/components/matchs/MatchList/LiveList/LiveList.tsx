import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import SimpleBar from "simplebar-react";
import { ClockCircleOutlined } from '@ant-design/icons';

import mergeClass from '../../../../utils/mergeClass';
import { withApi } from '../../../../apis';
import Pull from '../../../../apis/Pull';

import M from '../../../common/m';
import LoadingBar from '../../../common/LoadingBar';
import EmptyList from '../../../common/EmptyList';
import MatchTime from '../../MatchTime';
import IconVideo from '../../../icons/IconVideo';
import IconFlash from '../../../icons/IconFlash';
import { MatchState, Sports } from '../../../../consts/match';
import IconTeam from '../../../icons/IconTeam';

function LiveList (
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
  const intl = useIntl();

  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState([]);

  React.useEffect(
    () => {
      setLoading(true);
      pull.getLiveList({
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

  return (
    <section className="live-list">
      <header>
        <M
          id="match.total_matchs"
          values={{ count: <b>{results.length}</b> }}
        />
      </header>
      <SimpleBar className="container">
        <ul>
          {
            results.map((match: any) => {
              const teams = match.matchName.split(' vs ');
              const playing = match.matchState === MatchState.LIVE;
              const scores = (
                playing
                ? (match.liveScore?.score || '0:0')
                : ':'
              ).split(':');

              let logo1 = match.logo1
              let logo2 = match.logo2

              if (
                ![Sports.SOCCER, Sports.BASKETBALL, Sports.ESPORTS].includes(match.sportId)
              ) {
                logo1 = logo2 = undefined;
              }


              return (
                <li key={match.matchId}>
                  <Link
                    to={`/detail/${match.matchId}`}
                    className={mergeClass({
                      item: true,
                      playing
                    })}
                  >
                    <header>
                      <div>{match.tournamentName}</div>
                      <time><MatchTime match={{
                        ...match,
                        matchState: 0
                      }} /></time>
                    </header>
                    <section>
                      <div className="team">
                        <IconTeam
                          src={logo1}
                          name={teams[0]}
                          size={60}
                        />
                        <label>{teams[0]}</label>
                      </div>
                      <div>
                        <span>{scores[0]}</span>
                        <div>
                          <label>VS</label>
                          <time>
                            {
                              playing
                              ? (
                                <M id="search.playing" />
                              ) : (
                                <M
                                  id={`period.${match.matchPeriod || 0}`}
                                  values={{
                                    type: intl.formatMessage({
                                      id: `periods.${match.sportId}`
                                    })
                                  }}
                                />
                              )
                            }
                          </time>
                        </div>
                        <span>{scores[1]}</span>
                      </div>
                      <div className="team">
                        <IconTeam
                          src={logo2}
                          name={teams[1]}
                          size={60}
                        />
                        <label>{teams[1]}</label>
                      </div>
                    </section>
                    <footer>
                      {
                        Boolean(match.provider?.betradarKey)
                        ? (<IconFlash />)
                        : null
                      }
                      <IconVideo />
                      <div>
                      {
                        playing ? (
                          <button className="btn-playing">
                            <i />
                            <M id="match.living" />
                          </button>
                        ) : (
                          <button className="btn-waiting">
                            <ClockCircleOutlined />
                            <M id="match.waiting" />
                          </button>
                        )
                      }
                      </div>
                    </footer>
                  </Link>
                </li>
              );
            })
          }
        </ul>
      </SimpleBar>
    </section>
  );
}

export default withApi({ pull: Pull })(LiveList);
