<template>
  <div :class="`nb-cart-option-box ${boxClassName} flex-center-col`" >
    <bet-cart-option :data="data" :showId="newShowId" isSingle />
    <div class="content-shows flex-between" v-if="showInput">
      <div class="bet-show-get flex-end">
        <span class="show-get-txt-p flex-center" v-if="betCheck">{{$t('pageBet.willRtn')}}</span>
        <span class="show-get-txt flex-center" v-else>{{$t('pageBet.rightGet')}}</span>
        <div v-if="data.amt || betCheck" class="show-get-num flex-start" :style="{ color: oddsColor }">{{changeType((data.amt || 0) * (1 + data.odds), true)}}</div>
        <div v-else class="show-get-null flex-center">............</div>
      </div>
      <div :class="`bet-show-input-box${betCheck ? '-p' : ''}`">
        <div class="bet-show-input-place flex-center" v-if="!data.amt" >{{placeStr}}</div>
        <input type="text" :class="inputClass" ref="inputEl" v-model="data.amt" :style="inputStyle" maxLength="8" autocomplete="off" />
      </div>
    </div>
    <div class="page-item-close flex-center" v-if="!isResult" @click="closeFun(data)">
      <bet-cover-close size="20" :color="!/^white$/i.test(theme) ? '#909090' : '#BABABA'" />
    </div>
    <div class="page-item-cover" v-if="!/^7$/.test(data.betStatus) && !isResult"></div>
    <div class="page-item-line" v-if="showRedLine" :style="{ background: btnColor }"></div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { changeNumType } from '@/utils/betUtils';
import BetCoverClose from '@/components/Bet/BetComps/BetCoverClose';
import BetCartOption from '@/components/Bet/BetComps/BetCartOption';

export default {
  inheritAttrs: false,
  name: 'BetOptionBox',
  props: { data: Object, showId: Boolean, isResult: Boolean },
  data() {
    return { active: false };
  },
  computed: {
    ...mapState('app', ['theme', 'bettingMode', 'bettingStyle']),
    ...mapState({ cFlag: state => state.bet.cartFlag, betMult: state => state.bet.betMult }),
    modCheck() {
      return /^3$/.test(this.bettingMode);
    },
    styleCheck() {
      return /^1$/.test(this.bettingStyle);
    },
    betCheck() {
      return this.modCheck || this.styleCheck;
    },
    showRedLine() {
      return this.data.same && !this.isResult && (this.showId || this.modCheck);
    },
    boxClassName() {
      const str = this.betCheck && this.isResult ? 'need' : 'none';
      return (this.modCheck || !this.betMult) && !this.isResult ? 'mix' : str;
    },
    newShowId() {
      return this.showId && !(this.isResult && !this.modCheck);
    },
    showInput() {
      return !this.isResult && (!this.showId || this.modCheck);
    },
    placeStr() {
      return `${this.betCheck ? '' : this.$t('pageBet.betRange')}${this.data.min}-${this.data.max}`;
    },
    oddsColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (!/^white$/i.test(this.theme)) {
        return pSet && pSet.BLACK_OPTION_COLOR ? pSet.BLACK_OPTION_COLOR : '#ff5353';
      }
      return pSet && pSet.WHITE_OPTION_COLOR ? pSet.WHITE_OPTION_COLOR : '#ff5353';
    },
    btnColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (!/^white$/i.test(this.theme)) {
        return pSet && pSet.BLACK_BOTTON_BACKGROUND ? pSet.BLACK_BOTTON_BACKGROUND : '#ff5353';
      }
      return pSet && pSet.WHITE_BOTTON_BACKGROUND ? pSet.WHITE_BOTTON_BACKGROUND : '#ff5353';
    },
    inputClass() {
      return `bet-show-input${this.active || this.data.amt ? ' focus' : ''}`;
    },
    inputStyle() {
      const iObj = { color: this.oddsColor };
      if (this.data.amt) {
        iObj.border = `1px solid ${this.btnColor}`;
      }
      return iObj;
    },
  },
  watch: {
    showId(n, o) {
      if (!n && o) this.addInputEvent();
    },
    active() {
      if (this.active) {
        this.changeInputFocused(true);
      } else if (!this.isResult && !this.showId) {
        this.$emit('check', true);
      }
    },
  },
  components: { BetCoverClose, BetCartOption },
  methods: {
    ...mapMutations(['clearBetItem', 'changeInputFlag', 'updateItemAmt', 'changeInputFocused']),
    ...mapMutations('app', ['getUserInfo']),
    ...mapActions(['quoteBetCart']),
    changeType(num, fnum, bit) {
      return changeNumType(num, fnum, bit);
    },
    closeFun(v) {
      this.clearBetItem({ type: '', arr: v });
    },
    focusFun() {
      if (!this.cFlag) this.quoteBetCart({ });
      this.changeInputFlag(true);
      this.active = true;
    },
    changeVal(str) {
      let [val, flag] = [str.replace(/[^\d]/g, '').replace(/^0+/, ''), 0];
      if (+(val || 0) > this.data.max) {
        [val, flag] = [`${this.data.max}`, 1];
      }
      if ((+(val || 0)) * (1 + this.data.odds) > this.data.rtn) {
        [val, flag] = [`${parseInt(this.data.rtn / (1 + this.data.odds), 10)}`, flag || 2];
      }
      if (flag) this.$toast(this.$t(`pageBet.${flag < 2 ? 'maxToast' : 'rightToast'}`));
      if (`${this.data.amt}` !== `${val}`) {
        const dt = JSON.parse(JSON.stringify(this.data));
        dt.amt = val;
        this.updateItemAmt(dt);
        this.$emit('change', dt);
      }
      return val;
    },
    addInputEvent() {
      this.getUserInfo();
      setTimeout(() => {
        const [oInput, self] = [this.$el.querySelector('input'), this];
        if (oInput) {
          oInput.addEventListener('focus', () => { self.focusFun(); });
          oInput.addEventListener('blur', () => { self.active = false; });
          oInput.addEventListener('input', () => {
            const dt = JSON.parse(JSON.stringify(this.data));
            const newVal = self.changeVal(oInput.value);
            if (`${oInput.value}` !== `${newVal}`) {
              oInput.value = newVal;
            }
            if (`${newVal}` !== `${dt.oldAmt}`) {
              dt.amt = newVal;
              this.$emit('change', dt);
            }
          });
        }
      }, 50);
    },
  },
  mounted() {
    this.addInputEvent();
  },
};
</script>

<style lang="less">
.option-enter-active, .option-leave-active { transition: all 0.15s linear; }
.option-enter, .option-leave-active { transform: scaleY(0); }
.nb-cart-option-box {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 86px;
  overflow: hidden;
  border-radius: 10px;
  .page-item-cover { position: absolute; width: 100%; top: 0; bottom: 0; z-index: 15; opacity: .5; }
  .page-item-close { position: absolute; width: 40px; height: 40px; top: 0; right: 0; z-index: 20; cursor: pointer; }
  .page-item-close { svg { transition: transform .2s ease-out; &:hover { transform: rotate(90deg); } } }
  .page-item-line { position: absolute; width: 5px; height: 100%; left: 0; top: 0; z-index: 5; }
  .content-shows {
    width: 100%;
    height: 40px;
    margin-top: 5px;
    padding: 2px 10px 0;
    .bet-show-get {
      height: 26px;
      .show-get-txt, .show-get-txt-p, .show-get-null {
        font-size: 12px;
      }
      .show-get-num {
        font-size: 14px;
      }
      .show-get-txt-p {
        padding-right: 5px;
      }
    }
    .bet-show-input-box { position: relative; width: 140px; height: 26px; z-index: 10; }
    .bet-show-input-box-p { position: relative; width: 104px; height: 26px; z-index: 10; }
    .bet-show-input-place { position: absolute; width: 100%; height: 100%; z-index: 20; font-size: 12px; }
    .bet-show-input {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 30;
      border-radius: 4px;
      background: transparent;
      font-size: 12px;
      padding: 0 10px;
      box-sizing: border-box;
      text-align: center;
      line-height: 30px;
    }
  }
}
.nb-cart-option-box.mix {
  padding-top: 4px;
  padding-bottom: 2px;
}
.nb-cart-option-box.none { padding-bottom: 5px; }

.white .nb-cart-option-box {
  .page-item-cover { background-image: linear-gradient(0deg, #F9F9F9 0%, #FFFFFF 100%); }
  .content-shows { border-top: 1px solid #ecebeb; }
  .content-shows .bet-show-get { .show-get-txt, .show-get-null { color: #909090; } }
  .content-shows .bet-show-input { border: 1px solid #ecebeb; }
  .bet-show-input-place { color: #bababa; }
}
.dark .nb-cart-option-box {
  .bet-show-input {
    border: 1px solid #666;
    color: #53fffd !important;
  }
  .content-shows .bet-show-get .show-get-num {
    color: #53fffd !important;
  }
}
</style>
