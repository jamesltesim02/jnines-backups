<template>
<div
  v-show="visible"
  :class="{
    'x-game-rules': true,
    in: isIn,
  }"
  ref="el"
    @mousedown.self="close"
>
  <div class="rules-container">
    <header>
      玩法规则
      <button
        @click="close"
        class="close-button"
      >close</button>
    </header>
    <section>
      <perfect-scrollbar>
        <div class="rule-group">
          <h4>投注</h4>
          <ul>
            <li>投注分为“赛前投注”和“赛中投注(滚球)”两种。</li>
            <li>赛前投注：在比赛还未开始前预测比赛。</li>
            <li>赛中投注(滚球)：在比赛进行过程中预测接下来发生的事态。</li>
          </ul>
        </div>
        <div class="rule-group">
          <h4>投注形式</h4>
          <ul>
            <li>单项投注(独赢)：投一个盘口。</li>
            <li>复试投注：多个盘口一起投，盈利倍数是多个单个盘口的累加。</li>
            <li>混合过关：用某种特定玩法(如3串4、3串7等)来进行多个盘口一起投。</li>
          </ul>
        </div>
        <div class="rule-group">
          <h4>其他投注类型</h4>
          <ol>
            <li>1、两队都得分：预测两队是否都在赛事中皆有进球</li>
            <li>2、球队入球数 ：预测指定球队的入球数</li>
            <li>3、三选项让球盘：投注经让球调整后之主客和赛果。</li>
            <li>4、角球大小：投注比赛中双方所开出角球的总数。如果角球数大于预先指定的角球数，则投注“大”的为赢家如果角球数低于预先指定的角球数，则投注“小”的为赢家。</li>
            <li>5、第一个进球：投注哪个队伍会在比赛中会射进第一个入球。</li>
            <li>6、最后入球：投注哪个队伍会在比赛中会射进最后一球。</li>
            <li>7、进球最多的半场：投注哪半场有较多入球，可选择该场比赛的「上半场入球较多」、「下半场入球较多」或「上下半场入球数相同」。</li>
            <li>8、净胜球：预测两队之间的分差</li>
            <li>9、单队大小盘：单队大小盘是指投注某队在单场赛事中的得分。</li>
            <li>10、两个半场都获胜：预测选择的球队在90分钟完场时间内(不包括加时赛及点球赛)是否在上半场和下半场的进球数都多于对手。</li>
            <li>11、球队至少获胜半场比赛：预测选择的球队在90分钟完场时间内(不包括加时赛及点球赛)是否在上/下半场的其中一个半场进球数多于对手。</li>
            <li>12、主胜退款：预测该赛事之最终成绩为客胜或赛和，若主胜则退款。</li>
            <li>13、客胜退款：预测该赛事之最终成绩为主胜或赛和，若客胜则退款。</li>
            <li>14、平局退款：预测该赛事之最终成绩为主胜或客胜，若赛和则退款。</li>
            <li>15、小组首名：预测分组阶段小组首名出线队伍。</li>
            <li>16、冠军投注：预测哪个参赛者或队伍在联赛中获得冠军。</li>
          </ol>
        </div>
      </perfect-scrollbar>
    </section>
  </div>
</div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      animating: false,
      visible: false,
      isIn: false,
    };
  },
  computed: {
    ...mapState('xsports', ['gameRulesVisible']),
  },
  watch: {
    gameRulesVisible: 'setVisibility',
  },
  mounted() {
    this.setVisibility(this.gameRulesVisible);
  },
  methods: {
    ...mapMutations('xsports', ['showGameRule', 'hideGameRule']),
    setVisibility(n) {
      this.animating = true;
      if (n) {
        this.visible = true;
        setTimeout(() => {
          this.isIn = true;
        }, 0);
      } else {
        this.isIn = false;
      }
      setTimeout(() => {
        this.animating = false;
        if (!this.isIn) {
          this.visible = false;
        }
      }, 350);
    },
    close() {
      if (this.animating) {
        return;
      }
      this.isIn = false;
      setTimeout(this.hideGameRule.bind(this), 350);
    },
  },
};
</script>
<style lang="less">
.x-game-rules {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  &::before {
    content: "";
    position: absolute;
    background-color: #000;
    opacity: 0;
    z-index: 1;
    transition: all .35s ease-out;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: scale(0);
    width: 4000px;
    height: 4000px;
    top: 50%;
    left: 50%;
    margin: -2000px auto auto -2000px;
    border-radius: 50%;
  }
  .rules-container {
    position: absolute;
    top: 0;
    right: 0;
    width: 500px;
    height: 100%;
    box-shadow: 0 2px 4px 0 rgba(37, 37, 37, 0.5);
    background-color: #f5f4f5;
    z-index: 2;
    transform: translateX(100%);
    transition: all .25s ease-out;
    display: flex;
    flex-direction: column;
    header {
      position: relative;
      height: 80px;
      background: url('./images/subview-white.jpg') 100% 100%;
      display: flex;
      align-items: center;
      padding-left: 22px;
      font-size: 24px;
      color: #eeeeee;
      letter-spacing: 0.04px;
    }
    section {
      // flex-grow: 1;
      height: calc(100% - 80px);
      overflow: hidden;
      .ps {
        padding: 0 12px 12px 12px;
        height: 100% !important;
      }
    }
    .rule-group {
      border-radius: 6px;
      box-shadow: 0 2px 4px 0 rgba(236, 236, 236, 0.5);
      background-image: linear-gradient(to top, #f9f9f9, #ffffff);
      margin-top: 15px;
      overflow: hidden;
      h4 {
        font-size: 16px;
        letter-spacing: 0.02px;
        color: #3a3a3a;
        font-weight: bolder;
        line-height: 40px;
        padding-left: 16px;
        border-bottom: solid 1px #ecebeb;
      }
      ul, ol {
        padding: 10px 16px;
      }
      li {
        font-size: 12px;
        line-height: 22px;
      }
      ol li {
        line-height: 20px;
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  .close-button {
    position: absolute;
    font-size: 0;
    display: block;
    width: 18px;
    height: 18px;
    right: 10px;
    top: 50%;
    padding: 12px;
    transition: all .2s ease-out;
    z-index: 4;
    border: 0;
    transform: translateY(-50%);
    border: 2px solid #fff;
    border-radius: 50%;
    &::before,
    &::after {
      position: absolute;
      content: "";
      display: block;
      background-color: #fff;
      width: 17px;
      height: 2px;
      top: 50%;
      left: 50%;
    }
    &::before {
      transform: translate(-50%, -50%) rotate(45deg);
    }
    &::after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
    &:hover {
      background: transparent;
      transform: translateY(-50%) rotate(180deg);
    }
    &:active {
      transform: translateY(-50%) rotate(180deg) scale(1.3);
    }
  }
  &.in {
    &::before {
      opacity: .6;
      transform: scale(1);
    }
    .rules-container {
      transform: translateX(0);
    }
  }
}

.dark .x-game-rules .rules-container {
  box-shadow: 0 2px 4px 0 rgba(37, 37, 37, 0.5);
  background-color: #2d2c32;
  header {
    background: url('./images/subview-dark.jpg') 100% 100%;
  }
  .rule-group {
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.3);
    background-image: linear-gradient(to bottom, #3a393f, #333238);
    h4 {
      border-color: #2e2f34;
      color: #ecebeb;
    }
  }
}
</style>
