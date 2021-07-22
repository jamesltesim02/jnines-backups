<template>
  <ul class="agyy-mainoperation">
    <li
      v-for="m in menus"
      :key="m.url"
      @click="m.action ? m.action(m.url) : pushRouter(m.url)"
    >
      <div>
        <cimg
          :local="true"
          :src="m.icon"
        />
        <div>{{m.text}}</div>
      </div>
    </li>
  </ul>
</template>
<script>
import { mapMutations } from 'vuex';
import { getBankList } from '@/api/portalAgyy';

const [
  paymentImg,
  withdrawlImg,
  rebateImg,
] = [
  require('./images/cunkuan.png'), // eslint-disable-line global-require
  require('./images/qukuan.png'), // eslint-disable-line global-require
  require('./images/xima.png'), // eslint-disable-line global-require
];

export default {
  data() {
    return {
      menus: [
        {
          icon: paymentImg,
          url: '/member/payment',
          text: this.$t('agPage.member.mdeposit'),
        },
        {
          icon: withdrawlImg,
          url: '/member/withdraw',
          text: this.$t('agPage.member.mwithdrawal'),
          action: this.withdrawFun,
        },
        {
          icon: rebateImg,
          url: '/member/rebate',
          text: this.$t('agPage.member.rebate'),
        },
      ],
    };
  },
  methods: {
    ...mapMutations('agyy', ['pushRouter', 'setNoBankAlert']),
    async withdrawFun(url) {
      try {
        const rtn = await getBankList();
        const banks = [].concat(rtn && rtn.banks ? rtn.banks : []).concat(rtn && rtn.virtual ? rtn.virtual : []);
        if (banks.length > 0) {
          this.pushRouter(url);
        } else {
          this.setNoBankAlert(true);
          this.pushRouter('/member/bank');
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
<style lang="less">
.agyy-mainoperation {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  li {
    width: 80px;
    height: 96px;
    border-radius: 8px;
    border: solid 1px #2b2a33;
    box-shadow: 0 6px 9px 0 rgba(37, 37, 37, 0.5);
    background-image: linear-gradient(to bottom, #3c3b43, #2b2a31);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    & > div {
      padding-top: 4px;
      div {
        margin-top: -4px;
      }
    }
  }
}
</style>
