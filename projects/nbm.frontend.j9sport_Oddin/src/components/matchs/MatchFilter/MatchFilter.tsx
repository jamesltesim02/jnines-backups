import React from 'react';
import { MatchState, SportType, StateExtra } from '../../../consts/match';

import StateFilter from './StateFilter';
import DateFilter from './DateFilter';
import TourFilter from './TourFilter';
import SportFilter from './SportFilter';
import dayjs from 'dayjs';
import xor from 'lodash/xor';
// import { useHistory, useLocation } from 'react-router-dom';

declare type FilterChecked = {
  /** 当前状态 */
  matchState?: number,
  /** 当前体育项 */
  sportId?: SportType,
  /** 当前可被用于筛选的联赛列表 */
  tourIds?: Array<string>
  /** 事件条件 */
  dateTime?: string,
};

declare type MatchFilterProps = {
  /** 当前选中内容 */
  checked?: FilterChecked,
  /**  是否需要显示状态栏 */
  statable?: boolean,
  /** 是否需要显示时间筛选栏 */
  dateable?: boolean,
  /** 是否需要显示体育类型筛选栏 */
  sportable?: boolean,
  /** 体育类型对应的比赛数 */
  sportCounts?: any,
  /** 默认的联赛列表 */
  defaultTours?: Array<{ value: string, text: string, count: number }>,
  /** filter变化事件 */
  onChange?: (event: FilterChecked) => void,
};

function MatchFilter (
  {
    checked = {},
    statable = false,
    dateable = false,
    sportable = false,
    sportCounts,
    defaultTours,
    onChange = () => {}
  }: MatchFilterProps
) {
  // const history = useHistory();
  // const location = useLocation();

  const handleChange = (event: any) => {
    if (
      Object.entries(event).filter(
        (kvs: Array<any>) => {
          const source = (checked as any)[kvs[0]];
          if (Array.isArray(source)) {
            return xor(source, kvs[1]).length > 0;
          }
          return source !== kvs[1];
        }
      ).length === 0
    ) {
      return;
    }
    const newFilter = {
      ...checked,
      ...event
    };
    onChange(newFilter);
    // console.log(location.pathname)
    // history.push(`${location}?`);
  }

  return (
    <section className="match-filter">
      {/* 体育筛选 */}
      {
        sportable ? (
          <SportFilter
            checked={checked.sportId}
            sportCounts={sportCounts}
            onChange={
              (sportId: number) => handleChange({ sportId })
            }
          />
        ) : null
      }
      {/* 状态筛选 */}
      {
        (
          statable
          &&
          checked.sportId
        ) ? (
          <StateFilter
            sportId={checked.sportId}
            checked={checked.matchState}
            onChange={
              (matchState: number) => {
                handleChange({
                  matchState,
                  dateTime: (
                    matchState === StateExtra.RESULT
                    ? dayjs().format('YYYYMMDD')
                    : undefined
                  ),
                  tourIds: []
                })
              }
            }
          />
        ) : null
      }
      {/* 时间筛选 */}
      {
        (
          // 时间需要依赖于比赛状态, 如果比赛状态不限时则时间也不能显示
          typeof checked.matchState !== 'undefined'
          &&
          dateable
          &&
          checked.sportId
          &&
          // 滚球和推荐也不显示时间
          ![
            StateExtra.SUGGEST,
            MatchState.LIVE
          ].includes(checked.matchState)
        ) ? (
          <DateFilter
            sportId={checked.sportId}
            matchState={checked.matchState}
            checked={checked.dateTime}
            onChange={
              (dateTime: string | undefined | null) => handleChange({ dateTime })
            }
          />
        ) : null
      }
      {/* 联赛筛选 */}
      {
        checked.matchState !== StateExtra.SUGGEST ? (
          <TourFilter
            sportId={checked.sportId}
            matchState={checked.matchState}
            dateTime={checked.dateTime}
            defaultTours={defaultTours}
            checked={checked.tourIds}
            onChange={
              (tourIds: string[]) => handleChange({ tourIds })
            }
          />
        ) : null
      }
    </section>
  )
}

export default MatchFilter;
