import React from 'react';
import { useApi } from '../../../apis';
import Pull from '../../../apis/Pull';
import NavBar from '../../../components/common/NavBar';
import mergeClass from '../../../utils/mergeClass';
import LoadingBar from '../../../components/common/LoadingBar';

import BannerImage from './images/mobile-banner@2x.png';
import Medal1Image from './images/medal-1.svg';
import Medal2Image from './images/medal-2.svg';
import Medal3Image from './images/medal-3.svg';

import BoxNum1Image from './images/box-num-1.svg';
import BoxNum2Image from './images/box-num-2.svg';
import BoxNum3Image from './images/box-num-3.svg';

const MEDALS = [Medal1Image, Medal2Image, Medal3Image];

// 联赛id
const TOURID = '2998208593133569';

const PROFITINDEX_BONUS = [
  5_000,
  3_000,
  1_500,
  1_500,
  1_500,
  800,
  800,
  800,
  800,
  800,
  250,
  250,
  250,
  250,
  250,
  250,
  250,
  250,
  250,
  250,
  100,
  100,
  100,
  100,
  100,
  100,
  100,
  100,
  100,
  100
];
const RANK_BONUS = PROFITINDEX_BONUS;
const PROFIT_BONUS = PROFITINDEX_BONUS;

function LeaderboardBox (
  {
    icon,
    title,
    subTitle,
    children
  }: {
    icon: any,
    title: string,
    subTitle: string,
    children: any
  }
) {

  const contentRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState(0);
  const [expanded, setExpanded] = React.useState(true);

  React.useEffect(
    () => {
      if (contentRef.current) {
        setHeight(contentRef.current.clientHeight);
      }
    },
    []
  )

  return (
    <div className={mergeClass({
      'leaderboard-box': true,
      expanded
    })}>
      <header
        className="leaderboard-header"
        onClick={() => setExpanded(!expanded)}
      >
        {icon}
        <div>
          <h3>{title}</h3>
          <label>{subTitle}</label>
        </div>
        <button>
          <i />
        </button>
      </header>
      <section
        className="leaderboard-content"
        style={{ height: expanded ? height : 0 }}
      >
        <div ref={contentRef}>{children}</div>
      </section>
    </div>
  );
}

function HeroLeaderboard () {

  const { pull  }: { pull: Pull } = useApi({ pull: Pull });

  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<{
    profitIndex: any[],
    winRate: any[],
    profitRand: any[]
  }>({
    profitIndex: [],
    winRate: [],
    profitRand: []
  });

  React.useEffect(
    () => {
      setLoading(true);
      const params = {
        tourId: TOURID,
        weight: true,
        over: true,
        pageSize: PROFITINDEX_BONUS.length
      };
      Promise.all([
        pull.getProfitIndexRank(params),
        pull.getWinRateRank(params),
        pull.getProfitRank(params),
      ]).then(([
        profitIndex,
        winRate,
        profitRand
      ]) => setData({
        profitIndex,
        winRate,
        profitRand
      })).finally(
        () => setLoading(false)
      );
    },
    [pull, setData, setLoading]
  );

  return (
    <>
      <NavBar title="欧洲杯英雄榜" />
      <div className="hero-leaderboard">
        <div className="hl-banner">
          <img src={BannerImage} />
        </div>
        {
          loading ? (
            <LoadingBar />
          ) : (
            <>
              <LeaderboardBox
                icon={<img src={BoxNum1Image} />}
                title="盈利指数榜"
                subTitle="总净盈利/总投注额"
              >
                <table>
                  <thead>
                    <tr>
                      <th>排名</th>
                      <th>账号</th>
                      <th>盈利指数</th>
                      <th>奖金<sub>USDT</sub></th>
                      <th>注单/比赛</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    data.profitIndex.map((item, index) => (
                      <tr>
                        <td>
                          {
                            index < 3
                            ? <img src={MEDALS[index]} />
                            : (index + 1)
                          }
                        </td>
                        <td>{item.compUserId}</td>
                        <td>
                          {
                            item.winRate < 1
                            ? `小于1%`
                            : `${item.winRate}%`
                          }
                        </td>
                        <td>{PROFITINDEX_BONUS[index]}</td>
                        <td>
                          {item.ticketCount >= 50 ? '完成' : item.ticketCount}
                          /
                          {item.matchCount >= 30 ? '完成' : item.matchCount}
                        </td>
                      </tr>
                    ))
                  }
                  </tbody>
                </table>
              </LeaderboardBox>
              <LeaderboardBox
                icon={<img src={BoxNum2Image} />}
                title="胜率榜"
                subTitle="胜率指数=获胜注单数（包含赢半）/总注单数"
              >
                <table>
                  <thead>
                    <tr>
                      <th>排名</th>
                      <th>账号</th>
                      <th>胜率</th>
                      <th>奖金<sub>USDT</sub></th>
                      <th>注单/比赛</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    data.winRate.map((item, index) => (
                      <tr>
                        <td>
                          {
                            index < 3
                            ? <img src={MEDALS[index]} />
                            : (index + 1)
                          }
                        </td>
                        <td>{item.compUserId}</td>
                        <td>{item.winRate}%</td>
                        <td>{RANK_BONUS[index]}</td>
                        <td>
                          {item.ticketCount >= 50 ? '完成' : item.ticketCount}
                          /
                          {item.matchCount >= 30 ? '完成' : item.matchCount}
                        </td>
                      </tr>
                    ))
                  }
                  </tbody>
                </table>
              </LeaderboardBox>
              <LeaderboardBox
                icon={<img src={BoxNum3Image} />}
                title="盈利榜"
                subTitle="总盈利（金额）排名"
              >
                <table>
                  <thead>
                    <tr>
                      <th>排名</th>
                      <th>账号</th>
                      <th>盈利</th>
                      <th>奖金<sub>USDT</sub></th>
                      <th>注单/比赛</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    data.profitRand.map((item, index) => (
                      <tr>
                        <td>
                          {
                            index < 3
                            ? <img src={MEDALS[index]} />
                            : (index + 1)
                          }
                        </td>
                        <td>{item.compUserId}</td>
                        <td>{item.totalWinlost}</td>
                        <td>{PROFIT_BONUS[index]}</td>
                        <td>
                          {item.ticketCount >= 50 ? '完成' : item.ticketCount}
                          /
                          {item.matchCount >= 30 ? '完成' : item.matchCount}
                        </td>
                      </tr>
                    ))
                  }
                  </tbody>
                </table>
              </LeaderboardBox>
            </>
          )
        }
        <div className="hl-rules">
          <header>活动规则</header>
          <h3>
            欧洲杯期间，九游体育将会根据所有用户的欧洲杯投注情况，排出几大榜单，并给予奖金！
            <br />
            活动参与资格：需于活动期间累计投注30场（含）以上欧洲杯赛事且有50个（含）单注且投注额大于等于20 USDT有效注单
            <br />
            同盘口多次重复投注仅计算为一个有效注单
          </h3>
          <ol>
            <li>榜单仅统计用户在九游体育投注2021年欧洲杯赛事的数据。</li>
            <li>每位会员最多能获得一次此优惠。同一会员若是同时在三个榜上 是给金额最高的。</li>
            <li>排行榜若出现并列情况，投注赛事场次多的会员靠前。如投注场次也相同则总有效投注额高的用户靠前。如果同时获得本活动多个奖金，只可以获得最高奖金一次。</li>
            <li>返还将以USDT形式派发到用户账户中。</li>
            <li>本优惠可以与其他优惠重复获得。</li>
            <li>在体育博彩中，仅对产生输赢结果的投注额进行计算，所有平局或取消的赛事以及任何赔率低于1.7的投注将不计算在任何有效累计投注内。</li>
            <li>获得的奖金无需流水即可提款。</li>
          </ol>
        </div>
      </div>
    </>
  );
}

export default HeroLeaderboard;
