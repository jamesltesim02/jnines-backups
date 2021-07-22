<template>
  <div class="nb-rank-body" >
    <rank-item v-for="(v, k) in data" :key="k" :id="idx" :num="k" :data="v" @change="changeFun" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { findLongRank } from '@/api/activity';
import RankItem from '@/components/Rank/RankItem';

export default {
  inheritAttrs: false,
  name: 'RankBody',
  data() {
    return {
      data: [],
      list: ['getReturnRateRank', 'getLongRedRank', 'getHitRateRank', 'getFlowRank', 'getCommissionRank'],
    };
  },
  props: { id: Number, page: Number },
  computed: {
    ...mapState('app', ['userinfo']),
    idx() {
      let indx = /^-?\d+$/.test(this.id) ? +this.id : 0;
      indx = indx < 0 ? 0 : indx;
      return indx > 4 ? 4 : indx;
    },
  },
  watch: {
    idx() {
      this.getRankData();
    },
    page() {
      this.getRankData();
    },
  },
  components: { RankItem },
  methods: {
    async getRankData() {
      const params = { size: 20, userId: 0 };
      if (this.userinfo && this.userinfo.token && this.userinfo.nbUser) {
        params.userId = this.userinfo.nbUser;
      }
      this.data = [];
      try {
        const dt = await findLongRank(this.list[this.idx], params);
        this.data = dt && dt.length ? dt : [];
      } catch (e) {
        console.log(e);
      }
    },
    changeFun(v) {
      for (let i = 0; i < this.data.length; i += 1) {
        if (`${this.data[i].userId}` === `${v.userId}`) {
          this.$set(this.data, i, v);
        }
      }
    },
  },
  mounted() {
    this.getRankData();
  },
};
</script>

<style lang="less">
.nb-rank-body { width: 100%; padding: .04rem .1rem .1rem .1rem; }
</style>
