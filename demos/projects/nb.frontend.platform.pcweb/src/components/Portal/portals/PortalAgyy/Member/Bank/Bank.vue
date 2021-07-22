<template>
  <sub-panel class="agyy-bank-page" :title="$t('agPage.bank.title')" >
    <div class="bank-vert-blank"></div>
    <customer-service class="bank-vert-alert" :text="$t('agPage.bank.noBankAlert')" v-if="noBankAlert" start />
    <div class="bank-vert-box flex-between">
      <div class="bank-card-box flex-start-col">
        <bank-card class="bank-page-card" :data="v" v-for="(v, k) in banks" :key="k + 10"
        @add="addCardFun" @set="setCardFun" @delete="delCardFun" :hide="hideDel" />
      </div>
      <div class="vert-card-box flex-start-col">
        <bank-card class="bank-page-card" :data="v" v-for="(v, k) in virtual" :key="k + 20"
        @add="addCardFun" @set="setCardFun" @delete="delCardFun" virtual />
      </div>
    </div>
    <customer-service class="bank-vert-alert" :text="$t('agPage.bank.alert')" start />
  </sub-panel>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import BankCard from './BankCard';
import SubPanel from '@/components/Portal/portals/PortalAgyy/Member/SubPanel';
import CustomerService from '@/components/Portal/portals/PortalAgyy/Member/CustomerService';
import { getBankList } from '@/api/portalAgyy';

export default {
  data() {
    return { banks: [null, null, null], virtual: [null] };
  },
  computed: {
    ...mapState('app', ['userinfo']),
    ...mapState('agyy', ['msgCheckTime', 'noBankAlert']),
    hideDel() {
      return !this.banks[1];
    },
  },
  components: { BankCard, SubPanel, CustomerService },
  methods: {
    ...mapMutations('agyy', ['pushRouter', 'setBankCardType']),
    ...mapMutations('app', ['updateUserinfo']),
    ...mapActions('agyy', ['reloadUserinfo']),
    addCardFun(vert) {
      if (this.userinfo) {
        if (this.userinfo.phone && /^[\d_-]+$/.test(this.userinfo.phone)) {
          this.setBankCardType(vert);
          this.pushRouter(`/member/bank/${Date.now() - this.chkTime < 1800000 ? 'bind' : 'mobile'}`);
        } else {
          this.$toast(this.$t('agPage.bank.phoneWrong'));
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
        const [nUser, bk] = [this.userinfo, bks[0]];
        if (this.userinfo && this.userinfo.token) {
          nUser.bankUser = bk && bk.name ? bk.name : '';
          this.updateUserinfo(nUser);
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    this.getBankCardList();
  },
};
</script>
<style lang="less">
.agyy-bank-page {
  .bank-vert-blank { width: 100%; height: 20px; }
  .bank-vert-box { width: 100%; padding: 20px 20px 15px 20px; }
  .bank-card-box, .vert-card-box { width: 355px; min-height: 544px; .bank-page-card { margin-bottom: 20px; } .bank-page-card:last-child { margin: 0; } }
  .bank-vert-alert { padding: 0 20px; }
}
</style>
