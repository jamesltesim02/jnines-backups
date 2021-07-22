<template>
  <list-page class="focus-fans" v-if="!horizScreen" :noPadding="!!type" @scrollBottom="getFocusFansFun" >
    <nav-bar :title="title" slot="header" backable />
    <rank-item v-for="(v, k) in data" :key="k" :num="k" :data="v" @change="changeFun" hide />
  </list-page>
  <div class="focus-fans-horiz" v-else >
    <list-page class="focus-fans-horiz-left" >
      <nav-bar :title="title" slot="header" backable />
    </list-page>
    <list-page class="focus-fans-horiz-right" @scrollBottom="getFocusFansFun" >
      <rank-item v-for="(v, k) in data" :key="k" :num="k" :data="v" @change="changeFun" hide />
    </list-page>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { getFocusFans } from '@/api/activity';
import ListPage from '@/components/common/ListPage';
import NavBar from '@/components/common/NavBar';
import RankItem from '@/components/Rank/RankItem';

export default {
  props: { type: { type: Number, default: 0 } },
  data() {
    return { data: [], page: 1, finish: false };
  },
  computed: {
    ...mapState('app', ['userinfo', 'horizScreen']),
    noLogin() {
      return !(this.userinfo && this.userinfo.token && this.userinfo.nbUser);
    },
    title() {
      return !this.type ? this.$t('share.fansStr') : this.$t('share.focusStr');
    },
    fanUrl() {
      return !this.type ? 'getFansByUserId' : 'getFocusByUserId';
    },
  },
  components: { ListPage, NavBar, RankItem },
  methods: {
    changeFun(v) {
      for (let i = 0; i < this.data.length; i += 1) {
        if (`${this.data[i].userId}` === `${v.userId}` && this.type) {
          this.data.splice(i, 1);
        } else if (`${this.data[i].userId}` === `${v.userId}`) {
          this.$set(this.data, i, v);
        }
      }
    },
    async getFocusFansFun() {
      if (this.userinfo && this.userinfo.token && this.userinfo.nbUser) {
        const params = { userId: this.userinfo.nbUser, pageIndex: this.page };
        try {
          const dt = await getFocusFans(this.fanUrl, params);
          this.data = this.data.concat(dt && dt.length ? dt : []);
          this.finish = !(dt && dt.length >= 20);
        } catch (e) {
          console.log(e);
        }
      }
    },
  },
  mounted() {
    [this.data, this.page, this.finish] = [[], 1, false];
    this.getFocusFansFun();
  },
};
</script>
<style lang="less">
.horizontal .focus-fans-horiz { width: 100%; height: 100%; }
.focus-fans-horiz-left { width: 3.75rem; float: left; }
.focus-fans-horiz-right { float: right; .nb-focus-fans-foot { margin-top: .1rem; } }
.focus-fans, .focus-fans-horiz-left {
  .nav-bar { border-bottom: solid 1px #ecebeb; z-index: 2; }
  .nav-content { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
}
.focus-fans .page-content, .focus-fans-horiz .page-content { padding: 0 .1rem .1rem .1rem; }
.blue .focus-fans, .blue .focus-fans-horiz-left {
  .nav-bar { border-bottom: solid 1px #2e2f34; }
}
</style>
