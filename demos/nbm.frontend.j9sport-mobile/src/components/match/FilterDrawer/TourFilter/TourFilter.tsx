import React from 'react';
import { useApi } from '../../../../apis';
import Pull from '../../../../apis/Pull';
import { MatchState, Sports } from '../../../../consts/match';
import { ResourceDir } from '../../../../consts/network';
import IconTeam from '../../../icons/IconTeam';
import { MatchFilter } from '../../MatchHooks';
import FilterBlock from '../FilterBlock';
import KeywordText from './KeywordText';

import M from '../../../common/m'

export type TourFilterItem = {
  sportId: Sports,
  value: any,
  text: string,
  count?: number,
  icon?: string
};

function TourFilter (
  {
    filter,
    tours,
    onChange
  }: {
    filter: MatchFilter,
    tours: undefined | Array<TourFilterItem>
    onChange: (newFilter: any) => void
  }
) {
  const { pull }: { pull: Pull } = useApi({ pull: Pull });
  const [items, setItems] = React.useState<Array<TourFilterItem>>(tours || []);
  const [keyword, setKeyword] = React.useState<string>('');

  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(
    () => {
      if (tours?.length) {
        return;
      }
      setKeyword('');
      if (
        // 依赖于比赛状态条件,未选择比赛状态,则不限时联赛条件
        typeof filter.matchState === 'undefined'
        ||
        // 依赖于体育类型条件,未选择体育类型,则不限时联赛条件
        typeof filter.sportId === 'undefined'
      ) {
        setItems([]);
        onChange({ tourIds: [] });
        return;
      }
      const params: any = {
        sportId: filter.sportId,
        matchState: filter.matchState
      }

      if (Boolean(filter.dateTime)) {
        if (filter.matchState === MatchState.TODAY) {
          params.filterDate = filter.dateTime;
        } else {
          params.matchDay = filter.dateTime;
        }
      }

      pull.getTours(params).then(
        result => {
          setItems(
            result.map(
              (t: any) => ({
                sportId: t.sportId,
                value: t.tourId,
                text: t.tourName,
                count: t.matchCount,
                icon: t.tourIcon
              })
            )
          );
        }
      ).finally(
        () => onChange({ tourIds: [] })
      );
    },
    [pull, filter.sportId, filter.matchState, filter.dateTime]
  );

  React.useEffect(
    () => {
      if (tours) {
        setItems(tours)
      }
    },
    [tours, setItems]
  );

  if (!items.length) {
    return null;
  }

  const list = (
    Boolean(keyword)
    ? items.filter(({ text }) => text.includes(keyword))
    : items
  );

  return (
    <FilterBlock
      title={
        <>
          <label>
            <M id="filter.muti_select" />
          </label>
          <button
            onClick={() => onChange({
              tourIds: (
                filter.tourIds?.length !== items.length
                ? items.map(({ value }) => value)
                : []
              )
            })}
          >
            <i
              className={
                filter.tourIds?.length === items.length
                ? 'active'
                : undefined
              }
            />
          </button>
        </>
      }
      className="tour-filter"
    >
      {
        items.length > 10 ? (
          <KeywordText
            value={keyword}
            onChange={setKeyword}
          />
        ) : null
      }
      <section className="list">
        {list.map(item => (
          <button
            key={item.value}
            className={
              filter.tourIds?.includes(item.value)
              ? 'active'
              : undefined
            }
            onClick={() => {
              const index = filter.tourIds?.indexOf(item.value);
              if (
                typeof index === 'undefined'
                ||
                index === -1
              ) {
                onChange({ tourIds: [...(filter.tourIds || []), item.value] });
              } else {
                filter.tourIds?.splice(index, 1);
                onChange({ tourIds: filter.tourIds });
              }
            }}
          >
            <IconTeam
              src={item.icon}
              name={item.text}
              size={30}
              type={ResourceDir.TOURNAMENT}
            />
            <label>
              {item.text}
            </label>
          </button>
        ))}
      </section>
    </FilterBlock>
  );
}

export default TourFilter;
