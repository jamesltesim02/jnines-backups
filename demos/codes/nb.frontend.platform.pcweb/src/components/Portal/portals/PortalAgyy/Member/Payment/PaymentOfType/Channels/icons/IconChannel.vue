<template>
  <img :src="src" />
</template>
<script>
const [
  alipay,
  bankmobile,
  banknet,
  jd,
  qq,
  unionpay,
  wechat,
] = [
  require('./alipay.png'), // eslint-disable-line global-require
  require('./bankmobile.png'), // eslint-disable-line global-require
  require('./banknet.png'), // eslint-disable-line global-require
  require('./jd.png'), // eslint-disable-line global-require
  require('./qq.png'), // eslint-disable-line global-require
  require('./unionpay.png'), // eslint-disable-line global-require
  require('./wechat.png'), // eslint-disable-line global-require
];

const mapping = {
  // 支付宝
  scan_alipay: alipay,
  scan_big_alipay: alipay,
  // 扫码支付
  scan_wechat: wechat,
  scan_big_wechat: wechat,
  scan_unionpay: unionpay,
  scan_qq: qq,
  scan_jd: jd,
  // 在线支付
  online_bank: banknet,
  online_unionpay: unionpay,
  // 银行卡转账
  transfer_bank: banknet,
  transfer_alipay: alipay,
  transfer_wechat: wechat,
  transfer_mobile: bankmobile,
};

export default {
  props: ['channel'],
  computed: {
    src() {
      return mapping[this.channel];
    },
  },
};
</script>
