<template>
  <div class="nb-blockade" >
    <loading-bar v-if="loading && (!blockadeData || !blockadeData.length)" />
    <blockade-item v-for="(v, k) in blockadeData" :key="k" :data="v" />
    <div v-if="!loading || (blockadeData && blockadeData.length)" class="no-more">
      {{$t('message.noMoreRecords')}}
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import { findBunchList } from '@/api/pull';
import LoadingBar from '@/components/common/LoadingBar';
import BlockadeItem from '@/components/Matchs/BlockadeItem';

export default {
  data() {
    return {
      loading: false,
      blockadeData: [],
      reloadTimer: null,
      reloadDelay: 30000,
      delayArr: [30000, 5000],
    };
  },
  components: { LoadingBar, BlockadeItem },
  methods: {
    ...mapMutations(['clearBetItem']),
    ...mapMutations('app', ['updateMultType']),
    async queryBlockade() {
      [this.reloadDelay] = this.delayArr;
      try {
        [this.loading, this.reloadDelay] = [true, this.delayArr[0]];
        const data = await findBunchList();
        const nData = data && data.length ? data : [];
        for (let i = nData.length - 1; i >= 0; i -= 1) {
          const liveArr = nData[i].bunchList.filter(v => /^[12]$/.test(v.matchState));
          const delArr = nData[i].bunchList.filter(v => v.betStatus < 7 || v.matchState > 2);
          this.reloadDelay = liveArr && liveArr.length ? this.delayArr[1] : this.reloadDelay;
          if (delArr && delArr.length) nData.splice(i, 1);
        }
        this.blockadeData = nData;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
        clearTimeout(this.reloadTimer);
        this.reloadTimer = setTimeout(this.queryBlockade, this.reloadDelay);
      }
    },
  },
  mounted() {
    this.clearBetItem();
    this.$router.replace('/matchs/1/888');
    this.updateMultType(1);
    this.queryBlockade();
  },
  beforeDestroy() {
    clearTimeout(this.reloadTimer);
  },
};
</script>
<style lang="less">
.nb-blockade { width: 3.75rem; }
</style>
