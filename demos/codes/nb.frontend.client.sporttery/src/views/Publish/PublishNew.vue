<template>
  <list-page class="publish-new" v-if="!horizScreen" :noPadding="!!type" >
    <nav-bar :title="title" slot="header" backable />
    <publish-new-body :data="params" :odds="odds" @change="changeFun" v-if="!type" />
    <publish-new-foot :data="params" @change="changeFun" v-if="!type" />
    <publish-detail-head :data="headData" v-if="type" />
    <publish-detail-match :data="ticketArr" v-if="type" />
    <publish-detail-follow-head :data="flwHeadData" v-if="type" />
    <publish-detail-follow-body :data="flwListData" v-if="type" />
    <publish-detail-foot :data="params" slot="footer" v-if="type" />
  </list-page>
  <div class="publish-new-horiz" v-else >
    <list-page class="publish-new-horiz-left" >
      <nav-bar :title="title" slot="header" backable />
      <publish-new-body :data="params" :odds="odds" @change="changeFun" v-if="!type" />
      <publish-detail-head :data="headData" v-if="type" />
      <publish-detail-match :data="ticketArr" v-if="type" />
    </list-page>
    <list-page class="publish-new-horiz-right" >
      <publish-new-foot :data="params" @change="changeFun" v-if="!type" />
      <publish-detail-follow-head :data="flwHeadData" slot="header" v-if="type" />
      <publish-detail-follow-body :data="flwListData" v-if="type" />
      <publish-detail-foot :data="params" slot="footer" v-if="type" />
    </list-page>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { getMemberInfo } from '@/api/activity';
import ListPage from '@/components/common/ListPage';
import NavBar from '@/components/common/NavBar';
import PublishNewBody from '@/components/Publish/PublishNewBody';
import PublishNewFoot from '@/components/Publish/PublishNewFoot';
import PublishDetailHead from '@/components/Publish/PublishDetailHead';
import PublishDetailMatch from '@/components/Publish/PublishDetailMatch';
import PublishDetailFollowHead from '@/components/Publish/PublishDetailFollowHead';
import PublishDetailFollowBody from '@/components/Publish/PublishDetailFollowBody';
import PublishDetailFoot from '@/components/Publish/PublishDetailFoot';

export default {
  props: { mstid: { type: String, default: '' }, odds: { type: String, default: '' }, type: Number },
  data() {
    return {
      userData: { },
      flwListData: [],
      params: Object.assign({ title: '', remark: '', isRake: true }, { ticketId: '', minBetAmount: 500, guaranteeOdds: 0 }),
    };
  },
  computed: {
    ...mapState('app', ['userinfo', 'horizScreen']),
    ...mapState({ betTicket: state => state.bet.betTicket }),
    noLogin() {
      return !(this.userinfo && this.userinfo.token && this.userinfo.nbUser);
    },
    title() {
      return !this.type ? this.$t('share.publishNew') : this.$t('share.pubDetail');
    },
    headData() {
      return Object.assign({ }, this.userData || { }, this.params || { });
    },
    flwHeadData() {
      return Object.assign({ }, this.betTicket || { }, this.params || { });
    },
    ticketArr() {
      return this.betTicket && this.betTicket.opts ? this.betTicket.opts : [];
    },
  },
  watch: {
    type() {
      this.initFun();
    },
  },
  components: {
    ListPage,
    NavBar,
    PublishNewBody,
    PublishNewFoot,
    PublishDetailHead,
    PublishDetailMatch,
    PublishDetailFollowHead,
    PublishDetailFollowBody,
    PublishDetailFoot,
  },
  methods: {
    ...mapMutations(['updateTicket']),
    changeFun(v) {
      if (JSON.stringify(v) !== JSON.stringify(this.params)) {
        this.params = JSON.parse(JSON.stringify(v));
      }
    },
    async getMemInfo() {
      if (this.userinfo && this.userinfo.token && this.userinfo.nbUser) {
        try {
          const dt = await getMemberInfo(this.userinfo.nbUser);
          this.userData = dt || { };
        } catch (e) {
          console.log(e);
        }
      }
    },
    initFun() {
      this.params.ticketId = this.mstid || '';
      if (!/^.{5,20}$/.test(this.params.title) || (this.params.remark && !/^.{10,30}$/.test(this.params.remark))) {
        this.$router.replace(`/publishnew/${this.mstid}/${this.odds}/0`);
      }
      if (this.noLogin || !this.betTicket || `${this.betTicket.mstid}` !== `${this.mstid}`) {
        this.updateTicket();
        this.$router.go(-1);
      }
      if (!this.type) {
        [this.params.minBetAmount, this.params.guaranteeOdds] = [500, 0];
        [this.params.title, this.params.remark, this.params.isRake] = ['', '', true];
      }
    },
  },
  mounted() {
    this.getMemInfo();
    this.initFun();
  },
};
</script>
<style lang="less">
.horizontal .publish-new-horiz { width: 100%; height: 100%; }
.publish-new-horiz-left { width: 3.75rem; float: left; }
.publish-new-horiz-right { float: right; .nb-publish-new-foot { margin-top: .1rem; } }
.publish-new, .publish-new-horiz-left {
  .nav-bar { border-bottom: solid 1px #ecebeb; z-index: 2; }
  .nav-content { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
}
.blue .publish-new, .blue .publish-new-horiz-left {
  .nav-bar { border-bottom: solid 1px #2e2f34; }
}
</style>
