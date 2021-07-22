<template>
  <div class="ad-promotion">
    <bet-cover-box class="ad-promotion-box" :index="999999" :show="!!promot" @close="closePromote">
      <div class="ad-promotion-body" :class="bodyClass">
        <div class="ad-promotion-amount flex-center" v-if="getActed">
          {{promot && promot.amount ? promot.amount : 0}}
        </div>
        <div class="ad-promotion-bet-amount flex-center" v-if="getActed">
          <span class="bet-amount-text">{{$t('page.needBetAmount')}}</span>
          <span class="bet-amount-num">{{promot && promot.betAmount ? promot.betAmount : 0}}</span>
          <span class="bet-amount-text">{{$t('page.betAmountYuan')}}</span>
        </div>
        <div class="ad-promotion-title flex-center" v-else>{{promot && promot.title ? promot.title : ''}}</div>
        <v-touch class="ad-promotion-button-one" v-if="!getActed" @tap="postPromo"></v-touch>
        <v-touch class="ad-promotion-button-two" v-else @tap="closePromote"></v-touch>
        <div class="ad-service flex-center">
          <span class="ad-service-text">{{$t('page.ifHasQuestion')}}</span>
          <v-touch tag="span" class="ad-service-btn" @tap="serviceFun">{{$t('page.onlineService')}}</v-touch>
          <span class="ad-service-text">{{$t('page.thanksForComp')}}</span>
        </div>
      </div>
      <div class="ad-promotion-close flex-center"><bet-cover-close /></div>
    </bet-cover-box>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { toCustomerService } from '@/utils/app/AppAdapter';
import { getPromotion, postPromotion } from '@/api/portalAgyy';
import BetCoverClose from '@/components/Bet/BetComps/BetCoverClose';
import BetCoverBox from '@/components/Bet/BetComps/BetCoverBox';

export default {
  data() {
    return { promot: null, getActed: false, getSucc: false };
  },
  computed: {
    ...mapState('app', ['userinfo', 'showProto']),
    bodyClass() {
      return this.getActed ? 'promotion-body-two' : 'promotion-body-one';
    },
  },
  components: { BetCoverClose, BetCoverBox },
  methods: {
    ...mapMutations('app', ['setShowProto']),
    serviceFun() {
      toCustomerService(this);
    },
    async getPromotionPre() {
      [this.promot, this.getActed, this.getSucc] = [null, false, false];
      try {
        const rtn = await getPromotion({ userSource: 'NB' });
        this.promot = rtn || null;
        if (this.promot) {
          const title = `${this.promot.remarks || ''}||||`.split('|')[1] || this.$t('page.hasOnePackage');
          this.promot.title = /^TJHYLJ$/i.test(this.promot.type) ? this.$t('page.invitePackage') : title;
        }
      } catch (e) {
        console.log(e);
      }
    },
    postPromo() {
      setTimeout(this.postPromotionPre, 150);
    },
    async postPromotionPre() {
      if (this.promot && this.promot.id && !this.getActed) {
        [this.getActed, this.getSucc] = [true, false];
        try {
          await postPromotion({ requestId: this.promot.id });
          this.getSucc = true;
        } catch (e) {
          console.log(e);
        }
      }
    },
    closePromote() {
      this.promot = null;
      this.setShowProto(true);
    },
  },
  mounted() {
    const pSet = window.NBConfig.PORTAL_SETTING;
    const show = !(pSet && pSet.USER_CENTER_URL);
    if (show && this.userinfo && this.userinfo.token && !this.showProto) {
      this.getPromotionPre();
    }
  },
};
</script>
<style lang="less">
.ad-promotion-box .nb-bet-public-box-body {
  top: 1.6rem;
  .ad-promotion-body {
    position: relative;
    border-radius: .1rem;
    width: 3.5rem;
    margin: 0 auto;
    .ad-promotion-amount {
      position: absolute;
      width: auto;
      height: .5rem;
      right: 1.4rem;
      top: .48rem;
      color: #fee8d1;
      font-size: .38rem;
      font-weight: 500;
      font-family: 'Arial Rounded MT';
    }
    .ad-promotion-bet-amount {
      position: absolute;
      width: 100%;
      height: .24rem;
      left: 0;
      top: 1.14rem;
      padding-left: .18rem;
      .bet-amount-text { font-size: .1rem; color: #ffc26f; }
      .bet-amount-num { font-size: .1rem; color: #fff; padding: 0 .05rem; }
    }
    .ad-promotion-title {
      position: absolute;
      width: 100%;
      height: .5rem;
      left: 0;
      top: .25rem;
      padding-left:.36rem;
      color: #fee8d1;
      font-size: .18rem;
      font-weight: bold;
      letter-spacing: .02rem;
      font-family: 'Arial Rounded MT';
      text-shadow: 0 0.01rem 0.03rem #fee8d1;
    }
    .ad-promotion-button-one {
      position: absolute;
      width: .95rem;
      height: .95rem;
      left: 1.37rem;
      top: .71rem;
      border-radius: 100%;
      background: transparent;
    }
    .ad-promotion-button-two {
      position: absolute;
      width: 1.44rem;
      height: .48rem;
      left: 1.11rem;
      top: 1.9rem;
      border-radius: .06rem;
      background: transparent;
    }
    .ad-service {
      position: absolute;
      width: 100%;
      height: .38rem;
      bottom: 0;
      padding-left: .2rem;
      .ad-service-text { font-size: .12rem; color: #ffc26f; }
      .ad-service-btn { font-size: .12rem; color: #fff; text-decoration: underline; }
    }
  }
  .promotion-body-one {
    height: 2.26rem;
    background: url(./img/RedPackage-1.png) no-repeat, transparent;
    background-size: 100% 100%;
  }
  .promotion-body-two {
    height: 2.8rem;
    background: url(./img/RedPackage-2.png) no-repeat, transparent;
    background-size: 100% 100%;
  }
  .ad-promotion-close {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -.72rem;
    height: .72rem;
  }
}
.horizontal .ad-promotion-box .nb-bet-public-box-body { top: .1rem; }
</style>
