<template>
  <bet-cover-box class="nb-home-notice" :index="419999" :show="show" @close="closeFun">
    <div class="home-notice-body">
      <div class="body-title flex-center">
        {{homeNotice && homeNotice.noticeTitle ? homeNotice.noticeTitle : ''}}
      </div>
      <div class="body-detail">
        {{homeNotice && homeNotice.noticeBody ? homeNotice.noticeBody : ''}}
      </div>
    </div>
    <div class="home-notice-close flex-center"><bet-cover-close /></div>
  </bet-cover-box>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import BetCoverClose from '@/components/Bet/BetComps/BetCoverClose';
import BetCoverBox from '@/components/Bet/BetComps/BetCoverBox';

export default {
  components: {
    BetCoverClose,
    BetCoverBox,
  },
  computed: {
    ...mapState('app', ['homeNotice']),
    show() {
      return !!this.homeNotice;
    },
  },
  methods: {
    ...mapMutations('app', ['setHomeNotice']),
    closeFun() {
      this.setHomeNotice();
    },
  },
};
</script>

<style lang="less">
.nb-home-notice .nb-bet-public-box-body {
  top: 1.6rem;
  .home-notice-body {
    border-radius: .1rem;
    width: 3.15rem;
    margin: 0 auto;
    background: #fff;
    overflow: hidden;
    .body-title {
      width: 100%;
      height: .3rem;
      margin-top: .1rem;
      font-size: .12rem;
      font-weight: bold;
      border-bottom: .01rem solid #eee;
    }
    .body-detail {
      width: 100%;
      margin: .05rem auto .15rem;
      min-height: .8rem;
      max-height: 1.7rem;
      font-size: .12rem;
      padding: 0 .15rem;
      color: #777676;
      line-height: .24rem;
      word-wrap: break-word;
      overflow-y: scroll;
    }
  }
  .home-notice-close {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -.72rem;
    height: .72rem;
  }
}
.horizontal .nb-home-notice .nb-bet-public-box-body {
  top: .4rem;
}
</style>
