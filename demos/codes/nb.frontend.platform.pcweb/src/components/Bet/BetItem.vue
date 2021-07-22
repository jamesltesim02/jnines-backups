<template>
  <i class="nb-bet-item"></i>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { deepCheckData } from '@/utils/betUtils';
import { toPortalUrlByKey } from '@/utils/PortalUtils';

export default {
  inheritAttrs: false,
  name: 'BetItem',
  data() {
    return { click: [0, 0] };
  },
  model: { prop: 'checked', event: 'change' },
  props: ['checked', 'oid', 'type'],
  computed: {
    ...mapState('app', ['userinfo']),
    ...mapState({
      betIDArr: state => state.bet.betIDArr,
      betCount: state => state.bet.betCount,
      mthArr: state => state.bet.matchIDArr,
    }),
    betMax() {
      const bNum = window.NBConfig.MAX_BETTING_COUNT;
      const num = /^[1-9]\d*$/.test(bNum) ? +bNum : 10;
      return num < 30 ? num : 30;
    },
  },
  watch: {
    betIDArr() {
      this.setChange();
    },
  },
  methods: {
    ...mapMutations(['setNeedShowSingle', 'changeBetMult']),
    ...mapActions(['quoteBetCart']),
    async bet(item) {
      const login = this.userinfo && this.userinfo.token;
      let nItem = JSON.parse(JSON.stringify(item));
      nItem.from = /fast/i.test(this.type) ? 1 : 0;
      nItem.from = /blockade/i.test(this.type) ? 4 : nItem.from;
      nItem.from = /jackpot/i.test(this.type) ? 5 : nItem.from;
      const rootFrom = /^\/detail\/\d{1,2}\/\d+$/i.test(this.$route.path) ? 3 : 2;
      nItem.from = !this.type ? rootFrom : nItem.from;
      const bHave = this.betIDArr.filter(v => `${v.id}` === `${this.oid}` && `${v.type || ''}` === `${this.type || ''}`).length > 0;
      if (!login && !bHave) {
        toPortalUrlByKey('LOGIN_PAGE_URL');
        return;
      }
      if (!bHave && this.betCount >= this.betMax) {
        this.$toast(this.$t('pageBet.betFlow').replace('10', this.betMax));
        return;
      }
      if (nItem && (nItem.games || nItem.game)) {
        const result = deepCheckData(nItem.games || [nItem.game], nItem, null);
        nItem = result[1] || null;
      }
      if (nItem && `${nItem.optionID}` === `${this.oid}` && `${nItem.type || ''}` === `${this.type || ''}`) {
        await this.quoteBetCart({ item: nItem });
        const aHave = this.betIDArr.filter(v => `${v.id}` === `${this.oid}` && `${v.type || ''}` === `${this.type || ''}`).length > 0;
        if (!bHave && !aHave) {
          this.$toast(this.$t('pageBet.cantBet'));
        } else if (!bHave && aHave && this.mthArr.length < 3 && !this.type) {
          this.changeBetMult(this.mthArr.length > 1 ? 1 : 0);
        } else if (this.mthArr.length < 2 && !this.type) {
          this.changeBetMult(0);
        }
      } else if (item) {
        this.$toast(this.$t('pageBet.cantBet'));
      }
    },
    setChange() {
      this.$emit('change', this.betIDArr.filter(v => `${v.id}` === `${this.oid}` && `${v.type || ''}` === `${this.type || ''}`).length > 0);
    },
  },
  mounted() {
    setTimeout(() => { this.setChange(); }, 1);
  },
};
</script>

<style lang="less">
.nb-bet-item { width: 0; height: 0; display: none; }
