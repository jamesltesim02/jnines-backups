<template>
  <div class="nb-shine-body" v-if="data && data.length" >
    <shine-item :data="v" :type="idx" v-for="(v, k) in  data" :key="k" />
  </div>
  <div class="nb-shine-body" v-else-if="finish" >
    <div class="shine-body-none flex-center">{{$t('share.noShine')}}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { findShineList } from '@/api/activity';
import ShineItem from '@/components/Shine/ShineItem';

export default {
  inheritAttrs: false,
  name: 'ShineBody',
  data() {
    return {
      data: [],
      qTime: 0,
      finish: false,
      list: ['getNewestShare', 'getBetAmountShare', 'getBetOddsShare', 'getReturnShare', 'getFollowShare'],
    };
  },
  props: { state: Number, page: Number },
  computed: {
    ...mapState('app', ['userinfo']),
    idx() {
      let indx = /^-?\d+$/.test(this.state) ? +this.state : 0;
      indx = indx < 0 ? 0 : indx;
      return indx > 4 ? 4 : indx;
    },
  },
  watch: {
    idx() {
      [this.data, this.finish, this.qTime] = [[], false, 0];
      this.getShareData();
    },
    page() {
      this.getShareData();
    },
  },
  components: { ShineItem },
  methods: {
    async getShareData() {
      if (Date.now() - this.qTime <= 500) return;
      this.qTime = Date.now();
      const params = { userId: 0, pageIndex: this.page || 1 };
      if (this.userinfo && this.userinfo.token && this.userinfo.nbUser) {
        params.userId = this.userinfo.nbUser;
      }
      try {
        const dt = await findShineList(this.list[this.idx], params);
        if (dt && dt.length) {
          for (let i = 0; i < dt.length; i += 1) {
            this.data.push(dt[i]);
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
    this.getShareData();
  },
};
</script>

<style lang="less">
.nb-shine-body { width: 100%; padding: 0 .1rem; .nb-shine-item { margin-top: .15rem; } .shine-body-none { width: 100%; height: .6rem; font-size: .16rem; color: #909090; } }
</style>
