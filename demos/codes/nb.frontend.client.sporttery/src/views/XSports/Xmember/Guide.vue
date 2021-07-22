<template>
  <list-page class="x-guide">
    <nav-bar
      slot="header"
      title="新手帮助"
    />
    <div class="rule-group">
      <h4>竞猜</h4>
      <ul>
        <li>竞猜分为“赛前竞猜”和“赛中竞猜(滚球)”两种。</li>
        <li>赛前竞猜：在比赛还未开始前预测比赛。</li>
        <li>赛中竞猜(滚球)：在比赛进行过程中预测接下来发生的事态。</li>
      </ul>
    </div>
    <div class="rule-group">
      <h4>竞猜形式</h4>
      <ul>
        <li>单项竞猜(独赢)：投一个盘口。</li>
        <li>复试竞猜：多个盘口一起投，盈利倍数是多个单个盘口的累加。</li>
        <li>混合过关：用某种特定玩法(如3串4、3串7等)来进行多个盘口一起竞猜。</li>
      </ul>
    </div>
    <div class="rule-group">
      <h4>其他竞猜类型</h4>
      <ol>
        <li>1、两队都得分：预测两队是否都在赛事中皆有进球</li>
        <li>2、球队入球数 ：预测指定球队的入球数</li>
        <li>3、三选项让球盘：竞猜经让球调整后之主客和赛果。</li>
        <li>4、角球大小：竞猜比赛中双方所开出角球的总数。如果角球数大于预先指定的角球数，则竞猜“大”的为赢家如果角球数低于预先指定的角球数，则竞猜“小”的为赢家。</li>
        <li>5、第一个进球：竞猜哪个队伍会在比赛中会射进第一个入球。</li>
        <li>6、最后入球：竞猜哪个队伍会在比赛中会射进最后一球。</li>
        <li>7、进球最多的半场：竞猜哪半场有较多入球，可选择该场比赛的「上半场入球较多」、「下半场入球较多」或「上下半场入球数相同」。</li>
        <li>8、净胜球：预测两队之间的分差</li>
        <li>9、单队大小盘：单队大小盘是指竞猜某队在单场赛事中的得分。</li>
        <li>10、两个半场都获胜：预测选择的球队在90分钟完场时间内(不包括加时赛及点球赛)是否在上半场和下半场的进球数都多于对手。</li>
        <li>11、球队至少获胜半场比赛：预测选择的球队在90分钟完场时间内(不包括加时赛及点球赛)是否在上/下半场的其中一个半场进球数多于对手。</li>
        <li>12、主胜退款：预测该赛事之最终成绩为客胜或赛和，若主胜则退款。</li>
        <li>13、客胜退款：预测该赛事之最终成绩为主胜或赛和，若客胜则退款。</li>
        <li>14、平局退款：预测该赛事之最终成绩为主胜或客胜，若赛和则退款。</li>
        <li>15、小组首名：预测分组阶段小组首名出线队伍。</li>
        <li>16、冠军竞猜：预测哪个参赛者或队伍在联赛中获得冠军。</li>
      </ol>
    </div>
  </list-page>
</template>
<style lang="less">
.x-guide .page-content{
  padding: .1rem;
  .rule-group {
    border-radius: 6px;
    box-shadow: 0 10px 20px 0 rgba(223, 222, 223, 0.5);
    border: solid 1px #ecebeb;
    background-image: linear-gradient(to top, #f9f9f9, #ffffff);
    margin-bottom: .1rem;
    h4 {
      line-height: .4rem;
      padding-left: .15rem;
      border-bottom: solid 1px #ecebeb;
      font-size: .14rem;
      color: #3a3a3a;
      letter-spacing: 0.02px;
    }
    ol, ul {
      font-size: .12rem;
      color: #909090;
      padding-bottom: .1rem;
      letter-spacing: -1px;
    }
    li {
      padding: 0 .08rem 0 .15rem;
      margin-top: .1rem;
      line-height: .2rem;
    }
  }
}
.blue .x-guide .page-content{
  .rule-group {
    box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1);
    background: linear-gradient(to bottom, #3a393f, #333238);
    border: 1px solid #2e2f34;
    h4 {
      border-bottom: solid 1px #2e2f34;
      color: #ecebeb;
    }
    ol, ul { color: #909090; }
  }
}
</style>
