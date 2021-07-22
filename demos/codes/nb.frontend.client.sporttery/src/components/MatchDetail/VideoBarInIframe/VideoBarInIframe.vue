<template>
<div
  v-if="videoId"
  class="video-bar"
>
  <iframe :src="videoUrl" scrolling="no" allowfullscreen>video</iframe>
  <v-touch
    v-if="noticeExistable"
    class="notice"
    @tap="noticeVisible = !noticeVisible"
  >
    <img src="./notice.png" />
    <p v-show="noticeVisible">{{$t('portal.b06.liveTips')}}</p>
  </v-touch>
</div>
</template>
<script>
import { mapState } from 'vuex';
import { getLang } from '@/utils/I18nUtil';

/**
 * FONT_ID对照
 * 亚游: 102001011JIaThBA
 * 凯时: 1000610117Qe1Gj0 (A06)
 * 酷游: 102061011cYgTGB2 (B06 凯发电游)
 * 和记: 1010410116Ea5Hq7 (E03)
 * 永乐: 101031011k3Lx9Tf (E04)
 */
const { FRONT_ID } = window.NBConfig;

export default {
  props: ['videoId', 'matchVideo', 'mediaType'],
  data() {
    return {
      noticeVisible: false,
    };
  },
  computed: {
    ...mapState('app', ['isLoged', 'userinfo']),
    liveUrl() {
      if (!this.matchVideo) {
        return '';
      }

      /**
       * FONT_ID对照
       * 亚游: 102001011JIaThBA
       * 凯时: 1000610117Qe1Gj0 (A06)
       * 酷游: 102061011cYgTGB2 (B06 凯发电游)
       * 和记: 1010410116Ea5Hq7 (E03)
       * 永乐: 101031011k3Lx9Tf (E04)
       */
      if (FRONT_ID === '102061011cYgTGB2' && (!this.isLoged || !+this.userinfo.balance > 1)) {
        return '';
      }
      return encodeURIComponent(this.matchVideo || '');
    },
    videoUrl() {
      const [
        mediaUrl,
        lmtPage,
        lang,
        matchId,
        liveUrl,
        mediaType,
      ] = [
        window.NBConfig.LIVE_MEDIA_URL,
        'live-match-tracker.html',
        getLang(),
        this.videoId,
        this.liveUrl,
        this.mediaType || 'lmt',
      ];

      return `${mediaUrl}${lmtPage}?matchId=${matchId}&lang=${lang}&liveUrl=${liveUrl}&mediaType=${mediaType}`;
    },
    noticeExistable() {
      /**
       * FONT_ID对照
       * 亚游: 102001011JIaThBA
       * 凯时: 1000610117Qe1Gj0 (A06)
       * 酷游: 102061011cYgTGB2 (B06 凯发电游)
       * 和记: 1010410116Ea5Hq7 (E03)
       * 永乐: 101031011k3Lx9Tf (E04)
       */
      return FRONT_ID === '102061011cYgTGB2' && this.matchVideo;
    },
  },
};
</script>
<style lang="less">
.video-bar {
  position: relative;
  // height: 2rem;
  height: 100%;
  background: #061204;
  overflow: hidden;
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
  .notice {
    position: absolute;
    right: 0;
    top: 0;
    width: .3rem;
    width: .3rem;
    padding: .05rem;
    img {
      width: .2rem;
      height: .2rem;
    }
    p {
      position: absolute;
      width: 2rem;
      right: 0;
      background: #232227;
      color: #989898;
      font-size: .1rem;
      padding: .07rem;
      margin-top: .15rem;
      &::before {
        content: "";
        box-sizing: content-box;
        position: absolute;
        right: .06rem;
        top: -0.12rem;
        width: 0;
        border: 0.1rem solid transparent;
        border-top: 0;
        border-bottom: .12rem solid #232227;
      }
    }
  }
}
</style>
