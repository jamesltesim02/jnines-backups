<template>
  <list-page class="withdraw-page img-bg-page">
    <nav-bar :title="$t('withBank.withdraw')" slot="header" transparent />
    <member-info class="withdraw-info" :userinfo="user"/>
    <div class="withdraw-body">
      <div class="withdraw-bit" v-if="sel.ver">
        <div class="bit-amount flex-start">
          <span class="text-normal">{{$t('withBank.canChange')}}</span>
          <span class="text-alert">{{changeNum}}</span>
        </div>
        <div class="bit-currency flex-start">
          <span class="text-normal">{{$t('withBank.cuRate')}}</span>
          <span class="text-alert">1</span>
          <span class="text-normal">{{$t('withBank.virtuals')[sel.curr]}}</span>
          <span class="text-normal"> =</span>
          <span class="text-alert">{{range.rate}}</span>
          <span class="text-normal">{{$t('withBank.cMoney')}}</span>
        </div>
      </div>
      <query-select class="withdraw-sel" :data="bankData" :placeholder="$t('withBank.selectBank')" />
      <query-input class="withdraw-input" :data.sync="amount" :placeholder="inputPlace" :maxlength="12" />
      <query-show class="withdraw-show" :data="chargeMoney" v-if="sel.ver" />
      <v-touch tag="div" :class="`withdraw-button${actFlag ? '-active' : ''} flex-center`" @tap="submitFun">
        {{$t('withBank.submit')}}
      </v-touch>
      <div class="withdraw-alert-one">{{$t('withBank.alertOne')}}</div>
      <div class="withdraw-alert-two">{{$t('withBank.alertTwo')}}</div>
    </div>
  </list-page>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import ListPage from '@/components/common/ListPage';
import NavBar from '@/components/common/NavBar';
import MemberInfo from '@/components/Member/MemberInfo';
import QuerySelect from '@/components/QueryAndBank/QuerySelect';
import QueryInput from '@/components/QueryAndBank/QueryInput';
import QueryShow from '@/components/QueryAndBank/QueryShow';
import { getWithdrawList, getVirtualCurr, doWithdrawAction } from '@/api/portalAgyy';

export default {
  data() {
    return {
      amount: '',
      sel: { id: 0, ver: false, curr: 'CNY' },
      range: Object.assign({ min: 0, max: 0, bMin: 0 }, { name: '', rate: 0 }),
      bankData: Object.assign({ hide: true, default: '', data: [[]] }, { title: this.$t('withBank.changeBank') }),
    };
  },
  computed: {
    ...mapState('app', {
      user: state => state.userinfo || {},
    }),
    ...mapState('query', {
      pickSelect: state => state.pickSelect,
    }),
    balance() {
      return this.user && this.user.balance ? this.user.balance : 0;
    },
    changeNum() {
      const ra = this.range.rate;
      const rst = ra && ra > 0 ? this.balance / ra : 0;
      return Math.floor(rst * 100000) / 100000;
    },
    inputPlace() {
      const [v, r] = [this.sel.ver, this.range];
      const lan = this.$t(`withBank.input${v ? 'Ver' : 'Mon'}`);
      return `${lan[0]} ${v ? r.bMin : r.min} ${lan[1]}`;
    },
    chargeMoney() {
      const [num, ra] = [+(this.amount || 0), this.range.rate || 0];
      return Math.floor(num * ra * 100000) / 100000;
    },
    actFlag() {
      const [num, ra] = [+(this.amount || 0), this.range];
      let rst = this.sel.id > 0 && /^\d+(\.\d+)?$/.test(this.amount);
      if (rst && this.sel.ver) {
        rst = rst && num >= ra.bMin && num <= this.changeNum;
      } else if (rst) {
        rst = rst && num >= ra.min && num <= ra.max && num <= this.balance;
      }
      return rst;
    },
  },
  watch: {
    pickSelect(v) {
      const dt = this.bankData;
      const check = v && `${v.title}` === `${this.bankData.title}`;
      const selItem = dt.data[0].filter(w => `${w.value}` === `${v.val[0]}`);
      if (check && /^-1$/.test(v.val[0])) {
        this.$router.push('/bank');
      } else if (check && selItem && selItem.length) {
        [dt.default, this.sel.curr] = [v.default || '', selItem[0].curr.toUpperCase()];
        [this.bankData, this.sel.id, this.sel.ver] = [dt, v.val[0], /^(btc|eth)$/i.test(selItem[0].curr)];
        if (this.sel.ver) this.getCurrency();
      }
    },
  },
  components: {
    ListPage,
    NavBar,
    MemberInfo,
    QuerySelect,
    QueryInput,
    QueryShow,
  },
  methods: {
    ...mapMutations('app', ['setJumpObject']),
    ...mapActions('app', ['reloadBalance']),
    async submitFun() {
      if (this.actFlag) {
        let req = { bankId: this.sel.id, withdrawAmount: +this.amount };
        if (this.sel.ver) {
          req = { id: this.sel.id, rate: this.range.rate, amount: +this.amount };
        }
        try {
          await doWithdrawAction(req);
          const obj = { replace: true, url: '/report/4', btn: this.$t('withBank.toSeeNow') };
          this.setJumpObject(Object.assign(obj, { text: this.$t('withBank.withdrawSucc') }));
        } catch (e) {
          console.log(e);
        } finally {
          this.reloadBalance();
        }
      }
    },
    async queryBankList() {
      const dt = this.bankData;
      this.sel = { id: 0, ver: false, curr: 'CNY' };
      [dt.hide, dt.default, dt.data] = [true, '', [[]]];
      this.range = Object.assign({ min: 0, max: 0, bMin: 0 }, { name: '', rate: 0 });
      try {
        const rtn = await getWithdrawList();
        this.range.min = rtn && rtn.minAmount ? rtn.minAmount : 0;
        this.range.max = rtn && rtn.maxAmount ? rtn.maxAmount : 0;
        this.range.bMin = rtn && rtn.btcMinAmount ? rtn.btcMinAmount : 0;
        this.range.name = rtn && rtn.realNameHide ? rtn.realNameHide : '';
        const banks = [].concat(rtn && rtn.bankList ? rtn.bankList : []);
        for (let i = 0; i < banks.length; i += 1) {
          const curr = banks[i].currency.toUpperCase();
          const bkName = banks[i].bankName || this.$t('withBank.virtuals')[curr];
          const bStr = `${bkName} ${this.$t('withBank.lastNum')} ${banks[i].accountNo}`;
          dt.data[0].push({ value: banks[i].id, curr, text: bStr });
          if (!dt.default) {
            this.sel.ver = /^(btc|eth)$/i.test(banks[i].currency);
            [dt.default, this.sel.id, this.sel.curr] = [bStr, banks[i].id, banks[i].currency.toUpperCase()];
          }
        }
        if (dt.data[0].length < 4) {
          dt.data[0].push({ value: '-1', curr: '', text: this.$t('withBank.addBankBtn') });
        }
        this.bankData = dt;
        this.getCurrency();
      } catch (e) {
        console.log(e);
      }
    },
    async getCurrency() {
      try {
        this.range.rate = await getVirtualCurr({ currency: this.sel.curr });
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    this.queryBankList();
  },
};
</script>
<style lang="less">
.white .withdraw-page {
  background-image: url(../assets/images/backgrounds/withdraw.png);
  .withdraw-body {
    box-shadow: 0 .1rem .2rem 0 #ececec;
    background: linear-gradient(to bottom, #ffffff, #fcfcfc);
    .withdraw-bit .text-normal { color: #bababa; }
    .withdraw-bit .text-alert { color: #ff5353; }
    .withdraw-button {
      background: #ecebeb;
      color: #909090;
    }
    .withdraw-button-active {
      background: #ff5353;
      color: #fff;
    }
    .withdraw-alert-one, .withdraw-alert-two { color: #909090; }
  }
}

.webp .withdraw-page {
  background-image: url(../assets/images/backgrounds/withdraw.webp);
}
.black .withdraw-page {
  .withdraw-body {
    box-shadow: 0 .1rem .2rem 0 #212024;
    background: linear-gradient(to bottom, #323237, rgba(41, 41, 46, 0));
    .withdraw-bit .text-normal { color: #716d6d; }
    .withdraw-bit .text-alert { color: #ff5353; }
    .withdraw-button {
      background: #323136;
      color: #909090;
    }
    .withdraw-button-active {
      background: #ff5353;
      color: #fff;
    }
    .withdraw-alert-one, .withdraw-alert-two { color: #716d6d; }
  }
}
.withdraw-page {
  min-height: 100%;
  width: 3.75rem;
  .withdraw-info {
    padding-left: .1rem;
    transition: all .5s;
  }
  .withdraw-body {
    position: absolute;
    width: 3.75rem;
    left: 0;
    top: 1.2rem;
    bottom: 0;
    border-top-left-radius: .08rem;
    border-top-right-radius: .08rem;
    padding-top: .08rem;
    .withdraw-bit {
      width: 100%;
      height: .45rem;
      margin: .12rem auto .18rem;
      padding-left: .3rem;
      .bit-amount, .bit-currency { width: 100%; }
      .bit-amount {
        height: .25rem;
        .text-normal, .text-alert { font-size: .14rem; }
      }
      .bit-currency {
        height: .2rem;
        .text-normal, .text-alert { font-size: .12rem; }
      }
      .text-alert { padding: 0 .03rem; }
    }
    .withdraw-sel, .withdraw-input, .withdraw-show { margin: .12rem auto 0; }
    .withdraw-button, .withdraw-button-active {
      width: 3.5rem;
      height: .4rem;
      margin: .28rem auto 0;
      border-radius: .06rem;
      font-size: .14rem;
    }
    .withdraw-alert-one, .withdraw-alert-two {
      width: 3.55rem;
      font-size: .12rem;
      line-height: .18rem;
      word-wrap: break-word;
      word-break: break-all;
    }
    .withdraw-alert-one { margin: .2rem auto 0; }
    .withdraw-alert-two { margin: 0 auto; }
  }
}
</style>
