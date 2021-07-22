<template>
  <i class="nb-bet-item"></i>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { deepCheckData } from '@/utils/betUtils';

export default {
  inheritAttrs: false,
  name: 'BetItem',
  data() {
    return {
      click: [0, 0],
    };
  },
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: ['checked', 'oid'],
  computed: {
    ...mapState({
      betIDArr: state => state.bet.betIDArr,
      betCount: state => state.bet.betCount,
    }),
  },
  watch: {
    betIDArr() {
      this.setChange();
    },
  },
  methods: {
    ...mapMutations(['setNeedShowSingle']),
    ...mapActions(['quoteBetCart']),
    async bet(item) {
      let nItem = JSON.parse(JSON.stringify(item));
      const bHave = this.betIDArr.indexOf(`${this.oid}`) >= 0;
      if (!bHave && this.betCount >= 10) {
        this.$toast(this.$t('pageBet.betFlow'));
        return;
      }
      this.setNeedShowSingle(!!nItem.fastFlag);
      if (nItem && nItem.games) {
        const result = deepCheckData(nItem.games, nItem, null);
        nItem = result[1] || null;
      }
      if (nItem) {
        await this.quoteBetCart(nItem);
        const aHave = this.betIDArr.indexOf(`${this.oid}`) >= 0;
        if (!bHave && !aHave) {
          this.$toast(this.$t('pageBet.cantBet'));
        }
      } else {
        this.$toast(this.$t('pageBet.cantBet'));
      }
    },
    setChange() {
      this.$emit('change', this.betIDArr.indexOf(`${this.oid}`) >= 0);
    },
  },
  mounted() {
    setTimeout(() => { this.setChange(); }, 1);
  },
};
</script>

<style lang="less">
.nb-bet-item {
  width: 0;
  height: 0;
  display: none;
}
