import React from 'react';
import { MatchState, StateExtra } from '../../../../consts/match';

import { withApi } from '../../../../apis';
import Pull from '../../../../apis/Pull';

import FilterItem from '../FilterItem';
import dayjs from 'dayjs';
import range from 'lodash/range';
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

/* eslint-disable react-hooks/exhaustive-deps */
function DateFilter (
  {
    api: { pull },
    sportId,
    matchState,
    checked,
    onChange = () => {}
  }: {
    api: { pull: Pull },
    sportId: number,
    matchState: number,
    checked: string | undefined | null,
    onChange: (dateTime: string | undefined | null) => void,
  }
) {

  const intl = useIntl();
  const [items, setItems] = React.useState<any>([]);

  React.useEffect(
    () => {
      // 早盘 串关查接口
      if (
        [
          MatchState.EARLY,
          StateExtra.COMBO
        ].includes(matchState)
      ) {
        pull.getDayCounts({
          sportId,
          matchState
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
      if (matchState === MatchState.TODAY) {
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

      // 赛果 往前推15天, 直播往后推 7 天
      if (
        [
          StateExtra.RESULT,
          StateExtra.LIVE_LIST
        ].includes(matchState)
      ) {
        const items = range(
          0,
          (
            StateExtra.RESULT === matchState
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
        onChange(items[0].value);
        return;
      }
    },
    [pull, sportId, matchState, setItems]
  );

  if (!items?.length) {
    return null;
  }

  return (
    <FilterItem
      labelKey="filter.date"
      checked={[checked]}
      items={items}
      onChange={(newTime: string[]) => onChange(newTime[0])}
      className="date-filter"
      emptyAllItem={
        ![StateExtra.RESULT, StateExtra.LIVE_LIST].includes(matchState)
      }
    />
  );
}

export default withApi({ pull: Pull })(DateFilter);
