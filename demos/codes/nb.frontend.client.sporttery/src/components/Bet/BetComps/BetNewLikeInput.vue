<template>
  <v-touch :class="inputClass" :style="inputStyle" @tap="focusFun">
    <div class="text flex-start" :style="{ color: oddsColor }">{{bAmt}}</div>
    <div class="place flex-start" v-if="!`${bAmt}`">
      {{min || 0}}-{{max || 0}}
    </div>
  </v-touch>
</template>

<script>
import { mapState } from 'vuex';

export default {
  inheritAttrs: false,
  name: 'BetNewLikeInput',
  props: {
    min: Number,
    max: Number,
    place: String,
    focus: Boolean,
  },
  computed: {
    ...mapState({ bAmt: state => state.bet.betInputObj.amt }),
    ...mapState('app', { theme: state => state.theme }),
    inputClass() {
      const cStr = `nb-bet-new-like-input-${`${this.bAmt}` ? 'active' : 'normal'}`;
      return `${cStr}${this.focus ? ' focus' : ''} flex-center`;
    },
    inputStyle() {
      const bObj = { border: `.01rem solid ${this.oddsColor}` };
      return this.focus || `${this.bAmt}` ? bObj : { };
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
  },
  methods: {
    focusFun() {
      this.$emit('focus', true);
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
.white .nb-bet-new-like-input-active {
  .place { color: #bababa; }
}
.white .nb-bet-new-like-input-normal {
  border: .01rem solid #ECEBEB;
  .place { color: #bababa; }
}
.black .nb-bet-new-like-input-active {
  .place { color: #716d6d; }
}
.black .nb-bet-new-like-input-normal {
  border: .01rem solid #716d6d;
  .place { color: #716d6d; }
}
.blue .nb-bet-new-like-input-active {
  .place { color: #606060; }
}
.blue .nb-bet-new-like-input-normal {
  border: .01rem solid #606060;
  .place { color: #606060; }
}
.nb-bet-new-like-input-normal.focus .text, .nb-bet-new-like-input-active.focus .text {
  animation: actblink 1000ms infinite;
}
.nb-bet-new-like-input-normal, .nb-bet-new-like-input-active {
  position: relative;
  border-radius: .04rem;
  .text { max-width: 1.2rem; height: .21rem; font-size: .18rem; font-weight: 500; overflow: hidden; padding-right: .01rem; }
  .place { height: .21rem; font-size: .13rem; color: #bababa; }
}
</style>
