<template>
  <div class="nb-publish-body" v-if="data && data.length">
    <publish-item v-for="(v, k) in data" :key="k" :data="v" />
  </div>
  <div class="nb-publish-body" v-else-if="finish" >
    <div class="publish-body-none flex-center">{{$t('share.noPublish')}}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { findPublishList } from '@/api/activity';
import PublishItem from '@/components/Publish/PublishItem';

export default {
  inheritAttrs: false,
  name: 'PublishBody',
  data() {
    return {
      data: [],
      qTime: 0,
      finish: false,
      list: ['getFocusPlans', 'getNewestPlans', 'getMaxOddsPlans', 'getLongRedPlans', 'getMaxBetPlans', 'getPopularityPlans'],
    };
  },
  props: { state: Number, page: Number },
  computed: {
    ...mapState('app', ['userinfo']),
    idx() {
      let indx = /^-?\d+$/.test(this.state) ? +this.state : 1;
      indx = indx < 0 ? 0 : indx;
      return indx > 5 ? 5 : indx;
    },
  },
  watch: {
    idx() {
      [this.data, this.finish, this.qTime] = [[], false, 0];
      this.getPublishData();
    },
    page() {
      this.getPublishData();
    },
  },
  components: { PublishItem },
  methods: {
    async getPublishData() {
      if (Date.now() - this.qTime <= 500) return;
      this.qTime = Date.now();
      const params = { userId: 0, pageIndex: this.page || 1 };
      if (this.userinfo && this.userinfo.token && this.userinfo.nbUser) {
        params.userId = this.userinfo.nbUser;
      }
      try {
        const dt = await findPublishList(this.list[this.idx], params);
        if (dt && dt.length) {
          for (let i = 0; i < dt.length; i += 1) {
            const dti = JSON.parse(JSON.stringify(dt[i]));
            dti.show = false;
            this.data.push(dti);
          }
        }
        if (!(dt && dt.length >= 20)) {
          this.$emit('finish', true);
        }
        this.finish = true;
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    [this.data, this.finish, this.qTime] = [[], false, 0];
    this.getPublishData();
  },
};
</script>

<style lang="less">
.nb-publish-body { width: 100%; padding: 0 .1rem; .nb-publish-item { margin-top: .1rem; } .publish-body-none { width: 100%; height: .6rem; font-size: .16rem; color: #909090; } }
</style>
