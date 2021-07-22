<template>
  <list-page
    class="x-specialist"
    @scroll="pageScroll"
    @scrollBottom="queryNextHistory"
    v-if="!horizScreen"
  >
    <div class="x-special-head" slot="header">
      <nav-bar :title="title" />
      <special-select :type="type" :transparent="transparent" />
    </div>
    <div class="info-box">
      <introduction
        simplify
        :member-info="member"
        @followStateChange="followStateChange"
      />
      <achievement :member-info="specialist" />
    </div>
    <trend :tickets="tickets" />
    <special-select :type="type" />
    <div class="x-special-body" :style="bodyStyle" >
      <programs
        :programs="activePrograms"
        :type="type"
        v-if="!type"
      />
      <programs
        :programs="historyPrograms"
        :type="type"
        v-else
      />
    </div>
  </list-page>
  <div class="x-specialist-horiz" v-else >
    <list-page class="x-specialist-horiz-left" >
      <nav-bar :title="title" slot="header" />
      <div class="info-box">
        <introduction
          simplify
          :member-info="member"
          @followStateChange="followStateChange"
        />
        <achievement :member-info="specialist" />
      </div>
      <trend :tickets="tickets" />
    </list-page>
    <list-page
      class="x-specialist-horiz-right"
      @scrollBottom="queryNextHistory"
    >
      <special-select :type="type" slot="header" />
      <div class="x-special-body" >
        <programs
          :programs="activePrograms"
          :type="type"
          v-if="!type"
        />
        <programs
          :programs="historyPrograms"
          :type="type"
          v-else
        />
      </div>
    </list-page>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { getMemberByUser, getHistoryPlansByUser } from '@/api/activity';
import Introduction from '@/components/XSports/Xmember/Introduction';
import Achievement from '@/components/XSports/Xmember/Specialist/Achievement';
import Trend from '@/components/XSports/Xmember/Specialist/Trend';
import Programs from '@/components/XSports/Xmember/Specialist/Programs';
import SpecialSelect from '@/components/XSports/Xmember/Specialist/SpecialSelect';

export default {
  props: { userId: {}, type: Number },
  data() {
    return {
      specialist: {},
      tickets: [],
      activePrograms: [],
      historyPrograms: [],
      pageIndex: 1,
      loading: false,
      hasMore: true,
      scrollTop: 0,
      bodyStyle: { },
      transparent: true,
    };
  },
  computed: {
    ...mapState('app', ['isLoged', 'userinfo', 'horizScreen', 'tabHeight']),
    ...mapState('member', ['memberInfo']),
    member() {
      if (this.isLoged && this.userinfo.nbUser === this.userId) {
        return this.memberInfo;
      }
      return this.specialist;
    },
    title() {
      if (this.isLoged && this.userinfo.nbUser === this.userId) {
        return `${this.$t('share.me')}${this.$t('share.plans')}`;
      }
      if (this.member && this.member.nickName) {
        return `${this.member.nickName}${this.$t('share.plans')}`;
      }
      const str = this.member && this.member.userId ? `${this.member.userId}`.slice(0, 8) : this.$t('share.expert');
      return `${str}${this.$t('share.plans')}`;
    },
    rout() {
      return this.$route.path;
    },
  },
  watch: {
    tabHeight() {
      this.setMinHeight();
    },
    loading() {
      this.setMinHeight();
    },
    rout(n, o) {
      this.scrollTop = 0;
      this.setMinHeight();
      if (/specialist\//i.test(n) && !/specialist\//i.test(o)) {
        this.initFun();
      }
    },
  },
  components: {
    Introduction,
    Achievement,
    Trend,
    Programs,
    SpecialSelect,
  },
  created() {
    this.initFun();
  },
  methods: {
    initFun() {
      if (!this.userId) {
        this.$router.go(-1);
        return;
      }
      this.specialist = { };
      this.tickets = [];
      this.activePrograms = [];
      this.historyPrograms = [];
      this.pageIndex = 1;
      this.loading = false;
      this.hasMore = true;
      this.loadSpecialist();
      this.queryHistoryProgram();
    },
    async loadSpecialist() {
      const result = await getMemberByUser({
        userId: this.userId,
        myUserId: this.isLoged ? this.userinfo.nbUser : null,
      });
      this.specialist = result.memberInfo;
      this.tickets = result.tickets;
      this.activePrograms = result.activePlans || [];
    },
    async queryHistoryProgram(pageIndex = 1) {
      try {
        this.loading = true;
        const programs = await getHistoryPlansByUser({
          userId: this.userId,
          pageIndex,
        });
        if (!programs || !programs.length) {
          this.hasMore = false;
          return;
        }
        this.pageIndex = pageIndex;
        this.historyPrograms.push(...programs);
      } finally {
        this.loading = false;
      }
    },
    queryNextHistory() {
      if (this.hasMore && !this.loading && this.type) {
        this.queryHistoryProgram(this.pageIndex + 1);
      }
    },
    followStateChange(state) {
      this.specialist.focus = state;
    },
    pageScroll(e) {
      const top = e && e.target && e.target.scrollTop ? e.target.scrollTop : 0;
      const info = this.$el.querySelector('.info-box');
      const trend = this.$el.querySelector('.x-trend');
      const iHeight = info ? info.clientHeight : 0;
      const tHeight = trend ? trend.clientHeight : 0;
      const tTop = trend ? parseFloat(window.getComputedStyle(trend).marginTop) : 0;
      const tBtm = trend ? parseFloat(window.getComputedStyle(trend).marginBottom) : 0;
      const height = iHeight + tHeight + tTop + tBtm;
      [this.scrollTop, this.transparent] = [top, top < height];
    },
    setMinHeight() {
      setTimeout(() => {
        const nav = this.$el.querySelector('.nav-bar');
        const cont = this.$el.querySelector('.page-content');
        const foot = this.$el.querySelector('.page-footer');
        const select = this.$el.querySelector('.x-select');
        const contBottom = cont ? parseFloat(window.getComputedStyle(cont).paddingBottom) : 0;
        const footBottom = foot ? parseFloat(window.getComputedStyle(foot).paddingBottom) : 0;
        const selHeight = select ? select.clientHeight : 0;
        const navHeight = nav ? nav.clientHeight : 0;
        const height = window.innerHeight - contBottom - footBottom - selHeight - navHeight;
        this.bodyStyle = { minHeight: `${height}px` };
        this.pageScroll({ target: { scrollTop: this.scrollTop } });
      }, 100);
    },
  },
  mounted() {
    this.scrollTop = 0;
    this.setMinHeight();
  },
};
</script>
<style lang="less">
.horizontal .x-specialist-horiz { width: 100%; height: 100%; }
.x-specialist-horiz-left { width: 3.75rem; float: left; }
.x-specialist-horiz-right { float: right; .x-special-body { padding-top: .15rem; } }
.x-specialist, .x-specialist-horiz-left {
  .info-box {
    background: #fff;
    box-shadow: 0 .1rem .2rem 0 rgba(0,0,0,.03);
  }
  .x-special-body { padding-top: .15rem; }
}
.blue .x-specialist, .blue .x-specialist-horiz-left {
  .info-box {
    box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1);
    background: linear-gradient(to bottom, #3a393f, #333238);
  }
}
.x-specialist .page-content { margin-top: -.4rem; }
</style>
