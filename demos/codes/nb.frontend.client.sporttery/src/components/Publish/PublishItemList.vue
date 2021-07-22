<template>
  <div class="nb-publish-item-single" v-if="data.betType < 2">
    <div class="nb-publish-item-rtn-box flex-between-col" v-if="!publish" >
      <div class="publish-item-rtn-box-tp flex-end">
        <span class="publish-item-rtn-txt flex-center">{{$t('share.guess')}}</span>
        <span class="publish-item-rtn-num flex-center">{{(data.betAmount || 0) | NumFmt}}</span>
        <span class="publish-item-rtn-txt flex-center">{{$t('share.rmb')}}</span>
      </div>
      <div class="publish-item-rtn-box-btm flex-end">
        <span class="publish-item-rtn-txt flex-center">{{$t('share.rtnStr')}}</span>
        <span class="publish-item-rtn-num flex-center">{{(data.winAmount || 0) | NumFmt}}</span>
        <span class="publish-item-rtn-txt flex-center">{{$t('share.rmb')}}</span>
      </div>
    </div>
    <slot name="single" />
  </div>
  <v-touch class="nb-publish-item-mult publish-mult" v-else @tap="clickFun" >
    <div class="publish-item-mult-cover publish-mult"></div>
    <div class="publish-item-mult-title publish-mult flex-start" v-if="publish" >
      <span class="publish-item-mult-title-txt publish-mult">{{multName}}</span>
      <icon-arrow class="publish-mult" size="0.1rem" :direction="direct" />
      <div class="publish-item-odds publish-mult flex-center" v-if="data.ensureOdds">
        {{$t('share.ensure')}}{{(data.ensureOdds || 0) | NumFmt(true)}}
      </div>
    </div>
    <div class="publish-item-mult-title publish-mult flex-between" v-else >
      <div class="publish-item-mult-title-left publish-mult flex-start">
        <span class="publish-item-mult-title-str publish-mult">{{multName}}</span>
        <span class="publish-item-mult-title-at publish-mult">@</span>
        <span class="publish-item-mult-title-num publish-mult">
          {{(1 + (data.odds || 0)) | NumFmt(true, 3)}}
        </span>
      </div>
      <div class="publish-item-mult-title-right publish-mult flex-end">
        <span class="publish-item-mult-title-txt">{{dirTxt}}</span>
        <icon-arrow class="publish-mult" size="0.1rem" :direction="direct" />
      </div>
    </div>
    <transition name="publish-mult">
      <div class="nb-publish-item-mult-box publish-mult" v-if="show" >
        <div class="nb-publish-item-rtn-box publish-mult flex-between-col" v-if="!publish" >
          <div class="publish-item-rtn-box-tp publish-mult flex-end">
            <span class="publish-item-rtn-txt publish-mult flex-center">{{$t('share.guess')}}</span>
            <span class="publish-item-rtn-num publish-mult flex-center">{{(data.betAmount || 0) | NumFmt}}</span>
            <span class="publish-item-rtn-txt publish-mult flex-center">{{$t('share.rmb')}}</span>
          </div>
          <div class="publish-item-rtn-box-btm publish-mult flex-end">
            <span class="publish-item-rtn-txt publish-mult flex-center">{{$t('share.rtnStr')}}</span>
            <span class="publish-item-rtn-num publish-mult flex-center">{{(data.winAmount || 0) | NumFmt}}</span>
            <span class="publish-item-rtn-txt publish-mult flex-center">{{$t('share.rmb')}}</span>
          </div>
        </div>
        <slot name="multiple" />
      </div>
    </transition>
  </v-touch>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'PublishItemList',
  data() {
    return { show: false };
  },
  props: { data: Object, publish: Boolean },
  computed: {
    multName() {
      const [lan, num] = [this.$t('pageBet.betMoney'), this.data.items.length];
      const nunStr = !/[a-z]+/i.test(lan) ? '一二三四五六七八九十' : '';
      const beStr = num < 11 ? '一二三四五六七八九十'.substr(num - 1, 1) : num;
      return nunStr ? `${beStr}串一` : `${num} Folds`;
    },
    direct() {
      return this.show ? 'up' : 'down';
    },
    dirTxt() {
      return this.show ? this.$t('share.showClose') : this.$t('share.showOpen');
    },
  },
  methods: {
    clickFun() {
      const e = window.event ? window.event : null;
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      if (/publish-mult/i.test(cName)) {
        this.show = !this.show;
        this.$emit('toggle', true);
      }
    },
  },
};
</script>

<style lang="less">
.publish-mult-enter-active, .publish-mult-leave-active { transition: all 0.15s linear; }
.publish-mult-enter, .publish-mult-leave-active { transform: translateY(0); }
.nb-publish-item-single, .nb-publish-item-mult {
  position: relative;
  width: 100%;
  background: linear-gradient(to top, #fcfcfc, #f3f3f3);
  .publish-item-mult-cover { position: absolute; z-index: 9; width: 100%; height: 100%; left: 0; top: 0; }
  .publish-item-mult-title svg path { fill: #bababa; }
  .publish-item-mult-title-txt { font-size: .12rem; padding-right: .06rem; color: #909090; }
  .publish-item-odds { height: .16rem; margin-left: .06rem; border-radius: .08rem; padding: 0 .06rem; font-size: .1rem; line-height: .14rem; background: #ff5353; color: #ffffff; }
  .publish-item-mult-title-str { font-size: .14rem; font-weight: 500; padding-right: .06rem; color: #2e2f34; }
  .publish-item-mult-title-at { padding: 0 .01rem 0 .06rem; font-family: PingFangTC; font-size: .16rem; font-weight: 500; color: #ff5353; }
  .publish-item-mult-title-num { font-family: DIN; font-size: .16rem; font-weight: 500; color: #ff5353; }
  .nb-publish-item-mult-box { position: relative; width: 100%; }
  .nb-publish-item-rtn-box { position: absolute; width: 70%; height: .37rem; right: .1rem; bottom: .08rem; z-index: 7; }
  .publish-item-rtn-box-tp, .publish-item-rtn-box-btm { width: 100%; height: .17rem; }
  .publish-item-rtn-txt { font-size: .12rem; color: #909090; }
  .publish-item-rtn-num { padding: 0 .03rem; font-size: .14rem; font-weight: 500; color: #ff5353; }
}
.blue .nb-publish-item-single, .blue .nb-publish-item-mult {
  background: linear-gradient(to top, #303030, #343438);
  .publish-item-rtn-txt { color: #777777; }
  .publish-item-rtn-num { color: #53fffd; }
}
</style>
