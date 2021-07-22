<template>
  <div class="error-page">
    <nav-bar :title="title" />
    <cimg :src="src" />
    <div>{{content}}</div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import NavBar from '@/components/common/NavBar';

const errorImages = {
  black: require('./images/ade-black.png'), // eslint-disable-line global-require
  white: require('./images/ade-white.png'), // eslint-disable-line global-require
};

export default {
  computed: {
    ...mapState('app', ['theme']),
    src() {
      return errorImages[this.theme];
    },
    title() {
      return this.$t('page.ade.title');
    },
    content() {
      return this.$t('page.ade.content');
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
  color: #777 ;
  img {
    width: 1.8rem;
    margin: .8rem 0 .25rem;
  }
}
.black .error-page {
  color: #bababa;
}
</style>
