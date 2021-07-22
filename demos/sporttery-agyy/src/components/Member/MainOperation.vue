<template>
  <ul class="main-operation flex-between">
    <v-touch
      tag="li"
      @tap="$router.push('/payment')"
    >
      <cimg
        :local="true"
        class="cunkuan-icon"
        src="./images/cunkuan.png"
      />
      <div>{{$t('page.saveDeposit')}}</div>
    </v-touch>
    <v-touch
      tag="li"
      @tap="toWithdraw"
    >
      <cimg
        :local="true"
        class="qukuan-icon"
        src="./images/qukuan.png"
      />
      <div>{{$t('page.withdrawal')}}</div>
    </v-touch>
    <v-touch
      tag="li"
      @tap="$router.push('/rebate')"
    >
      <cimg
        :local="true"
        class="xima-icon"
        src="./images/xima.png"
      />
      <div>{{$t('page.cashback')}}</div>
    </v-touch>
  </ul>
</template>
<script>
import { mapMutations } from 'vuex';
import { getBankList } from '@/api/portalAgyy';

export default {
  methods: {
    ...mapMutations('app', ['setJumpObject']),
    async toWithdraw() {
      try {
        const rtn = await getBankList();
        const banks = [].concat(rtn && rtn.banks ? rtn.banks : []).concat(rtn && rtn.virtual ? rtn.virtual : []);
        if (banks.length > 0) {
          this.$router.push('/withdraw');
        } else {
          this.setJumpObject({ btn: this.$t('withBank.addBankBtn'), text: this.$t('withBank.addBankTxt'), url: '/bank' });
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
<style lang="less">
.main-operation {
  padding: .2rem .1rem .2rem .02rem;
  transition: all .5s;
  li {
    position: relative;
    height: .9rem;
    width: 1.07rem;
    border-radius: 8px;
    overflow: hidden;
    text-align: center;
    padding-top: .12rem;
    &::before {
      content: "";
      position: absolute;
      display: block;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 8px;
      background: #fff;
      z-index: 1;
      transition: all .5s;
    }
    img {
      position: relative;
      z-index: 2;
    }
    div {
      font-size: .16rem;
      position: absolute;
      z-index: 2;
      width: 100%;
      bottom: .08rem;
      color: #2e2f34;
      transition: all .5s;
    }
  }
}
.cunkuan-icon {
  width: .65rem;
  height: .47rem;
  transform: translate(.035rem, .05rem);
}
.qukuan-icon {
  width: .56rem;
  height: .50rem;
  transform: translate(.03rem, 0);
}
.xima-icon {
  width: .47rem;
  height: .47rem;
  transform: translate(.02rem, .02rem);
}

.black .main-operation {
  color: rgba(194, 202, 203, .7);
  border-color: #333339;
  li div {
    color: #c2cacb;
  }
  li::before {
    // opacity: 0.5;
    box-shadow: 0 6px 9px 0 rgba(37, 37, 37, 0.5);
    background: linear-gradient(to bottom, #3c3b43, #2b2a31);
  }
}
</style>
