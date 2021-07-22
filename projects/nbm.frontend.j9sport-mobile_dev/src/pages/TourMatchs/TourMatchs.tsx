import React from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../../apis';
import Pull from '../../apis/Pull';
import BackButton from '../../components/common/BackButton';
import SearchButton from '../../components/common/SearchButton';
import IconTeam from '../../components/icons/IconTeam';
import { MatchsForPage } from '../../components/match/MatchList/MatchList';
import { Sports } from '../../consts/match';
import { ResourceDir } from '../../consts/network';
import matchStore from '../../stores/matchs';

const LIST_STORE_KEY = 'tourmatchs';

/* eslint-disable react-hooks/exhaustive-deps */
function TourMatchs () {

  const { pull }: { pull: Pull } = useApi({ pull: Pull });
  const params = useParams<any>();

  const sportId = Number(params.sid) as Sports;
  const { name, logo, tourIds } = JSON.parse(params.tours);

  const [loading, setLoading] = React.useState(false);

  React.useEffect(
    () => {
      setLoading(true);

      pull.getTourMatchs({
        sportId,
        tourIds
      }).then(
        result => matchStore.setData({ [LIST_STORE_KEY]: result })
      ).finally(
        () => setLoading(false)
      );

      return () => matchStore.clear(LIST_STORE_KEY);
    },
    [pull, sportId, params.tours, setLoading]
  );

  return  (
    <>
      <header className="tour-matchs-header">
        <BackButton />
        <IconTeam
          src={logo}
          name={name}
          size={25}
          type={ResourceDir.CATEGORY}
        />
        <label>
          {name}
        </label>
        <SearchButton />
      </header>
      <MatchsForPage
        loading={loading}
        matchs={matchStore.get(LIST_STORE_KEY)}
      />
    </>
  );
}

export default TourMatchs;
