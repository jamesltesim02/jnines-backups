<template>
  <div class="x-program-item">
    <v-touch tag="header" @tap="toPubDetail" >
      <span class="type flex-start" v-if="isMe">发单</span>
      <span class="type flex-start" v-else>跟单</span>
      <span>{{ program.planTitle }}</span>
      <win-or-lose
        v-if="typeof program.settleResult !== 'undefined' && program.settleResult !== 0"
        :win="program.settleResult >= 0"
      />
    </v-touch>
    <program-match-items :items="program.items" />
    <footer
      :class="{ settled: isMe }"
    >
      <div class="my-amount" v-if="isMe">
        自购<span class="amount">{{ program.betAmount | moneyFormat }}</span>元
      </div>
      <div class="my-amount" v-else>
        竞猜<span class="amount">{{ program.betAmount | moneyFormat }}</span>元
      </div>
      <div class="follow-count" v-if="isMe">
        跟单<span>{{ program.followCount }}</span>人
      </div>
      <div class="commission" v-if="isMe">
        跟单获得<span>{{ program.recCommission }}</span>
      </div>
      <div
        v-if="!isMe && program.settleResult !== 0"
        class="settle-amount"
      >返还<span>{{program.settleAmount | moneyFormat}}</span></div>
      <div
        v-else-if="!isMe && program.settleResult === 0"
        class="settle-amount"
      >预计返还<span>{{rtnMin | moneyFormat}}~{{rtnMax | moneyFormat}}</span></div>
      <template>
        <v-touch
          v-if="program.settleResult === 0 || !isMe"
          tag="button"
          @tap="toShareFun"
        >分享</v-touch>
        <v-touch
          v-if="program.settleResult !== 0 && isMe && program.share"
          tag="button"
          @tap="toNewShinePage"
        >发晒单</v-touch>
        <button
          v-else-if="program.settleResult !== 0 && isMe"
          class="shared"
        >已晒单</button>
      </template>
    </footer>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import WinOrLose from './WinOrLose';
import ProgramMatchItems from '../ProgramMatchItems';

export default {
  props: {
    program: { default: () => ({}) },
    type: Number,
  },
  data() {
    return { expanded: false };
  },
  computed: {
    ...mapState('app', ['isLoged', 'userinfo']),
    isMe() {
      return !!(this.program && this.userinfo && this.program.userId && `${this.userinfo.nbUser}` === `${this.program.userId}`);
    },
    rtnMin() {
      const amt = +(this.program && this.program.betAmount ? this.program.betAmount : 0);
      const odds = +(this.program && this.program.ensureOdds ? this.program.ensureOdds : 1);
      const tAmt = amt * odds;
      const rAmt = parseInt(tAmt / 500, 10) * 500;
      return rAmt === tAmt ? (rAmt - 500) : rAmt;
    },
    rtnMax() {
      return this.rtnMin + 500;
    },
  },
  components: { WinOrLose, ProgramMatchItems },
  methods: {
    ...mapMutations('app', ['setPageAziFlag', 'setShareTarget']),
    ...mapMutations(['updateShineNewObj']),
    toNewShinePage() {
      if (this.program && this.program.ticketId) {
        this.updateShineNewObj(this.program);
        this.$router.push(`/shinenew/${this.program.ticketId}`);
      }
    },
    toPubDetail() {
      if (this.program && this.program.ticketId) {
        this.setPageAziFlag(1);
        this.$router.push(`/publishdetail/${this.program.ticketId}`);
      }
    },
    toShareFun() {
      setTimeout(() => { this.setShareTarget(this.isMe ? 'publish' : 'follow'); }, 100);
    },
  },
};
</script>
<style lang="less">
.x-program-item {
  border-radius: 6px;
  box-shadow: 0 .1rem .2rem 0 rgba(223,222,223,.5);
  border: solid 1px #f1f1f1;
  background-image: linear-gradient(to top, #f9f9f9, #fafafa);
  overflow: hidden;
  & > * {
    padding: 0 .1rem;
  }
  header {
    line-height: .38rem;
    font-size: .14rem;
    letter-spacing: -0.27px;
    display: grid;
    grid-template-columns: .42rem 1fr .26rem;
    align-items: center;
    .type { font-size: .16rem; color: #909090; }
  }
  section {
    font-size: .12rem;
    color: #aaa;
    margin: 0 -.1rem;
    .items-line {
      display: block;
      background-image: linear-gradient(to top, #fcfcfc, #f3f3f3);
      line-height: .3rem;
      padding: 0 .1rem;
      border-top: solid 1px #f6f6f6;
      border-bottom: solid 1px #f6f6f6;
    }
    .icon-arrow {
      height: .12rem !important;
      margin-left: .06rem;
    }
  }
  footer {
    line-height: .36rem;
    display: grid;
    grid-template-columns: 1fr 1fr .6rem;
    color: #909090;
    background: #fff;
    .follow-count {
      text-align: right;
    }
    span {
      font-size: 16px;
      color: #ff5353;
      margin: 0 .03rem;
    }
    button {
      background: #ff5353;
      color: #fff;
      line-height: .24rem;
      height: .24rem;
      font-size: .14rem;
      border-radius: 10rem;
      margin-top: .06rem;
      &.shared {
        font-size: .12rem;
        color: #cacaca;
        background: transparent;
      }
    }
  }
  footer.settled {
    grid-template-columns: 1fr 1fr 1fr .6rem;
    .follow-count {
      text-align: center;
    }
    .settle-amount {
      text-align: right;
    }
  }
}
.blue .x-program-item {
  box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1);
  background: linear-gradient(to bottom, #3a393f, #333238);
  border: .01rem solid #2e2f34;
  header { color: #ecebeb; .type { color: #aaaaaa; } }
  section {
    color: #666666;
    .items-line {
      background: linear-gradient(to top, #303030, #343438);
      border-top: solid 1px #2e2f34;
      border-bottom: solid 1px #2e2f34;
    }
  }
  footer {
    color: #909090;
    background: linear-gradient(to bottom, #3a393f, #333238);
    span { color: #53fffd; }
    button {
      background: #00b5b3;
      color: #fff;
      &.shared { color: #777777; background: transparent; }
    }
  }
}
</style>
