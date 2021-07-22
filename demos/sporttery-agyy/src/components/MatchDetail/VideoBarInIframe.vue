<template>
<div
  v-if="videoId"
  class="video-bar"
>
  <iframe :src="videoUrl" scrolling="no">video</iframe>
</div>
</template>
<script>
import { getLang } from '@/utils/I18nUtil';

export default {
  props: ['videoId'],
  computed: {
    videoUrl() {
      const [
        mediaUrl,
        lmtPage,
        lang,
        matchId,
      ] = [
        window.NBConfig.LIVE_MEDIA_URL,
        'live-match-tracker.html',
        getLang(),
        this.videoId,
      ];

      return `${mediaUrl}${lmtPage}?matchId=${matchId}&lang=${lang}`;
    },
  },
};
</script>
<style lang="less">
.video-bar {
  height: 2.33rem;
  background: #061204;
  overflow: hidden;
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
}
</style>
