import dayjs from 'dayjs';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useApi } from '../../apis';
import Pull from '../../apis/Pull';
import { MatchOrderby, Sports, StateExtra } from '../../consts/match';

import matchStore from '../../stores/matchs';
import MatchList from '../../stores/matchs/MatchList';

export type MatchListResult = {
  matchs?: MatchList,
  hasMore: boolean,
  count: number,
  pageIndex: number,
  loading: boolean,
};

/**
 * 比赛列表查询条件
 */
export type MatchFilter = {
  /** 体育类型 */
  sportId: Sports,
  /** 比赛状态 */
  matchState?: number,
  /** 页码 */
  pageIndex?: number,
  /** 排序类型 */
  orderBy?: MatchOrderby,
  /** 时间条件 */
  dateTime?: string,
  /** 联赛条件 */
  tourIds?: string[]
};

const DEFAULT_FILTER = {
  pageIndex: 1,
};

/**
 * 比赛查询条件
 *
 * @param init 初始化过滤条件值
 */
/* eslint-disable react-hooks/exhaustive-deps */
export function useMatchFilter (init: MatchFilter) : [
  MatchFilter,
  (oldFilter: any, newFilter: any) => void
] {
  const history = useHistory();
  const location = useLocation();

  const [filter, setFilter] = React.useState(init);
  const setNewFilter = React.useCallback(
    (oldFilter, newFilter: any) => {
      const finalFilter = {
        ...oldFilter,
        ...newFilter
      };

      // 当前状态不再是滚球,并且当前选择的按时间降序,则重新设置为升序
      if (
        oldFilter.matchState !== finalFilter.matchState
        &&
        oldFilter.orderBy === MatchOrderby.BY_TIME_DESC
      ) {
        finalFilter.orderBy = MatchOrderby.BY_TIME_ASC;
      }

      if (
        oldFilter.matchState !== StateExtra.RESULT
        &&
        newFilter.matchState === StateExtra.RESULT
        &&
        !newFilter.dateTime
      ) {
        finalFilter.dateTime = dayjs().format('YYYYMMDD');
      }

      // 将更新后到条件,更新到地址上
      history.replace(`${location.pathname}?filter=${JSON.stringify(finalFilter)}`);
      setFilter(finalFilter);
    },
    []
  )

  // 初始化时加载地址上的条件
  React.useEffect(
    () => {
      const params = new URLSearchParams(window.location.search);
      const filterParam = params.get('filter');
      if (!filterParam) {
        return;
      }
      const filterObj = JSON.parse(filterParam);
      filterObj.pageIndex = 1;
      setNewFilter(filter, filterObj);
    },
    [setNewFilter]
  );
  return [
    filter,
    setNewFilter
  ];
}

/**
 * 查询比赛列表
 *
 * @param dataId store中保存的列表名
 * @param filter 查询条件
 */
export function useMatchList (
  dataId: string,
  filter: MatchFilter
): MatchListResult {
  const { pull }: { pull: Pull } = useApi({ pull: Pull });

  const [result, setResult] = React.useState<MatchListResult>({
    matchs: undefined,
    hasMore: true,
    loading: true,
    pageIndex: 1,
    count: 0,
  });

  const [lastFilter, setLastFilter] = React.useState<string>('');

  React.useEffect(
    () => {
      if (filter) {
        setLastFilter(JSON.stringify(filter))
      }
    },
    [filter]
  );

  React.useEffect(
    () => {
      if (
        !lastFilter
        ||
        [
          StateExtra.RESULT,
          StateExtra.LIVE_LIST
        ].includes(
          filter.matchState as any
        )
      ) {
        return;
      }
      const params = {
        ...DEFAULT_FILTER,
        ...filter
      };
      setResult(result => ({
        ...result,
        loading: true,
        pageIndex: params.pageIndex,
        matchs: params.pageIndex === 1 ? undefined : result.matchs
      }));
      const timer = setTimeout(() => {
        if (filter.matchState === StateExtra.SUGGEST) {
          pull.getSuggest(params).then(
            ({ live, select }) => {
              matchStore.setData({ [dataId]: [...live, ...select] });
              const matchs = matchStore.get(dataId);
              setResult(result => ({
                ...result,
                matchs,
                count: matchs?.list.length || 0,
                pageIndex: params.pageIndex,
                hasMore: false
              }));
            }
          ).finally(
            () => setResult(result => ({ ...result, loading: false }))
          );
          return;
        }
        pull.getMatchList(params).then(
          ({
            count,
            matchs
          }: any) => {
            if (params.pageIndex === 1) {
              matchStore.setData({ [dataId]: matchs });
            } else {
              matchStore.addData(dataId, matchs);
            }
            setResult(result => ({
              ...result,
              matchs: matchStore.get(dataId),
              count: count || result.count,
              pageIndex: params.pageIndex,
              hasMore: matchs.length >= 20
            }));
          }
        ).finally(
          () => setResult(result => ({ ...result, loading: false }))
        );
      }, 300);
      return () => clearTimeout(timer);
    },
    [pull, lastFilter]
  );

  return result;
}

