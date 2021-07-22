<template>
  <i class="nb-bet-item"></i>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { AppModes } from '@/config/constants';
import { deepCheckData } from '@/utils/betUtils';

export default {
  inheritAttrs: false,
  name: 'BetItem',
  data() {
    return { click: [0, 0] };
  },
  model: { prop: 'checked', event: 'change' },
  props: ['checked', 'oid'],
  computed: {
    ...mapState('app', ['userinfo']),
    ...mapState({ betIDArr: state => state.bet.betIDArr, betCount: state => state.bet.betCount }),
    appMode() {
      return window.NBConfig.APP_MODE;
    },
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
    ...mapMutations(['clearBetItem', 'setNeedShowSingle']),
    ...mapActions('app', ['toLoginPage']),
    ...mapActions(['quoteBetCart']),
    async bet(item) {
      const login = this.userinfo && this.userinfo.token;
      if (!login && AppModes.SEAMLESS !== this.appMode) {
        this.toLoginPage(this);
        return;
      }
      if (item && item.fastFlag) {
        this.clearBetItem();
        this.setNeedShowSingle(true);
      }
      let nItem = JSON.parse(JSON.stringify(item));
      nItem.from = /^\/(home)?$/i.test(this.$route.path) ? 1 : 0;
      nItem.from = /\/(matchs\/\d|xsports)\/\d{1,2}$/i.test(this.$route.path) ? 2 : nItem.from;
      nItem.from = /\/(detail|matchinfo)\/\d{1,2}\/\d+$/i.test(this.$route.path) ? 3 : nItem.from;
      nItem.from = /\/matchs\/\d\/8{3}$/i.test(this.$route.path) ? 4 : nItem.from;
      nItem.from = /\/matchs\/\d\/9{3}$/i.test(this.$route.path) ? 5 : nItem.from;
      const bHave = this.betIDArr.indexOf(`${this.oid}`) >= 0;
      if (item && !bHave && this.betCount >= this.betMax) {
        this.$toast(this.$t('pageBet.betFlow').replace('10', this.betMax));
        return;
      }
      if (nItem && (nItem.games || nItem.game)) {
        const result = deepCheckData(nItem.games || [nItem.game], nItem, null);
        nItem = result[1] || null;
      }
      if (nItem && `${nItem.optionID}` === `${this.oid}`) {
        await this.quoteBetCart(nItem);
        const aHave = this.betIDArr.indexOf(`${this.oid}`) >= 0;
        if (!bHave && !aHave) {
          this.$toast(this.$t('pageBet.cantBet'));
        }
      } else if (item) {
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
.nb-bet-item { width: 0; height: 0; display: none; }
</style>
