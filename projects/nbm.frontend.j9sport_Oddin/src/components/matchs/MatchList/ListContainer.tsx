import React from 'react';
import { Radio } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

import LoadingBar from '../../common/LoadingBar';
import ListMarketTitle from '../ListMarketTitle';
import { SportType } from '../../../consts/match';
import EmptyList from '../../common/EmptyList';
import M from '../../common/m';

function ListContainer (
  {
    sportId,
    loading = false,
    currIndex = 1,
    orderByable = true,
    recordCount,
    hasMore,
    children,
    orderBy,
    onOrderByChcnage = () => {},
    onLoadMore = () => {},
  }: {
    sportId: SportType,
    loading: boolean,
    currIndex: number,
    orderByable?: boolean,
    recordCount: number,
    hasMore: boolean,
    children: any,
    orderBy?: number,
    onOrderByChcnage?: (orderBy: number) => void,
    onLoadMore?: () => void,
  }
) {
  if (
    loading
    &&
    currIndex === 1
  ) {
    return (<LoadingBar />);
  }

  if (!loading && recordCount === 0) {
    return (<EmptyList />);
  }

  return (
    <section className="list-container">
      <header>
        <section className="list-title">
          <label>
            <M
              id="match.total_matchs"
              values={{ count: <b>{recordCount}</b> }}
            />
          </label>
          {
            orderByable ? (
              <div>
                <Radio.Group
                  onChange={e => onOrderByChcnage(e.target.value)}
                  value={orderBy}
                >
                  <Radio value={0}><M id="match.time_sort" /></Radio>
                  <Radio value={1}><M id="match.tour_sort" /></Radio>
                </Radio.Group>
              </div>
            ) : null
          }
          {/* {
            typeof collapseAll !== 'undefined' ? (
              <button onClick={() => onCollapseAllChange(!collapseAll)}>
                {
                  collapseAll
                  ? '收起全部附加盘口'
                  : '展开全部附加盘口'
                }
              </button>
            ) : null
          } */}
        </section>
        <ListMarketTitle
          sportId={sportId}
          beforeLabels={
            <>
              <label><M id="match.list_title_tour" /></label>
              <label><M id="match.list_title_versus" /></label>
            </>
          }
        />
      </header>
      <div className="list">
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={onLoadMore}
          hasMore={hasMore}
          useWindow={false}
        >
          {children}
          {loading ? (<LoadingBar />) : null}
        </InfiniteScroll>
      </div>
    </section>
  );
}

export default ListContainer;
