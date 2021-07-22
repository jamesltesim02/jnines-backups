<template>
  <section class="sports-filter">
    <h3>{{$t('page.blocktitle.all')}}</h3>
    <ul>
      <li
        v-for="s in sports"
        :key="s"
        :class="{
          active: s === sno
        }"
      >
        <a @click="toSport(s)">
          <icon-sport :sno="s" />
          {{$t(`common.sports.${s}`)}}
          <span>{{sportCounts[s] || 0}}</span>
        </a>
      </li>
    </ul>
  </section>
</template>
<script>
import appConfig from '@/config/business.config';
import { mapState } from 'vuex';
import { matchCountBySport } from '@/api/pull';

import IconSport from '@/components/common/icons/IconSport';

// 当前可用体育项
const sports = window.NBConfig.AVAILABLE_SPORTS;

export default {
  data() {
    return {
      sports,
      sportCounts: {},
      delayRefreshTimer: null,
    };
  },
  computed: {
    ...mapState('match', ['sno']),
  },
  components: {
    IconSport,
  },
  watch: {
    sno() {
      this.querySportCount();
      if (appConfig.matchsReloadTime) {
        clearInterval(this.delayRefreshTimer);
        this.delayRefreshTimer = setInterval(this.querySportCount.bind(this), appConfig.matchsReloadTime);
      }
    },
  },
  mounted() {
    this.querySportCount();
    if (appConfig.matchsReloadTime) {
      this.delayRefreshTimer = setInterval(this.querySportCount.bind(this), appConfig.matchsReloadTime);
    }
  },
  beforeDestroy() {
    clearInterval(this.delayRefreshTimer);
  },
  methods: {
    toSport(sport) {
      if (sport !== this.sno) {
        this.$router.push(`/tomatchs/${sport}`);
      }
    },
    async querySportCount() {
      const counts = await matchCountBySport();
      if (counts && counts.length) {
        const sc = {};
        counts.forEach(({ matNum, sportID }) => {
          sc[sportID] = matNum;
        });
        this.sportCounts = sc;
      }
    },
  },
};
</script>
<style lang="less">
.sports-filter {
  h3 {
    color: #b0b0b0;
    font-size: 20px;
    line-height: 28px;
    text-align: center;
  }
  ul {
    border-top: 2px solid #2e2f34;
    margin-top: 8px;
    line-height: 45px;
    font-size: 14px;
    li {
      padding-left: 7px;
      a {
        padding-left: 7px;
        position: relative;
        display: block;
        overflow: hidden;
        cursor: pointer;
        transition: all .35s ease-out;
        &::before {
          content: "";
          position: absolute;
          display: block;
          height: 2px;
          width: 100%;
          bottom: 0;
          left: 7px;
          background: #2e2f34;
        }
      }
      span {
        position: absolute;
        right: 10px;
        font-size: 12px;
        color: #666;
        transition: all .35s ease-out;
      }
      &.active {
        svg g {
          fill: #ff5353;
        }
        a,span {
          color: #ff5353;
        }
      }
    }
  }
  svg {
    vertical-align: middle;
    margin-right: 10px;
    width: 23px
  }
}
</style>
