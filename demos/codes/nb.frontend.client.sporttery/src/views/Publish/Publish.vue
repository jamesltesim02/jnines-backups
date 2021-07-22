<template>
  <list-page class="publish" v-if="!horizScreen" @scrollBottom="scrollToNextPage" >
    <div slot="header">
      <nav-tabbar />
      <publish-head />
      <publish-title :state="state" @change="changeState" />
    </div>
    <publish-body :state="state" :page="pageId" @finish="finishFun" />
  </list-page>
  <div class="publish-horiz" v-else >
    <list-page class="publish-horiz-left" >
      <div slot="header">
        <nav-tabbar />
        <publish-head />
        <publish-title :state="state" @change="changeState" />
      </div>
    </list-page>
    <list-page class="publish-horiz-right" @scrollBottom="scrollToNextPage" >
      <publish-body :state="state" :page="pageId" @finish="finishFun" />
    </list-page>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import NavTabbar from '@/components/XSports/NavTabbar';
import PublishHead from '@/components/Publish/PublishHead';
import PublishTitle from '@/components/Publish/PublishTitle';
import PublishBody from '@/components/Publish/PublishBody';

export default {
  props: { state: { type: Number, default: 1 } },
  data() {
    return { pageId: 1, finish: false };
  },
  computed: {
    ...mapState('app', ['horizScreen', 'userinfo', 'teachSets']),
  },
  components: {
    NavTabbar,
    PublishHead,
    PublishTitle,
    PublishBody,
  },
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
      this.$router.replace(`/publish/${v}`);
    },
    showTeachNew() {
      if (this.userinfo && this.userinfo.token && this.teachSets && !this.teachSets[1]) {
        this.setTeachList({
          id: 1,
          data: [
            { bottom: 'bt_21.jpg', cover: 'cv_21.png', height: '' },
            { bottom: 'bt_22.jpg', cover: 'cv_22.png', height: '.66rem' },
            { bottom: 'bt_23.jpg', cover: 'cv_23.png', height: '4.03rem' },
            { bottom: 'bt_24.jpg', cover: 'cv_24.png', height: '4.03rem' },
            { bottom: 'bt_25.jpg', cover: 'cv_25.png', height: '4.03rem' },
            { bottom: 'bt_26.jpg', cover: 'cv_26.png', height: '' },
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
.horizontal .publish-horiz { width: 100%; height: 100%; }
.publish-horiz-left { width: 3.75rem; float: left; }
.publish-horiz-right { padding-top: .05rem; float: right; }
.publish, .publish-horiz-left {
  .nav-bar {
    border-bottom: solid 1px #ecebeb;
    z-index: 2;
    .nav-content { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
  }
}
.blue .publish, .blue .publish-horiz-left {
  .nav-bar { border-bottom: solid 1px #2e2f34; }
}
</style>
