<template>
  <v-touch class="nb-shine-item" @tap="clickFun" >
    <publish-item-head :data="data" class="shine-item-head-box" showTitle >
      <div slot="time" >{{shineTime}}</div>
      <span slot="left" >{{leftStr}}</span>
      <span slot="right" >{{rightStr}}</span>
      {{middleStr | NumFmt}}
    </publish-item-head>
    <publish-item-list :data="data" >
      <div class="shine-item-body-single" slot="single">
        <div class="shine-item-title flex-start">
          <span class="shine-item-name flex-center">{{getOptName(data.items[0])}}</span>
          <span class="shine-item-at flex-center">@</span>
          <span class="shine-item-num flex-center">{{(data.items[0].odds || 0) | NumFmt(true, 3)}}</span>
        </div>
        <div class="shine-item-tour flex-start">
          <span class="shine-tour-txt flex-center">{{data.items[0].sportName || ''}}</span>
          <span class="shine-tour-line flex-center"></span>
          <span class="shine-tour-txt flex-center">{{data.items[0].tourName || ''}}</span>
        </div>
        <div class="shine-item-teams flex-start">
          <rolling-text class="shine-item-team" :text="getJoinTeam(data.items[0])" :maxLength="37" scrollamount="2" />
        </div>
        <div class="shine-item-line"></div>
      </div>
      <div class="shine-item-body-mult" slot="multiple">
        <div class="shine-item-mult-item shine-mult" v-for="(v, k) in data.items" :key="k" >
          <div class="shine-item-title shine-mult flex-start">
            <span class="shine-item-name shine-mult flex-center">{{getOptName(v)}}</span>
            <span class="shine-item-at shine-mult flex-center">@</span>
            <span class="shine-item-num shine-mult flex-center">{{(v.odds || 0) | NumFmt(true, 3)}}</span>
            <span class="shine-item-rst-win shine-mult flex-center" v-if="isOptionWin(v)">{{v.settleResultName}}</span>
            <span class="shine-item-rst-lose shine-mult flex-center" v-else-if="v.settleResultName">{{v.settleResultName}}</span>
          </div>
          <div class="shine-item-tour shine-mult flex-start">
            <span class="shine-tour-txt shine-mult flex-center">{{v.sportName || ''}}</span>
            <span class="shine-tour-line shine-mult flex-center"></span>
            <span class="shine-tour-txt shine-mult flex-center">{{v.tourName || ''}}</span>
          </div>
          <div class="shine-item-teams shine-mult flex-start">
            <rolling-text class="shine-item-team shine-mult" :text="getJoinTeam(v)" :maxLength="37" scrollamount="2" />
          </div>
          <div class="shine-item-line"></div>
        </div>
      </div>
    </publish-item-list>
    <div class="shine-item-foot flex-between">
      <div class="shine-item-foot-left flex-start">
        <span class="shine-item-foot-txt flex-center">{{$t('share.flwCnt')}}</span>
        <span class="shine-item-foot-num flex-center">{{data.followCount || 0}}</span>
        <span class="shine-item-foot-txt flex-center">{{$t('share.person')}}</span>
      </div>
      <div class="shine-item-foot-right flex-end">
        <span class="shine-item-foot-txt flex-center">{{$t('share.flwWin')}}</span>
        <span class="shine-item-foot-num flex-center">{{followWinStr | NumFmt}}</span>
        <span class="shine-item-foot-txt flex-center">{{$t('share.rmb')}}</span>
      </div>
    </div>
  </v-touch>
</template>

<script>
import toOptionName from '@/components/common/GameOption/toOptionName';
import PublishItemHead from '@/components/Publish/PublishItemHead';
import PublishItemList from '@/components/Publish/PublishItemList';
import RollingText from '@/components/common/RollingText';

export default {
  inheritAttrs: false,
  name: 'ShineItem',
  props: { data: Object, type: Number },
  computed: {
    shineTime() {
      let dt = `${this.data.shareDate || ''}`;
      const td = `${new Date().getMonth() + 1}/${new Date().getDate()}`;
      dt = dt.replace(/^.*([1-9]\d*)[-/]0?([1-9]\d*\s\d{2}:\d{2}).*$/, '$1/$2');
      return dt.replace(`${td} `, this.$t('share.today'));
    },
    leftStr() {
      let tStr = this.$t(`share.${/^2$/.test(this.type) ? 'rtnStr' : 'guess'}`);
      tStr = /^3$/.test(this.type) ? this.$t('share.rtnRate') : tStr;
      tStr = /^4$/.test(this.type) ? this.$t('share.flwRed') : tStr;
      return tStr;
    },
    rightStr() {
      let tStr = /^3$/.test(this.type) ? '%' : this.$t('share.rmb');
      tStr = /^4$/.test(this.type) ? this.$t('share.person') : tStr;
      return tStr;
    },
    middleStr() {
      let tStr = `${this.data.betAmount || 0}`;
      tStr = /^2$/.test(this.type) ? `${this.data.winAmount || 0}` : tStr;
      tStr = /^3$/.test(this.type) ? `${100 * (this.data.odds || 0)}` : tStr;
      tStr = /^4$/.test(this.type) ? `${this.data.totalRed || 0}` : tStr;
      return tStr;
    },
    followWinStr() {
      const payCom = +(this.data.payCommission || 0);
      const recCom = +(this.data.recCommission || 0);
      return recCom - payCom;
    },
  },
  components: { PublishItemHead, PublishItemList, RollingText },
  methods: {
    getMatchDate(v) {
      const dt = v && v.matchDate ? new Date(+v.matchDate) : new Date();
      return `${`0${dt.getMonth() + 1}`.slice(-2)}/${`0${dt.getDate()}`.slice(-2)}`;
    },
    getOptName(v) {
      const obj = toOptionName(v.gmt || v.gameType, v.bar || v.betBar, v.bop || v.betOption);
      let optName = obj.key_s ? this.$t(`common.optionNames.${obj.key_s}`) : '';
      optName += obj.prefix ? `${/-/.test(obj.prefix) ? '' : '+'}${obj.prefix} ` : '';
      optName += obj.key_e ? this.$t(`common.optionNames.${obj.key_e}`) : '';
      optName += !obj.key_s && obj.key ? this.$t(`common.optionNames.${obj.key}`) : '';
      return `${optName}${obj.value || ''}${obj.suffix || ''}`;
    },
    isOptionWin(v) {
      return `${v.settleResultName || ''}`.includes('赢');
    },
    getJoinTeam(v) {
      const score = `${v.matchResult || '0'}:0:0`.split(':');
      return `${v.homeName || ''} ${score[0] || 0} vs ${score[1] || 0} ${v.awayName || ''}`;
    },
    clickFun() {
      const e = window.event ? window.event : null;
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      if (/(publish|shine)-user/i.test(cName)) {
        this.$router.push(`/member/specialist/${this.data.userId}/0`);
      } else if (!/(shine|publish)-mult/i.test(cName)) {
        this.$router.push(`/publishdetail/${this.data.ticketId}`);
      }
    },
  },
};
</script>

<style lang="less">
.nb-shine-item {
  width: 100%;
  height: auto;
  border-radius: .06rem;
  box-shadow: 0 .1rem .2rem 0 rgba(223,222,223,.5);
  border: .01rem solid #ecebeb;
  background: linear-gradient(to top, #f9f9f9, #ffffff);
  overflow: hidden;
  .shine-item-head-box { width: 100%; height: .9rem; }
  .publish-item-mult-title { width: 100%; height: .34rem; padding: 0 .1rem; background: linear-gradient(to top, #fcfcfc, #f3f3f3); }
  .shine-item-body-single { width: 100%; height: .78rem; background: linear-gradient(to top, #fcfcfc, #f3f3f3); }
  .shine-item-body-mult { position: relative; padding: .03rem 0; background: linear-gradient(to top, #fcfcfc, #f3f3f3); }
  .shine-item-mult-item { width: 100%; }
  .shine-item-title { width: 100%; padding: 0 .1rem; }
  .shine-item-body-single .shine-item-title { height: .32rem; }
  .shine-item-body-mult .shine-item-title { height: .26rem; margin-top: .02rem; }
  .shine-item-body-single { .shine-item-name { font-size: .14rem; } .shine-item-at { font-size: .16rem; } .shine-item-num { font-size: .16rem; } }
  .shine-item-body-mult { .shine-item-name { font-size: .12rem; } .shine-item-at { font-size: .14rem; } .shine-item-num { font-size: .14rem; } }
  .shine-item-name { height: 100%; padding-right: .06rem; font-weight: 500; color: #2e2f34; }
  .shine-item-at { height: 100%; padding-right: .01rem; font-family: PingFangTC; font-weight: 500; color: #ff5353; }
  .shine-item-num { height: 100%; font-weight: 500; color: #ff5353; }
  .shine-item-rst-win, .shine-item-rst-lose { height: .18rem; margin-left: .12rem; padding: 0 .04rem; border-radius: .02rem; font-size: .12rem; }
  .shine-item-rst-win { border: .01rem solid #ff5353; color: #fe6246; }
  .shine-item-rst-lose { border: .01rem solid #bababa; color: #bababa; }
  .shine-item-tour { width: 100%; height: .17rem; margin-top: .02rem; padding: 0 .1rem; }
  .shine-tour-txt { height: 100%; line-height: .17rem; font-size: .12rem; color: #909090; }
  .shine-tour-line { height: .11rem; padding-right: .08rem; margin-right: .08rem; border-right: .01rem solid #cccccc; }
  .shine-item-teams { width: 100%; height: .17rem; margin-top: .02rem; padding: 0 .1rem; }
  .shine-item-team { font-size: .12rem; color: #909090; }
  .shine-item-line { width: 1.8rem; height: .06rem; }
  .shine-item-mult-item .shine-item-line { border-bottom: .01rem solid #f3f3f3; }
  .shine-item-mult-item:last-child .shine-item-line { border: none; }
  .shine-item-foot { width: 100%; height: .36rem; padding: 0 .1rem; border-top: .01rem solid #f6f6f6; background: #ffffff; }
  .shine-item-foot-left, .shine-item-foot-right { width: 50%; height: 100%; }
  .shine-item-foot-txt { height: 100%; font-size: .12rem; color: #909090; }
  .shine-item-foot-num { height: 100%; line-height: .36rem; padding: 0 .03rem; font-size: .16rem; font-weight: 500; color: #ff5353; }
}
.blue .nb-shine-item {
  box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1);
  border: .01rem solid #2e2f34;
  background: linear-gradient(to bottom, #3a393f, #333238);
  .publish-rate-btm { color: #909090; }
  .shine-item-body-single { background: linear-gradient(to top, #303030, #343438); border-top: .01rem solid #2e2f34; }
  .shine-item-body-mult { background: linear-gradient(to top, #303030, #343438); border-top: .01rem solid #2e2f34; }
  .shine-item-name { color: #ecebeb; }
  .shine-item-at { color: #53fffd; }
  .shine-item-num { color: #53fffd; }
  .shine-item-rst-win { border-image-source: linear-gradient(155deg, #00ffd8, #00e5fe); color: #53fffd; }
  .shine-item-rst-lose { border: .01rem solid #777777; color: #777777; }
  .shine-tour-txt { color: #777777; }
  .shine-tour-line { border-right: .01rem solid #777777; }
  .shine-item-team { color: #777777; }
  .shine-item-mult-item .shine-item-line { border-bottom: .01rem solid #2e2f34; }
  .shine-item-foot { border-top: .01rem solid #2e2f34; background: linear-gradient(to bottom, #3a393f, #333238); }
  .shine-item-foot-num { color: #53fffd; }
}
</style>
