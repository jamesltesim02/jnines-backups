import dayjs from 'dayjs';
import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Pagination } from 'antd-mobile';
import { useApi } from '../../../apis';
import Promotion from '../../../apis/Promotion';
import LoadingBar from '../../../components/common/LoadingBar';
import NavBar from '../../../components/common/NavBar';
import { Sports } from '../../../consts/match';

import memberStore from '../../../stores/member';
import mergeClass from '../../../utils/mergeClass';

function GradientBlock (
  {
    children,
    title,
    className
  }: any
) {
  return (
    <div className={mergeClass({
      'gradient-block': true,
      [className]: Boolean(className)
    })}>
      {
        title
        ? <header>{title}</header>
        : null
      }
      {children}
    </div>
  );
}

const tabs = [
  {
    name: '足球赛程',
    value: 10
  },
  {
    name: '篮球赛程',
    value: 11
  }
];

function RedEnvelope () {

  const history = useHistory();
  const location = useLocation();
  const { promotion }: { promotion: Promotion } = useApi({ promotion: Promotion });
  const [currTab, setCurrTab] = React.useState(Sports.SOCCER);

  const [matchLoading, setMatchLoading] = React.useState(false);
  const [matchs, setMatchs] = React.useState<Array<any>>([]);
  const [statistics, setStatistics] = React.useState<{ totalCount: number, totalAmount: number }>({
    totalCount: 0,
    totalAmount: 0
  });

  const [recordsLoading, setRecordsLoading] = React.useState(false);
  const [records, setRecords] = React.useState<{ count: number, list: Array<any> }>({
    count: 0,
    list: [],
  });
  const [recordsIndex, setRecordsIndex] = React.useState<number>(1);

  React.useEffect(
    () => {
      setMatchLoading(true);
      promotion.getRedEnvelopeMatchs().then(
        (result: any) => {
          setMatchs(result?.list || []);
          setStatistics(
            result?.statistics || {
              totalCount: 0,
              totalAmount: 0
            }
          )
        }
      ).finally(
        () => setMatchLoading(false)
      );
    },
    [promotion, setMatchs, setStatistics, setMatchLoading]
  );

  React.useEffect(
    () => {
      if (!memberStore.isLoged) {
        return
      }
      setRecordsLoading(true);
      promotion.getMyRedEnvelopes({
        pageIndex: recordsIndex
      }).then(
        (result: any) => {
          setRecords(records => ({
            list: result.list,
            count: result.count || records.count
          }));
        }
      ).finally(
        () => setRecordsLoading(false)
      );
    },
    [promotion, setRecords, setRecordsLoading, recordsIndex]
  );

  const filteredMatchs = matchs.filter(m => m.sportId === currTab);

  return (
    <>
      <NavBar title="九游体育红包雨, 见者有份" />
      <div className="red-envelope">
        <section className="slogan">
          <div>九游体育红包雨</div>
          <div>见者有份</div>
        </section>
        <div className="counts">
          <ul>
            <li>
              <span>{statistics.totalCount}</span>
              <label>已送出红包数</label>
            </li>
            <li>
              <span>{statistics.totalAmount}</span>
              <label>已送出红包金额</label>
            </li>
          </ul>
        </div>
        <GradientBlock
          title={
            <>
              {
                tabs.map(tab => (
                  <button
                    key={tab.value}
                    className={tab.value === currTab ? 'active' : undefined}
                    onClick={() => setCurrTab(tab.value)}
                  >{tab.name}</button>
                ))
              }
            </>
          }
          loading={matchLoading}
        >
          {
            filteredMatchs.length ? (
              <table className={`table matchs`}>
                <thead>
                  <tr>
                    <th>时间</th>
                    <th>赛事</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                {
                  filteredMatchs.map(item => (
                    <tr
                      key={item.matchId}
                      className={
                        item.matchState === 1 ? 'inplay' : undefined
                      }
                    >
                      <td
                        dangerouslySetInnerHTML={{
                          __html: dayjs(+item.matchDate).format('MM-DD<br/>HH:mm')
                        }}
                      />
                      <td>
                        <div>{item.tournamentName}</div>
                        <div>{item.matchName}</div>
                      </td>
                      <td>
                        {item.matchState === 1 ? '进行中' : '未开始'}
                        <br />
                        <Link to={`/detail/${item.matchId}`}>
                          {item.matchState === 1 ? '立即参与' : '查看详情' }
                        </Link>
                      </td>
                    </tr>
                  ))
                }
                </tbody>
              </table>
            ) : (
              matchLoading
              ? <LoadingBar />
              : (
                <div className="empty">
                  {
                    matchLoading
                    ? null 
                    : <>暂无数据</>
                  }
                </div>
              )
            )
          }
        </GradientBlock>
        <GradientBlock
          title="我的红包记录"
          className="re-records"
        >
          {
            memberStore.isLoged ? (
              records.list.length ? (
                <table className="table records">
                  <thead>
                    <tr>
                      <th>赛事</th>
                      <th>奖金</th>
                      <th>时间</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    records.list.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div>{item.tournamentName}</div>
                          <div>{item.matchName}</div>
                        </td>
                        <td>
                          {item.amount}
                        </td>
                        <td
                          dangerouslySetInnerHTML={{
                            __html: dayjs(+item.createTime).format('MM-DD HH:mm')
                          }}
                        />
                      </tr>
                    ))
                  }
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3}>
                        <Pagination
                          total={Math.floor((records.count + 19) / 20)}
                          current={recordsIndex}
                          onChange={(pageIndex) => setRecordsIndex(pageIndex + 1)}
                        />
                      </td>
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <div className="empty">
                  {
                    recordsLoading
                    ? null 
                    : <>暂无数据</>
                  }
                </div>
              )
            ) : (
              <section className="need-login">
                <label>当前未登录，无法查看记录</label>
                <button onClick={() => history.replace(`/login?from=${location.pathname}`)}>马上登录</button>
              </section>
            )
          }
          {
            recordsLoading
            ? <LoadingBar />
            : null
          }
        </GradientBlock>
        <GradientBlock className="description">
          {/* <section>
            <label>活动时间:</label>
            <span>2020年12月1日 - 2021年8月1日</span>
          </section>
          <section>
            <label>活动内容:</label>
            <div>足球红包雨：在指定赛事中，一旦出现进球，九游体育比赛详情页面便会飘落价值1000USDT的红包雨。</div>
            <div>NBA湖人红包雨： 湖人本赛季常规赛和季后赛， 第四节第10分钟之前(倒计时剩余3分钟以前)，一旦湖人得分达到99且领先立刻飘落1000USDT红包雨。</div>
            <div>两者有概率出现额外加奖666USDT大红包。</div>
          </section>
          <section>
            <label>活动规则:</label>
            <ol>
              <li>此活动需在比赛内页进行，红包飘屏时间内不在本场内页视为放弃，红包最低派发金额为1USDT，小于1USDT者需要继续参与活动累计1USDT以上才会派发。</li>
              <li>获得的红包奖金需在九游体育1倍有效投注流水方能提款。</li>
              <li>在九游体育有过真钱投注记录（即使用非优惠彩金投注记录）才可提取完成流水的彩金以及彩金投注所产生的盈利。</li>
              <li>若会员身份、电子邮箱地址、电话号码、支付方式（借记卡、银行账户号码）、或IP地址有相似的资料将视为不符合条件。</li>
              <li>任何会员若以任何不诚实手段，包括滥用多个账户、对赌、冒充、伪造身份、合谋作弊等参加此次活动将视为违规。违规者将会被取消资格并不需事先做任何通知。</li>
              <li>抢到的红包奖金将在比赛结束后4小时内到账。</li>
              <li>请勿滥用此优惠，对于违规者，九游体育有权取消其相关红利及其盈利。</li>
              <li>此活动条款最终解释权归九游体育所有。</li>
            </ol>
          </section> */}

          <section>
            <label>活动时间:</label>
            <span>2020年12月1日 - 2021年8月1日</span>
          </section>
          <section>
            <label>活动内容:</label>
            <div>足球红包雨：在指定赛事中，一旦出现进球，九游体育比赛详情页面便会飘落价值1000USDT的红包雨。</div>
            <label>C罗红包雨（限欧洲杯期间）：在葡萄牙队的所有2021欧洲杯赛事中，只要葡萄牙球员克里斯蒂亚诺-罗纳尔多取得进球，该场比赛详情页面立刻飘落总额2000USDT红包（其他人进球仍然为1000USDT）</label>
            <div>NBA湖人红包雨： 湖人本赛季常规赛和季后赛， 第四节第10分钟之前(倒计时剩余3分钟以前)，一旦湖人得分达到99且领先立刻飘落1000USDT红包雨。</div>
            <div>三者有概率出现额外加奖666USDT大红包。</div>
          </section>
          <section>
            <label>活动规则:</label>
            <ol>
              <li>此活动需在比赛内页进行，红包飘屏时间内不在本场内页视为放弃，红包最低派发金额为1USDT，小于1USDT者需要继续参与活动累计1USDT以上才会派发。</li>
              <li>获得的红包奖金需在九游体育1倍有效投注流水方能提款。</li>
              <li>仅限九游体育真钱会员参与，在九游体育有过真钱投注记录（即使用非优惠彩金投注记录）才可提取完成流水的彩金以及彩金投注所产生的盈利。</li>
              <li>若会员身份、电子邮箱地址、电话号码、支付方式（借记卡、银行账户号码）、或IP地址有相似的资料将视为不符合条件。</li>
              <li>任何会员若以任何不诚实手段，包括滥用多个账户、对赌、冒充、伪造身份、合谋作弊等参加此次活动将视为违规。违规者将会被取消资格并不需事先做任何通知。</li>
              <li>抢到的红包奖金将在比赛结束后4小时内到账。</li>
              <li>请勿滥用此优惠，对于违规者，九游体育有权取消其相关红利及其盈利。</li>
              <li>此活动条款最终解释权归九游体育所有。</li>
            </ol>
          </section>
        </GradientBlock>
      </div>
    </>
  );
}

export default RedEnvelope;
