<template>
  <div class="bank-card" :style="elStyle">
    <v-touch :class="noClass" v-if="!data" @tap="addBankFun">
      <bank-add-new />
      <span class="add-new-text">{{$t(`withBank.addNew${virtual ? 'Vert' : 'Card'}`)}}</span>
    </v-touch>
    <div :class="cardClass" v-else>
      <div class="card-cover-bottom"></div>
      <div class="card-back"></div>
      <div class="card-cover-up"></div>
      <v-touch class="card-body" @tap="setCheckFun">
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
            {{data.province}}{{data.province ? $t('withBank.provBank') : ''}}
            {{data.city}}{{data.city ? $t('withBank.cityBank') : ''}}
          </span>
          <span class="card-addr-branch flex-start">{{data.branch}}</span>
        </div>
      </v-touch>
      <v-touch class="delete-card flex-center" @tap="delCheckFun" v-if="!hide">
        {{$t('withBank.delete')}}
      </v-touch>
      <v-touch class="def-card" @tap="setCheckFun">
        <card-default v-if="/^1$/.test(data.def)" />
      </v-touch>
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
  props: {
    data: Object,
    hide: Boolean,
    virtual: Boolean,
  },
  computed: {
    ...mapState('app', {
      theme: state => state.theme,
      jpSts: state => state.jumpStatus,
    }),
    elStyle() {
      const hasColor = 'none';
      let defColor = /black/i.test(this.theme) ? '#363636' : 'rgba(212,212,212,.35)';
      defColor = /blue/i.test(this.theme) ? '#363636' : defColor;
      return { border: this.data ? hasColor : `.01rem solid ${defColor}` };
    },
    noClass() {
      return `picture-left no-${this.virtual ? 'vert' : 'card'} flex-center-col`;
    },
    cardClass() {
      const bInfo = this.$t('withBank.bankInfor');
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
    jpSts() {
      if (this.jpSts) {
        if (this.toastType === 1) {
          this.setBankFun();
        } else if (this.toastType === 2) {
          this.delBankFun();
        }
      }
    },
  },
  components: {
    BankAddNew,
    CardDefault,
  },
  methods: {
    ...mapMutations('app', ['setJumpObject']),
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
    setCheckFun() {
      if (/^1$/.test(this.data.def)) return;
      this.toastType = 1;
      this.setJumpObject({ btn: this.$t('withBank.setBankBtn'), text: this.$t('withBank.setBankTxt') });
    },
    async setBankFun() {
      try {
        const rtn = await setDefBank({ id: this.data.id });
        this.$toast(rtn || this.$t('withBank.setBankSuc'));
        this.$emit('set', this.data);
      } catch (e) {
        console.log(e);
      }
    },
    delCheckFun() {
      this.toastType = 2;
      this.setJumpObject({ btn: this.$t('withBank.delBankBtn'), text: this.$t('withBank.delBankTxt') });
    },
    async delBankFun() {
      if (Date.now() - this.delTime < 1000) return;
      this.delTime = Date.now();
      try {
        const rtn = await deleteBank({ id: this.data.id, currency: this.data.currency || 'CNY' });
        this.$toast(rtn || this.$t('withBank.delBankSuc'));
        this.$emit('delete', this.data);
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="less">
.white .bank-card {
  background-image: linear-gradient(129deg, #efecea, rgba(240, 237, 243, 0.65));
  .picture-right, .card-cover-bottom {
    background: linear-gradient(117deg, #633ee5, #c47ad1 44%, #f86ea7 73%, #ffaecf);
  }
  .picture-right, .card-cover-up {
    background: linear-gradient(117deg, rgba(99,62,229,.1), rgba(196,122,209,.1) 44%, rgba(248,110,167,.1) 73%, rgba(255,174,207,.1));
  }
  .no-vert, .vert-btc .card-back {
    background-image: url(./images/v-btc-back.png);
  }
  .no-card .add-new-text, .no-vert .add-new-text {
    color: #909090;
  }
  .body-head-icon {
    background: #ecebeb;
  }
  .body-head-name {
    color: #fff;
  }
  .body-head-type {
    color: #fff;
  }
  .body-num {
    color: #efefef;
  }
  .body-card-name, .card-addr-detail, .card-addr-branch {
    color: #fff;
  }
  .delete-card {
    color: #fff;
  }
  .def-card {
    background: #f9bbd6;
  }
}
.black .bank-card {
  background: linear-gradient(129deg, #3f3d45, rgba(45, 42, 48, 0.65));
  .picture-right, .card-cover-bottom {
    box-shadow: 0 .1rem .2rem 0 rgba(37, 37, 37, 0.5);
    background: linear-gradient(154deg, #4b3a4a, #302a35);
  }
  .picture-right, .card-cover-up {
    box-shadow: 0 .1rem .2rem 0 rgba(37, 37, 37, 0.5);
    background: linear-gradient(154deg, rgba(75,58,74,.8), rgba(48,42,53,.8));
  }
  .no-vert {
    background-image: url(./images/v-btc-back-black.png);
  }
  .no-card .add-new-text, .no-vert .add-new-text {
    color: #909090;
  }
  .body-head-icon {
    background: #ecebeb;
  }
  .body-head-name {
    color: #ecebeb;
  }
  .body-head-type {
    color: #909090;
  }
  .body-num {
    color: #ff5353;
  }
  .body-card-name, .card-addr-detail, .card-addr-branch {
    color: #909090;
  }
  .delete-card {
    color: #ecebeb;
  }
  .def-card {
    background: #41303b;
  }
}
.bank-card {
  width: 3.55rem;
  height: 1.68rem;
  border-radius: .12rem;
  overflow: hidden;
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
  .picture-left, .picture-right {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .picture-left {
    background-repeat: no-repeat;
    background-size: auto 100%;
    background-position: left center;
  }
  .no-card, .no-vert {
    .add-new-text {
      padding-top: .2rem;
      font-size: .14rem;
    }
  }
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
    width: 3rem;
    height: 1.26rem;
    top: .21rem;
    right: .24rem;
    background-repeat: no-repeat;
    background-size: auto 100%;
    background-position: right center;
  }
  .card-cover-up {
    position: absolute;
    z-index: 30;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .card-body {
    position: absolute;
    z-index: 40;
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: .15rem .2rem;
    .body-head {
      width: 3.15rem;
      height: .3rem;
      margin: 0 auto;
      .body-head-icon {
        width: .3rem;
        height: .3rem;
        border-radius: 100%;
        .head-icon-box {
          width: .26rem;
          height: .26rem;
          border-radius: 100%;
          background-repeat: no-repeat;
          background-size: cover;
        }
      }
      .body-head-name {
        max-width: 1.7rem;
        height: .3rem;
        margin: 0 .08rem 0 .1rem;
        font-size: .18rem;
        font-weight: 500;
      }
      .body-head-type {
        width: .5rem;
        height: .3rem;
        padding-top: .06rem;
        font-size: .12rem;
      }
    }
    .body-num {
      width: 3.15rem;
      height: .24rem;
      margin: .3rem auto 0;
      font-size: .24rem;
    }
    .body-card-name, .body-card-addr {
      width: 3.15rem;
      height: .2rem;
      font-size: .14rem;
    }
    .card-addr-detail, .card-addr-branch {
      height: .2rem;
      font-size: .14rem;
    }
    .card-addr-branch {
      margin-left: .1rem;
    }
    .body-card-name {
      margin: .11rem auto 0;
    }
    .body-card-addr {
      margin: .04rem auto 0;
    }
  }
  .delete-card {
    position: absolute;
    z-index: 50;
    width: .6rem;
    height: .4rem;
    top: .1rem;
    right: 0;
    font-size: .14rem;
    font-weight: 500;
  }
  .def-card {
    position: absolute;
    z-index: 50;
    width: .6rem;
    height: .6rem;
    border-radius: 100%;
    right: -.12rem;
    bottom: -.28rem;
    padding-top: .12rem;
    padding-left: .2rem;
  }
  .vert-btc .body-num {
    height: .6rem !important;
  }
}
</style>
