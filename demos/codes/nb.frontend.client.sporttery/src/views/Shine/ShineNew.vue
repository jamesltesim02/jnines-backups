<template>
  <list-page class="shine-new" v-if="!horizScreen" >
    <nav-bar :title="$t('share.shineOut')" slot="header" @operate="shineOutFun" backable >
      <div class="shine-new-t-right flex-center">{{$t('share.frmPublish')}}</div>
    </nav-bar>
    <shine-new-body :data="params" />
  </list-page>
  <div class="shine-new-horiz" v-else >
    <list-page class="shine-new-horiz-left" >
      <nav-bar :title="$t('share.shineOut')" slot="header" @operate="shineOutFun" backable >
        <div class="shine-new-t-right flex-center">{{$t('share.frmPublish')}}</div>
      </nav-bar>
    </list-page>
    <list-page class="shine-new-horiz-right" >
      <shine-new-body :data="params" />
    </list-page>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { shinePlan } from '@/api/activity';
import ListPage from '@/components/common/ListPage';
import NavBar from '@/components/common/NavBar';
import ShineNewBody from '@/components/Shine/ShineNewBody';

export default {
  props: { ticketId: { type: String, default: '' } },
  data() {
    return {
      params: {
        shareTitle: '',
        shareRemark: '',
        ticketId: '',
        userId: '',
      },
    };
  },
  computed: {
    ...mapState({ shineObj: state => state.bet.shineNewObj }),
    ...mapState('app', ['userinfo', 'horizScreen']),
    isLogin() {
      return !!(this.userinfo && this.userinfo.token && this.userinfo.nbUser);
    },
  },
  components: { ListPage, NavBar, ShineNewBody },
  methods: {
    ...mapMutations(['setFinishTask']),
    shineSucFun() {
      const content = this;
      this.setFinishTask({
        title: content.$t('share.shineSucc'),
        detail: [{
          text: content.$t('share.shiDetailOne'),
          style: { fontSize: '.2rem', fontWeight: 500 },
        }, {
          text: content.$t('share.shiDetailTwo'),
          style: { fontSize: '.2rem', fontWeight: 500 },
        }],
        button: {
          text: content.$t('share.shiGetNow'),
          fun: () => {
            content.$router.push('/reward');
          },
        },
      });
    },
    async shineOutFun() {
      if (!this.isLogin) {
        this.$toast(this.$t('pageBet.notLogin'));
        this.$router.go(-1);
      } else if (!this.params.ticketId) {
        this.$toast(this.$t('pageBet.ticketErr'));
        this.$router.go(-1);
      } else if (!/^.{5,20}$/.test(this.params.shareTitle)) {
        this.$toast(this.$t('share.pubTitleError'));
      } else if (this.params.shareRemark && !/^.{10,30}$/.test(this.params.shareRemark)) {
        this.$toast(this.$t('share.pubDetailError'));
      } else {
        try {
          await shinePlan(this.params);
          this.shineSucFun();
        } catch (ev) {
          console.log(ev);
        }
      }
    },
  },
  mounted() {
    this.params.ticketId = this.ticketId || '';
    this.params.userId = this.isLogin ? this.userinfo.nbUser : '';
    if (this.shineObj) {
      const title = this.shineObj.planTitle || this.shineObj.title || this.shineObj.shareTitle;
      const remark = this.shineObj.planRemarks || this.shineObj.remark || this.shineObj.shareRemark;
      this.params.shareTitle = title || this.params.shareTitle;
      this.params.shareRemark = remark || this.params.shareRemark;
    }
  },
};
</script>
<style lang="less">
.horizontal .shine-new-horiz { width: 100%; height: 100%; }
.shine-new-horiz-left { width: 3.75rem; float: left; }
.shine-new-horiz-right { float: right; .nb-shine-new-foot { margin-top: .1rem; } }
.shine-new, .shine-new-horiz-left {
  .nav-bar { border-bottom: solid 1px #ecebeb; z-index: 2; }
  .nav-content { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
  .shine-new-t-right { width: .64rem; height: 100%; }
}
.blue .shine-new, .blue .shine-new-horiz-left {
  .nav-bar { border-bottom: solid 1px #2e2f34; }
}
</style>
