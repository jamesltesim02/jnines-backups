import React from 'react';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';

import { withApi } from '../../apis';
import Pull from '../../apis/Pull';

import matchStore from '../../stores/matchs';
import Navs from '../../components/common/Navs';
import MatchPanel from '../../components/matchs/MatchPanel';
import ListContainer from '../../components/matchs/MatchList/ListContainer';
import MatchItem from '../../components/matchs/MatchItem';

const LIST_STORE_KEY = 'category';

function Category (
  {
    api: { pull }
  }: {
    api: { pull: Pull }
  }
) {
  const { category, name, sid } = useParams<any>();
  const [loading, setLoading] = React.useState(true);
  const [recordCount, setRecordCount] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(false);
  const [params, setParams] = React.useState<any>(null);

  React.useEffect(
    () => {
      if (!params) {
        return;
      }
      setLoading(true);
      pull.getMatchsByCategory(params).then(
        (result: any) => {
          if (result.count) {
            setRecordCount(result.count);
          }
          if (params.pageIndex === 1) {
            matchStore.setData({ [LIST_STORE_KEY]: result.list });
          } else {
            matchStore.addData(LIST_STORE_KEY, result.list);
          }
          setHasMore(result.list.length >= 20);
        }
      ).finally(
        () => setLoading(false)
      );
    },
    [pull, params]
  );

  React.useEffect(
    () => {
      setParams({
        category,
        sportId: sid,
        pageIndex: 1
      });
    },
    [category, sid]
  );

  React.useEffect(
    () => () => matchStore.clear(LIST_STORE_KEY),
    []
  );

  const matchList = matchStore.list(LIST_STORE_KEY);

  return (
    <div className="tour-matchs">
      <Navs
        list={[
          {
            textKey: `sports.${sid}`,
            path: `/home/${sid}`
          },
          { text: name }
        ]}
      />
      <MatchPanel sportId={sid}>
        <ListContainer
          sportId={sid}
          loading={loading}
          currIndex={params?.pageIndex}
          orderByable={false}
          recordCount={recordCount}
          hasMore={hasMore}
          onLoadMore={() => {
            if (loading || !hasMore) {
              return;
            }
            setParams({
              ...params,
              pageIndex: params.pageIndex + 1
            });
          }}
        >
        {
          (matchList || []).map(match => (
            <MatchItem
              key={match.matchId}
              match={match}
            />
          ))
        }
        </ListContainer>
      </MatchPanel>
    </div>
  );
}

export default withApi({ pull: Pull })(
  observer(Category)
);
