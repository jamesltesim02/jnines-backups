<template>
  <list-page class="rebate-description" v-if="!horizScreen">
    <nav-bar :title="ptObject && ptObject.title ? ptObject.title : ''" slot="header" />
    <div class="rule-list" v-html="ptObject && ptObject.body ? ptObject.body : ''"></div>
  </list-page>
  <div class="rebate-description" v-else>
    <div class="rebate-description-header">
      <nav-bar :title="ptObject && ptObject.title ? ptObject.title : ''" />
    </div>
    <div class="rebate-description-content">
      <div class="rule-list" v-html="ptObject && ptObject.body ? ptObject.body : ''"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ListPage from '@/components/common/ListPage';
import NavBar from '@/components/common/NavBar';

export default {
  props: ['id'],
  computed: {
    ...mapState('app', ['horizScreen', 'ptObject']),
  },
  components: { ListPage, NavBar },
  mounted() {
    setTimeout(() => {
      if (!this.ptObject || !this.ptObject.title) {
        this.$router.go(-1);
      } else if (this.ptObject && this.ptObject.body) {
        let bodyStr = this.ptObject.body.replace(/width:[a-z0-9]+;/, '');
        bodyStr = bodyStr.replace(/\s*cellspacing="\d+"/i, ' cellspacing="0"');
        this.ptObject.body = bodyStr.replace(/\s*[a-z]+=""/, '');
      }
    }, 100);
  },
};
</script>

<style lang="less">
.white .rebate-description .rule-list {
  color: #716D6D;
  table { border: .01rem solid #bababa }
}
.black .rebate-description .rule-list {
  color: #bababa;
  table { border: .01rem solid #bababa }
}
.rebate-description .rule-list {
  padding: 0 .12rem;
  p {
    margin-top: .12rem;
    margin-bottom: .12rem;
    line-height: .22rem;
  }
  table {
    width: 100%;
    line-height: .22rem;
  }
}
.horizontal .rebate-description {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  .rebate-description-header {
    position: relative;
    width: 100%;
    height: .44rem;;
    z-index: 12;
  }
  .rebate-description-content {
    position: relative;
    flex-grow: 1;
    z-index: 10;
    width: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: .1rem;
  }
}
</style>
