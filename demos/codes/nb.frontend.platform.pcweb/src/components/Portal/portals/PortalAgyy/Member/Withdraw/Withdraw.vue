<template>
  <sub-panel class="agyy-withdraw-page" :title="$t('agPage.bank.withTitle')" >
    <div class="withdraw-body" @click="setBankInputFlag" >
      <div class="withdraw-title flex-start" v-if="sel.ver">{{$t('agPage.bank.withVertOne')}}</div>
      <div class="withdraw-bit" v-if="sel.ver">
        <div class="bit-amount flex-start">
          <span class="text-normal">{{$t('agPage.bank.canChange')}}</span>
          <span class="text-alert">{{changeNum}}</span>
        </div>
        <div class="bit-currency flex-start">
          <span class="text-normal">{{$t('agPage.bank.cuRate')}}</span>
          <span class="text-alert">1</span>
          <span class="text-normal">{{$t('agPage.bank.virtuals')[sel.curr]}}</span>
          <span class="text-normal">&nbsp;=</span>
          <span class="text-alert">{{Math.floor(range.rate * 100) / 100}}</span>
          <span class="text-normal">{{$t('agPage.bank.cMoney')}}</span>
        </div>
      </div>
      <div class="withdraw-title flex-start" v-if="sel.ver">{{$t('agPage.bank.withVertTwo')}}</div>
      <div class="withdraw-title flex-start" v-else>{{$t('agPage.bank.withCardOne')}}</div>
      <data-select class="withdraw-sel" :data.sync="bankData" :placeholder="$t('agPage.bank.selectBank')" join="/" />
      <div class="withdraw-title flex-start" v-if="sel.ver">{{$t('agPage.bank.withVertThree')}}</div>
      <div class="withdraw-title flex-start" v-else>{{$t('agPage.bank.withCardTwo')}}</div>
      <input class="withdraw-sel with-input" v-model="amount" type="text" maxlength="12" :placeholder="inputPlace" @input="amtFun" >
      <div class="withdraw-alert-text flex-start">{{$t('agPage.bank.alertOne')}}</div>
      <div class="withdraw-alert-text flex-start">{{$t('agPage.bank.alertTwo')}}</div>
      <div class="withdraw-title title-four flex-start" v-if="sel.ver">{{$t('agPage.bank.withVertFour')}}</div>
      <div class="withdraw-show flex-between" v-if="sel.ver" >
        <div class="show-title flex-start">
          <span class="sel-text" v-if="chargeMoney">{{chargeMoney}}</span>
          <span class="sel-def" v-else>- - -</span>
        </div>
        <div class="show-end flex-center">{{$t('agPage.bank.cMoney')}}</div>
      </div>
      <div class="withdraw-btn-box flex-between-col" >
        <div :class="`withdraw-button${actFlag ? '-active' : ''} flex-center`" @click="submitFun">
          {{$t('agPage.bank.submit')}}
        </div>
        <customer-service class="withdraw-service-alert" :detail="serveArr" />
      </div>
    </div>
  </sub-panel>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import SubPanel from '@/components/Portal/portals/PortalAgyy/Member/SubPanel';
import DataSelect from '@/components/Portal/portals/PortalAgyy/Member/DataSelect';
import CustomerService from '@/components/Portal/portals/PortalAgyy/Member/CustomerService';
import { getWithdrawList, getVirtualCurr, doWithdrawAction } from '@/api/portalAgyy';

export default {
  data() {
    return {
      amount: '',
      serveArr: [
        { text: this.$t('agPage.service.hasQuestion'), type: 'text' },
        { text: this.$t('agPage.service.online'), type: 'button' },
        { text: this.$t('agPage.bank.goToSee'), type: 'text' },
        { text: this.$t('agPage.bank.withDetail'), type: 'button', url: '/member/report' },
      ],
      bankData: { default: '', data: [[]] },
      sel: { id: 0, ver: false, curr: 'CNY' },
      range: Object.assign({ min: 0, max: 0, bMin: 0 }, { name: '', rate: 0 }),
    };
  },
  computed: {
    ...mapState('app', { user: state => state.userinfo || {} }),
    ...mapState('agyy', ['bankInputFlag']),
    vert() {
      return !!this.sel.ver;
    },
    balance() {
      return this.user && this.user.balance ? this.user.balance : 0;
    },
    changeNum() {
      const ra = this.range.rate;
      const rst = ra && ra > 0 ? this.balance / ra : 0;
      return Math.floor(rst * 100) / 100;
    },
    inputPlace() {
      const [v, r] = [this.sel.ver, this.range];
      const lan = this.$t(`agPage.bank.input${v ? 'Ver' : 'Mon'}`);
      return `${lan[0]} ${v ? r.bMin : r.min} ${lan[1]}`;
    },
    chargeMoney() {
      const [num, ra] = [/^\d+(\.\d+)?$/.test(this.amount) ? +this.amount : 0, this.range.rate || 0];
      return Math.floor(num * ra * 100) / 100;
    },
    actFlag() {
      const [num, ra] = [/^\d+(\.\d+)?$/.test(this.amount) ? +this.amount : 0, this.range];
      let rst = this.sel.id > 0 && /^\d+(\.\d+)?$/.test(this.amount);
      if (rst && this.sel.ver) {
        rst = rst && num >= ra.bMin && num <= this.changeNum;
      } else if (rst) {
        rst = rst && /^\d+$/.test(this.amount);
        rst = rst && num >= ra.min && num <= ra.max && num <= this.balance;
      }
      return rst;
    },
  },
  watch: {
    bankData(n) {
      const dt = n.data[0].filter(w => `${w.text}` === `${n.default}`);
      const item = dt && dt.length ? dt[0] : null;
      if (item && /^-1$/.test(item.value)) {
        this.pushRouter('/member/bank');
      } else if (item && item.curr) {
        [this.sel.curr, this.sel.id, this.sel.ver] = [item.curr.toUpperCase(), item.value, /^(btc|eth)$/i.test(item.curr)];
        if (this.sel.ver) this.getCurrency();
      }
    },
    vert() {
      this.amount = '';
    },
  },
  components: { DataSelect, SubPanel, CustomerService },
  methods: {
    ...mapMutations('agyy', ['pushRouter', 'setBankInputFlag', 'setReportIndex']),
    ...mapActions('agyy', ['reloadBalance']),
    amtFun(e) {
      let val = e.target.value;
      if (this.sel.ver && !/^\d+(\.\d*)?$/.test(val)) {
        val = /\d/.test(val) ? val.replace(/^.*(\d+(\.\d*)?).*$/, '$1') : '';
      } else if (!this.sel.ver && !/^\d+$/.test(val)) {
        val = val.replace(/[^\d]/g, '');
      }
      val = val.replace(/^0+/, '0').replace(/^0(\d.*)$/, '$1');
      if (!this.sel.ver && +val > this.balance) {
        val = val.slice(0, -1);
      } else if (this.sel.ver && ((+val) * this.range.rate > this.balance)) {
        val = val.slice(0, -1);
      }
      if (`${val}` !== `${e.target.value}`) {
        [e.target.value, this.amount] = [val, val];
      }
    },
    async submitFun() {
      this.setReportIndex(0);
      if (this.actFlag) {
        let req = { bankId: this.sel.id, withdrawAmount: +this.amount, userSource: 'NB' };
        if (this.sel.ver) {
          const oRate = parseInt(this.range.rate * 10, 10) / 10;
          await this.getCurrency();
          const nRate = parseInt(this.range.rate * 10, 10) / 10;
          if (nRate !== oRate) {
            this.$toast(this.$t('agPage.bank.verRateChange'));
            return;
          }
          req = { id: this.sel.id, rate: this.range.rate, amount: +this.amount };
        }
        try {
          await doWithdrawAction(req);
          this.$toast(this.$t('agPage.bank.withdrawSucc'));
        } catch (e) {
          console.log(e);
        } finally {
          this.reloadBalance();
        }
      }
    },
    async queryBankList() {
      const dt = this.bankData;
      [dt.default, dt.data, this.sel] = ['', [[]], { id: 0, ver: false, curr: 'CNY' }];
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
          const bkName = banks[i].bankName || this.$t('agPage.bank.virtuals')[curr];
          const bStr = `${bkName} ${this.$t('agPage.bank.lastNum')} ${banks[i].accountNo}`;
          dt.data[0].push({ value: banks[i].id, curr, text: bStr });
          if (!dt.default) {
            this.sel.ver = /^(btc|eth)$/i.test(banks[i].currency);
            [dt.default, this.sel.id, this.sel.curr] = [bStr, banks[i].id, banks[i].currency.toUpperCase()];
          }
        }
        if (dt.data[0].length < 4) {
          dt.data[0].push({ value: '-1', curr: '', text: this.$t('agPage.bank.addBankBtn') });
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
.agyy-withdraw-page {
  .withdraw-body { width: 100%; padding: 40px 46px; }
  .withdraw-title { width: 100%; height: 30px; margin-bottom: 20px; font-size: 20px; font-weight: 500; color: #dddddd; }
  .withdraw-title.title-four { margin-top: 30px; }
  .withdraw-bit { width: 445px; height: 50px; margin-bottom: 30px; .bit-amount, .bit-currency { width: 100%; height: 50%; } }
  .withdraw-bit { .text-normal { font-size: 14px; color: #716d6d; } .text-alert { font-size: 16px; color: #ff5353; padding: 0 4px; } }
  .withdraw-sel { width: 445px; height: 50px; margin-bottom: 30px; font-size: 14px; font-weight: 500; color: #ecebeb; background: transparent; border: 1px solid #716d6d; }
  .withdraw-sel .select-title { justify-content: center; .sel-text { color: #ff5353; }}
  .withdraw-sel.with-input { width: 415px; margin-bottom: 10px; padding: 0 15px; border-radius: 4px; }
  .withdraw-sel:hover, .withdraw-sel:focus { border: 1px solid #ff5353; }
  .withdraw-alert-text { width: 100%; height: 20px; font-size: 12px; color: #716d6d; }
  .withdraw-show { width: 445px; height: 50px; border-radius: 4px; border: 1px solid #3a3a3a; background: #232227; font-size: 14px; font-weight: 500; }
  .withdraw-show .show-title { width: 76%; height: 100%; padding: 0 15px; .sel-text { color: #ff5353; } .sel-def { color: #909090; } }
  .withdraw-show .show-end { width: 24%; height: 100%; border-left: 1px solid #2e2f34; color: #909090; }
  .withdraw-btn-box { width: 445px; height: 90px; margin-top: 100px; }
  .withdraw-button, .withdraw-button-active { width: 320px; height: 50px; border-radius: 6px; font-size: 16px; font-weight: 500; }
  .withdraw-button { background: transparent; color: #ff5353; border: 1px solid #ff5353; }
  .withdraw-button-active { background: #ff5353; color: #eaeaea; }
}
</style>
