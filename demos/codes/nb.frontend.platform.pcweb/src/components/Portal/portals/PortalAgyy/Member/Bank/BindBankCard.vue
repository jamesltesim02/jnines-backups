<template>
  <sub-panel class="agyy-bind-card-page" :title="$t('agPage.bank.addCardNew')" >
    <div class="bind-card-body" @click="setBankInputFlag" >
      <div class="body-items-vert" v-if="vert" >
        <div class="bind-card-title flex-start">{{$t('agPage.bank.walletDetail')}}</div>
        <div class="vert-box flex-between">
          <span class="bank-title flex-start">{{$t('agPage.bank.walletUrl')}}</span>
          <input class="bank-content vert-input" v-model="walletUrl" type="text" maxlength="34"
          :placeholder="$t('agPage.bank.inputUrl')" >
        </div>
      </div>
      <div class="body-items-bank" v-else >
        <div class="bind-card-title flex-start">{{$t('agPage.bank.accountName')}}</div>
        <div class="bank-box flex-between">
          <span class="bank-title flex-start">{{$t('agPage.bank.inputName')}}</span>
          <input class="bank-input-read" v-model="bankUser" type="text" v-if="user.bankUser" readonly>
          <input class="bank-content bank-input-normal" v-model="bankUser" type="text" maxlength="20"
          :placeholder="$t('agPage.bank.namePlace')" v-else>
        </div>
        <customer-service class="bank-alert" :detail="serveArr" start />
        <div class="bind-card-title flex-start">{{$t('agPage.bank.accountDetail')}}</div>
        <div class="bank-box flex-between">
          <span class="bank-title flex-start">{{$t('agPage.bank.inputCard')}}</span>
          <input class="bank-content bank-input-normal" v-model="queryObj.bankAccountNo" type="text" maxlength="19"
          :placeholder="$t('agPage.bank.cardPlace')" >
        </div>
        <div class="bank-box flex-between">
          <span class="bank-title flex-start">{{$t('agPage.bank.inputCName')}}</span>
          <data-select class="bank-content" :data.sync="cNameData" :placeholder="$t('agPage.bank.cNamePlace')" />
        </div>
        <div class="bank-box flex-between">
          <span class="bank-title flex-start">{{$t('agPage.bank.inputProCity')}}</span>
          <data-select class="bank-content" :data.sync="proCityData" :placeholder="$t('agPage.bank.proCityPlace')" />
        </div>
        <div class="bank-box flex-between">
          <span class="bank-title flex-start">{{$t('agPage.bank.inputType')}}</span>
          <data-select class="bank-content" :data.sync="typeData" :placeholder="$t('agPage.bank.typePlace')" />
        </div>
        <div class="bank-box flex-between">
          <span class="bank-title flex-start">{{$t('agPage.bank.inputNet')}}</span>
          <input class="bank-content bank-input-normal" v-model="queryObj.branchName" type="text" maxlength="20"
          :placeholder="$t('agPage.bank.netPlace')" >
        </div>
      </div>
      <div class="bank-btn-box flex-between">
        <div class="body-btn-return flex-center" @click="returnFun">{{$t('agPage.bank.prevStep')}}</div>
        <div class="body-btn-submit flex-center" @click="addCardFun">{{$t(`agPage.bank.add${vert ? 'Vert' : 'Card'}`)}}</div>
      </div>
    </div>
  </sub-panel>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import SubPanel from '@/components/Portal/portals/PortalAgyy/Member/SubPanel';
import DataSelect from '@/components/Portal/portals/PortalAgyy/Member/DataSelect';
import CustomerService from '@/components/Portal/portals/PortalAgyy/Member/CustomerService';
import { addVertOrCard, getProAndCity } from '@/api/portalAgyy';

export default {
  inheritAttrs: false,
  name: 'BindBankCard',
  data() {
    return {
      walletUrl: '',
      bankUser: '',
      serveArr: [
        { text: this.$t('agPage.bank.serviceOne'), type: 'text' },
        { text: this.$t('agPage.bank.serviceTwo'), type: 'button' },
        { text: this.$t('agPage.bank.serviceThree'), type: 'alert' },
      ],
      cNameData: { default: '', data: [] },
      proCityData: { default: ' ', data: [] },
      typeData: { default: '', data: [] },
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
    ...mapState('app', { user: state => state.userinfo || {} }),
    ...mapState('agyy', ['history', 'bankCardType']),
    vert() {
      return !!(this.bankCardType);
    },
  },
  watch: {
    bankUser() {
      delete (this.queryObj.bankAccountName);
      if (!this.user.bankUser) {
        this.queryObj.bankAccountName = this.bankUser || '';
      }
    },
    cNameData() {
      this.queryObj.bankName = this.cNameData.default;
    },
    proCityData(n, o) {
      const [nArr, oArr] = [n.default.split(' '), o.default.split(' ')];
      this.queryObj.bankCountry = nArr && nArr.length > 0 ? nArr[0] : '';
      this.queryObj.bankCity = nArr && nArr.length > 1 ? nArr[1] : '';
      const nPro = nArr && nArr.length > 0 ? nArr[0] : '';
      const oPro = oArr && oArr.length > 0 ? oArr[0] : '';
      if (nPro && nPro !== oPro) {
        this.getCityFun(nPro);
      }
    },
    typeData() {
      for (let i = 0; i < this.typeData.data.length; i += 1) {
        const dt = this.typeData.data[i];
        for (let j = 0; j < dt.length; j += 1) {
          if (dt[j].text === this.typeData.default) {
            this.queryObj.bankAccountType = dt[j].value;
          }
        }
      }
    },
  },
  components: { DataSelect, SubPanel, CustomerService },
  methods: {
    ...mapMutations('agyy', ['pushRouter', 'setBankInputFlag']),
    returnFun() {
      if (this.history && this.history.length > 1) {
        this.pushRouter(this.history[this.history.length - 2]);
      } else {
        this.pushRouter('/member/bank/mobile');
      }
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
        this.$toast(this.$t('agPage.bank.urlWrong'));
      } else {
        try {
          const rtn = await addVertOrCard({ accountNo: this.walletUrl, currency: 'BTC' });
          if (rtn) this.$toast(rtn);
          this.pushRouter('/member/bank');
        } catch (e) {
          console.log(e);
        }
      }
    },
    async addBankFun() {
      const nameReg = /(^[\u4e00-\u9fa5][\u4e00-\u9fa5\\.·•。]{0,18}[\u4e00-\u9fa5]$)|(^[a-z][a-z\s.]{0,18}[a-z]$)/i;
      if (!this.user.bankUser && !nameReg.test(this.queryObj.bankAccountName)) {
        this.$toast(this.$t('agPage.bank.accNameWrong'));
      } else if (!/^\d{16,19}$/.test(this.queryObj.bankAccountNo)) {
        this.$toast(this.$t('agPage.bank.accountWrong'));
      } else if (!this.queryObj.bankName) {
        this.$toast(this.$t('agPage.bank.bankNameWrong'));
      } else if (!this.queryObj.bankCountry) {
        this.$toast(this.$t('agPage.bank.provinceWrong'));
      } else if (!this.queryObj.bankCity) {
        this.$toast(this.$t('agPage.bank.cityWrong'));
      } else if (!this.queryObj.bankAccountType) {
        this.$toast(this.$t('agPage.bank.typeWrong'));
      } else if (!/^[a-z\u4e00-\u9fa5]{2,20}$/i.test(this.queryObj.branchName)) {
        this.$toast(this.$t('agPage.bank.netWrong'));
      } else {
        try {
          const rtn = await addVertOrCard(this.queryObj);
          if (rtn) this.$toast(rtn);
          this.pushRouter('/member/bank');
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
          this.updateCityDef(0);
        }
      } catch (e) {
        console.log(e);
      }
    },
    updateCityDef(num) {
      const defArr = this.proCityData.default.split(' ');
      if (!num && this.proCityData.data[0].length) {
        const val = this.proCityData.data[0][0];
        defArr[0] = val;
      }
      defArr[0] = defArr[0] || '';
      if (num && this.proCityData.data[1].length) {
        const val = this.proCityData.data[1][0];
        defArr[1] = val;
      }
      defArr[1] = defArr[1] || '';
      this.proCityData.default = `${defArr[0]} ${defArr[1]}`;
    },
    async getCityFun(prov) {
      try {
        const rtn = await getProAndCity({ province: prov });
        const dt = JSON.parse(JSON.stringify(this.proCityData));
        dt.data[1] = rtn || [];
        this.proCityData = dt;
        this.updateCityDef(1);
      } catch (e) {
        console.log(e);
      }
    },
    async setDefault() {
      this.proCityData = { default: '', data: [] };
      this.cNameData = { default: '', data: [] };
      this.typeData = { default: '', data: [] };
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
        const list = this.$t('agPage.bank.typeList');
        [this.typeData.default, this.queryObj.bankAccountType, this.typeData.data] = [list[0].text, list[0].value, [list]];
      }
    },
  },
  mounted() {
    this.setDefault();
  },
};
</script>

<style lang="less">
.agyy-bind-card-page {
  .bind-card-body { width: 100%; padding: 40px 46px; }
  .bind-card-title { width: 100%; height: 30px; margin-bottom: 20px; font-size: 20px; font-weight: 500; color: #dddddd; }
  .body-items-vert, .body-items-bank { width: 100%; }
  .bank-alert { margin-bottom: 20px; }
  .vert-box, .bank-box { width: 445px; height: 50px; margin-bottom: 10px; }
  .vert-box:last-child, .bank-box:last-child { margin-bottom: 0; }
  .bank-title { width: 69px; height: 100%; font-size: 14px; font-weight: 500; color: #909090; }
  .bank-content, .bank-input-read {box-sizing: border-box; width: 376px; height: 100%; padding: 0 15px; font-size: 14px; font-weight: 500; color: #ecebeb; background: transparent; }
  .bank-content { border: 1px solid #716d6d; } .bank-input-read { border: none; }
  .vert-box .vert-input, .bank-box .bank-input-normal { border-radius: 4px; }
  .bank-content:hover, .bank-content:focus { border: 1px solid #ff5353; }
  .bank-select { padding: 0; }
  .bank-btn-box { width: 445px; height: 50px; margin-top: 150px; font-size: 16px; font-weight: 500; }
  .body-btn-return { width: 38%; height: 100%; border-radius: 6px; background: #323136; color: #716d6d; }
  .body-btn-submit { width: 55%; height: 100%; border-radius: 6px; background: #ff5353; color: #eaeaea; }
}
</style>
