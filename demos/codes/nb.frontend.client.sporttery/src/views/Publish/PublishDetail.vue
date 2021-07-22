<template>
  <list-page class="publish-detail" @scrollBottom="getFlwList" v-if="!horizScreen" >
    <nav-bar :title="$t('share.pubDetail')" slot="header" @operate="shineFun" backable >
      <div class="publish-detail-t-right flex-center" v-if="showShine">{{$t('share.shinePlan')}}</div>
    </nav-bar>
    <publish-detail-head :data="data" @change="changeFun" />
    <publish-detail-match :data="matchList" />
    <publish-detail-follow-head :data="data" />
    <publish-detail-follow-body :data="list" />
    <publish-detail-send :ticketId="ticketId" :data="data" slot="footer" v-if="flwShow" />
  </list-page>
  <div class="publish-detail-horiz" v-else >
    <list-page class="publish-detail-horiz-left" >
      <nav-bar :title="$t('share.pubDetail')" slot="header" @operate="shineFun" backable >
        <div class="publish-detail-t-right flex-center" v-if="showShine">{{$t('share.shinePlan')}}</div>
      </nav-bar>
      <publish-detail-head :data="data" @change="changeFun" />
      <publish-detail-match :data="matchList" />
    </list-page>
    <list-page class="publish-detail-horiz-right" @scrollBottom="getFlwList" >
      <publish-detail-follow-head :data="data" slot="header" />
      <publish-detail-follow-body :data="list" />
      <publish-detail-send :ticketId="ticketId" :data="data" slot="footer" v-if="flwShow" />
    </list-page>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { findPublishDetail, findFollowList, findCouponList } from '@/api/activity';
import ListPage from '@/components/common/ListPage';
import NavBar from '@/components/common/NavBar';
import PublishDetailHead from '@/components/Publish/PublishDetailHead';
import PublishDetailMatch from '@/components/Publish/PublishDetailMatch';
import PublishDetailSend from '@/components/Publish/PublishDetailSend';
import PublishDetailFollowHead from '@/components/Publish/PublishDetailFollowHead';
import PublishDetailFollowBody from '@/components/Publish/PublishDetailFollowBody';

export default {
  props: { ticketId: { type: String, default: '' } },
  data() {
    return {
      data: { },
      list: [],
      page: 1,
      qTime: 0,
      finish: false,
    };
  },
  computed: {
    ...mapState({ kSub: state => state.bet.keySubSuc }),
    ...mapState('app', ['userinfo', 'horizScreen']),
    matchList() {
      return this.data && this.data.items ? this.data.items : [];
    },
    flwShow() {
      let rst = this.data && this.data.userId && this.data.follow && this.data.canBet && this.data.minBet;
      rst = rst && +this.data.minBet <= +(this.data.maxBet || 0) && this.userinfo && this.userinfo.nbUser;
      return !!(rst && `${this.data.userId}` !== `${this.userinfo.nbUser}`);
    },
    showShine() {
      const rst = this.data && this.data.share && this.userinfo && this.userinfo.nbUser;
      return !!(rst && `${this.data.userId}` === `${this.userinfo.nbUser}`);
    },
  },
  components: {
    ListPage,
    NavBar,
    PublishDetailHead,
    PublishDetailMatch,
    PublishDetailSend,
    PublishDetailFollowHead,
    PublishDetailFollowBody,
  },
  watch: {
    kSub() {
      setTimeout(() => { this.loadDetailData(); }, 100);
    },
  },
  methods: {
    ...mapMutations(['updateShineNewObj']),
    changeFun(v) {
      this.data = v;
    },
    async getPubDetail() {
      const user = this.userinfo;
      if (this.ticketId) {
        try {
          const params = { ticketId: this.ticketId, userId: user && user.nbUser ? user.nbUser : '' };
          const dt = await findPublishDetail(params);
          if (typeof dt === 'object' && dt.constructor === Array) {
            this.data = dt[0] || { };
          } else if (typeof dt === 'object' && dt.constructor !== Array) {
            this.data = dt || { };
          }
          if (this.data && this.data.remark) {
            delete this.data.remark;
          }
          [this.list, this.page, this.finish] = [[], 1, false];
          this.getFlwList();
          if (this.data && this.data.follow) {
            this.getComList();
          }
        } catch (e) {
          console.log(e);
        }
      }
    },
    async getComList() {
      if (this.userinfo && this.userinfo.nbUser && this.ticketId) {
        const params = { ticketId: this.ticketId, userId: this.userinfo.nbUser, couponType: 1 };
        try {
          const dt = await findCouponList(params);
          if (dt && dt.minBet && this.data && this.data.followMinBet) {
            dt.minBet = +dt.minBet < +this.data.followMinBet ? +this.data.followMinBet : +dt.minBet;
          }
          this.data = Object.assign({ }, this.data || { }, dt || { });
        } catch (e) {
          console.log(e);
        }
      }
    },
    async getFlwList() {
      if (this.ticketId && !this.finish && Date.now() - this.qTime > 500) {
        this.qTime = Date.now();
        try {
          const dt = await findFollowList({ ticketId: this.ticketId, pageIndex: this.page });
          this.list = this.list.concat(dt && dt.length ? dt : []);
          this.finish = !(dt && dt.length >= 20);
        } catch (e) {
          console.log(e);
        }
      }
    },
    shineFun() {
      if (this.showShine) {
        this.updateShineNewObj(this.data);
        this.$router.push(`/shinenew/${this.ticketId}`);
      }
    },
    loadDetailData() {
      [this.data, this.list] = [{ }, []];
      [this.page, this.finish] = [1, false];
      this.getPubDetail();
    },
  },
  created() {
    this.loadDetailData();
  },
};
</script>
<style lang="less">
.horizontal .publish-detail-horiz { width: 100%; height: 100%; }
.publish-detail-horiz-left { width: 3.75rem; float: left; }
.publish-detail-horiz-right { float: right; .nb-publish-detail-follow-head { border: none; } }
.publish-detail, .publish-detail-horiz-left {
  .nav-bar { border-bottom: solid 1px #ecebeb; z-index: 2; }
  .nav-content { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
  .publish-detail-t-right { width: .8rem; height: 100%; }
  .page-footer { background: #f3f3f3; box-shadow: 0 0 .2rem 0 rgba(0,0,0,.15); }
}
.blue .publish-detail, .blue .publish-detail-horiz-left {
  .nav-bar { border-bottom: solid 1px #2e2f34; }
  .page-footer { background: linear-gradient(to bottom, #3a393f, #333238); box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1); }
}
</style>
