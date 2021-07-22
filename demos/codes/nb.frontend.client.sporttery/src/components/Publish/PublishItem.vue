<template>
  <v-touch class="nb-publish-item" @tap="clickFun" >
    <publish-item-head :data="data" class="publish-item-head-box" showTitle >
      <p slot="time" >{{publishTime}}</p>
      <span slot="left" >{{$t('share.maxThan')}}</span>
      <span slot="right" >%</span>
      <span slot="bottom" >{{$t('share.rtnRate')}}</span>
      {{100 * (data.odds || 0) | NumFmt}}
    </publish-item-head>
    <publish-item-list :data="data" publish @toggle="toggleFun" >
      <div class="publish-item-body-single flex-between" slot="single">
        <div class="publish-item-left-box flex-start">
          <div class="publish-item-sport flex-center">{{data.items[0].sportName || ''}}</div>
          <div class="publish-item-date flex-center">{{getMatchDate(data.items[0])}}</div>
          <div class="publish-item-tour flex-center">{{data.items[0].tourName || ''}}</div>
          <div class="publish-item-line flex-center"></div>
        </div>
        <div class="publish-item-ensure-box flex-start">
          <span class="publish-item-team">{{data.items[0].homeName || ''}} vs {{data.items[0].awayName || ''}}</span>
          <div class="publish-item-odds flex-center" v-if="data.ensureOdds">{{$t('share.ensure')}}{{(data.ensureOdds || 0) | NumFmt(true)}}</div>
        </div>
      </div>
      <div class="publish-item-body-mult" slot="multiple">
        <div class="publish-item-mult-item publish-mult flex-between" v-for="(v, k) in data.items" :key="k" >
          <div class="publish-item-left-box publish-mult flex-start">
            <div class="publish-item-sport publish-mult flex-center">{{v.sportName || ''}}</div>
            <div class="publish-item-date publish-mult flex-center">{{getMatchDate(v)}}</div>
            <div class="publish-item-tour publish-mult flex-center">{{v.tourName || ''}}</div>
            <div class="publish-item-line publish-mult flex-center"></div>
          </div>
          <div class="publish-item-ensure-box publish-mult flex-start">
            <span class="publish-item-team publish-mult">{{v.homeName || ''}} vs {{v.awayName || ''}}</span>
          </div>
        </div>
      </div>
    </publish-item-list>
    <div class="publish-item-foot flex-between">
      <div class="publish-item-foot-left flex-start">
        <span class="publish-item-foot-txt flex-center">{{$t('share.selfBuy')}}</span>
        <span class="publish-item-foot-num flex-center">{{(data.betAmount || 0) | NumFmt}}</span>
        <span class="publish-item-foot-txt flex-center">{{$t('share.rmb')}}</span>
      </div>
      <div class="publish-item-foot-right flex-end">
        <span class="publish-item-foot-txt flex-center">{{$t('share.follow')}}</span>
        <span class="publish-item-foot-num flex-center">{{data.followCount || 0}}</span>
        <span class="publish-item-foot-txt flex-center">{{$t('share.person')}}</span>
      </div>
    </div>
  </v-touch>
</template>

<script>
import PublishItemHead from '@/components/Publish/PublishItemHead';
import PublishItemList from '@/components/Publish/PublishItemList';

export default {
  inheritAttrs: false,
  name: 'PublishItem',
  data() {
    return { maxWidth: '' };
  },
  props: { data: Object },
  computed: {
    publishTime() {
      let dt = `${this.data.planCreateDate || ''}`;
      const td = `${new Date().getMonth() + 1}/${new Date().getDate()}`;
      dt = dt.replace(/^.*([1-9]\d*)[-/]0?([1-9]\d*\s\d{2}:\d{2}).*$/, '$1/$2');
      return dt.replace(`${td} `, this.$t('share.today'));
    },
  },
  components: { PublishItemHead, PublishItemList },
  methods: {
    getMatchDate(v) {
      const dt = v && v.matchDate ? new Date(+v.matchDate) : new Date();
      return `${`0${dt.getMonth() + 1}`.slice(-2)}/${`0${dt.getDate()}`.slice(-2)}`;
    },
    clickFun() {
      const e = window.event ? window.event : null;
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      if (/(publish|shine)-user/i.test(cName)) {
        this.$router.push(`/member/specialist/${this.data.userId}/0`);
      } else if (!/publish-mult/i.test(cName)) {
        this.$router.push(`/publishdetail/${this.data.ticketId}`);
      }
    },
    setWidthFun() {
      this.$el.querySelectorAll('.publish-item-mult-item, .publish-item-body-single').forEach((bsEle) => {
        const baseWidth = parseFloat(window.getComputedStyle(bsEle).width);
        const basePadding = parseFloat(window.getComputedStyle(bsEle).paddingLeft);
        const leftEle = bsEle.querySelector('.publish-item-left-box');
        const rightEle = bsEle.querySelector('.publish-item-ensure-box');
        if (leftEle && rightEle) {
          const leftWidth = parseFloat(window.getComputedStyle(leftEle).width);
          const rightWidth = baseWidth - 2 * basePadding - leftWidth;
          const oddsEle = bsEle.querySelector('.publish-item-odds');
          const teamEle = bsEle.querySelector('.publish-item-team');
          rightEle.style.width = `${rightWidth}px`;
          if (/publish-item-body-single/i.test(bsEle.className) && teamEle) {
            const oWidth = oddsEle ? parseFloat(window.getComputedStyle(oddsEle).width) : 0;
            const oLeft = oddsEle ? parseFloat(window.getComputedStyle(oddsEle).marginLeft) : 0;
            teamEle.style.maxWidth = `${rightWidth - oWidth - oLeft}px`;
          }
        }
      });
    },
    toggleFun() {
      setTimeout(() => { this.setWidthFun(); }, 20);
    },
  },
  mounted() {
    this.toggleFun();
  },
};
</script>

<style lang="less">
.nb-publish-item {
  width: 100%;
  height: auto;
  border-radius: .06rem;
  box-shadow: 0 .1rem .2rem 0 rgba(223,222,223,.5);
  border: .01rem solid #ecebeb;
  background: linear-gradient(to top, #f9f9f9, #ffffff);
  overflow: hidden;
  .publish-item-head-box { width: 100%; height: .9rem; }
  .publish-item-body-single, .publish-item-mult-title { width: 100%; height: .34rem; padding: 0 .1rem; background: linear-gradient(to top, #fcfcfc, #f3f3f3); }
  .publish-item-body-mult { background: linear-gradient(to top, #fcfcfc, #f3f3f3); }
  .publish-item-mult-item { width: 100%; height: .3rem; padding: 0 .1rem; border-bottom: .01rem solid #f4f4f4; }
  .publish-item-mult-item:last-child { border: none; }
  .publish-item-left-box { position: relative; z-index: 3; width: auto; height: 100%; }
  .publish-item-sport { min-height: .14rem; border-radius: .02rem; padding: 0 .04rem; font-size: .1rem; line-height: .14rem; border: .005rem solid #ff5353; color: #ff5353; }
  .publish-item-date { margin-left: .06rem; font-size: .12rem; color: #aaaaaa; }
  .publish-item-tour { height: 100%; margin: 0 .08rem 0 .06rem; font-size: .12rem; color: #aaaaaa; }
  .publish-item-line { width: .01rem; height: .1rem; margin-right: .08rem; background: #e2e2e2; }
  .publish-item-ensure-box { position: relative; z-index: 1; width: 0; height: 100%; overflow: hidden; }
  .publish-item-team { max-width: 1%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .12rem; color: #aaaaaa; }
  .publish-item-mult-item .publish-item-team { max-width: 100%; }
  .publish-item-odds { height: .16rem; margin-left: .06rem; border-radius: .08rem; padding: 0 .06rem; font-size: .1rem; line-height: .14rem; background: #ff5353; color: #ffffff; }
  .publish-item-foot { width: 100%; height: .36rem; padding: 0 .1rem; border-top: .01rem solid #f6f6f6; background: #ffffff; }
  .publish-item-foot-left, .publish-item-foot-right { width: 50%; height: 100%; }
  .publish-item-foot-txt { height: 100%; font-size: .12rem; color: #909090; }
  .publish-item-foot-num { height: 100%; line-height: .36rem; padding: 0 .03rem; font-size: .16rem; font-weight: 500; color: #ff5353; }
}
.blue .nb-publish-item {
  box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1);
  border: .01rem solid #2e2f34;
  background: linear-gradient(to bottom, #3a393f, #333238);
  .publish-item-body-single, .publish-item-mult-title { background: linear-gradient(to top, #303030, #343438); border-top: .01rem solid #2e2f34; }
  .publish-item-body-mult { background: linear-gradient(to top, #303030, #343438); border-top: .01rem solid #2e2f34; }
  .publish-item-mult-item { border-bottom: .01rem solid #2e2f34; background: linear-gradient(to top, #303030, #343438); }
  .publish-item-sport { border: .005rem solid #53fffd; color: #53fffd; }
  .publish-item-date { color: #666666; }
  .publish-item-tour { color: #666666; }
  .publish-item-line { background: #444444; }
  .publish-item-team { color: #666666; }
  .publish-item-odds { background: #434249; color: #53fffd; }
  .publish-item-foot { border-top: .01rem solid #2e2f34; background: linear-gradient(to bottom, #3a393f, #333238); }
  .publish-item-foot-num { color: #53fffd; }
}
</style>
