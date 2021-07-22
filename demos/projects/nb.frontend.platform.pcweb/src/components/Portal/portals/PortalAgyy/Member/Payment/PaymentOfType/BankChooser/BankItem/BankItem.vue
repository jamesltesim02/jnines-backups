<template>
  <div :class="classes">
    <span v-if="!isAready">{{$t(`agPage.payment.banks.${code}`)}}</span>
  </div>
</template>
<script>
const ALREADS = [
  'icbc', // 工商银行
  'abc', // 中国农业银行
  'ccb', // 建设银行
  'boco', // 交通银行
  'cmb', // 招商银行
  'bofc', // 中国银行
  'msb', // 民生银行
  'hxb', // 华夏银行
  'inb', // 兴业银行
  'shpdb', // 上海浦东发展银行
  'gddb', // 广东发展银行
  'citic', // 中信银行
  'ebb', // 光大银行
  'psb', // 邮政储蓄
  'bjyh', // 北京银行
  'tccb', // 天津银行
  'bos', // 上海银行
  'srcb', // 上海农商银行
  'pab', // 平安银行
  'bjrcb', // 北京农村商业银行
  'njcb', // 南京银行
  'szdb', // 深圳发展银行
  'nbcb', // 宁波银行
  'hsbank', // 徽商银行
  'hzbank', // 杭州银行
  'czbank', // 浙商银行
  'bohaibank', // 渤海银行
  'hebbank', // 河北银行
  'eab', // 东亚银行
  // 'inbdebit', // 兴业银行借记卡
  // 'inbcredit', // 兴业银行贷记卡
  'gzcb', // 广州银行
  'gnxs', // 广州市农村信用合作社
  'hfyh', // 恒丰银行
  'cdyh', // 成都银行
  'zjtlyh', // 浙江泰隆银行
  // 'ccbank', // 城市商业银行
  // 'crbank', // 农村商业银行
  // 'other', // 其他银行
  'chinapay', // 银联在线
  'unionpay', // 中国银联
];
export default {
  props: ['code'],
  computed: {
    isAready() {
      return ALREADS.includes(this.code);
    },
    classes() {
      return [
        'agyy-iconbank',
        this.isAready ? this.code : 'others',
      ];
    },
  },
};
</script>
<style lang="less">
.agyy-iconbank {
  width: 210px;
  height: 50px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  &.others {
    position: relative;
    background: #fff;
    font-size: 18px;
    line-height: 50px;
    text-align: center;
  }
  &.abc {
    background-image: url(./images/abc.jpg);
  }
  &.bjrcb {
    background-image: url(./images/bjrcb.jpg);
  }
  &.bjyh {
    background-image: url(./images/bjyh.jpg);
  }
  &.boco {
    background-image: url(./images/boco.jpg);
  }
  &.bofc {
    background-image: url(./images/bofc.jpg);
  }
  &.bohaibank {
    background-image: url(./images/bohaibank.jpg);
  }
  &.bos {
    background-image: url(./images/bos.jpg);
  }
  &.ccb {
    background-image: url(./images/ccb.jpg);
  }
  &.cdyh {
    background-image: url(./images/cdyh.jpg);
  }
  &.chinapay {
    background-image: url(./images/chinapay.jpg);
  }
  &.citic {
    background-image: url(./images/citic.jpg);
  }
  &.cmb {
    background-image: url(./images/cmb.jpg);
  }
  &.czbank {
    background-image: url(./images/czbank.jpg);
  }
  &.eab {
    background-image: url(./images/eab.jpg);
  }
  &.ebb {
    background-image: url(./images/ebb.jpg);
  }
  &.gddb {
    background-image: url(./images/gddb.jpg);
  }
  &.gnxs {
    background-image: url(./images/gnxs.jpg);
  }
  &.gzcb {
    background-image: url(./images/gzcb.jpg);
  }
  &.hebbank {
    background-image: url(./images/hebbank.jpg);
  }
  &.hfyh {
    background-image: url(./images/hfyh.jpg);
  }
  &.hsbank {
    background-image: url(./images/hsbank.jpg);
  }
  &.hxb {
    background-image: url(./images/hxb.jpg);
  }
  &.hzbank {
    background-image: url(./images/hzbank.jpg);
  }
  &.icbc {
    background-image: url(./images/icbc.jpg);
  }
  &.inb {
    background-image: url(./images/inb.jpg);
  }
  &.msb {
    background-image: url(./images/msb.jpg);
  }
  &.nbcb {
    background-image: url(./images/nbcb.jpg);
  }
  &.njcb {
    background-image: url(./images/njcb.jpg);
  }
  &.pab {
    background-image: url(./images/pab.jpg);
  }
  &.psb {
    background-image: url(./images/psb.jpg);
  }
  &.shpdb {
    background-image: url(./images/shpdb.jpg);
  }
  &.srcb {
    background-image: url(./images/srcb.jpg);
  }
  &.szdb {
    background-image: url(./images/szdb.jpg);
  }
  &.tccb {
    background-image: url(./images/tccb.jpg);
  }
  &.unionpay {
    background-image: url(./images/unionpay.jpg);
  }
  &.zjtlyh {
    background-image: url(./images/zjtlyh.jpg);
  }
}
</style>
