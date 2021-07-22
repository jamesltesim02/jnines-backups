<template>
  <div class="nb-publish-detail-match-item">
    <div class="detail-match-item-btm">
      <div class="match-item-btm-box flex-start">
        <span>{{getSptName}}</span>
        <i></i>
        <span>{{data.tn || data.tourName || ''}}</span>
      </div>
    </div>
    <div class="detail-match-item-tp flex-between">
      <div class="match-item-tp-left flex-end">
        <rolling-text class="team-name" :text="getTeamName(0)" :maxLength="37" scrollamount="2" />
        <div class="home-logo flex-center">
          <cimg :src="getLogo(0)" remote />
        </div>
      </div>
      <div class="match-item-tp-middle">
        <div class="item-middle-tp flex-center">{{$t('share.toStart')}}</div>
        <div class="item-middle-btm flex-center">{{timeStr}}</div>
      </div>
      <div class="match-item-tp-right flex-start">
        <div class="away-logo flex-center">
          <cimg :src="getLogo(1)" remote />
        </div>
        <rolling-text class="team-name" :text="getTeamName(1)" :maxLength="37" scrollamount="2" />
      </div>
    </div>
  </div>
</template>

<script>
import RollingText from '@/components/common/RollingText';

const LOGOS = [require('./img/logo-1.jpg'), require('./img/logo-2.jpg')];

export default {
  inheritAttrs: false,
  name: 'PublishDetailMatchItem',
  data() {
    return { t: null, timeStr: '00:00:00' };
  },
  props: { data: Object },
  computed: {
    getSptName() {
      if (this.data.sportName) {
        return this.data.sportName;
      }
      const dt = this.$t('common.sports');
      return this.data.sno && dt[this.data.sno] ? dt[this.data.sno] : '';
    },
  },
  components: { RollingText },
  methods: {
    getLogo(id) {
      const str = !id ? this.data.homeIcon : this.data.awayIcon;
      const def = !id ? LOGOS[0] : LOGOS[1];
      return str ? `logo/${str}` : def;
    },
    getTeamName(id) {
      const arr = `${this.data.mn || ''} vs `.split(/\s*vs\s*/i);
      const str = !id ? this.data.homeName : this.data.awayName;
      const def = !id ? arr[0] : arr[1];
      return str || def;
    },
    updateTimeStr() {
      const tNum = +(this.data.matchDate || this.data.tp || this.data.matchStartTime || new Date().getTime());
      let delTime = parseInt((tNum - new Date().getTime()) / 1000, 10);
      delTime = delTime < 0 ? 0 : delTime;
      const hh = parseInt(delTime / 3600, 10);
      const mm = parseInt((delTime % 3600) / 60, 10);
      const ss = parseInt(delTime % 60, 10);
      this.timeStr = `${hh > 99 ? `${hh}` : `0${hh}`.slice(-2)}:${`0${mm}`.slice(-2)}:${`0${ss}`.slice(-2)}`;
      if (delTime <= 0) {
        clearInterval(this.t);
      }
    },
  },
  mounted() {
    clearInterval(this.t);
    this.t = setInterval(() => { this.updateTimeStr(); }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.t);
  },
};
</script>

<style lang="less">
.nb-publish-detail-match-item {
  position: relative;
  width: 100%;
  height: .77rem;
  z-index: 1;
  border-top: .01rem solid #ecebeb;
  .detail-match-item-btm { position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 2; padding: .08rem .22rem; }
  .detail-match-item-tp { position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 3; padding: .24rem .1rem 0 .1rem; }
  .match-item-btm-box { width: 100%; height: .18rem; font-size: .12rem; color: #909090; span { height: 100%; } }
  .match-item-btm-box i { display: inline-block; width: .01rem; height: .1rem; margin: 0 .08rem; background: #e2e2e2; }
  .match-item-tp-left, .match-item-tp-right { width: 41%; height: 100%; }
  .match-item-tp-middle { position: relative; width: 18%; height: 100%; }
  .home-logo { width: .3rem; height: .3rem; margin-left: .1rem; border-radius: 100%; overflow: hidden; background: #fff; border: .01rem solid #ebebeb; img { max-width: .24rem; max-height: .24rem; } }
  .away-logo { width: .3rem; height: .3rem; margin-right: .1rem; border-radius: 100%; overflow: hidden; background: #fff; border: .01rem solid #ebebeb; img { max-width: .24rem; max-height: .24rem; } }
  .team-name { max-width: 1.05rem; font-size: .15rem; font-weight: bold; letter-spacing: -.01rem; white-space: nowrap; user-select: none; color: #2e2f34; }
  .item-middle-tp { position: absolute; width: 100%; height: .16rem; top: 0; left: 0; font-size: .12rem; color: #bababa; }
  .item-middle-btm { width: 100%; height: 100%; font-size: .13rem; font-family: DIN; color: #6eb4ff; }
}
.blue .nb-publish-detail-match-item {
  border-top: .01rem solid #2e2f34;
  .match-item-btm-box { color: #909090; }
  .match-item-btm-box i { background: #666666; }
  .home-logo { background: #fff; border: .01rem solid #2e2f34; }
  .away-logo { background: #fff; border: .01rem solid #2e2f34; }
  .team-name { color: #ecebeb; }
  .item-middle-tp { color: #777777; }
  .item-middle-btm { color: #6eb4ff; }
}
</style>
