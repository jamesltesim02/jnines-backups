import React from 'react';
import BlockContainer from './BlockContainer';
import MatchItem, { Ec21Match } from './MatchItem';

function GroupMatchs (
  {
    matchs
  }: {
    matchs: Ec21Match[]
  }
) {
  return (
    <section className="ec21pp-group-matchs">
      <div className="group-match-list">
        {
          matchs.map(match => (
            <MatchItem
              key={match.index}
              match={match}
            />
          ))
        }
      </div>
      <BlockContainer
        title="活动规则"
        className="group-match-description"
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
    </section>
  );
}

export default GroupMatchs;
