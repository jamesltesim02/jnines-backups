import { observer } from 'mobx-react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { withApi } from '../../apis';
import Pull from '../../apis/Pull';
import LoadingBar from '../../components/common/LoadingBar';
import Navs from '../../components/common/Navs';
import MatchItem from '../../components/matchs/MatchItem';
import ListContainer from '../../components/matchs/MatchList/ListContainer';
import MatchPanel from '../../components/matchs/MatchPanel';
import { SportType } from '../../consts/match';

import matchStore from '../../stores/matchs';

const LIST_STORE_KEY = 'tourmatchs';

/* eslint-disable react-hooks/exhaustive-deps*/
function TourMatchs(
  {
    api: { pull }
  }: {
    api: { pull: Pull }
  }
) {
  const params = useParams<any>();

  const sportId = Number(params.sid) as SportType;
  const { name, tourIds } = JSON.parse(params.tours);

  const [recordCount, setRecordCount] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(
    () => {
      setLoading(true);

      pull.getTourMatchs({
        sportId,
        tourIds
      }).then(
        result => {
          setRecordCount(result.length);
          matchStore.setData({ [LIST_STORE_KEY]: result });
        }
      ).finally(
        () => setLoading(false)
      );

      return () => matchStore.clear(LIST_STORE_KEY);
    },
    [pull, sportId, params.tours, setLoading]
  );

  const matchList = matchStore.list(LIST_STORE_KEY);

  return (
    <div className="tour-matchs">
      <Navs
        list={[
          {
            textKey: `sports.${sportId}`,
            path: `/home/${sportId}`
          },
          { text: name }
        ]}
      />
      <MatchPanel sportId={sportId}>
        {
          loading ? (
            <LoadingBar />
          ) : (
            <ListContainer
              sportId={sportId}
              loading={loading}
              currIndex={1}
              orderByable={false}
              recordCount={recordCount}
              hasMore={false}
            >
            {
              matchList.map(match => (
                <MatchItem
                  key={match.matchId}
                  match={match}
                />
              ))
            }
            </ListContainer>
          )
        }
      </MatchPanel>
    </div>
  );
}

export default withApi({ pull: Pull })(
  observer(TourMatchs)
);
