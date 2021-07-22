import React from 'react';
import dayjs from 'dayjs';
import range from 'lodash/range';
import { MatchFilter } from '../../MatchHooks';
import FilterBlock from '../FilterBlock';
import Pull from '../../../../apis/Pull';
import { useApi } from '../../../../apis';
import { MatchState, StateExtra } from '../../../../consts/match';
import { useIntl } from 'react-intl';

const DAYOFFSET = (
  new Date().getHours() >= 12 ? 0 : -1
)
const TIME_STEP = (
  [16, 20, 24, 28, 32, 36].map(
    h => (
      dayjs()
        .startOf('day')
        .add(DAYOFFSET, 'day')
        .add(h, 'hour')
        .valueOf()
    )
  )
);

type DateFilterItem = {
  value: any,
  text: string,
  count?: number
};

function DateFilter (
  {
    filter,
    onChange
  }: {
    filter: MatchFilter,
    onChange: (newFilter: any) => void
  }
) {
  const intl = useIntl();
  const { pull }: { pull: Pull } = useApi({ pull: Pull });
  const [items, setItems] = React.useState<Array<DateFilterItem>>([]);
  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(
    () => {
      if (
        // 时间条件依赖于状态,如果没有选择状态条件,则不显示时间条件
        typeof filter.matchState === 'undefined'
        ||
        // 时间条件依赖于球类, 如果没选择体育类型,则不显示时间条件
        typeof filter.sportId === 'undefined'
        ||
        // 滚球和推荐也不显示时间
        [
          StateExtra.SUGGEST,
          MatchState.LIVE
        ].includes(filter.matchState)
      ) {
        setItems([]);
        onChange({ dateTime: undefined });
        return;
      }

      // 早盘 串关查接口
      if (
        [
          MatchState.EARLY,
          StateExtra.COMBO
        ].includes(filter.matchState)
      ) {
        pull.getDayCounts({
          sportId: filter.sportId,
          matchState: filter.matchState
        }).then(
          result => {
            if (!result || !result.length) {
              setItems([]);
              return;
            }
            setItems(result.map((d: any) => {
              const day = dayjs(String(d.matchDay), 'YYYYMMDD')
              return ({
                value: d.matchDay,
                text: day.format(intl.formatMessage({ id: 'filter.date_format1' })),
                count: d.matchCount
              })
            }));
          }
        );
        return;
      }

      // 今日构造 小时时间段
      if (filter.matchState === MatchState.TODAY) {
        const now = Date.now();
        setItems(
          TIME_STEP.filter(
            time => time > now
          ).map(
            (time, index, array) => {
              if (index === 0) {
                return {
                  value: `${now}_${time}`,
                  text: `${intl.formatMessage({ id: 'filter.now' })} - ${dayjs(time).format('HH:mm')}`
                }
              }
              const previous = array[index - 1];
              return {
                value: `${previous}_${time}`,
                text: `${dayjs(previous).format('HH:mm')} - ${dayjs(time).format('HH:mm')}`
              };
            }
          )
        );

        return
      }

      // 赛果往前推15天
      // 直播往后推 7 天
      if (
        [
          StateExtra.RESULT,
          StateExtra.LIVE_LIST
        ].includes(filter.matchState)
      ) {
        const items = range(
          0,
          (
            StateExtra.RESULT === filter.matchState
            ? -15
            : 7
          )
        ).map(num => {
          const day = dayjs().add(num, 'day');
          return {
            value: day.format('YYYYMMDD'),
            text: day.format(intl.formatMessage({ id: 'filter.date_format1' }))
          };
        });
        setItems(items);
        onChange({ dateTime: items[0].value });
        return;
      }
    },
    [pull, filter.sportId, filter.matchState, setItems]
  );

  if (!items.length) {
    return null;
  }

  return (
    <FilterBlock
      title={intl.formatMessage({id: "filter.time_pick"})}
      className="date-filter"
    >
      <section>
        {
          items.map(item => (
            <button
              key={item.value}
              className={
                filter.dateTime === item.value
                ? 'active'
                : undefined
              }
              onClick={() => onChange({
                dateTime: (
                  (
                    filter.dateTime === item.value
                    &&
                    filter.matchState !== StateExtra.RESULT
                  )
                  ? undefined
                  : item.value
                )
              })}
            >
              {item.text}
              {
                typeof item.count !== 'undefined'
                ? ` (${item.count})`
                : null
              }
            </button>
          ))
        }
      </section>
    </FilterBlock>
  );
}

export default DateFilter;
