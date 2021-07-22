<template>
  <div class="blockade-page" >
    <h3>{{$t('page.blockade.title')}}</h3>
    <perfect-scrollbar class="blockade-page-content" :style="{ height: hmHeight }">
      <loading-bar full v-if="loading && (!blockadeData || !blockadeData.length)" />
      <no-more-bar full v-if="!loading && (!blockadeData || !blockadeData.length)" />
      <blockade-item v-for="(v, k) in blockadeData" :key="k" :data="v" />
    </perfect-scrollbar>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { findBunchList } from '@/api/pull';
import BlockadeItem from '@/components/Blockade/BlockadeItem';

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
  computed: {
    ...mapState('app', ['contentHeight']),
    hmHeight() {
      if (!this.contentHeight) {
        return 'auto';
      }

      return `${this.contentHeight - 68}px`;
    },
  },
  components: { BlockadeItem },
  methods: {
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
    this.queryBlockade();
  },
  beforeDestroy() {
    clearTimeout(this.reloadTimer);
  },
};
</script>
<style lang="less">
.blockade-page {
  padding-top: 30px;
  h3 { width: 100%; height: 35px; line-height: 35px; border-left: 7px solid #ff5353; padding-left: 15px; font-size: 22px; font-weight: 600; color: #fe6246; }
  .blockade-page-content { width: 100%; padding: 0 50px; }
 }
</style>
