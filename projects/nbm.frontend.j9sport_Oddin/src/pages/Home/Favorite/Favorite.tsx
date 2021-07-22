import { observer } from 'mobx-react';
import React from 'react';
import { message } from 'antd';
import { useHistory } from 'react-router-dom';

import { AVAILABLE_SPORTS, Sports } from '../../../consts/match';

import { withApi } from '../../../apis';
import Pull from '../../../apis/Pull';

import memberStore from '../../../stores/member';
import matchStore from '../../../stores/matchs';

import M from '../../../components/common/m';
import LoadingBar from '../../../components/common/LoadingBar';
import EmptyList from '../../../components/common/EmptyList';

import MatchFilter from '../../../components/matchs/MatchFilter';
import MatchItem from '../../../components/matchs/MatchItem';
import ListMarketTitle from '../../../components/matchs/ListMarketTitle';
import { useIntl } from 'react-intl';
import { toSignin } from '../../../utils/MainSiteUtils';

const LIST_STORE_KEY = 'favorite';

/* eslint-disable react-hooks/exhaustive-deps */
function FavoritePage (
  {
    api: { pull }
  }: {
    api: { pull: Pull }
  }
) {

  const intl = useIntl();
  const { isLoged } = memberStore;

  const history = useHistory();
  const [loading, setLoading] = React.useState(false);
  const [tours, setTours] = React.useState([]);
  const [filter, setFilter] = React.useState<any>({ sportId: Sports.SOCCER, });
  const [filterProps, setFilterProps] = React.useState<any>({
    sportCounts: {},
    sportable: true,
    defaultTours: []
  });

  React.useEffect(
    () => {
      setLoading(true);
      if (!isLoged) {
        message.warn(
          intl.formatMessage({ id: 'common.sign_first' })
        );
        setTimeout(toSignin, 1500);
        return;
      }
      pull.getFavorites().then(
        result => {
          if (!result?.length) {
            return;
          }
          const sportCounts: any = {};
          const defaultTours: any = [];

          result.forEach((match: any)=> {
            sportCounts[match.sportId] = (sportCounts[match.sportId] || 0) + 1;
            const tour = defaultTours.find(({ value }: any) => value === match.tournamentId);
            if (tour) {
              tour.count = tour.count + 1;
            } else {
              defaultTours.push({
                sportId: match.sportId,
                value: match.tournamentId,
                text: match.tournamentName,
                count: 1,
              });
            }

            const sportId = AVAILABLE_SPORTS.find(
              sid => sportCounts[sid] > 0
            ) || Sports.SOCCER;

            setTours(defaultTours);
            setFilterProps({
              sportCounts,
              defaultTours: defaultTours.filter((tour: any) => tour.sportId === sportId),
              sportable: true,
            });
            setFilter({
              sportId,
              tourIds: [],
            });
          });
          matchStore.setData({ [LIST_STORE_KEY]: result });
        }
      ).finally(
        () => setLoading(false)
      );

      return () => matchStore.clear(LIST_STORE_KEY);
    },
    [pull, history, isLoged, setLoading]
  );

  if (loading) {
    return (<LoadingBar />);
  }

  const matchs = matchStore.list(LIST_STORE_KEY).filter(
    match => (
      match.sportId === filter.sportId
      &&
      (
        !filter.tourIds?.length
        ||
        filter.tourIds.includes(match.tournamentId)
      )
    )
  )

  return (
    <section className="favorite-page">
      <MatchFilter
        checked={filter}
        onChange={(newFilter) => {
          const filterValue = (
            filter.sportId !== newFilter.sportId
            ? ({
              ...newFilter,
              tourIds: [],
            }) : newFilter
          );
          setFilter(filterValue);
          setFilterProps({
            ...filterProps,
            defaultTours: (
              filterProps.sportCounts[Number(filterValue.sportId)]
              ? tours.filter((tour: any) => tour.sportId === filterValue.sportId)
              : []
            )
          });
        }}
        {...filterProps}
      />
      <div className="count">
        <M
          id="match.total_matchs"
          values={{ count: <b>{matchs.length}</b> }}
        />
      </div>
      <ListMarketTitle
          sportId={filter.sportId}
          beforeLabels={
            <>
              <label><M id="match.list_title_tour" /></label>
              <label><M id="match.list_title_versus" /></label>
            </>
          }
        />
      <div className="container">
      {
        matchs.length ? (
          matchs.map(match => (
            <MatchItem
              key={match.matchId}
              match={match}
            />
          ))
        ) : (
          <EmptyList />
        )
      }
      </div>
    </section>
  );
}

export default withApi({ pull: Pull })(
  observer(FavoritePage)
);
