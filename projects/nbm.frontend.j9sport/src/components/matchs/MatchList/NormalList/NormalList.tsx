import React from 'react';
import { observer } from 'mobx-react';

import { MatchState, StateExtra } from '../../../../consts/match';
import { withApi } from '../../../../apis';
import Pull from '../../../../apis/Pull';

import matchStore from '../../../../stores/matchs';
import cartStore, { TAB_INDEX } from '../../../../stores/cart/Cart';

import M from '../../../common/m';
import MatchItem from '../../MatchItem';
import ListContainer from '../ListContainer';
import { ApiConst } from '../../../../consts/network';
import { Button } from 'antd';

const LIST_STORE_KEY = 'normal';

function NormalList (
  {
    api: { pull },
    params
  }: {
    api: {
      pull: Pull
    },
    params: any
  }
) {
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(false);

  const [queryParams, setQueryParams] = React.useState({
    ...params,
    pageIndex: 1,
    orderBy: 0,
  });
  const [orderBy, setOrderBy] = React.useState(0);

  const [recordCount, setRecordCount] = React.useState(0);
  const [hasNew, setHasNew] = React.useState(false);

  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return;
    }
    setQueryParams({
      ...queryParams,
      pageIndex: queryParams.pageIndex + 1
    });
  };

  React.useEffect(
    () => {
      setLoading(true);
      const timer = setTimeout(
        () => {
          pull.getMatchList(queryParams).then(
            ({
              count,
              matchs
            }) => {
              if (typeof count !== 'undefined') {
                setRecordCount(count);
              }
              if (queryParams.pageIndex === 1) {
                matchStore.setData({ [LIST_STORE_KEY]: matchs });
              } else {
                matchStore.addData(LIST_STORE_KEY, matchs);
              }
              setHasMore(matchs.length >= 20);
            }
          ).finally(() => {
            setLoading(false);
            setHasNew(false);
          });
        },
        500
      );
      cartStore.cartToggleTo(
        queryParams.matchState === StateExtra.COMBO
        ? TAB_INDEX.COMBO
        : TAB_INDEX.SINGLE
      );
      return () => clearTimeout(timer);
    },
    [pull, queryParams]
  );

  React.useEffect(
    () => {
      matchStore.clear(LIST_STORE_KEY);
      setQueryParams({
        ...params,
        pageIndex: 1,
        orderBy: orderBy
      });
      setHasMore(true);
    },
    [params, orderBy, setQueryParams]
  );

  /* eslint-disable react-hooks/exhaustive-deps*/
  React.useEffect(
    () => {
      if (
        loading
        ||
        params.matchState !== MatchState.LIVE
        ||
        params.tourIds?.length > 0
      ) {
        return;
      }
      
      const timer = setInterval(
        async () => {
          try {
            const countsArray = await pull.getInplaySportsCount();
            if (!countsArray.length) {
              return;
            }

            const sportItem = countsArray.find(
              (item: any) => item.sportId === params.sportId
            );

            if (!sportItem || sportItem.count <= recordCount) {
              return;
            }
            setHasNew(true);
          } catch (err) {
            console.warn(err);
          }
        },
        ApiConst.CACHE_REFRESH_DELAY
      );

      return () => clearInterval(timer);
    },
    [pull, params, recordCount, setHasNew]
  );

  React.useEffect(
    () => () => {
      matchStore.clear(LIST_STORE_KEY);
      cartStore.cartToggleTo(TAB_INDEX.SINGLE);
    },
    []
  );

  const matchList = matchStore.list(LIST_STORE_KEY);

  return (
    <>
      {
        hasNew ? (
          <div className="has-new">
            <Button
              type="link"
              onClick={() => setQueryParams({
                ...params,
                pageIndex: 1,
                orderBy: orderBy
              })}
            >
              <M id="match.inplay_updated" />
            </Button>
          </div>
        ) : null
      }
      <ListContainer
        sportId={params.sportId}
        loading={loading}
        currIndex={queryParams.pageIndex}
        orderBy={orderBy}
        recordCount={recordCount}
        hasMore={hasMore}
        onOrderByChcnage={setOrderBy}
        onLoadMore={handleLoadMore}
      >
      {
        matchList.map(match => (
          <MatchItem
            key={match.matchId}
            match={match}
            combo={queryParams.matchState === StateExtra.COMBO}
          />
        ))
      }
      </ListContainer>
    </>
  );
}

export default withApi({ pull: Pull })(
  observer(NormalList)
);
