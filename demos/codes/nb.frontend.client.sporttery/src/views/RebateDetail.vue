<template>
  <list-page class="rebate-description" v-if="!horizScreen">
    <nav-bar :title="data.title || ''" slot="header" />
    <ul class="rule-list" v-if="data.details">
      <li v-for="(v, k) in data.details" :key="k">
        <div class="list-str">{{v || ''}}</div>
      </li>
    </ul>
  </list-page>
  <div class="rebate-description" v-else>
    <div class="rebate-description-header">
      <nav-bar :title="data.title || ''" />
    </div>
    <div class="rebate-description-content">
      <ul class="rule-list" v-if="data.details">
        <li v-for="(v, k) in data.details" :key="k">
          <div class="list-str">{{v || ''}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ListPage from '@/components/common/ListPage';
import NavBar from '@/components/common/NavBar';

export default {
  data() {
    return {
      data: {
        title: '',
        details: [],
      },
    };
  },
  computed: {
    ...mapState('app', ['horizScreen']),
  },
  components: { ListPage, NavBar },
  mounted() {
    this.data = this.$t('rebate.rebateDetail');
  },
};
</script>

<style lang="less">
.white .rebate-description .rule-list {
  color: #716D6D;
}
.black .rebate-description .rule-list {
  color: #bababa;
}
.rebate-description .rule-list {
  padding: 0 .12rem;
  .list-str {
    margin-top: .12rem;
    margin-bottom: .12rem;
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
