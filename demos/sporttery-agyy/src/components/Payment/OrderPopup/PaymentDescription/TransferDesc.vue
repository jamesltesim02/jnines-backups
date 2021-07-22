<template>
  <div class="transfer-desc">
    <div class="card">
      <div class="card-header">
        <i class="payment-bank-logo" :class="[`bank-${card.bankcode.toLowerCase()}`]"></i>
        <span>{{card.bankname}}</span>
      </div>
      <div class="card-no">
        <span>{{card.accountnumber | banknoFormat}}</span>
        <btn-copy @copy="copy({ content: card.accountnumber })" />
      </div>
      <div class="card-owner">
        <span class="copy-target">{{card.accountname}}</span>
        <span class="card-pinyin">{{card.pinyin}}</span>
        <btn-copy @copy="copy({ content: card.accountname })" />
      </div>
      <div class="card-address">
        {{card.bankprovince}}
        {{card.bankcity}}
        {{card.bankaddress}}
      </div>
    </div>
    <div class="tips">{{$t('payment.transferRule', { time: info.finalDate })}}</div>
  </div>
</template>
<script>
import copy from '@/utils/copy';
import BtnCopy from '@/components/common/BtnCopy';

export default {
  props: ['info'],
  computed: {
    card() {
      return this.info.card;
    },
  },
  components: {
    BtnCopy,
  },
  methods: {
    copy,
  },
};
</script>
<style lang="less">
.transfer-desc {
  margin-top: .18rem;
  padding: 0 .07rem;
  .card {
    font-size: .14rem;
    padding: .12rem 0 .12rem .17rem;
    background: #ccc;
    border-radius: 6px;
    height: 1.42rem;
    background-image: linear-gradient(146deg, #5440B8 1%, #A34B88 100%);
    box-shadow: 0 10px 20px 0 rgba(189, 16, 224, 0.33);
    margin-bottom: .28rem;
  }
  .card-header {
    color: #ecebeb;
    line-height: .25rem;
    // span {
    //   margin-left: .12rem;
    // }
  }
  .card-no {
    color: #fff;
    font-size: .16rem;
    letter-spacing: 2px;
    color: #ffffff;
    line-height: .2rem;
    margin-top: .15rem;
  }
  .card-owner {
    color: #ecebeb;
    letter-spacing: -0.3px;
    margin-top: .1rem;
    line-height: .2rem;
    height: .2rem;
    .card-pinyin {
      margin-left: .08rem;
      color: #bababa;
    }
  }
  .card-address {
    margin-top: .08rem;
    color: #ecebeb;
  }
  .tips {
    padding: 0 .09rem;
    margin-bottom: .2rem;
    letter-spacing: -0.2px;
    color: #909090;
    font-size: .12rem;
    line-height: .16rem;
  }
}
.copy-target.hidden {
  display: none;
}
// .payment-bank-logo {
//   display: inline-block;
//   vertical-align: middle;
//   height: .25rem;
//   width: .25rem;
//   border-radius: 50%;
//   background: #fff;
//   background-repeat: no-repeat;
//   background-size: contain;
//   background-clip: content-box;
//   border: .02rem solid #fff;
// }
// .bank-ccbc { background-image: url(../../../QueryAndBank/images/b-icbc-icon.png); }
</style>
