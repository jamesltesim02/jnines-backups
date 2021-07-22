<template>
  <div class="bank-card" :style="elStyle">
    <div :class="noClass" v-if="!data" @click="addBankFun">
      <bank-add-new />
      <span class="add-new-text">{{$t(`agPage.bank.addNew${virtual ? 'Vert' : 'Card'}`)}}</span>
    </div>
    <div :class="cardClass" v-else>
      <div class="card-cover-bottom"></div>
      <div class="card-back"></div>
      <div class="card-cover-up"></div>
      <div class="card-body" @click="setCheckFun">
        <div class="body-head flex-start">
          <div class="body-head-icon flex-center">
            <div class="head-icon-box"></div>
          </div>
          <span class="body-head-name flex-center">{{data.bankName}}</span>
          <div class="body-head-type flex-start">{{data.type}}</div>
        </div>
        <div class="body-num flex-start">{{changeCardType(data.cardNo)}}</div>
        <div class="body-card-name flex-start" v-if="!virtual">{{data.name}}</div>
        <div class="body-card-addr flex-start" v-if="!virtual">
          <span class="card-addr-detail flex-start" >
            {{data.province}}{{data.province ? $t('agPage.bank.provBank') : ''}}
            {{data.city}}{{data.city ? $t('agPage.bank.cityBank') : ''}}
          </span>
          <span class="card-addr-branch flex-start">{{data.branch}}</span>
        </div>
      </div>
      <div class="delete-card flex-center" @click="delCheckFun" v-if="!hide">
        {{$t('agPage.bank.delete')}}
      </div>
      <div class="def-card" @click="setCheckFun">
        <card-default v-if="/^1$/.test(data.def)" />
      </div>
      <div class="card-action-box flex-center" v-if="/^[12]$/.test(toastType)">
        <div class="card-action-body-box flex-center-col">
          <div class="card-action-title flex-center" v-if="toastType < 2">{{$t('agPage.bank.setBankTxt')}}</div>
          <div class="card-action-title flex-center" v-else>{{$t('agPage.bank.delBankTxt')}}</div>
          <div class="action-btn-box flex-between">
            <div class="action-cancel flex-center" @click="doCancelFun">{{$t('agPage.bank.thinkMore')}}</div>
            <div class="action-submit flex-center" @click="doActionFun" v-if="toastType < 2">{{$t('agPage.bank.setBankBtn')}}</div>
            <div class="action-submit flex-center" @click="doActionFun" v-else>{{$t('agPage.bank.delBankBtn')}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import BankAddNew from './BankAddNew';
import CardDefault from './CardDefault';
import { setDefBank, deleteBank } from '@/api/portalAgyy';

export default {
  inheritAttrs: false,
  name: 'BankCard',
  data() {
    return { toastType: 0, delTime: 0 };
  },
  props: { data: Object, hide: Boolean, virtual: Boolean },
  computed: {
    ...mapState('app', ['theme']),
    ...mapState('agyy', ['bankCardAct']),
    elStyle() {
      const noColor = `1px solid ${!/^white$/i.test(this.theme) ? '#363636' : 'rgba(212,212,212,.35)'}`;
      return { border: this.data ? 'none' : noColor };
    },
    noClass() {
      return `picture-left no-${this.virtual ? 'vert' : 'card'} flex-center-col`;
    },
    cardClass() {
      const bInfo = this.$t('agPage.bank.bankInfor');
      let str = `picture-right ${this.virtual ? 'vert' : 'card'}-`;
      for (let i = 0; i < bInfo.length; i += 1) {
        if (this.data.bankName.indexOf(bInfo[i].key) > -1) {
          str += bInfo[i].value;
          break;
        }
      }
      return /-$/.test(str) ? `${str}other` : str;
    },
  },
  watch: {
    bankCardAct() {
      this.doCancelFun();
    },
  },
  components: { BankAddNew, CardDefault },
  methods: {
    ...mapMutations('agyy', ['setBankCardAct']),
    changeCardType(str) {
      let nStr = '';
      for (let i = 0; i < str.length; i += 1) {
        nStr = `${nStr}${str.slice(i, i + 1)}${i % 4 === 3 ? ' ' : ''}`;
      }
      return nStr;
    },
    addBankFun() {
      this.$emit('add', this.virtual);
    },
    doActionFun() {
      if (this.toastType === 1) {
        this.setBankFun();
      } else if (this.toastType === 2) {
        this.delBankFun();
      }
      setTimeout(() => { this.toastType = 0; }, 40);
    },
    doCancelFun() {
      this.toastType = 0;
    },
    setCheckFun() {
      if (/^1$/.test(this.data.def)) return;
      this.setBankCardAct();
      setTimeout(() => { this.toastType = 1; }, 40);
    },
    async setBankFun() {
      try {
        const rtn = await setDefBank({ id: this.data.id });
        this.$toast(rtn || this.$t('agPage.bank.setBankSuc'));
        this.$emit('set', this.data);
      } catch (e) {
        console.log(e);
      }
    },
    delCheckFun() {
      this.setBankCardAct();
      setTimeout(() => { this.toastType = 2; }, 40);
    },
    async delBankFun() {
      if (Date.now() - this.delTime < 1000) return;
      this.delTime = Date.now();
      try {
        const rtn = await deleteBank({ id: this.data.id, currency: this.data.currency || 'CNY' });
        this.$toast(rtn || this.$t('agPage.bank.delBankSuc'));
        this.$emit('delete', this.data);
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="less">
.bank-card {
  width: 355px;
  height: 168px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(129deg, #3f3d45, rgba(45, 42, 48, 0.65));
  .vert-btc .card-back {
    background-image: url(./images/v-btc-back.png);
  }
  .vert-btc .head-icon-box {
    background-image: url(./images/v-btc-icon.png);
  }
  .card-abc .card-back {
    background-image: url(./images/b-abc-back.png);
  }
  .card-abc .head-icon-box {
    background-image: url(./images/b-abc-icon.png);
  }
  .card-icbc .card-back {
    background-image: url(./images/b-icbc-back.png);
  }
  .card-icbc .head-icon-box {
    background-image: url(./images/b-icbc-icon.png);
  }
  .card-boco .card-back {
    background-image: url(./images/b-boco-back.png);
  }
  .card-boco .head-icon-box {
    background-image: url(./images/b-boco-icon.png);
  }
  .card-ccb .card-back {
    background-image: url(./images/b-ccb-back.png);
  }
  .card-ccb .head-icon-box {
    background-image: url(./images/b-ccb-icon.png);
  }
  .card-citic .card-back {
    background-image: url(./images/b-citic-back.png);
  }
  .card-citic .head-icon-box {
    background-image: url(./images/b-citic-icon.png);
  }
  .card-ebb .card-back {
    background-image: url(./images/b-ebb-back.png);
  }
  .card-ebb .head-icon-box {
    background-image: url(./images/b-ebb-icon.png);
  }
  .card-pab .card-back {
    background-image: url(./images/b-pab-back.png);
  }
  .card-pab .head-icon-box {
    background-image: url(./images/b-pab-icon.png);
  }
  .card-psbc .card-back {
    background-image: url(./images/b-psbc-back.png);
  }
  .card-psbc .head-icon-box {
    background-image: url(./images/b-psbc-icon.png);
  }
  .card-szdb .head-icon-box {
    background-image: url(./images/b-szdb-icon.png);
  }
  .card-bofc .head-icon-box {
    background-image: url(./images/b-bofc-icon.png);
  }
  .card-msb .head-icon-box {
    background-image: url(./images/b-msb-icon.png);
  }
  .card-cmb .head-icon-box {
    background-image: url(./images/b-cmb-icon.png);
  }
  .card-shpdb .head-icon-box {
    background-image: url(./images/b-shpdb-icon.png);
  }
  .card-inb .head-icon-box {
    background-image: url(./images/b-inb-icon.png);
  }
  .card-gnxs .head-icon-box {
    background-image: url(./images/b-gnxs-icon.png);
  }
  .card-gddb .head-icon-box {
    background-image: url(./images/b-gddb-icon.png);
  }
  .card-hxb .head-icon-box {
    background-image: url(./images/b-hxb-icon.png);
  }
  .card-other .head-icon-box {
    background-image: url(./images/b-other-icon.png);
  }
  .picture-left, .picture-right { position: relative; z-index: 1; width: 100%; height: 100%; overflow: hidden; }
  .picture-left { background-repeat: no-repeat; background-size: auto 100%; background-position: left center; }
  .no-card, .no-vert { .add-new-text { padding-top: 20px; font-size: 14px; } }
  .picture-right, .card-cover-bottom { box-shadow: 0 10px 20px 0 rgba(37, 37, 37, 0.5); background: linear-gradient(154deg, #4b3a4a, #302a35); }
  .picture-right, .card-cover-up { box-shadow: 0 10px 20px 0 rgba(37, 37, 37, 0.5); background: linear-gradient(154deg, rgba(75,58,74,.8), rgba(48,42,53,.8)); }
  .no-vert { background-image: url(./images/v-btc-back-black.png); }
  .no-card .add-new-text, .no-vert .add-new-text { color: #909090; }
  .card-cover-bottom {
    position: absolute;
    z-index: 10;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .card-back {
    position: absolute;
    z-index: 20;
    width: 200px;
    height: 126px;
    top: 21px;
    right: 24px;
    background-repeat: no-repeat;
    background-size: auto 100%;
    background-position: right center;
  }
  .card-cover-up { position: absolute; z-index: 30; width: 100%; height: 100%; overflow: hidden; }
  .card-body {
    position: absolute;
    z-index: 40;
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 15px 20px;
    .body-head {
      width: 315px;
      height: 30px;
      margin: 0 auto;
      .body-head-icon {
        width: 30px;
        height: 30px;
        border-radius: 100%;
        background: #ecebeb;
        .head-icon-box { width: 26px; height: 26px; border-radius: 100%; background-repeat: no-repeat; background-size: cover; }
      }
      .body-head-name { max-width: 170px; height: 30px; margin: 0 8px 0 10px; font-size: 18px; font-weight: 500; color: #ecebeb; }
      .body-head-type { width: 50px; height: 30px; padding-top: 6px; font-size: 12px; color: #909090; }
    }
    .body-num { width: 315px; height: 24px; margin: 30px auto 0; font-size: 24px; color: #ff5353; }
    .body-card-name, .body-card-addr { width: 315px; height: 20px; font-size: 14px; }
    .card-addr-detail, .card-addr-branch { height: 20px; font-size: 14px; color: #909090; }
    .card-addr-branch { margin-left: 10px; }
    .body-card-name { margin: 11px auto 0; color: #909090; }
    .body-card-addr {  margin: 4px auto 0; }
  }
  .delete-card {
    position: absolute;
    z-index: 50;
    width: 60px;
    height: 40px;
    top: 10px;
    right: 0;
    font-size: 14px;
    font-weight: 500;
    color: #ecebeb;
  }
  .def-card {
    position: absolute;
    z-index: 50;
    width: 60px;
    height: 60px;
    border-radius: 100%;
    right: -12px;
    bottom: -28px;
    padding-top: 12px;
    padding-left: 20px;
    background: #41303b;
  }
  .vert-btc .body-num { height: 60px !important; }
  .card-action-box { position: absolute; z-index: 90; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); }
  .card-action-body-box { width: 250px; height: 100px; border-radius: 10px; overflow: hidden; background: #f5f5f5; }
  .card-action-title { width: 100%; height: 60%; padding-top: 5px; font-size: 16px; font-weight: 500; color: #2e2f34; }
  .action-btn-box { width: 100%; height: 40%; font-size: 14px; font-weight: 500; color: #fff; }
  .action-cancel { width: 38%; height: 100%; background: #909090; }
  .action-submit { width: 62%; height: 100%; background: #ff5353; }
}
.white .bank-card {
  background-image: linear-gradient(129deg, #efecea, rgba(240, 237, 243, 0.65));
  .picture-right, .card-cover-bottom {
    background: linear-gradient(117deg, #633ee5, #c47ad1 44%, #f86ea7 73%, #ffaecf);
  }
  .picture-right, .card-cover-up {
    background: linear-gradient(117deg, rgba(99,62,229,.1), rgba(196,122,209,.1) 44%, rgba(248,110,167,.1) 73%, rgba(255,174,207,.1));
  }
  .no-vert, .vert-btc .card-back { background-image: url(./images/v-btc-back.png); }
  .no-card .add-new-text, .no-vert .add-new-text { color: #909090; }
  .body-head-icon { background: #ecebeb; }
  .body-head-name { color: #fff; }
  .body-head-type { color: #fff; }
  .body-num { color: #efefef; }
  .body-card-name, .card-addr-detail, .card-addr-branch { color: #fff; }
  .delete-card { color: #fff; }
  .def-card { background: #f9bbd6; }
}
</style>
