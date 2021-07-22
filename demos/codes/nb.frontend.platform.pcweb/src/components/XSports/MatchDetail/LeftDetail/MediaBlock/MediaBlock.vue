<template>
  <div
    ref="el"
    class="x-media-block"
    :style="{
      height: `${elHeight}px`,
    }"
  >
  <video-bar
    v-if="value !== 0 && [10, 11].includes(match.sportID)"
    :video-id="match.videoId"
    :match-video="liveUrl"
    :media-type="['lmt', 'video', 'lmt'][value]"
  />
  <default-block v-else :match="match" />
  <div
    v-if="switcherVisible && value === 0"
    class="switcher"
  >
    <ul>
      <li
        v-if="liveUrl"
        tag="li"
        @click="value = 1"
      ><icon-video />视频直播</li>
      <li
        tag="li"
        @click="value = 2"
      ><icon-court />动画直播</li>
    </ul>
  </div>
</div>
</template>
<script>
import IconVideo from '../icons/IconVideo';
import IconCourt from '../icons/IconCourt';
import VideoBar from './VideoBar';
import DefaultBlock from './DefaultBlock';

const WH_PROPORTION = 0.56;

export default {
  props: {
    match: {},
  },
  data() {
    return {
      el: null,
      elWidth: 0,
      value: 0,
    };
  },
  computed: {
    elHeight() {
      return parseInt(this.elWidth * WH_PROPORTION, 10);
    },
    liveUrl() {
      return this.match.matchState === 1
        ? this.match.matchVideo
        : null;
    },
    finished() {
      return this.match.matchState === 3;
    },
    switcherVisible() {
      return [10, 11].includes(this.match.sportID) && !this.finished;
    },
  },
  components: {
    VideoBar,
    DefaultBlock,
    IconVideo,
    IconCourt,
  },
  mounted() {
    this.el = this.$refs.el;
    this.initWith();
    window.addEventListener('resize', this.initWith.bind(this));
  },
  methods: {
    initWith() {
      if (this.el) {
        this.elWidth = this.el.clientWidth;
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.initWith);
  },
};
</script>
<style lang="less">
.x-media-block {
  position: relative;
  display: flex;
  align-items: center;
  .switcher {
    position: absolute;
    bottom: 22%;
    width: 100%;
    text-align: center;
    color: #fff;
    font-size: 12px;
    ul {
      display: inline-flex;
      background: rgba(0, 0, 0, .5);
      line-height: 30px;
      border-radius: 15px;
      li {
        position: relative;
        display: flex;
        align-items: center;
        padding: 0 15px;
        cursor: pointer;
        svg {
          margin-right: 10px;
        }
        &:nth-child(2)::before {
          content: "";
          position: absolute;
          display: block;
          width: 1px;
          height: 18px;
          background: #202020;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
      }
    }
  }
}
</style>
