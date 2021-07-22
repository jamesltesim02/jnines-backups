<template>
  <bet-cover-box class="nb-bind-card" :index="399999" :show="show" @close="closeFun">
    <div class="bind-card-body">
      <div class="body-items-vert flex-center" v-if="vert">
        <div class="vert-box flex-between">
          <span class="vert-title">{{$t('withBank.walletUrl')}}</span>
          <input class="vert-input" v-model="walletUrl" type="text"
          :placeholder="$t('withBank.inputUrl')" maxlength="34">
        </div>
      </div>
      <div class="body-items-bank" v-else>
        <div class="bank-box flex-between">
          <span class="bank-title">{{$t('withBank.inputName')}}</span>
          <input class="bank-input-read" v-model="bankUser" type="text" v-if="user.bankUser" readonly>
          <input class="bank-input-normal" v-model="bankUser" type="text"
          :placeholder="$t('withBank.namePlace')" maxlength="20" v-else>
        </div>
        <div class="bank-alert flex-center">
          <query-alert class="alert-flag" />
          <span class="alert-text">
            {{$t('withBank.changeName')}}
            <v-touch tag="span" class="serve-btn" @tap="serveFun">{{$t('withBank.online')}}</v-touch>
            {{$t('withBank.sameName')}}
          </span>
        </div>
        <div class="bank-box flex-between">
          <span class="bank-title">{{$t('withBank.inputCard')}}</span>
          <input class="bank-input-normal" v-model="queryObj.bankAccountNo" type="text"
          :placeholder="$t('withBank.cardPlace')" maxlength="19">
        </div>
        <div class="bank-box flex-between">
          <span class="bank-title">{{$t('withBank.inputCName')}}</span>
          <bank-select :data="cNameData" :placeholder="$t('withBank.cNamePlace')" />
        </div>
        <div class="bank-box flex-between">
          <span class="bank-title">{{$t('withBank.inputProCity')}}</span>
          <bank-select :data="proCityData" :placeholder="$t('withBank.proCityPlace')" />
        </div>
        <div class="bank-box flex-between">
          <span class="bank-title">{{$t('withBank.inputType')}}</span>
          <bank-select :data="typeData" :placeholder="$t('withBank.typePlace')" />
        </div>
        <div class="bank-box flex-between">
          <span class="bank-title">{{$t('withBank.inputNet')}}</span>
          <input class="bank-input-normal" v-model="queryObj.branchName" type="text"
          :placeholder="$t('withBank.netPlace')" maxlength="20">
        </div>
      </div>
      <v-touch tag="div" class="body-btn flex-center" @tap="addCardFun">
        {{$t(`withBank.add${vert ? 'Vert' : 'Card'}`)}}
      </v-touch>
    </div>
    <div class="bind-card-close flex-center"><bet-cover-close /></div>
  </bet-cover-box>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { toCustomerService } from '@/utils/app/AppAdapter';
import BetCoverClose from '@/components/Bet/BetComps/BetCoverClose';
import BetCoverBox from '@/components/Bet/BetComps/BetCoverBox';
import BankSelect from '@/components/QueryAndBank/BankSelect';
import QueryAlert from '@/components/QueryAndBank/QueryAlert';
import { addVertOrCard, getProAndCity } from '@/api/portalAgyy';

export default {
  inheritAttrs: false,
  name: 'BindBankCard',
  data() {
    return {
      walletUrl: '',
      bankUser: '',
      cNameData: {
        hide: true,
        title: this.$t('withBank.inputCName'),
        default: '',
        data: [],
      },
      proCityData: {
        hide: true,
        title: this.$t('withBank.inputProCity'),
        default: '',
        data: [],
      },
      typeData: {
        hide: true,
        title: this.$t('withBank.inputType'),
        default: '',
        data: [],
      },
      queryObj: {
        bankAccountNo: '',
        bankName: '',
        bankCountry: '',
        bankCity: '',
        bankAccountType: '',
        branchName: '',
      },
    };
  },
  computed: {
    ...mapState('app', {
      data: state => state.bankObj,
      user: state => state.userinfo || {},
    }),
    ...mapState('query', {
      pickSelect: state => state.pickSelect,
      pickChange: state => state.pickChange,
    }),
    show() {
      return !!(this.data && /2/.test(this.data.step));
    },
    vert() {
      return !!(this.data && this.data.vert);
    },
  },
  watch: {
    show() {
      if (this.show) {
        this.setDefault();
      }
    },
    bankUser() {
      delete (this.queryObj.bankAccountName);
      if (!this.user.bankUser) {
        this.queryObj.bankAccountName = this.bankUser || '';
      }
    },
    pickSelect(v) {
      if (v && this.cNameData && `${v.title}` === `${this.cNameData.title}`) {
        this.cNameData.default = v.default || '';
        this.queryObj.bankName = this.cNameData.default;
      } else if (v && this.proCityData && `${v.title}` === `${this.proCityData.title}`) {
        this.proCityData.default = v.default || '';
        const pArr = this.proCityData.default.split(' ');
        this.queryObj.bankCountry = pArr && pArr.length > 0 ? pArr[0] : '';
        this.queryObj.bankCity = pArr && pArr.length > 1 ? pArr[1] : '';
      } else if (v && this.typeData && `${v.title}` === `${this.typeData.title}`) {
        [this.typeData.default, this.queryObj.bankAccountType] = [v.default || '', v.val[0]];
      }
    },
    async pickChange(v) {
      if (v && !v.id && this.proCityData && `${v.title}` === `${this.proCityData.title}`) {
        if (v.select && v.select.text) {
          await this.getCityFun(v.select.text);
          await this.setPickerData(JSON.parse(JSON.stringify(this.proCityData)));
        }
      }
    },
  },
  components: {
    BetCoverClose,
    BetCoverBox,
    BankSelect,
    QueryAlert,
  },
  methods: {
    ...mapMutations('app', ['setBankObject']),
    ...mapMutations('query', ['setPickerData', 'setPickChange']),
    closeFun() {
      this.setBankObject();
    },
    serveFun() {
      this.setBankObject();
      toCustomerService(this);
    },
    addCardFun() {
      if (this.vert) {
        this.addVertFun();
      } else {
        this.addBankFun();
      }
    },
    async addVertFun() {
      if (!/^[a-z0-9]{26,34}$/i.test(this.walletUrl)) {
        this.$toast(this.$t('withBank.urlWrong'));
      } else {
        try {
          const rtn = await addVertOrCard({ accountNo: this.walletUrl, currency: 'BTC' });
          if (rtn) this.$toast(rtn);
          this.setBankObject({ step: 3 });
        } catch (e) {
          console.log(e);
        }
      }
    },
    async addBankFun() {
      const nameReg = /(^[\u4e00-\u9fa5][\u4e00-\u9fa5\\.·•。]{0,18}[\u4e00-\u9fa5]$)|(^[a-z][a-z\s.]{0,18}[a-z]$)/i;
      if (!this.user.bankUser && !nameReg.test(this.queryObj.bankAccountName)) {
        this.$toast(this.$t('withBank.accNameWrong'));
      } else if (!/^\d{16,19}$/.test(this.queryObj.bankAccountNo)) {
        this.$toast(this.$t('withBank.accountWrong'));
      } else if (!this.queryObj.bankName) {
        this.$toast(this.$t('withBank.bankNameWrong'));
      } else if (!this.queryObj.bankCountry) {
        this.$toast(this.$t('withBank.provinceWrong'));
      } else if (!this.queryObj.bankCity) {
        this.$toast(this.$t('withBank.cityWrong'));
      } else if (!this.queryObj.bankAccountType) {
        this.$toast(this.$t('withBank.typeWrong'));
      } else if (!/^[a-z\u4e00-\u9fa5]{2,20}$/i.test(this.queryObj.branchName)) {
        this.$toast(this.$t('withBank.netWrong'));
      } else {
        try {
          const rtn = await addVertOrCard(this.queryObj);
          if (rtn) this.$toast(rtn);
          this.setBankObject({ step: 3 });
        } catch (e) {
          console.log(e);
        }
      }
    },
    async getProvinceFun() {
      try {
        const rtn = await getProAndCity();
        if (rtn && rtn.bankNames) {
          this.cNameData.data = [rtn.bankNames];
        }
        if (rtn && rtn.provinces) {
          this.proCityData.data = [rtn.provinces || [], []];
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getCityFun(prov) {
      try {
        const rtn = await getProAndCity({ province: prov });
        this.proCityData.data[1] = rtn || [];
      } catch (e) {
        console.log(e);
      }
    },
    async setDefault() {
      this.proCityData = Object.assign(this.proCityData, { hide: true, default: '', data: [] });
      this.cNameData = Object.assign(this.cNameData, { hide: true, default: '', data: [] });
      this.typeData = Object.assign(this.typeData, { hide: true, default: '', data: [] });
      this.queryObj = Object.assign(this.queryObj, { bankAccountType: '', bankName: '' }, {
        bankAccountNo: '',
        branchName: '',
      });
      [this.walletUrl, this.bankUser] = ['', this.user.bankUser || ''];
      if (!this.vert) {
        await this.getProvinceFun();
        if (this.proCityData.data[0][0]) {
          await this.getCityFun(this.proCityData.data[0][0]);
        }
        const list = this.$t('withBank.typeList');
        [this.typeData.default, this.queryObj.bankAccountType, this.typeData.data] = [list[0].text, list[0].value, [list]];
      }
    },
  },
};
</script>

<style lang="less">
.nb-bind-card .nb-bet-body-box {
  top: .6rem;
  .bind-card-body {
    position: relative;
    border-radius: .1rem;
    background: #fff;
    width: 3.15rem;
    margin: 0 auto;
    padding-bottom: .5rem;
    overflow: hidden;
    .body-items-vert {
      width: 100%;
      height: 1.23rem;
      .vert-box {
        width: 2.85rem;
        height: .43rem;
        .vert-title {
          font-size: .14rem;
          font-weight: 500;
          color: #909090;
        }
        .vert-input {
          width: 2.16rem;
          height: .43rem;
          border-radius: .04rem;
          padding-left: .1rem;
          font-size: .12rem;
          color: #909090;
          border: .01rem solid #ecebeb;
          -webkit-appearance: none;
          border-radius: 0;
        }
      }
    }
    .body-items-bank {
      width: 100%;
      height: 3.84rem;
      padding-top: .1rem;
      .bank-box {
        width: 2.85rem;
        height: .43rem;
        margin: .1rem auto 0;
        .bank-title {
          font-size: .14rem;
          font-weight: 500;
          color: #909090;
        }
        .bank-input-normal, .bank-input-read {
          width: 2.16rem;
          height: .43rem;
          border-radius: .04rem;
          padding-left: .1rem;
          font-size: .12rem;
          color: #2e2f34;
        }
        .bank-input-normal {
          border: .01rem solid #ecebeb;
          -webkit-appearance: none;
        }
        .bank-input-normal:focus {
          border: .01rem solid #ff5353;
        }
        .bank-input-read {
          border: .01rem solid transparent;
        }
      }
      .bank-alert {
        width: 100%;
        height: .33rem;
        margin: 0 auto;
        border-bottom: .01rem solid rgba(236, 236, 236, 0.5);
        .alert-flag {
          margin-right: .04rem;
        }
        .alert-text {
          font-size: .12rem;
          color: #909090;
          user-select: none;
        }
        .serve-btn {
          font-size: .12rem;
          color: #ff5353;
          user-select: none;
          text-decoration: underline;
        }
      }
    }
    .body-btn {
      position: absolute;
      width: 100%;
      height: .5rem;
      left: 0;
      bottom: 0;
      color: #fff;
      background: #ff5353;
      font-size: .16rem;
    }
  }
  .bind-card-close {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -.72rem;
    height: .72rem;
  }
}
</style>
