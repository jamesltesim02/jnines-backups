<template>
  <div v-if="focusMatchs && focusMatchs.length" class="quick-bet" >
    <h3>{{$t('pagelite.quickBetTitle')}}</h3>
    <swiper :options="swiperOption">
      <swiper-slide v-for="(m, i) in focusMatchs" :key="i" >
        <div class="quick-bet-item" >
          <span class="match-date" :style="{ background: backColor }">{{m.matchDate | dateFormat('MM/dd')}}</span>
          <div class="more-games flex-center" :style="{ color: '#716d6d' }">+{{m.matchGame || 0}}</div>
          <v-touch class="quick-bet-to-detail" @tap="$router.push(`/detail/${m.sportID}/${m.matchID}`)">
            <rolling-text class="match-group flex-center" :text="m.abbrName || m.tournamentName" :max-length="30" scrollamount="3" />
            <div class="match-time">{{m.matchDate | dateFormat('HH:mm')}}</div>
            <div class="tns flex-between">
              <rolling-text class="tn" :text="m.competitor1Name" :max-length="14" scrollamount="3" />
              <li class="score">
                <span :style="{ color: oddsColor }">{{getScore(m, 0)}}</span>
                <span class="spliter flex-center"></span>
                <span :style="{ color: oddsColor }">{{getScore(m, 1)}}</span>
              </li>
              <rolling-text class="tn" :text="m.competitor2Name" :max-length="14" scrollamount="3" />
            </div>
          </v-touch>
          <list-options class="quick-options" :match="m" :games="m.games" />
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { findmatchsList } from '@/api/pull';
import ListOptions from '@/components/Matchs/MatchList/ListOptions';
import RollingText from '@/components/common/RollingText';

const pSet = window.NBConfig.PORTAL_SETTING;

export default {
  data() {
    return {
      swiperOption: {
        loop: true,
        loopAdditionalSlides: 1,
        centeredSlides: true,
        slidesPerView: 1,
        pagination: { el: '.swiper-pagination' },
      },
      focusMatchs: [],
      filterTimer: null,
      setPointTimer: null,
    };
  },
  computed: {
    ...mapState('app', ['theme']),
    backColor() {
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_FAST_DATE_BACKGROUND ? pSet.BLACK_FAST_DATE_BACKGROUND : 'linear-gradient(to right, #fe597d, #ffb775)';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_FAST_DATE_BACKGROUND ? pSet.BLUE_FAST_DATE_BACKGROUND : 'linear-gradient(to right, #00c4a5, #00c0d5);';
      }
      return pSet && pSet.WHITE_FAST_DATE_BACKGROUND ? pSet.WHITE_FAST_DATE_BACKGROUND : 'linear-gradient(to right, #fe597d, #ffb775)';
    },
    oddsColor() {
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_OPTION_COLOR ? pSet.BLACK_OPTION_COLOR : '#ff5353';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_OPTION_COLOR ? pSet.BLUE_OPTION_COLOR : '#53fffd';
      }
      return pSet && pSet.WHITE_OPTION_COLOR ? pSet.WHITE_OPTION_COLOR : '#ff5353';
    },
    btnColor() {
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_BOTTON_BACKGROUND ? pSet.BLACK_BOTTON_BACKGROUND : '#ff5353';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_BOTTON_BACKGROUND ? pSet.BLUE_BOTTON_BACKGROUND : '#00b5b3';
      }
      return pSet && pSet.WHITE_BOTTON_BACKGROUND ? pSet.WHITE_BOTTON_BACKGROUND : '#ff5353';
    },
  },
  watch: {
    focusMatchs(n) {
      if (n && n.length) {
        this.setColor();
      }
    },
  },
  components: {
    swiper,
    swiperSlide,
    ListOptions,
    RollingText,
  },
  methods: {
    getScore(m, id) {
      const score = `${/^[12]$/.test(m.matchState) ? `${m.matchScore || '0'}:0` : ':'}`.split(':');
      return score[id ? 1 : 0];
    },
    filterMatches(data) {
      const [dt, sports] = [JSON.parse(JSON.stringify(data)), window.NBConfig.AVAILABLE_SPORTS];
      const showLive = window.NBConfig.SHOW_LIVE;
      for (let mid = dt.length; mid > 0; mid -= 1) {
        let eachShowLive = showLive;
        for (let i = 0; i < sports.length; i += 1) {
          const sno = typeof sports[i] === 'object' ? sports[i].SNO || sports[i].SPORT_ID : sports[i];
          if (`${dt[mid - 1].sportID}` === `${sno}` && typeof sports[i] === 'object') {
            eachShowLive = typeof sports[i].SHOW_LIVE === 'undefined' ? showLive : sports[i].SHOW_LIVE;
            break;
          }
        }
        if (!eachShowLive && /^[123]$/.test(dt[mid - 1].matchState)) {
          dt.splice(mid - 1, 1);
        }
      }
      return dt;
    },
    async getMatchList() {
      try {
        let focusMatchs = await findmatchsList({
          sportID: 10,
          // TODO 有数据时改回用isFocus查询, 注册推送消息
          isFocus: 1,
          pageSize: 5,
          pageNum: 1,
        });
        focusMatchs = this.filterMatches(focusMatchs);
        this.focusMatchs = focusMatchs.map((m) => {
          const games = m.games.map(g => ({
            ...g,
            options: g.options.map(o => ({
              ...o,
              betBar: g.betBar,
              oddsUpper: false,
              oddsLower: false,
            })),
          }));
          if (games.length === 1) {
            games[1] = { options: [undefined, undefined, undefined] };
          }
          if (games.length > 2) {
            games.length = 2;
          }
          return ({ ...m, isQuickBet: true, games });
        });
      } catch (e) {
        console.log(e);
      }
    },
    setColor() {
      clearTimeout(this.setPointTimer);
      this.setPointTimer = setTimeout(() => {
        this.$el.querySelectorAll('.swiper-pagination-bullet').forEach((v) => {
          v.removeAttribute('style');
        });
        this.$el.querySelectorAll('.swiper-pagination-bullet-active').forEach((v) => {
          v.style.background = this.btnColor;
        });
        this.setColor();
      }, 100);
    },
  },
  async created() {
    await this.getMatchList();
    clearInterval(this.filterTimer);
    this.filterTimer = setInterval(this.getMatchList, 30000);
  },
  beforeDestroy() {
    clearTimeout(this.setPointTimer);
    clearInterval(this.filterTimer);
  },
};
</script>
<style lang="less">
.quick-bet {
  width: 3.75rem;
  margin-top: -.08rem;
  h3 {
    color: #4a4a4a;
    padding: .1rem .12rem;
    font-size: .16rem;
    font-weight: bolder;
  }
  .swiper-container { padding-bottom: .2rem; }
  .swiper-slide { padding: 0 .12rem; }
  .quick-bet-item {
    position: relative;
    width: 3.5rem;
    box-shadow: 0 10px 20px 0 rgba(242, 228, 233, 0.5);
    background-image: linear-gradient(297deg, #f9f9f9, #ffffff);
    border-radius: 6px;
    padding: .1rem .1rem .2rem .1rem;
    overflow: hidden;
    .match-group {
      max-width: 2.4rem;
      margin: 0 auto;
      color: #bababa;
      font-size: .14rem;
      line-height: .2rem;
      text-align: center;
    }
    .more-games {
      position: absolute;
      width: .4rem;
      height: .25rem;
      top: 0;
      right: 0;
      border-bottom-left-radius: .06rem;
      background: #ECEBEB;
    }
  }
  .match-date {
    display: inline-block;
    position: absolute;
    left: 0;
    padding-left: .05rem;
    width: .46rem;
    line-height: .2rem;
    color: #fff;
    border-top-right-radius: 10rem;
    border-bottom-right-radius: 10rem;
    font-size: .12rem;
  }
  .match-time {
    color: #888;
    text-align: center;
    font-size: .12rem;
    line-height: .14rem;
  }
  .tns {
    position: relative;
    color: #666;
    font-size: .15rem;
    text-align: center;
    margin-top: -.04rem;
    line-height: .22rem;
    & > .tn { width: 42%; }
    .score {
      display: flex;
      font-size: .18rem;
      width: .64rem;
      span { width: 100%; }
      .spliter {
        width: .2rem;
        &::before {
          content: "";
          width: .18rem;
          height: .02rem;
          border-radius: 1.5px;
          background: linear-gradient(93deg, #fe597d, #ffb775);
        }
      }
    }
  }
  .quick-options {
    margin-top: .12rem;
    border-radius: 6px;
    background-image: linear-gradient(to top, #f9f9f9, #ffffff);
    border: 1px solid #ecebeb;
    & > li { border-top: 1px solid #ecebeb; }
    & > li:first-child { border-top: 0; }
  }
  .swiper-pagination-bullet {
    width: .05rem;
    height: .05rem;
    background: #3a3a3a;
    margin: 0 .02rem;
  }
  .swiper-pagination-bullet-active{ width: .1rem; border-radius: .03rem; opacity: .7; }
  .swiper-container-horizontal > .swiper-pagination-bullets { bottom: .05rem; }
}
.black .quick-bet {
  h3 { color: #b0b0b0; }
  .quick-bet-item {
    background-image: linear-gradient(to bottom, #3c3b43, #2b2a31);
    box-shadow: 0 6px 9px 0 rgba(37, 37, 37, 0.5);
    .more-games { background: #2e2f34; }
  }
  .tns { color: #e8e6e8; }
  .quick-options {
    background: linear-gradient(to bottom, #3a393f, #333238);
    border: 0;
    & > li { border-top: 1px solid #2e2f34; }
  }
  .swiper-pagination-bullet { background: #B8B8B8; }
}
.black.dark .quick-bet .quick-bet-item {
  background: linear-gradient(to bottom, rgba(50,50,55,.5), rgba(41,41,46,.5));
  box-shadow: 0 .12rem .2rem 0 #151518;
  .quick-options {
    background: rgba(255,83,83,0);
    border: 1px solid #2e2f34;
    & > li:first-child { border-top: 0; }
  }
}
.horizontal .quick-bet .quick-bet-item {
  padding: .05rem .1rem .1rem .1rem;
}
</style>
