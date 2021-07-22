import React from 'react';
import { useApi } from '../../../apis';
import Theme from '../../../apis/Theme';
import NavBar from '../../../components/common/NavBar';
import mergeClass from '../../../utils/mergeClass';
import BlockContainer from './BlockContainer';
import MatchItem, {Ec21Match} from './MatchItem';

import IconCrown from './images/crown.svg';
import IconToTop from './images/to-top.svg';
import { throttle } from 'lodash';
import LoadingBar from '../../../components/common/LoadingBar';

class PoolItem {
  value: number;
  totalAmount: number;
  accomplish: number;
  obtainAmount: number;
  constructor (source: string) {
    const values = source.split(':');
    [
      this.value,
      this.totalAmount,
      this.accomplish,
      this.obtainAmount
    ] =[
      Number(values[0]),
      Number(values[1]) + Number(values[4]),
      Number(values[2]) + Number(values[5]),
      Number(values[3]) + Number(values[6])
    ];
  }
}

function parseList <T> (source: string = '', Type: any) {
  return (
    source.replace(
      /^\[\{|\}\]$/gi,
      ''
    ).split(
      '},{'
    ).map<T>(
      matchStr => new Type(matchStr)
    )
  ); 
}

function WingFlag (
  {
    active,
    children
  }: {
    active: boolean,
    children: any
  }
) {
  return (
    <span
      className={mergeClass({
        'wing-flag': true,
        active
      })}
    >{children}</span>
  );
}

/** 欧洲杯闯关奖池活动 */
function Eurocup21Prizepool () {
  const [theme]:[Theme] = useApi([Theme]);
  const descriptionRef = React.useRef<any>();
  const poolRef = React.useRef<any>();
  const rootRef = React.useRef<any>();

  const [eliminateMode, setEliminateMode] = React.useState(true);
  const [toTopAvaibale, setToTopAvaibale] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [matchList1, setMatchList1] = React.useState<Ec21Match[]>([]);
  const [matchList2, setMatchList2] = React.useState<Ec21Match[]>([]);
  const [bonusList, setBonusList] = React.useState<PoolItem[]>([]);

  const handleMoveTo = (ref: React.MutableRefObject<HTMLDivElement | undefined>) => () => {
    if (!ref.current) {
      return;
    }
    window.scrollTo({
      top: ref.current.offsetTop - 45,
      behavior: 'smooth'
    });
  };

  React.useEffect(
    () => {
      setLoading(true);
      Promise.all([
        theme.getEurocup21PrizepoolMatchs(),
        theme.getEurocup21PrizepoolElimination(),
        theme.getEurocup21PrizepoolBonus()
      ]).then(([result1, result2, result3]) => {
        setMatchList1(
          parseList<Ec21Match>(result1, Ec21Match)
        );
        setMatchList2(
          parseList<Ec21Match>(result2, Ec21Match)
        )
        setBonusList(
          parseList(result3 || '', PoolItem)
        )
      }).finally(
        () => setLoading(false)
      )

      const handleScroll = throttle(
        () => setToTopAvaibale(window.scrollY >= 70),
        16
      );
      window.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    },
    [theme]
  );

  return (
    <>
      <NavBar title="百万奖池,大闯关" />
      <div
        className="ec21pp"
        ref={rootRef}
      >
        <div className="ec-banner">
          <i className="wing" />
          <ul className="flags">
            <li>
              <WingFlag active={!eliminateMode}>
                小组赛奖池
              </WingFlag>
            </li>
            <li></li>
            <li>
              <WingFlag active={eliminateMode}>
                淘汰赛奖池
              </WingFlag>
            </li>
          </ul>
          <ul className="flags-cover">
            <li>
              <button
                className="cover-button"
                onClick={() => setEliminateMode(false)}
              />
            </li>
            <li>
              <button
                className="rules-button"
                onClick={handleMoveTo(descriptionRef)}
              >活动规则</button>
            </li>
            <li>
              <button
                className="cover-button"
                onClick={() => setEliminateMode(true)}
              />
            </li>
          </ul>
        </div>
        {
          loading ? (
            <LoadingBar />
          ) : (
            !eliminateMode ? (
              <div>
                {matchList1.map(match => (
                  <MatchItem
                    key={match.index}
                    match={match}
                    pool={5000}
                  />
                ))}
              </div>
            ) : (
              <>
                <div>
                  {matchList2.map(match => (
                    <MatchItem
                      key={match.index}
                      match={match}
                      pool={10000}
                    />
                  ))}
                </div>
                <BlockContainer
                  ref={poolRef}
                  className="ec21pp-pool"
                  title={<>闯关大奖池<b>15万</b>USDT</>}
                >
                  <ul>
                    {
                      bonusList.map(bitem => (
                        <li key={bitem.value}>
                          <label>
                            <img src={IconCrown} />
                            淘汰赛猜对<b>{bitem.value}</b>场
                          </label>
                          <ol>
                            <li>
                              <span>{bitem.totalAmount}</span>
                              <label>奖池奖金<br />(USDT)</label>
                            </li>
                            <li>
                              <span>{bitem.accomplish}</span>
                              <label>达成人数<br />(人)</label>
                            </li>
                            <li>
                              <span>{(bitem.totalAmount/(bitem.accomplish || 1)).toFixed(2).replace('.00', '')}</span>
                              <label>获得奖励<br />(USDT)</label>
                            </li>
                          </ol>
                        </li>
                      ))
                    }
                  </ul>
                </BlockContainer>
              </>
            )
          )
        }
        <BlockContainer
          className="ec21pp-description"
          title="活动规则"
          ref={descriptionRef}
        >
          <div className="single-rules">
            <label>单场奖池</label>
            <ol>
              <li>欧洲杯期间，每天九游体育将会挑选一场比赛作为闯关奖池赛事，公布在活动页面</li>
              <li>用户只需要在九游体育平台当场赛事赛前盘投注“胜平负”玩法，单注不低于10USDT或者70RMB，即可参与成功。</li>
              <li>如果用户的活动注单获胜（猜中胜平负赛果），将获得本场奖池瓜分资格。</li>
            </ol>
          </div>
          <div className="common-rules">
            <label>通用规则</label>
            <ol>
              <li>每个用户每场比赛只可以选择胜、平、负其中一项投注参与活动，如果投注多个选项，只统计第一个注单作为活动共参与依据。</li>
              <li>每场奖池赛事结束后，九游体育将统计用户中奖情况并将彩金添加至用户账户，无需流水即可提现。</li>
              <li>本优惠可以与其他欧洲杯活动奖励重复获得。</li>
              <li>此优惠仅开放给独立账户的会员。若会员身份、电子邮箱地址、电话号码、支付方式（ 借记卡/银行账户号码 ）、或 IP 地址有相似的资料将视为不符合条件。</li>
              <li>任何会员若以任何不诚实手段，包括滥用多个账户、对赌、冒充、伪造身份、合谋作弊等参加此活动将视为违规，违规者将会被取消申请资格并不需事先作任何通知。</li>
              <li>对于违规者, 九游体育有权取消其相关红利及其盈利。</li>
              <li>九游体育拥有优惠活动的最终解释权。</li>
            </ol>
          </div>
        </BlockContainer>

        <button
          className={mergeClass({
            'to-pool-botton': true,
            available: eliminateMode
          })}
          onClick={handleMoveTo(poolRef)}
        >
          闯关<br />奖池
        </button>
        <button
          className={mergeClass({
            'ec21pp-to-top-button': true,
            available: toTopAvaibale
          })}
          onClick={handleMoveTo(rootRef)}
        >
          <img src={IconToTop} />
        </button>
      </div>
    </>
  );
}

export default Eurocup21Prizepool;
