<template>
<div
  v-if="videoId"
  class="sir-widget"
>
  <iframe
    :src="videoUrl"
  >video</iframe>
</div>
</template>
<script>
import { getLang } from '@/utils/I18nUtil';

export default {
  props: ['videoId', 'widget'],
  data() {
    return {
      loadHandler: null,
      tcHeight: '1000px',
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
        'common-widget.html',
        getLang(),
        this.videoId,
        `${window.location.protocol}//${window.location.host}`,
      ];

      return `${mediaUrl}${lmtPage}?matchId=${matchId}&lang=${lang}&origin=${origin}&widget=${this.widget}&clientType=pc`;
    },
  },
  mounted() {
    this.loadHandler = ({ data: msg }) => {
      if (msg.action !== `${this.widget}-loaded`) {
        return;
      }

      this.tcHeight = `${Math.max(msg.data, 350)}px`;
    };
    window.addEventListener('message', this.loadHandler.bind(this), false);
  },
  beforeDestroy() {
    window.removeEventListener('message', this.loadHandler);
  },
};
</script>
<style lang="less">
.sir-widget iframe {
  width: 100%;
  border: 0;
}
</style>
