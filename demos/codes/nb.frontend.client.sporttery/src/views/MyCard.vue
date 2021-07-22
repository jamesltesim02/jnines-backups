<template>
  <list-page class="my-card" v-if="!horizScreen" @scrollBottom="loadData" >
    <card-head :state="state" slot="header" />
    <card-body :state="state" :data="data" />
  </list-page>
  <div class="my-card-horiz" v-else >
    <list-page class="my-card-horiz-left" >
      <card-head :state="state" slot="header" />
    </list-page>
    <list-page class="my-card-horiz-right" @scrollBottom="loadData" >
      <card-body :state="state" :data="data" />
    </list-page>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { findMyCouponList } from '@/api/activity';
import CardHead from '@/components/Card/CardHead';
import CardBody from '@/components/Card/CardBody';

export default {
  data() {
    return {
      loading: false,
      finish: false,
      size: 20,
      page: 1,
      data: [],
    };
  },
  props: { state: { type: Number, default: 0 } },
  computed: {
    ...mapState('app', ['horizScreen', 'userinfo']),
  },
  watch: {
    state() {
      this.initData();
    },
  },
  components: { CardHead, CardBody },
  methods: {
    async loadData() {
      if (this.userinfo && this.userinfo.token && this.userinfo.nbUser && !this.loading && !this.finish) {
        const params = { userId: this.userinfo.nbUser, state: this.state ? 0 : 1 };
        [params.pageSize, params.pageIndex] = [this.size, this.page];
        this.loading = true;
        try {
          const dt = await findMyCouponList(params);
          this.data = this.data.concat(dt && dt.length ? dt : []);
          this.finish = !(dt && dt.length && dt.length >= this.size);
          this.page += this.finish ? 0 : 1;
        } catch (ev) {
          console.log(ev);
        } finally {
          this.loading = false;
        }
      }
    },
    initData() {
      [this.data, this.page] = [[], 1];
      [this.loading, this.finish] = [false, false];
      this.loadData();
    },
  },
  mounted() {
    this.initData();
  },
};
</script>
<style lang="less">
.horizontal .my-card-horiz { width: 100%; height: 100%; }
.my-card-horiz-left { width: 3.75rem; float: left; }
.my-card-horiz-right { padding-top: .05rem; float: right; }
.my-card, .my-card-horiz-left {
  .nav-bar {
    border-bottom: solid 1px #ecebeb;
    z-index: 2;
    .nav-content { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
    .opr-others span { padding: 0 .1rem; font-size: .14rem; }
  }
}
.blue .my-card, .blue .my-card-horiz-left {
  .nav-bar { border-bottom: solid 1px #2e2f34; }
}
</style>
