<template>
  <div class="x-media-block">
    <video-bar-in-iframe
      v-if="value !== 0 && [10, 11].includes(matchInfo.sportID)"
      :video-id="matchInfo.videoId"
      :match-video="liveUrl"
      :media-type="['lmt', 'video', 'lmt'][value]"
    />
    <default-block
      v-else
      :match-info="matchInfo"
    />
    <div
      v-if="switcherVisible && value === 0"
      class="switcher"
    >
      <ul>
        <v-touch
          v-if="liveUrl"
          tag="li"
          @tap="$emit('change', 1)"
        ><icon-video />视频直播</v-touch>
        <v-touch
          tag="li"
          @tap="$emit('change', 2)"
        ><icon-court />动画直播</v-touch>
      </ul>
    </div>
    <v-touch
      tag="button"
      :class="{
        pin: true,
        pined: pin,
      }"
      @tap="$emit('update:pin', !pin)"
    ><icon-pin /></v-touch>
  </div>
</template>
<script>
import DefaultBlock from '@/components/XSports/MatchInfo/MediaBlock/DefaultBlock';
import VideoBarInIframe from '@/components/MatchDetail/VideoBarInIframe';
import IconVideo from './icons/IconVideo';
import IconCourt from './icons/IconCourt';
import IconPin from './icons/IconPin';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Number,
      required: true,
    },
    pin: {
      type: Boolean,
      required: true,
    },
    matchInfo: {},
  },
  computed: {
    liveUrl() {
      return this.matchInfo.matchState === 1
        ? this.matchInfo.matchVideo
        : null;
    },
    switcherVisible() {
      return [10, 11].includes(this.matchInfo.sportID);
    },
  },
  components: {
    DefaultBlock,
    VideoBarInIframe,
    IconVideo,
    IconCourt,
    IconPin,
  },
};
</script>
<style lang="less">
.x-media-block {
  position: relative;
  width: 3.75rem;
  height: 2.2rem;
  font-size: .12rem;
  .switcher {
    position: absolute;
    width: 100%;
    bottom: .15rem;
    color: #f9f9f9;
    text-align: center;
    ul {
      display: inline-flex;
      line-height: .24rem;
      background: rgba(0, 0, 0, .5);
      border-radius: .11rem;
      padding: 0 .09rem;
      li {
        position: relative;
        padding: 0 .06rem;
        &:first-child {
          padding-left: 0;
        }
        &:last-child {
          padding-right: 0;
        }
        &:nth-child(2)::before {
          content: "";
          position: absolute;
          display: block;
          width: .01rem;
          height: .11rem;
          background: #202020;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
      }
      svg {
        transform: translateY(.02rem);
        margin-right: .03rem;
      }
    }
  }
  .pin {
    position: absolute;
    display: inline-block;
    right: .05rem;
    top: .9rem;
    color: #fff;
    opacity: .8;
    &.pined .pin-line{
      fill: #ff5353;
    }
  }
}
</style>
