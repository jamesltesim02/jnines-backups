<template>
<div
  v-if="videoId"
  class="sir-widget"
>
  <iframe
    v-if="[10, 11].includes(sno)"
    :src="videoUrl"
    scrolling="no"
    :style="{ height: tcHeight }"
  >video</iframe>
  <no-records v-else>没有统计数据</no-records>
</div>
</template>
<script>
import { mapState } from 'vuex';
import { getLang } from '@/utils/I18nUtil';

export default {
  props: ['sno', 'videoId', 'widget'],
  data() {
    return {
      loadHandler: null,
      tcHeight: '500px',
    };
  },
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
        setTheme: /white/i.test(this.theme) ? 'white' : 'black',
      }).map(([k, v]) => `${k}=${v || ''}`).join('&');

      return `${LIVE_MEDIA_URL}common-widget.html?${params}`;
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
.sir-widget {
  iframe {
    width: 100%;
    border: 0;
  }
  // .no-data {
  //   text-align: center;
  //   padding: .2rem;
  //   background: #fff;
  //   margin: 15px;
  //   p {
  //     color: #000;
  //     margin-top: .1rem;
  //     opacity: .7;
  //   }
  // }
}
</style>
