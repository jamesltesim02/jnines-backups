import React from 'react';
import { useMatchFilter, MatchListResult} from '../../components/match/MatchHooks';
import MatchsPageHeader from '../../components/match/MatchsPageHeader';
import SportsBar from '../../components/match/SportsBar';
import { AVAILABLE_SPORTS, ExtraMenu, Sports} from '../../consts/match';

import memberStore from '../../stores/member';
import matchStore from '../../stores/matchs';
import Pull from '../../apis/Pull';
import { useApi } from '../../apis';
import { Toast } from 'antd-mobile';
import { useIntl } from 'react-intl';
import { toSignin } from '../../utils/MainSiteUtils';
import { TourFilterItem } from '../../components/match/FilterDrawer/TourFilter/TourFilter';
import { MatchGroups } from '../../components/match/MatchList/MatchList';
import LoadingBar from '../../components/common/LoadingBar';
import EmptyList from '../../components/common/EmptyList';

/* eslint-disable react-hooks/exhaustive-deps */
function Favorites () {
  const { isLoged } = memberStore;

  const intl = useIntl();
  const { pull }: { pull: Pull } = useApi({ pull: Pull });
  const [sportCounts, setSportCounts] = React.useState<any>();
  const [tours, setTours] = React.useState<Array<TourFilterItem> | undefined>();

  const [filter, setFilter] = useMatchFilter({
    sportId: Sports.SOCCER
  });
  const [result, setResult] = React.useState<MatchListResult>({
    matchs: undefined,
    hasMore: false,
    count: 0,
    pageIndex: 1,
    loading: true,
  });
  React.useEffect(
    () => {
      if (!isLoged) {
        Toast.fail(intl.formatMessage({ id: 'common.sign_first' }));
        setTimeout(toSignin, 1500);
        return;
      }
      setResult(result => ({ ...result, loading: true, }));
      pull.getFavorites().then(result => {
        if (!result?.length) {
          return;
        }

        matchStore.setData({ favorites: result });
        const sports: any = {};
        const tours: any = [];
        result.forEach((match: any)=> {
          sports[match.sportId] = (sports[match.sportId] || 0) + 1;
          const tour = tours.find(({ value }: any) => value === match.tournamentId);
          if (tour) {
            tour.count = tour.count + 1;
          } else {
            tours.push({
              sportId: match.sportId,
              value: match.tournamentId,
              text: match.tournamentName,
              count: 1,
              icon: match.tournamentLogo
            });
          }
        });
        const sportId = AVAILABLE_SPORTS.find(
          sid => sports[sid] > 0
        ) || Sports.SOCCER;

        setFilter(filter, { sportId });
        setTours(tours);
        setSportCounts(sports);

        setResult(result => ({ ...result, matchs: matchStore.get('favorites') }))
      }).finally(
        () => setResult(result => ({ ...result, loading: false }))
      );
    },
    [pull]
  );

  const groups = result.matchs?.getGroupsByFilter(filter);

  return (
    <>
      <MatchsPageHeader
        sport={ExtraMenu.FAVORITE}
        filter={filter}
        tours={tours?.filter(({ sportId }) => sportId === filter.sportId)}
        onFilterChange={(newFilter: any) => setFilter(filter, newFilter)}
        switchable
        backable
      />
      <SportsBar
        active={filter.sportId}
        counts={sportCounts}
        type={ExtraMenu.FAVORITE}
        onChange={
          sportId => setFilter(filter, { sportId, tourIds: [] })
        }
      />
      {
        groups?.length
        ? <MatchGroups key={filter.sportId} groups={groups} />
        : (
          <div className="scrollable-match-list fullscreen">
            {
              result.loading
              ? <LoadingBar className="full" />
              : <EmptyList />
            }
          </div>
        )
      }
    </>
  );
}

export default Favorites;
