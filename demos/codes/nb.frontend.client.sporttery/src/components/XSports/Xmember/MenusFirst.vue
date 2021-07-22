<template>
  <div class="x-menu-first">
    <v-touch
      tag="a"
      @tap="toPath('/history/0')"
    >
      <div class="iconc" :class="{ history: sucSts }">
        <icon-order-history />
      </div>
      <div class="labelc">
        <span>竞猜记录</span>
      </div>
    </v-touch>
    <v-touch
      tag="a"
      @tap="toPath(`/member/specialist/${userId}/0`)"
    >
      <div class="iconc">
        <icon-programs />
      </div>
      <div class="labelc">
        <span>我的方案</span>
      </div>
    </v-touch>
    <v-touch
      tag="a"
      @tap="toPath('/mycard/0')"
    >
      <div class="iconc">
        <icon-coupons />
      </div>
      <div class="labelc">
        <span>我的卡券</span>
      </div>
    </v-touch>
    <v-touch
      tag="a"
      @tap="toPath('/reward')"
    >
      <div class="iconc">
        <icon-gift />
      </div>
      <div class="labelc">
        <span>每日奖励</span>
      </div>
    </v-touch>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { pushToLogedPath } from '@/utils/PortalUtils';
import IconOrderHistory from './icons/IconOrderHistory';
import IconPrograms from './icons/IconPrograms';
import IconCoupons from './icons/IconCoupons';
import IconGift from './icons/IconGift';

export default {
  computed: {
    ...mapState({ sucSts: state => state.bet.succStatus }),
    ...mapState('app', ['isLoged', 'userinfo']),
    userId() {
      return this.isLoged && this.userinfo && this.userinfo.nbUser ? this.userinfo.nbUser : '';
    },
  },
  components: {
    IconOrderHistory,
    IconPrograms,
    IconCoupons,
    IconGift,
  },
  methods: {
    toPath(url) {
      pushToLogedPath(url);
    },
  },
};
</script>
<style lang="less">
.x-menu-first {
  margin-top: .1rem;
  background: #fff;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  height: .8rem;
  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .iconc {
      position: relative;
      display: flex;
      align-items: center;
      height: .26rem;
      &.history::before {
        content: "";
        display: inline-block;
        width: .05rem;
        height: .05rem;
        background: #ff5353;
        border-radius: 50%;
        position: absolute;
        top: -.02rem;
        right: -.08rem;
      }
    }
    .labelc {
      font-size: .14rem;
      line-height: .2rem;
      margin-top: .05rem;
      span {
        display: inline-block;
      }
    }
  }
}
.blue .x-menu-first {
  box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1);
  background: linear-gradient(to bottom, #3a393f, #333238);
  .iconc.history::before { background: #53fffd; }
  .labelc span { color: #eeeeee; }
}
</style>
