import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import mergeClass from '../../../utils/mergeClass';
import EmptyList from '../../common/EmptyList';
import LoadingBar from '../../common/LoadingBar';
import MatchList from '../MatchList';

import { MatchListResult } from '../MatchHooks';

function ScrollableMatchList (
  {
    result: {
      loading,
      matchs,
      hasMore,
      pageIndex
    },
    onLoadmore = () => {},
    className
  } : {
    result: MatchListResult,
    onLoadmore: (page: number) => void,
    className?: string
  }
) {

  return (
    <InfiniteScroll
      initialLoad={false}
      hasMore={hasMore}
      pageStart={0}
      useWindow
      className={mergeClass('scrollable-match-list', className)}
      loadMore={() => {
        if (hasMore && !loading) {
          onLoadmore(pageIndex + 1)
        }
      }}
    >
      {
        matchs?.list.length
        ? <MatchList matchs={matchs} />
        : (
          loading
          ? null
          : <EmptyList />
        )
      }
      {
        loading ? (
          <LoadingBar
            className={
              pageIndex === 1
              ? 'full'
              : undefined
            }
          />
        ) : null
      }
    </InfiniteScroll>
  );
}

export default ScrollableMatchList;
