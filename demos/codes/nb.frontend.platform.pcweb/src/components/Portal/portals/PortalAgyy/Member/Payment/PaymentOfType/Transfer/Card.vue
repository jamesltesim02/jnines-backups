<template>
<div class="agyy-card">
  <div class="header">
    <div><!-- TODO 设置银行logo --></div>
    <h4>{{card.bankname}}</h4>
  </div>
  <div class="cardno">
    {{card.accountnumber | banknoFormat}}
    <button
      class="btn-copy"
      @click="copy({ content: card.accountnumber })"
    >{{$t('agPage.payment.copyLabel')}}</button>
  </div>
  <div class="name">
    <span>{{card.accountname}} {{card.pinyin}}</span>
    <button
      class="btn-copy"
      @click="copy({ content: card.accountname })"
    >{{$t('agPage.payment.copyLabel')}}</button>
  </div>
  <div class="address">
    {{card.bankprovince}}
    {{card.bankcity}}
    {{card.bankaddress}}
  </div>
</div>
</template>
<script>
import copy from '@/utils/copy';

export default {
  props: ['card'],
  methods: { copy },
};
</script>
<style lang="less">
.agyy-card {
  width: 400px;
  color: #ecebeb;
  padding: 15px 10px 15px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 20px 0 rgba(37, 37, 37, 0.5);
  background-image: linear-gradient(154deg, #4b3a4a, #302a35);
  .header {
    display: flex;
    line-height: 30px;
    div {
      width: 30px;
      height: 30px;
      background-color: #fff;
      border-radius: 50%;
    }
    h4 {
      padding: 0 10px;
      font-size: 18px;
    }
  }
  .btn-copy {
    border-radius: 13px;
    border: solid 1px #ff5353;
    padding: 0 14px;
    line-height: 22px;
    color: #ff5353;
    font-size: 14px;
    font-weight: normal;
    margin-left: 6px;
  }
  .cardno {
    margin-top: 20px;
    font-size: 20px;
    font-weight: bold;
    color: #ff5353;
    letter-spacing: 1.8px;
    line-height: 22px;
  }
  .name {
    margin-top: 15px;
    line-height: 22px;
    font-size: 16px;
    letter-spacing: -0.4px;
    color: #bababa;
  }
  .address {
    margin-top: 16px;
    font-size: 14px;
  }
}
</style>
