<template>
<div
  v-if="videoId"
  class="momentum-bar"
>
  <iframe :src="videoUrl" scrolling="no">video</iframe>
</div>
</template>
<script>
import { getLang } from '@/utils/I18nUtil';

export default {
  props: ['videoId'],
  data() {
    return {
      loadHandler: null,
    };
  },
  computed: {
    videoUrl() {
      const [
        mediaUrl,
        lmtPage,
        lang,
        matchId,
        origin,
      ] = [
        window.NBConfig.LIVE_MEDIA_URL,
        'match-momentum.html',
        getLang(),
        this.videoId,
        `${window.location.protocol}//${window.location.host}`,
      ];

      return `${mediaUrl}${lmtPage}?matchId=${matchId}&lang=${lang}&origin=${origin}`;
    },
  },
};
</script>
<style lang="less">
.momentum-bar {
  line-height: 0;
  iframe {
    width: 100%;
    border: 0;
    height: 1.32rem;
  }
}
</style>
