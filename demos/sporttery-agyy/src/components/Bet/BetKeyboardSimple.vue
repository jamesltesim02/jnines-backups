<template>
  <div class="nb-bet-keyboard-simple">
    <div class="content-btns flex-between">
      <bet-flex-box class="content-btn-box" v-for="mon in moneys" :key="mon.k" @start="sFun(mon.k)">
        <v-touch tag="div" :class="`content-btn${mon.c ? '-active' : ''} flex-center`" @tap="addMoney(+mon.v)">
          <span class="btn-money">￥</span>
          <span class="btn-number">{{mon.v}}</span>
        </v-touch>
      </bet-flex-box>
    </div>
    <div class="content-inputs flex-between">
      <bet-like-input class="content-input" :min="min" :max="max" :lock="!!lock" :place="place" />
      <bet-flex-box class="content-del-box" @start="sDelFun">
        <v-touch tag="div" :class="`content-del${delSel ? '-active' : ''} flex-center`" @tap="eDelFun">
          <bet-input-delete />
        </v-touch>
      </bet-flex-box>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import BetFlexBox from './BetComps/BetFlexBox';
import BetLikeInput from './BetComps/BetLikeInput';
import BetInputDelete from './BetComps/BetInputDelete';

export default {
  inheritAttrs: false,
  name: 'BetKeyboardSimple',
  data() {
    return {
      delSel: 0,
      moneys: [{ k: 0, v: 50, c: 0 }, { k: 1, v: 100, c: 0 }, { k: 2, v: 200, c: 0 }, { k: 3, v: 300, c: 0 }],
      t: { max: 300, timer: null },
    };
  },
  props: {
    min: Number,
    max: Number,
    odds: Number,
    lock: Boolean,
    check: Function,
    place: String,
    toast: String,
    title: String,
    action: String,
  },
  computed: {
    ...mapState({
      bAmt: state => state.bet.betInputObj.amt,
    }),
  },
  components: {
    BetFlexBox,
    BetLikeInput,
    BetInputDelete,
  },
  methods: {
    ...mapMutations([
      'changebetAmount',
    ]),
    clearC(k) {
      const mon = this.moneys;
      for (let i = 0; i < mon.length; i += 1) {
        mon[i].c = `${mon[i].k}` === `${k}` ? 1 : 0;
      }
      this.moneys = mon;
    },
    sFun(k) {
      this.clearC(k);
      clearTimeout(this.t.timer);
      this.t.timer = setTimeout(() => { this.clearC(-1); }, this.t.max);
    },
    addMoney(num) {
      clearTimeout(this.t.timer);
      let amt = this.bAmt || 0;
      amt = parseInt(amt + num, 10);
      if (amt <= this.max) {
        let result = true;
        if (this.check && typeof this.check === 'function') {
          result = this.check(amt);
        }
        if (result) {
          setTimeout(() => { this.changebetAmount({ amt }); }, 10);
        }
      } else {
        this.$toast(this.toast || this.$t('pageBet.outToast'));
      }
      this.clearC(-1);
    },
    sDelFun() {
      this.delSel = 1;
      clearTimeout(this.t.timer);
      this.t.timer = setTimeout(() => { this.delSel = 0; }, this.t.max);
    },
    eDelFun() {
      clearTimeout(this.t.timer);
      const amt = `${this.bAmt || 0}`.slice(0, -1);
      this.changebetAmount({ amt: amt ? +amt : '' });
      this.delSel = 0;
    },
    setKeySetting() {
      let obj = { num: this.bCnt, amt: this.bAmt, toast: this.toast || this.$t('pageBet.outToast') };
      obj = Object.assign({ cnt: 1, title: this.title || '', action: this.action || '' }, obj);
      [obj.min, obj.max, obj.odds] = [this.min || 0, this.max || 0, this.odds || 0];
      this.changebetAmount(obj);
    },
  },
  mounted() {
    setTimeout(this.setKeySetting, 10);
  },
};
</script>

<style lang="less">
.white .nb-bet-keyboard-simple {
  .content-btns .content-btn {
    border: .01rem solid #ECEBEB;
    background-image: linear-gradient(0deg, #F9F9F9 0%, #FFFFFF 100%);
    .btn-money {
      color: #909090;
    }
    .btn-number {
      color: #909090;
    }
  }
  .content-btns .content-btn-active {
    border: .01rem solid #ff5353;
    .btn-money {
      color: #ff5353;
    }
    .btn-number {
      color: #ff5353;
    }
  }
  .content-inputs .content-del {
    background-image: linear-gradient(to top, #f9f9f9, #ffffff);
    border: .01rem solid transparent;
  }
  .content-inputs .content-del-active {
    background-image: linear-gradient(to top, #f9f9f9, #ffffff);
    border: .01rem solid #FF5353;
  }
}
.black .nb-bet-keyboard-simple {
  .content-btns .content-btn {
    border: .01rem solid #716d6d;
    .btn-money {
      color: #909090;
    }
    .btn-number {
      color: #bababa;
    }
  }
  .content-btns .content-btn-active {
    border: .01rem solid #ff5353;
    .btn-money {
      color: #ff5353;
    }
    .btn-number {
      color: #ff5353;
    }
  }
  .content-inputs .content-del {
    border: .01rem solid transparent;
  }
  .content-inputs .content-del-active {
    border: .01rem solid #FF5353;
  }
}
.nb-bet-keyboard-simple {
  width: 100%;
  .content-btns {
    width: 100%;
    height: .43rem;
    margin: .17rem 0 .12rem 0;
    padding: 0 3.2%;
    .content-btn-box {
      width: 23.65%;
      height: .43rem;
      .content-btn, .content-btn-active {
        width: 100%;
        height: 100%;
        border-radius: .04rem;
        .btn-money {
          font-size: .12rem;
        }
        .btn-number {
          padding-left: .03rem;
          font-size: .2rem;
        }
      }
    }
  }
  .content-inputs {
    width: 100%;
    height: .43rem;
    margin: .12rem 0;
    padding: 0 3.2%;
    .content-input {
      width: 84.617%;
      height: .43rem;
      border-radius: .04rem;
    }
    .content-del-box {
      width: 12.255%;
      height: .43rem;
      .content-del, .content-del-active {
        width: 100%;
        height: 100%;
        border-radius: .04rem;
      }
    }
  }
}
</style>
