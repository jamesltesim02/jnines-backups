import dayjs from 'dayjs';
import React from 'react';
import { Link } from 'react-router-dom';
import IconTeam4Ec21 from '../../../components/promotions/common/IconTeam4Ec21';
import mergeClass from '../../../utils/mergeClass';
import BlockContainer from './BlockContainer';

enum MatchState {
  EARLY = 0,
  LIVE = 1,
  FINISHED = 3
}

export class Ec21Match {
  /** 序号 */
  index: number;
  /** 时间，其中小时和分钟用半角减号 */
  matchTime: dayjs.Dayjs;
  /** SabaID，0=暂无SabaID */
  sabaId?: string;
  /** NBMatchID，long，0=暂无 */
  matchId?: string;
  /** 比赛状态；0=早盘；1=滚球；3=完场 */
  matchState: MatchState;
  /** 主队，如是固定26支国家队名请自行获取logo，注意不一定是国家名，有可能是 "A组第一" */
  home: string;
  /** 客队，同上 */
  away: string;
  /** 主队完场得分，注意只有完场后才用，早盘和滚球一直都是0，0=暂无完场比分，不是进球0 */
  homeScore?: number;
  /** 客队完场得分，同上 */
  awayScore?: number;
  /** 买胜最终人数，前端用 */
  countOf1: number;
  /** 买平最终人数，前端用 */
  countOfX: number;
  /** 买负最终人数，前端用 */
  countOf2: number;

  constructor (source: string) {
    const values = source.split(':');
    const matchState = Number(values[4]) as MatchState;
    const timeValues:number[] = values[1].split(/[\s\-]/gi).map(Number);
    [
      this.index,
      this.matchTime,
      this.sabaId,
      this.matchId,
      this.matchState,
      this.home,
      this.away,
      this.homeScore,
      this.awayScore,
      this.countOf1,
      this.countOfX,
      this.countOf2
    ] = [
      Number(values[0]),
      dayjs(new Date(+timeValues[0], +timeValues[1] - 1, +timeValues[2], +timeValues[3], +timeValues[4], 0, 0)),
      values[2] === '0' ? undefined : values[2],
      values[3] === '0' ? undefined : values[3],
      matchState,
      values[5],
      values[6],
      matchState === MatchState.FINISHED ? Number(values[7]) : undefined,
      matchState === MatchState.FINISHED ? Number(values[8]) : undefined,
      Number(values[9]),
      Number(values[10]),
      Number(values[11]),
    ];
  }
};

function countText (count: number) {
  return count > 99999 ? '10W+' : count;
}

function MatchItem (
  {
    match,
    pool = 5000
  }: {
    match: Ec21Match,
    pool?: number
  }
) {
  const [expanded, setExpanded] = React.useState(match.matchState !== MatchState.FINISHED);

  return (
    <BlockContainer
      className="ec21pp-match-item"
      title={<>本场奖池<b>{pool}</b>USDT</>}
    >
      <ul className="ec21pp-match-info">
        <li>
          <IconTeam4Ec21
            name={match.home}
            size={74}
            circle
          />
          <label>{match.home}</label>
        </li>
        <li>
          <span className="vs">
            {
              typeof match.homeScore === 'number'
              ? <i>{match.homeScore}</i>
              : undefined
            }
            VS
            {
              typeof match.awayScore === 'number'
              ? <i>{match.awayScore}</i>
              : undefined
            }
          </span>
          <time>{match.matchTime.format('M/DD HH:mm')}</time>
          {
            match.matchState != MatchState.FINISHED ? (
              Boolean(match.matchId) ? (
                <Link to={`/detail/${match.matchId}`}>
                  {
                    match.matchState === MatchState.LIVE
                    ? '现场投注'
                    : '参与分奖'
                  }
                </Link>
              ) : <var>等待开始</var>
            ) : <var>比赛结束</var>
          }
        </li>
        <li>
          <IconTeam4Ec21
            name={match.away}
            size={74}
            circle
          />
          <label>{match.away}</label>
        </li>
      </ul>
      <div className={mergeClass({
        'ec21app-statistics': true,
        expanded
      })}>
        <header>
          <label></label>
          <span>胜</span>
          <span>平</span>
          <span>负</span>
        </header>
        <section>
          <label>参与人数</label>
          <span>{countText(match.countOf1)}</span>
          <span>{countText(match.countOfX)}</span>
          <span>{countText(match.countOf2)}</span>
        </section>
        <section className="prize">
          <label>可分奖励</label>
          <span>{(pool/(match.countOf1 || 1)).toFixed(2).replace('.00', '')}</span>
          <span>{(pool/(match.countOfX || 1)).toFixed(2).replace('.00', '')}</span>
          <span>{(pool/(match.countOf2 || 1)).toFixed(2).replace('.00', '')}</span>
        </section>
      </div>
      <button
        className={mergeClass({
          'expand-button': true,
          expanded
        })}
        onClick={() => setExpanded(!expanded)}
      >
        {
          !expanded
          ? <>展开查看参与情况</>
          : '收起'
        }
      </button>
    </BlockContainer>
  );
}

export default MatchItem;
