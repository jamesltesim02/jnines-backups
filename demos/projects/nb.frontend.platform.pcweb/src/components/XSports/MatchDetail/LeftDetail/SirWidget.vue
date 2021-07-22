<template>
<div
  v-if="videoId"
  class="sir-widget"
>
  <iframe
    v-if="[10, 11].includes(sno)"
    :src="videoUrl"
  >video</iframe>
  <div
    v-else
    class="no-data"
  >
    <icon-report />
    <p>没有统计数据</p>
  </div>
</div>
</template>
<script>
import { mapState } from 'vuex';
import { getLang } from '@/utils/I18nUtil';
import IconReport from './icons/IconReport';

export default {
  props: ['sno', 'videoId', 'widget'],
  computed: {
    ...mapState('app', ['theme']),
    videoUrl() {
      const {
        location: {
          protocol,
          host,
        },
        NBConfig: {
          LIVE_MEDIA_URL,
        },
      } = window;

      const params = Object.entries({
        matchId: this.videoId,
        lang: getLang(),
        origin: `${protocol}//${host}`,
        widget: this.widget,
        setTheme: this.theme === 'white' ? 'white' : 'black',
        clientType: 'pc',
      }).map(([k, v]) => `${k}=${v || ''}`).join('&');

      return `${LIVE_MEDIA_URL}common-widget.html?${params}`;
    },
  },
  components: {
    IconReport,
  },
};
</script>
<style lang="less">
.sir-widget {
  width: 100%;
  height: 100%;
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
  .no-data {
    text-align: center;
    padding: 20px;
    background-image: linear-gradient(to top, #f9f9f9, #ffffff);
    margin: 15px;
    p {
      color: #000;
      margin-top: 10px;
      opacity: .7;
    }
  }
}

.dark .sir-widget .no-data {
  background-image: linear-gradient(to bottom, #36353d, #2f2d34);
  p {
    color: #bababa;
  }
}
</style>
