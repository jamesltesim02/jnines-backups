<template>
<div class="video-bar">
  <iframe
    :src="videoUrl"
    scrolling="no"
  >video</iframe>
</div>
</template>
<script>
import { getLang } from '@/utils/I18nUtil';

export default {
  props: ['sno', 'videoId', 'matchVideo'],
  computed: {
    videoUrl() {
      const [
        mediaUrl,
        lmtPage,
        lang,
        matchId,
        liveUrl,
      ] = [
        window.NBConfig.LIVE_MEDIA_URL,
        'live-match-tracker.html',
        getLang(),
        this.videoId,
        encodeURIComponent(this.matchVideo || ''),
      ];

      return `${mediaUrl}${lmtPage}?matchId=${matchId}&lang=${lang}&liveUrl=${liveUrl}`;
    },
  },
};
</script>
<style lang="less">
.video-bar {
  width: 100%;
  height: 100%;
  background: #061204;
  overflow: hidden;
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
}
</style>
