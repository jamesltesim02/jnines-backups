import React from 'react'
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react';

import dayjs from 'dayjs';

import M from '../common/m';
import Match from '../../stores/matchs/Match';
import { MatchState, Sports } from '../../consts/match';

function MatchTime (
  { match }: {
    match: Match
  }
) {
  const intl = useIntl()

  if (!match) {
    return null;
  }

  // 非滚球直接返回日期
  if (match.matchState !== MatchState.LIVE) {
    return (
      <>
        {dayjs(+match.matchDate).format('MM/DD HH:mm')}
      </>
    )
  }

  // 棒球,排球无时间无阶段,则显示进行中
  if (
    [
      Sports.BASEBALL,
      Sports.VOLLEYBALL
    ].includes(match.sportId)
  ) {
    return <M id="search.playing" />;
  }

  const periodComp = (
    <M
      id={`period.${match.currPeriod || 0}`}
      values={{ type: intl.formatMessage({ id: `periods.${match.sportId}` }) }}
    />
  );

  // 网球无时间,直接显示阶段
  if (
    match.sportId !== Sports.SOCCER
    &&
    match.sportId !== Sports.BASKETBALL
  ) {
    return periodComp;
  }

  const time = match.liveTime || {}

  return (
    <>
    {periodComp}
    &nbsp;
    {
      (
        [15, 19].includes(Number(match.currPeriod))
        ||
        !time.runTime
      ) ? null : (
        <>
          {time.runTime}
          {
            +time.stoppageTime > 0? (
              `+${time.stoppageTime}`
            ) : ''
          }
          <M id="common.minute" />
        </>
      )
    }
    </>
  )
}

export default observer(MatchTime)
