<template>
  <div class="nb-bet-keyboard-multiple">
    <div class="input-box-item">
      <v-touch tag="div" class="input-touch-box" v-for="v in bets" :key="v.nm" @tap="touchFun(v)">
        <div class="input-box-item-box flex-between">
          <div :class="`input-box-item-title${v.active ? '-active' : ''} flex-start`">
            <span class="box-item-title-point"></span>
            <span class="box-item-title-text">{{getMultName(v.nm)}}</span>
          </div>
          <div class="input-box-item-body flex-end">
            <span class="input-box-item-count">
              {{`${$t('pageBet.total')}${v.mct}${$t('pageBet.count')}`}}
            </span>
            <div class="box-item-like-input flex-start">
              <span class="like-input-text">{{v.value}}</span>
              <span v-if="!v.value" class="like-input-place">{{$t('pageBet.betMoney')}}</span>
            </div>
          </div>
        </div>
        <transition name="toggle">
          <bet-box-toggle v-if="v.toggle" :data="v" :opts="data" />
        </transition>
      </v-touch>
    </div>
    <div class="body-shows flex-between">
      <div class="body-show-item flex-center">
        <div class="bet-show-item flex-center">{{$t('pageBet.balance')}}</div>
        <div class="bet-show-num flex-center" v-if="balAct">{{balance}}</div>
        <div class="bet-show-num flex-center" v-else>- - -</div>
      </div>
      <div class="body-show-item flex-center">
        <div class="bet-show-item flex-center">{{$t('pageBet.odds')}}</div>
        <div v-if="showOdds" class="bet-show-num flex-center">{{odds[1]}}</div>
        <div v-else class="bet-show-null flex-center">- - -</div>
      </div>
      <div class="body-show-item flex-center">
        <div class="bet-show-item flex-center">{{$t('pageBet.retn')}}</div>
        <div v-if="showOdds && bAmt" class="bet-show-num flex-center" align="start">{{maxRtn}}</div>
        <div v-else class="bet-show-null flex-center">- - -</div>
      </div>
    </div>
    <v-touch tag="div" :class="`keyboard-multiple-submit${actBet ? '-active' : ''} flex-center`" @tap="betFun">
      {{$t(`pageBet.${bAlt ? 'noBalance' : oAlt ? 'oddsChange' : 'sureBet'}`)}}
      <div class="bet-foot-odds-box flex-center" v-if="!bAlt && oAlt"
      :style="`transform:rotate(${oAlt < 0 ? 180 : 0}deg)`">
        <bet-odds-flag class="bet-foot-odds-change" size="0.4" />
      </div>
    </v-touch>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { toSeries } from '@/utils/betUtils';
import BetBoxToggle from './BetComps/BetBoxToggle';
import BetOddsFlag from './BetComps/BetOddsFlag';

export default {
  inheritAttrs: false,
  name: 'BetKeyboardMultiple',
  data() {
    return {
      bets: [],
      data: [],
      btime: 0,
      balance: '0.00',
      odds: [0, '0.00'],
      maxRtn: '',
      bAlt: false,
    };
  },
  computed: {
    ...mapState({
      bCnt: state => state.bet.betCount,
      qObj: state => state.bet.quoteObj,
      oAlt: state => state.bet.oddsAlert,
      keySts: state => state.bet.keyStatus,
      betList: state => state.bet.betList,
      inputObj: state => state.bet.betInputObj,
    }),
    ...mapState('app', {
      user: state => state.userinfo,
    }),
    bAmt() {
      return this.inputObj.amt;
    },
    showOdds() {
      return this.bets.filter(v => v.active).length === 1;
    },
    actBet() {
      const amt = +(this.bAmt || 0);
      const rst = amt && !this.betList.filter(v => v.same).length;
      return rst && amt >= this.qObj.min && amt <= this.qObj.max;
    },
    balAct() {
      return !!(this.user && this.user.balance !== undefined);
    },
  },
  watch: {
    user() {
      this.changeBalance();
    },
    betList() {
      this.toSeriesFun();
    },
    bAmt() {
      for (let i = 0; i < this.bets.length; i += 1) {
        if (`${this.bets[i].nm}` === `${this.inputObj.num}`) {
          const bt = this.bets[i];
          bt.value = this.bAmt;
          this.$set(this.bets, i, bt);
          break;
        }
      }
      this.changeBalance();
    },
    keySts() {
      if (!this.keySts && `${this.bAmt}` === '') {
        const bt = this.bets;
        for (let i = 0; i < bt.length; i += 1) {
          bt[i].active = true;
        }
        this.bets = bt;
      }
    },
  },
  components: {
    BetBoxToggle,
    BetOddsFlag,
  },
  methods: {
    ...mapMutations(['changebetAmount', 'changeKeyStatus']),
    ...mapMutations('app', ['getUserInfo']),
    ...mapActions(['doBetAction']),
    changeType(num, fnum) {
      const arr = `${Math.abs(num) + 0.000005}`.match(/^(\d+)(\.\d{2})/);
      const [len, flag] = [arr[1].length % 3, num < 0 ? '-' : ''];
      const str = `${new Array(len ? 4 - len : 1).join('0')}${arr[1]}`;
      let rtn = '';
      for (let i = 0; i < str.length; i += 3) {
        rtn += `${str.slice(i, i + 3)}${i === str.length - 3 ? '' : ','}`;
      }
      rtn = `${flag}${`${rtn}`.replace(/^0{1,2}/, '')}`;
      return fnum ? `${rtn}${arr[2]}` : `${rtn}${`${arr[2]}`.replace(/[.0]+$/, '')}`;
    },
    changeBalance() {
      const amt = this.bAmt || 0;
      const bal = this.user && this.user.balance !== undefined ? this.user.balance : 100000;
      [this.bAlt, this.odds[1]] = [bal < this.qObj.min, this.changeType(this.odds[0], true)];
      let mrtn = amt * this.odds[0];
      if (this.user && this.user.rtn && this.inputObj.num > 1) {
        let saveRtn = mrtn;
        for (let i = this.inputObj.num; i >= 2; i -= 1) {
          if (this.user.rtn[`mut${i}`] && +this.user.rtn[`mut${i}`]) {
            saveRtn = +this.user.rtn[`mut${i}`];
            break;
          }
        }
        mrtn = mrtn > saveRtn ? saveRtn : mrtn;
      }
      this.maxRtn = this.changeType(mrtn);
      this.balance = this.changeType(bal - amt);
    },
    async betFun() {
      this.getUserInfo();
      if (!this.user || !this.user.token) {
        if (this.actBet) this.$toast(this.$t('pageBet.notLogin'));
      } else if (this.bAlt) {
        this.$router.push('/payment');
      } else if (this.actBet && Date.now() - this.btime > 2000) {
        this.btime = Date.now();
        const rtn = await this.doBetAction();
        if (rtn) {
          this.$toast(this.$t(`pageBet.${/^1$/.test(rtn) ? 'betWrong' : 'userWrong'}`));
        } else {
          this.changebetAmount({ amt: '' });
        }
      }
    },
    getMultName(num) {
      const lan = this.$t('pageBet.betMoney');
      const nunStr = !/[a-z]+/i.test(lan) ? '一二三四五六七八九十' : '';
      if (nunStr && num < 11) {
        return `${'一二三四五六七八九十'.substr(num - 1, 1)}串一`;
      }
      return nunStr ? `${num}串一` : `${num} Folds`;
    },
    touchFun(v) {
      const e = window.event ? window.event : null;
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      if (/like-input/i.test(cName)) {
        const bts = this.bets;
        for (let i = 0; i < bts.length; i += 1) {
          const isSel = `${bts[i].nm}` === `${v.nm}`;
          [bts[i].value, bts[i].active] = [isSel ? bts[i].value : '', isSel];
        }
        [this.bets, this.odds[0]] = [bts, v.odds];
        this.setKeySetting(v);
        this.changeKeyStatus(true);
      } else {
        for (let i = 0; i < this.bets.length; i += 1) {
          if (`${this.bets[i].nm}` === `${v.nm}`) {
            const bt = this.bets[i];
            bt.toggle = !bt.toggle;
            this.$set(this.bets, i, bt);
            break;
          }
        }
      }
    },
    toSeriesFun() {
      const [dt, bt, bList] = [[], [], JSON.parse(JSON.stringify(this.betList))];
      for (let i = 0; i < bList.length; i += 1) {
        const obj = bList[i];
        obj.odds = obj.odds ? obj.odds + 1 : 1;
        dt.push(obj);
      }
      this.data = dt.filter(v => /^7$/.test(v.betStatus));
      this.series = toSeries(this.data);
      for (let i = 0; i < this.series.length; i += 1) {
        bt.push(Object.assign({ value: '', active: true, toggle: false }, this.series[i]));
      }
      this.bets = bt.filter(v => v.nm > 1);
      this.setKeySetting();
      this.changeBalance();
    },
    setKeySetting(bet) {
      let obj = { num: bet && bet.nm ? bet.nm : 1, amt: bet && bet.value ? bet.value : '', toast: this.toast || this.$t('pageBet.outToast') };
      obj = Object.assign({ cnt: bet && bet.mct ? bet.mct : 1, title: this.title || '', action: this.action || '' }, obj);
      [obj.min, obj.max, obj.odds] = [this.qObj.min || 0, this.qObj.max || 1000, bet && bet.odds ? bet.odds : 0];
      this.changebetAmount(obj);
    },
  },
  mounted() {
    setTimeout(this.toSeriesFun, 10);
  },
};
</script>

<style lang="less">
.toggle-enter-active, .toggle-leave-active {
  transition: all 0.15s linear;
}
.toggle-enter, .toggle-leave-active {
  transform: scaleY(0);
}
.white .nb-bet-keyboard-multiple {
  border: .01rem solid #ECEBEB;
  background-image: linear-gradient(0deg, #F9F9F9 0%, #FFFFFF 100%);
  .input-box-item-title {
    .box-item-title-point {
      background: #716d6d;
      opacity: 0.3;
    }
    .box-item-title-text {
      color: #716d6d;
      opacity: 0.3;
    }
  }
  .input-box-item-title-active {
    .box-item-title-point {
      background: #ff5353;
      box-shadow: 0 .02rem .06rem 0 rgba(255, 83, 83, 0.5);
    }
    .box-item-title-text {
      color: #2e2f34;
    }
  }
  .input-box-item-count {
    color: #999999;
  }
  .box-item-like-input {
    border: .01rem solid #ecebeb;
    .like-input-text {
      color: #ff5353;
    }
    .like-input-place {
      color: #bababa;
    }
  }
  .body-shows {
    border-top: .01rem solid #ecebeb;
    .body-show-item .bet-show-item, .body-show-item .bet-show-null {
      color: #909090;
    }
    .body-show-item .bet-show-num {
      color: #FF5353;
    }
  }
  .keyboard-multiple-submit {
    border: .01rem solid #ecebeb;
    color: #aaaaaa;
  }
  .keyboard-multiple-submit-active {
    border: .01rem solid #ff5353;
    background: #ff5353;
    color: #fff;
  }
}
.black .nb-bet-keyboard-multiple {
  box-shadow: 0 .02rem .12rem 0 rgba(0, 0, 0, 0.1);
  background-image: linear-gradient(to bottom, #3a393f, #333238);
  .input-box-item-title, .input-box-item-title-active {
    .box-item-title-point {
      background: #fff;
    }
    .box-item-title-text {
      color: #ecebeb;
    }
  }
  .input-box-item-title {
    .box-item-title-point, .box-item-title-text {
      opacity: 0.3;
    }
  }
  .input-box-item-count {
    color: #bababa;
  }
  .box-item-like-input {
    border: .01rem solid #716d6d;
    .like-input-text {
      color: #ff5353;
    }
    .like-input-place {
      color: #999999;
    }
  }
  .body-shows {
    border-top: .01rem solid #2e2f34;
    .body-show-item .bet-show-item, .body-show-item .bet-show-null {
      color: #909090;
    }
    .body-show-item .bet-show-num {
      color: #FF5353;
    }
  }
  .keyboard-multiple-submit {
    border: .01rem solid #716d6d;
    color: #716d6d;
  }
  .keyboard-multiple-submit-active {
    border: .01rem solid #ff5353;
    background: #ff5353;
    color: #fff;
  }
}
.nb-bet-keyboard-multiple {
  width: 100%;
  border-radius: .1rem;
  padding: .05rem 0;
  .input-box-item {
    width: 100%;
    .input-touch-box {
      width: 100%;
      .input-box-item-box {
        width: 100%;
        height: .4rem;
        padding: 0 .1rem;
        .input-box-item-title, .input-box-item-title-active {
          width: .8rem;
          height: 100%;
          .box-item-title-point {
            width: .08rem;
            height: .08rem;
            border-radius: 100%;
          }
          .box-item-title-text {
            padding-left: .07rem;
            font-size: 16px;
            font-weight: 500;
          }
        }
        .input-box-item-body {
          width: 2.2rem;
          height: 100%;
          .input-box-item-count {
            padding-right: .11rem;
            font-size: .13rem;
          }
          .box-item-like-input {
            width: 1rem;
            height: .3rem;
            padding-left: .09rem;
            border-radius: .04rem;
            .like-input-text {
              font-size: .18rem;
              font-weight: 500;
            }
            .like-input-place {
              font-size: .14rem;
              opacity: 0.5;
            }
          }
        }
      }
    }
    .input-touch-box:last-child .nb-bet-box-toggole {
      border-bottom: none !important;
    }
  }
  .body-shows {
    width: 100%;
    height: .4rem;
    margin-top: .05rem;
    padding: 0 .05rem;
    .body-show-item {
      height: 100%;
      .bet-show-item, .bet-show-null {
        font-size: .12rem;
      }
      .bet-show-num {
        font-size: .14rem;
      }
      .bet-show-num, .bet-show-null {
        min-width: .5rem;
      }
    }
  }
  .keyboard-multiple-submit, .keyboard-multiple-submit-active {
    position: relative;
    width: 3.33rem;
    height: .48rem;
    margin: 0 auto .05rem;
    font-size: .16rem;
    border-radius: .06rem;
    .bet-foot-odds-box {
      position: absolute;
      right: .5rem;
      top: 0;
      width: .42rem;
      height: .48rem;
      padding-top: .06rem;
    }
  }
}
</style>
