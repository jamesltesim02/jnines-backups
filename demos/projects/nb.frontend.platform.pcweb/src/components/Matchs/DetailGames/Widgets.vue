<template>
<div class="widgets">
  <div class="tabs">
    <ul>
      <li
        v-for="(w, i) in widgets"
        :key="i"
        :class="{ active: i === current }"
        @click="current = i"
      >{{$t(`page.detailmenu.${w}`)}}</li>
    </ul>
  </div>
  <div
    class="widget-container"
    :style="{ height: wcHeight }"
  >
    <sir-widget
      :video-id="videoId"
      :widget="widgets[current]"
    />
  </div>
</div>
</template>
<script>
import { mapState } from 'vuex';
import SirWidget from './SirWidget';

export default {
  props: ['videoId', 'state'],
  data() {
    return {
      current: 0,
    };
  },
  computed: {
    ...mapState('app', ['contentHeight']),
    widgets() {
      if (this.state === 1) {
        return [
          'match.statistics',
          'match.generalStatistics',
          'match.ballPosession',
          'match.lineups',
        ];
      }

      return [
        'team.comparison',
        'match.headToHead',
        'match.scoringProbabilityPerPeriod',
      ];
    },
    wcHeight() {
      if (!this.contentHeight) {
        return 'auto';
      }

      return `${this.contentHeight - 40}px`;
    },
  },
  components: {
    SirWidget,
  },
};
</script>
<style lang="less">
.widgets {
  width: 32%;
  min-width: 310px;
  .widget-container {
    position: relative;
    display: flex;
  }
  .tabs {
    padding: 0 20px 0 10px;
  }
  .sir-widget {
    width: 100%;
    height: 94%;
    padding-right: 10px;
    iframe {
      width: 100%;
      height: 100%;
    }
  }
  ul {
    display: flex;
    border-bottom: 1px solid #3a3a3a;
    li {
      position: relative;
      width: 100%;
      text-align: center;
      line-height: 22px;
      padding-bottom: 16px;
      cursor: pointer;
      transition: color .35s ease-out;
      &::before {
        content: "";
        position: absolute;
        bottom: 0;
        display: block;
        background: #ff5353;
        height: 4px;
        width: 100%;
        opacity: 0;
        transition: opacity .35s ease-out;
      }
      &.active {
        color: #ff5353;
        &::before {
          opacity: 1;
        }
      }
    }
  }
}
</style>
