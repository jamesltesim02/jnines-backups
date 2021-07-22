<template>
  <v-touch :class="`flex-center nb-bet-${txtClass}`" :style="bStyle" @tap="changeStatus">
    <div class="text flex-start" :style="tStyle">{{bAmt}}</div>
    <div v-if="!`${bAmt}`" class="place flex-start" :style="pStyle">
      {{flag ? '' : place || $t('pageBet.inputRange')}}{{min || 0}}-{{max || 0}}
    </div>
    <div v-else-if="!flag" position="absolute" class="like-input-clear-box flex-center">
      <bet-input-close :color="closeColor" />
    </div>
  </v-touch>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import BetInputClose from './BetInputClose';

export default {
  inheritAttrs: false,
  name: 'BetLikeInput',
  props: {
    min: Number,
    max: Number,
    flag: Boolean,
    lock: Boolean,
    place: String,
  },
  computed: {
    ...mapState({
      bAmt: state => state.bet.betInputObj.amt,
      kSts: state => state.bet.keyStatus,
    }),
    ...mapState('app', { theme: state => state.theme }),
    closeColor() {
      const defColor = /black/i.test(this.theme) ? '#585758' : '#E8E6E8';
      return /blue/i.test(this.theme) ? '#585758' : defColor;
    },
    oddsColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_OPTION_COLOR ? pSet.BLACK_OPTION_COLOR : '#ff5353';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_OPTION_COLOR ? pSet.BLUE_OPTION_COLOR : '#53fffd';
      }
      return pSet && pSet.WHITE_OPTION_COLOR ? pSet.WHITE_OPTION_COLOR : '#ff5353';
    },
    txtClass() {
      return `${this.bAmt}` ? 'like-input-active' : 'like-input-normal';
    },
    bStyle() {
      const obj = { 'border-radius': !this.flag ? '.04rem' : '.06rem' };
      return Object.assign(obj, `${this.bAmt}` ? { border: `.01rem solid ${this.oddsColor}` } : { });
    },
    tStyle() {
      const obj = { color: this.oddsColor, 'font-size': !this.flag ? '.2rem' : '.16rem' };
      return Object.assign(obj, { 'max-width': !this.flag ? '2rem' : '1.2rem' });
    },
    pStyle() {
      return { 'font-size': !this.flag ? '.13rem' : '.16rem' };
    },
  },
  components: { BetInputClose },
  methods: {
    ...mapMutations(['changeKeyStatus', 'changeBetAmount']),
    changeStatus(e) {
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      if (/input-clear/i.test(cName)) {
        setTimeout(() => { this.changeBetAmount({ amt: '' }); }, 50);
      } else if (!this.kSts && !this.lock) {
        this.changeKeyStatus(true);
      }
    },
  },
};
</script>

<style lang="less">
@keyframes actblink {
  from { border-right: 2px solid rgba(151,151,151,1); }
  50% { border-right: 2px solid rgba(151,151,151,0); }
  to { border-right: 2px solid rgba(151,151,151,1); }
}
.white .nb-bet-like-input-active {
  .place { color: #bababa; }
}
.white .nb-bet-like-input-normal {
  border: .01rem solid #ECEBEB;
  .place { color: #bababa; }
}
.black .nb-bet-like-input-active {
  .place { color: #716d6d; }
}
.black .nb-bet-like-input-normal {
  border: .01rem solid #716d6d;
  .place { color: #716d6d; }
}
.blue .nb-bet-like-input-active {
  .place { color: #606060; }
}
.blue .nb-bet-like-input-normal {
  border: .01rem solid #606060;
  .place { color: #606060; }
}
.nb-bet-like-input-active .text {
  animation: actblink 1000ms infinite;
}
.nb-bet-like-input-normal, .nb-bet-like-input-active {
  position: relative;
  .like-input-clear-box {
    position: absolute;
    width: .43rem;
    height: .43rem;
    top: 0;
    right: 0;
  }
  .text {
    height: .21rem;
    overflow: hidden;
    padding-right: .01rem;
  }
  .place { height: .21rem; color: #bababa; }
}
</style>
