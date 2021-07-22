<template>
  <div class="error-page" v-if="!horizScreen">
    <nav-bar :title="title" />
    <div class="err-content" v-if="adObject && adObject.title && adObject.body">{{content}}</div>
    <div class="err-content" v-else>
      <cimg :src="src" />
      <div>{{content}}</div>
    </div>
  </div>
  <div class="error-page" v-else>
    <div class="error-header">
      <nav-bar :title="title" />
    </div>
    <div class="error-content">
      <div v-if="adObject && adObject.title && adObject.body">{{content}}</div>
      <div v-else>
        <cimg class="err-img" :src="src" />
        <div>{{content}}</div>
      </div>
    </div>
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
    ...mapState('app', ['theme', 'horizScreen', 'adObject']),
    src() {
      return errorImages[this.theme];
    },
    title() {
      return this.adObject && this.adObject.title ? this.adObject.title : this.$t('page.ade.title');
    },
    content() {
      if (this.adObject && this.adObject.body) {
        let bodyStr = this.adObject.body.replace(/width:[a-z0-9]+;/, '');
        bodyStr = bodyStr.replace(/\s*cellspacing="\d+"/i, ' cellspacing="0"');
        return bodyStr.replace(/\s*[a-z]+=""/, '');
      }
      return this.$t('page.ade.content');
    },
  },
  components: { NavBar },
};
</script>
<style lang="less">
.error-page {
  font-size: .18rem;
  text-align: center;
  color: #777 ;
  img { width: 1.8rem; margin: .8rem 0 .25rem; }
  .err-content, .error-content { padding: 0 .12rem; }
  p {
    margin-top: .12rem;
    margin-bottom: .12rem;
    line-height: .22rem;
  }
  table {
    width: 100%;
    line-height: .22rem;
    border: .01rem solid #bababa;
  }
}
.black .error-page { color: #bababa; }
.horizontal .error-page {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  .error-header {
    position: relative;
    width: 100%;
    height: .44rem;;
    z-index: 12;
  }
  .error-content {
    position: relative;
    flex-grow: 1;
    z-index: 10;
    width: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .err-img { margin-top: .35rem; }
  }
}
</style>
