<template>
  <list-page class="shine" v-if="!horizScreen" @scrollBottom="scrollToNextPage" >
    <div slot="header">
      <nav-tabbar />
      <shine-title :state="state" @change="changeState" />
    </div>
    <shine-body :state="state" :page="pageId" @finish="finishFun" />
  </list-page>
  <div class="shine-horiz" v-else >
    <list-page class="shine-horiz-left" >
      <div slot="header">
        <nav-tabbar />
        <shine-title :state="state" @change="changeState" />
      </div>
    </list-page>
    <list-page class="shine-horiz-right" @scrollBottom="scrollToNextPage" >
      <shine-body :state="state" :page="pageId" @finish="finishFun" />
    </list-page>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import NavTabbar from '@/components/XSports/NavTabbar';
import ShineTitle from '@/components/Shine/ShineTitle';
import ShineBody from '@/components/Shine/ShineBody';

export default {
  props: { state: { type: Number, default: 0 } },
  data() {
    return { pageId: 1, finish: false };
  },
  computed: {
    ...mapState('app', ['horizScreen', 'userinfo', 'teachSets']),
  },
  components: { NavTabbar, ShineTitle, ShineBody },
  methods: {
    ...mapMutations('app', ['setTeachList']),
    finishFun() {
      this.finish = true;
    },
    scrollToNextPage() {
      this.pageId += this.finish ? 0 : 1;
    },
    changeState(v) {
      [this.pageId, this.finish] = [1, false];
      this.$router.replace(`/shine/${v}`);
    },
    showTeachNew() {
      if (this.userinfo && this.userinfo.token && this.teachSets && !this.teachSets[2]) {
        this.setTeachList({
          id: 2,
          data: [
            { bottom: 'bt_31.jpg', cover: 'cv_31.png', height: '' },
            { bottom: 'bt_32.jpg', cover: 'cv_32.png', height: '' },
            { bottom: 'bt_33.jpg', cover: 'cv_33.png', height: '' },
            { bottom: 'bt_34.jpg', cover: 'cv_34.png', height: '' },
          ],
        });
      }
    },
  },
  created() {
    [this.pageId, this.finish] = [1, false];
    this.showTeachNew();
  },
};
</script>
<style lang="less">
.horizontal .shine-horiz { width: 100%; height: 100%; }
.shine-horiz-left { width: 3.75rem; float: left; }
.shine-horiz-right { padding-top: .05rem; float: right; }
.shine, .shine-horiz-left {
  .nav-bar {
    border-bottom: solid 1px #ecebeb;
    z-index: 2;
    .nav-content { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
  }
}
.blue .shine, .blue .shine-horiz-left {
  .nav-bar { border-bottom: solid 1px #2e2f34; }
}
</style>
