<template>
  <list-page class="rank-page img-bg-page" v-if="!horizScreen">
    <div slot="header">
      <nav-bar :title="$t('share.rankTitle')" transparent />
      <share-select :tabList="data" :value="value" @change="changeFun" />
    </div>
    <rank-body :id="idx" :page="page" />
  </list-page>
  <div class="rank-page" v-else>
    <div class="rank-page-left img-bg-page flex-none-col">
      <div class="rank-left-header">
        <nav-bar :title="$t('share.rankTitle')" slot="header" transparent />
      </div>
      <div class="rank-left-content">
        <share-select :tabList="data" :value="value" @change="changeFun" />
      </div>
    </div>
    <div class="rank-page-right">
      <list-page>
        <rank-body :id="idx" :page="page" />
      </list-page>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ListPage from '@/components/common/ListPage';
import NavBar from '@/components/common/NavBar';
import ShareSelect from '@/components/common/ShareSelect';
import RankBody from '@/components/Rank/RankBody';

export default {
  data() {
    return {
      data: ['rank0', 'rank1', 'rank2', 'rank3', 'rank4'],
      page: 1,
    };
  },
  props: { id: { type: Number, default: 0 } },
  computed: {
    ...mapState('app', ['horizScreen']),
    idx() {
      return this.getIdx(this.id);
    },
    value() {
      return this.data[this.idx];
    },
  },
  components: {
    ListPage,
    NavBar,
    ShareSelect,
    RankBody,
  },
  methods: {
    getIdx(id) {
      const idx = id < 0 ? 0 : id;
      return idx > 4 ? 4 : idx;
    },
    changeFun(val) {
      this.page = 1;
      this.$router.replace(`/ranking/${this.getIdx(this.data.findIndex(v => v === val))}`);
    },
  },
  mounted() { },
};
</script>
<style lang="less">
.rank-page {
  background-image: url(../assets/images/backgrounds/rank.jpg);
  background-repeat: no-repeat;
  background-size: 3.75rem auto;
  min-height: 100%;
  width: 3.75rem;
  .nb-share-select { height: .44rem; margin-top: 1.36rem; border-top-left-radius: .18rem; border-top-right-radius: .18rem; box-shadow: 0 -.1rem .2rem 0 rgba(0,0,0,.1); background: linear-gradient(to top, #fbfbfb, #f6f6f6); }
}
.rank-page-left {
  float: left;
  width: 3.75rem;
  height: 100%;
  .rank-left-header { position: relative; z-index: 13; }
  .rank-left-content { position: relative; flex-grow: 1; z-index: 10; width: 3.75rem; overflow: auto; -webkit-overflow-scrolling: touch; padding-bottom: .1rem; }
}
.rank-page-right { float: right; width: 3.75rem; height: 100%; }
.horizontal .rank-page { width: 100%; height: 100%; }
.blue .rank-page .nb-share-select { box-shadow: 0 .1rem .2rem 0 rgba(0,0,0,.3); background: #2e2f34; li.active { color: #53fffd; } }
</style>
