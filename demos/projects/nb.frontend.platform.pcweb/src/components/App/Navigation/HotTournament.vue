<template>
  <section class="hot-tournament">
    <h3>{{$t('page.blocktitle.hottour')}}</h3>
    <ul>
      <li
        v-for="t in hotTours"
        :key="t.tournamentID"
        :class="{active: t.tournamentID === tourid}"
        @click="toTourPage(t)"
      >{{t.abbr}}</li>
    </ul>
  </section>
</template>
<script>
import appConfig from '@/config/business.config';
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState('match', ['sno', 'hotTours', 'tourid']),
  },
  data() {
    return {
      delayRefreshTimer: null,
    };
  },
  mounted() {
    this.loadHotTours();
    if (appConfig.matchsReloadTime) {
      this.delayRefreshTimer = setInterval(this.loadHotTours.bind(this), appConfig.matchsReloadTime);
    }
  },
  beforeDestroy() {
    clearInterval(this.delayRefreshTimer);
  },
  methods: {
    ...mapActions('match', ['loadHotTours']),
    toTourPage(tour) {
      if (this.tourid !== tour.tournamentID) {
        this.$router.push(`/tour/${tour.sportID}/${tour.tournamentID}`);
      }
    },
  },
};
</script>

<style lang="less">
.hot-tournament {
  h3 {
    color: #b0b0b0;
    font-size: 20px;
    line-height: 70px;
    text-align: center;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    font-size: 13px;
    padding: 0 5px;
    li {
      cursor: pointer;
      margin: 5px;
      padding: 6px 16px;
      color: #ff5353;
      text-align: center;
      border-radius: 18px;
      border: 2px solid #37363C;
      transition: all .35s ease-out;
      &:hover {
        border-color: rgba(255, 83, 83, .8);
      }
      &.active {
        color: #fff;
        background-color: #ff5353;
        border-color: #ff5353;
        &:hover {
          border-color: #ff5353;
        }
      }
    }
  }
}
</style>
