<template>
  <list-page class="x-member" v-if="!horizScreen" >
    <nav-bar title="我的" slot="header" />
    <div class="info-box">
      <introduction :member-info="memberInfo" />
    </div>
    <menus-first />
    <menus-second />
    <menus-third />
  </list-page>
  <div class="x-member-horiz" v-else >
    <list-page class="x-member-horiz-left" >
      <nav-bar title="我的" slot="header" />
      <div class="info-box">
        <introduction :member-info="memberInfo" />
      </div>
      <menus-first />
    </list-page>
    <list-page class="x-member-horiz-right" >
      <menus-second />
      <menus-third />
    </list-page>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { getBetBalance } from '@/api/bet';
import Introduction from '@/components/XSports/Xmember/Introduction';
import MenusFirst from '@/components/XSports/Xmember/MenusFirst';
import MenusSecond from '@/components/XSports/Xmember/MenusSecond';
import MenusThird from '@/components/XSports/Xmember/MenusThird';

export default {
  components: {
    Introduction,
    MenusFirst,
    MenusSecond,
    MenusThird,
  },
  data() {
    return {
      member: null,
    };
  },
  created() {
    this.initMemberinfo();
    this.showTeachNew();
  },
  computed: {
    ...mapState('app', ['isLoged', 'userinfo', 'teachSets', 'horizScreen']),
    ...mapState('member', ['memberInfo']),
  },
  watch: {
    isLoged(n) {
      if (n) {
        this.initMemberinfo();
      }
    },
  },
  methods: {
    ...mapMutations('app', ['setUserinfo', 'setTeachList']),
    ...mapActions('member', ['loadMemberInfo']),
    async initMemberinfo() {
      if (!this.isLoged) {
        return;
      }
      this.loadMemberInfo();
      if (this.isLoged) {
        const balance = await getBetBalance();
        this.setUserinfo({
          ...this.userinfo,
          ...balance,
        });
      }
    },
    showTeachNew() {
      if (this.userinfo && this.userinfo.token && this.teachSets && !this.teachSets[3]) {
        this.setTeachList({
          id: 3,
          data: [
            { bottom: 'bt_41.jpg', cover: 'cv_41.png', height: '' },
            { bottom: 'bt_42.jpg', cover: 'cv_42.png', height: '' },
            { bottom: 'bt_43.jpg', cover: 'cv_43.png', height: '' },
            { bottom: 'bt_44.jpg', cover: 'cv_44.png', height: '' },
            { bottom: 'bt_45.jpg', cover: 'cv_45.png', height: '' },
            { bottom: 'bt_46.jpg', cover: 'cv_46.png', height: '' },
          ],
        });
      }
    },
  },
};
</script>
<style lang="less">
.horizontal .x-member-horiz { width: 100%; height: 100%; }
.x-member-horiz-left { width: 3.75rem; float: left; }
.x-member-horiz-right { float: right; padding: .05rem; }
.x-member, .x-member-horiz-left {
  a { color:  #2e2f34; }
  .info-box {
    background: #fff;
    box-shadow: 0 .1rem .2rem 0 rgba(0,0,0,.03);
  }
}
.blue .x-member, .blue .x-member-horiz-left {
  a { color:  #ecebeb; }
  .info-box {
    box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1);
    background: linear-gradient(to bottom, #3a393f, #333238);
  }
}
</style>
