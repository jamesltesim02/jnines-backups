<template>
  <list-page class="bank-page img-bg-page" v-if="!horizScreen">
    <nav-bar :title="$t('withBank.bank')" slot="header" transparent />
    <bank-card class="bank-page-card" :data="v" v-for="(v, k) in banks" :key="k + 10"
    @add="addCardFun" @set="setCardFun" @delete="delCardFun" :hide="hideDel" />
    <bank-card class="bank-page-card" :data="v" v-for="(v, k) in virtual" :key="k + 20"
    @add="addCardFun" @set="setCardFun" @delete="delCardFun" virtual />
  </list-page>
  <div class="bank-page" v-else>
    <div class="bank-page-left img-bg-page flex-none-col">
      <div class="bank-left-header">
        <nav-bar :title="$t('withBank.bank')" slot="header" transparent />
      </div>
      <div class="bank-left-content">
        <bank-card class="bank-page-card" :data="banks[0]" @add="addCardFun"
        @set="setCardFun" @delete="delCardFun" :hide="hideDel" />
        <bank-card class="bank-page-card" :data="banks[1]" @add="addCardFun"
        @set="setCardFun" @delete="delCardFun" :hide="hideDel" />
      </div>
    </div>
    <div class="bank-page-right">
      <list-page>
        <bank-card class="bank-page-card" :data="banks[2]" @add="addCardFun"
        @set="setCardFun" @delete="delCardFun" :hide="hideDel" />
        <bank-card class="bank-page-card" :data="virtual[0]" @add="addCardFun"
        @set="setCardFun" @delete="delCardFun" virtual />
      </list-page>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import ListPage from '@/components/common/ListPage';
import NavBar from '@/components/common/NavBar';
import BankCard from '@/components/QueryAndBank/BankCard';
import { getBankList } from '@/api/portalAgyy';

export default {
  data() {
    return {
      banks: [null, null, null],
      virtual: [null],
    };
  },
  computed: {
    ...mapState('app', {
      user: state => state.userinfo || {},
      bankObj: state => state.bankObj,
      chkTime: state => state.msgCheckTime || 0,
      horizScreen: state => state.horizScreen,
    }),
    hideDel() {
      return !this.banks[1];
    },
  },
  components: { ListPage, NavBar, BankCard },
  watch: {
    bankObj() {
      if (this.bankObj && /3/.test(this.bankObj.step)) {
        this.getBankCardList();
      }
    },
  },
  methods: {
    ...mapMutations('app', ['setBankObject', 'updateUserinfo']),
    ...mapActions('app', ['agRealodUserinfo']),
    addCardFun(vert) {
      if (this.user) {
        if (this.user.phone && /^[\d_-]+$/.test(this.user.phone)) {
          this.setBankObject({ vert, step: Date.now() - this.chkTime < 1800000 ? 2 : 1 });
        } else {
          this.$toast(this.$t('withBank.phoneWrong'));
        }
      }
    },
    setCardFun() {
      this.getBankCardList();
    },
    delCardFun() {
      this.getBankCardList();
    },
    async getBankCardList() {
      this.setBankObject();
      [this.banks, this.virtual] = [[null, null, null], [null]];
      try {
        const rtn = await getBankList();
        const bks = rtn && rtn.banks ? rtn.banks : [];
        const vtl = rtn && rtn.virtual ? rtn.virtual : [];
        if (bks.length === 1) {
          bks[0].def = 1;
        }
        if (vtl.length === 1) {
          vtl[0].def = 1;
        }
        for (let i = bks.length; i < 3; i += 1) {
          bks.push(null);
        }
        for (let i = vtl.length; i < 1; i += 1) {
          vtl.push(null);
        }
        [this.banks, this.virtual] = [bks.slice(0, 3), vtl.slice(0, 1)];
        const [nUser, bk] = [this.user, bks[0]];
        if (this.user && this.user.token) {
          nUser.bankUser = bk && bk.name ? bk.name : '';
          this.updateUserinfo(nUser);
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    this.agRealodUserinfo();
    this.getBankCardList();
  },
};
</script>
<style lang="less">
.bank-page {
  background-image: url(../assets/images/backgrounds/bank.png);
  background-repeat: no-repeat;
  background-size: 3.75rem auto;
  min-height: 100%;
  width: 3.75rem;
  .bank-page-card {
    margin: .1rem auto .2rem;
  }
}
.webp .bank-page {
  background-image: url(../assets/images/backgrounds/bank.webp);
}
.bank-page-left {
  float: left;
  width: 3.75rem;
  height: 100%;
  .bank-left-header {
    position: relative;
    z-index: 13;
  }
  .bank-left-content {
    position: relative;
    flex-grow: 1;
    z-index: 10;
    width: 3.75rem;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: .1rem;
  }
}
.bank-page-right {
  float: right;
  width: 3.75rem;
  height: 100%;
}
.horizontal .bank-page {
  width: 100%;
  height: 100%;
}
</style>
