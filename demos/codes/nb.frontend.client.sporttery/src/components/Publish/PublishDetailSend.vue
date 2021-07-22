<template>
<div class="nb-publish-detail-send flex-between">
  <div class="nb-publish-detail-send-lt flex-between-col">
    <div class="nb-publish-detail-send-tp flex-start">
      <span class="send-title">{{sendTitle}}</span>
      <div class="send-min-box flex-center">
        <span class="send-txt">{{$t('share.minFlw')}}</span>
        <span class="send-num">{{(data.followMinBet || 0) | NumFmt}}</span>
        <span class="send-txt">{{$t('share.rmb')}}</span>
      </div>
      <div class="send-odds-box flex-center" v-if="data.ensureOdds">
        <span class="send-txt">{{$t('share.ensure')}}</span>
        <span class="send-num">{{(data.ensureOdds || 0) | NumFmt(true)}}</span>
      </div>
    </div>
    <div class="nb-publish-detail-send-btm flex-start">
      <v-touch class="detail-box flex-start" @tap="showFun">
        <publish-send-alert :color="altColor" />
        <span>{{$t('share.flwExplan')}}</span>
      </v-touch>
    </div>
  </div>
  <div class="nb-publish-detail-send-rt flex-end">
    <v-touch class="send-now-btn flex-center" @tap="flwFun">{{$t('share.flwNow')}}</v-touch>
  </div>
</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import PublishSendAlert from '@/components/Publish/PublishSendAlert';

export default {
  inheritAttrs: false,
  name: 'PublishDetailSend',
  props: { data: Object },
  computed: {
    ...mapState('app', ['userinfo', 'theme']),
    isLogin() {
      return !!(this.userinfo && this.userinfo.token && this.userinfo.nbUser);
    },
    sendTitle() {
      return this.data && /^2$/.test(this.data.betType) ? this.$t('share.flwMultiple') : this.$t('share.flwSingle');
    },
    altColor() {
      return /blue/.test(this.theme) ? '#53fffd' : '#ff5353';
    },
  },
  components: { PublishSendAlert },
  methods: {
    ...mapMutations(['changeKeyStatus', 'changeKeyObject']),
    ...mapMutations('app', ['setJumpNewObject']),
    showFun() {
      this.setJumpNewObject({ title: this.$t('share.flwExplan'), detail: this.$t('share.flwExplanDetail') });
    },
    flwFun() {
      if (!this.isLogin) {
        this.$toast(this.$t('pageBet.notLogin'));
      } else if (!this.data || !this.data.canBet) {
        this.$toast(this.$t('share.cantBet'));
      } else {
        this.changeKeyStatus(true);
        this.changeKeyObject(JSON.parse(JSON.stringify(this.data)));
      }
    },
  },
};
</script>

<style lang="less">
.nb-publish-detail-send {
  position: relative;
  width: 100%;
  height: .66rem;
  .nb-publish-detail-send-lt { width: 100%; height: 100%; padding: .1rem .15rem; }
  .nb-publish-detail-send-rt { position: absolute; width: 45%; height: 100%; padding: .1rem .15rem; top: 0; right: 0; }
  .nb-publish-detail-send-tp { width: 100%; height: .25rem; }
  .nb-publish-detail-send-btm { width: 100%; height: .16rem; }
  .send-title { font-size: .18rem; font-weight: 500; color: #2e2f34; }
  .send-min-box { height: .2rem; margin-left: .08rem; padding: 0 .08rem; border-radius: .1rem; border: .01rem solid #6eb4ff; background: rgba(110,180,255,.1); color: #6eb4ff; }
  .send-odds-box { height: .2rem; margin-left: .07rem; padding: 0 .08rem; border-radius: .1rem; border: .01rem solid #ff5353; background: rgba(255,83,83,.1); color: #ff5353; }
  .send-txt { font-size: .12rem; }
  .send-num { font-size: .14rem; font-family: DIN; }
  .detail-box span { padding-left: .04rem; font-size: .12rem; font-weight: 500; color: #aaaaaa; }
  .send-now-btn { width: 1.03rem; height: .34rem; border-radius: .04rem; font-size: .16rem; background: #ff5353; color: #ffffff; }
}
.blue .nb-publish-detail-send {
  .send-title { color: #ecebeb; }
  .send-min-box { border: .01rem solid #53fffd; background: rgba(83,255,253,.1); color: #53fffd; }
  .send-odds-box { border: .01rem solid #ff5353; background: rgba(255,83,83,.1); color: #ff5353; }
  .detail-box span { color: #777; }
  .send-now-btn { background: #00b5b3; color: #ffffff; }
}
</style>
