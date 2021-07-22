<template>
  <div
    v-if="focusMatchs && focusMatchs.length"
    class="quick-bet"
  >
    <h3>{{$t('pagelite.quickBetTitle')}}</h3>
    <swiper :options="swiperOption">
      <swiper-slide
        v-for="(m, i) in focusMatchs"
        :key="i"
      >
        <div class="quick-bet-item">
          <v-touch @tap="$router.push(`/detail/${m.sportID}/${m.matchID}`)">
            <span class="match-date">{{m.matchDate | dateFormat('MM/dd')}}</span>
            <h4>{{m.abbrName || m.tournamentName}}</h4>
            <div class="match-time">{{m.matchDate | dateFormat('HH:mm')}}</div>
            <div class="tns">
              <div class="tn">{{m.competitor1Name}}</div>
              <div class="tn">{{m.competitor2Name}}</div>
            </div>
          </v-touch>
          <list-options
            class="quick-options"
            :match="m"
            :games="m.games"
          />
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { findmatchsList } from '@/api/pull';
import ListOptions from '@/components/Matchs/MatchList/ListOptions';

export default {
  data() {
    return {
      swiperOption: {
        loop: true,
        loopAdditionalSlides: 1,
        centeredSlides: true,
        slidesPerView: 1,
        // autoplay: true,
        // autoplayTimeout: 15000,
        pagination: {
          el: '.swiper-pagination',
        },
      },
      focusMatchs: [],
    };
  },
  components: {
    swiper,
    swiperSlide,
    ListOptions,
  },
  async created() {
    try {
      const focusMatchs = await findmatchsList({
        sportID: 10,
        // TODO 有数据时改回用isFocus查询, 注册推送消息
        isFocus: 1,
        pageSize: 10,
        pageNum: 1,
      });

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
          games[1] = {
            options: [undefined, undefined, undefined],
          };
        }

        return ({
          ...m,
          isQuickBet: true,
          games,
        });
      });
    } catch (e) {
      console.log(e);
    }
  },
};
</script>
<style lang="less">
.quick-bet {
  margin-top: -.08rem;
  h3 {
    color: #4a4a4a;
    padding: .1rem .12rem;
    font-size: .16rem;
    font-weight: bolder;
  }
  .swiper-container {
    padding-bottom: .2rem;
  }
  .swiper-slide {
    padding: 0 .12rem;
  }
  .quick-bet-item {
    position: relative;
    box-shadow: 0 10px 20px 0 rgba(242, 228, 233, 0.5);
    background-image: linear-gradient(297deg, #f9f9f9, #ffffff);
    border-radius: 6px;
    padding: .1rem .1rem .2rem .1rem;
    h4 {
      color: #bababa;
      font-size: .14rem;
      line-height: .2rem;
      text-align: center;
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
    background: linear-gradient(to right, #fe597d, #ffb775);
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
    display: flex;
    color: #666;
    font-size: .15rem;
    text-align: center;
    margin-top: -.04rem;
    line-height: .22rem;
    & > div {
      width: 100%;
    }
    & > div:first-child {
      padding-right: .23rem;
    }
    & > div:last-child {
      padding-left: .23rem;
    }
    &::before {
      content: "";
      display: block;
      position: absolute;
      top: 60%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: .18rem;
      height: .02rem;
      border-radius: 1.5px;
      background: linear-gradient(93deg, #fe597d, #ffb775);
    }
  }
  .quick-options {
    margin-top: .12rem;
    border-radius: 6px;
    background-image: linear-gradient(to top, #f9f9f9, #ffffff);
    border: 1px solid #ecebeb;
    & > li {
      border-top: 1px solid #ecebeb;
    }
    & > li:first-child {
      border-top: 0;
    }
  }
  .swiper-pagination-bullet {
    width: .05rem;
    height: .05rem;
    background: #3a3a3a;
    margin: 0 .02rem;
  }
  .swiper-pagination-bullet-active {
    background: #ff5353;
  }
}

.black {
  h3 {
    color: #b0b0b0;
  }
  .quick-bet-item {
    background-image: linear-gradient(to bottom, #3c3b43, #2b2a31);
    box-shadow: 0 6px 9px 0 rgba(37, 37, 37, 0.5);
  }
  .tns {
    color: #e8e6e8;
  }
  .quick-options {
    background: linear-gradient(to bottom, #3a393f, #333238);
    border: 0;
    & > li {
      border-top: 1px solid #2e2f34;
    }
  }
}
</style>
