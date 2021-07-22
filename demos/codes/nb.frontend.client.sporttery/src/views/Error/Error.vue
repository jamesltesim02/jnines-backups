<template>
  <div class="error-page">
    <nav-bar
      v-if="['404'].includes(code)"
      :title="title"
    />
    <div class="error-img">
      <cimg :src="src" />
    </div>
    <div>{{content}}</div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import NavBar from '@/components/common/NavBar';

const errorImages = {
  '503-white': require('./images/503-white.png'), // eslint-disable-line global-require
  '503-black': require('./images/503-black.png'), // eslint-disable-line global-require
  '403-black': require('./images/403-black.png'), // eslint-disable-line global-require
  '403-white': require('./images/403-white.png'), // eslint-disable-line global-require
  '404-black': require('./images/404-black.png'), // eslint-disable-line global-require
  '404-white': require('./images/404-white.png'), // eslint-disable-line global-require
};

export default {
  props: {
    code: {
      default: '404',
    },
  },
  computed: {
    ...mapState('app', ['theme']),
    src() {
      return errorImages[`${this.code}-${this.theme}`] || errorImages[`503-${this.theme}`];
    },
    title() {
      return this.$t(`page.error.${this.code}.title`);
    },
    content() {
      return this.$t(`page.error.${this.code}.content`);
    },
  },
  components: {
    NavBar,
  },
};
</script>
<style lang="less">
.error-page {
  font-size: .18rem;
  text-align: center;
  color: #777;
  .error-img {
    margin: 0 auto;
  }
  img {
    width: 1.8rem;
    margin: .8rem 0 .25rem;
  }
}
.black .error-page {
  color: #bababa;
}
</style>
