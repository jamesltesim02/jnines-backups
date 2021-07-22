<template>
  <bet-cover-box class="nb-bet-jump-page" :index="399999" :show="show" @close="closeFun">
    <div class="jump-page-body">
      <div class="body-alerts">
        <div class="body-blank"></div>
        <div class="title-box flex-center-col" v-if="title.length > 1">
          <div class="body-title flex-center" v-for="(v, k) in title" :key="k">{{v}}</div>
        </div>
        <div class="title-box flex-center-col" v-else>
          <div class="body-title-big flex-center" v-for="(v, k) in title" :key="k">{{v}}</div>
        </div>
      </div>
      <div class="body-btns flex-center">
        <v-touch tag="div" class="body-btn-cancel flex-center" @tap="closeFun">{{$t('pageBet.think')}}</v-touch>
        <v-touch tag="div" class="body-btn-submit flex-center" @tap="jumpFun">{{data && data.btn ? data.btn : ''}}</v-touch>
      </div>
    </div>
    <div class="jump-page-close flex-center"><bet-cover-close /></div>
  </bet-cover-box>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import BetCoverClose from './BetComps/BetCoverClose';
import BetCoverBox from './BetComps/BetCoverBox';

export default {
  inheritAttrs: false,
  name: 'BetJumpPage',
  computed: {
    ...mapState('app', {
      data: state => state.jumpObj,
    }),
    show() {
      return !!(this.data && this.data.btn);
    },
    title() {
      const check = this.data && this.data.text;
      const arr = check ? [].concat(this.data.text) : [];
      return arr.slice(0, 3);
    },
  },
  watch: {
    show() {
      if (this.show) {
        this.setJumpStatus(false);
      }
    },
  },
  components: {
    BetCoverClose,
    BetCoverBox,
  },
  methods: {
    ...mapMutations('app', [
      'setJumpObject',
      'setJumpStatus',
    ]),
    closeFun() {
      this.setJumpObject();
    },
    jumpFun() {
      if (this.data && this.data.url && this.data.replace) {
        this.$router.replace(this.data.url);
      } else if (this.data && this.data.url) {
        this.$router.push(this.data.url);
      }
      this.setJumpStatus(true);
      setTimeout(() => { this.closeFun(); }, 50);
    },
  },
};
</script>

<style lang="less">
.nb-bet-jump-page .nb-bet-body-box {
  top: 1.6rem;
  .jump-page-body {
    border-radius: .1rem;
    width: 3.15rem;
    height: 2.16rem;
    margin: 0 auto;
    background: url(./images/jump-page.png) no-repeat, #fff;
    background-size: 70% auto;
    background-position: center 15%;
    overflow: hidden;
    .body-alerts {
      width: 100%;
      height: 1.66rem;
      .body-blank {
        width: 100%;
        height: .98rem;
      }
      .title-box {
        width: 100%;
        height: .68rem;
        .body-title-big {
          width: 100%;
          height: .6rem;
          font-size: .2rem;
          font-weight: 500;
          color: #2e2f34;
        }
        .body-title {
          width: 100%;
          height: .2rem;
          font-size: .14rem;
          color: #909090;
        }
      }
    }
    .body-btns {
      width: 100%;
      height: .5rem;
      .body-btn-cancel, .body-btn-submit {
        height: .5rem;
        color: #fff;
        font-size: .16rem;
      }
      .body-btn-cancel {
        width: 1.15rem;
        background: #909090;
      }
      .body-btn-submit {
        width: 2rem;
        background: #ff5353;
      }
    }
  }
  .jump-page-close {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -.72rem;
    height: .72rem;
  }
}
</style>
