<template>
  <list-page class="rebate-description">
    <nav-bar :title="data.title || ''" slot="header" />
    <ul class="rule-list" v-if="data.details">
      <li v-for="(v, k) in data.details" :key="k">
        <div class="list-str" v-if="typeof v === 'string'">{{v || ''}}</div>
        <div class="list-table flex-center-col-top" v-else-if="v && v.data && typeof v.data === 'object' && v.data.constructor === Array">
          <div class="list-row flex-center" v-for="(x, i) in v.data" :key="i" :style="`width: ${v.width || '100%'}`">
            <div class="list-cell flex-center" v-for="(y, j) in x" :key="j">{{y || ''}}</div>
          </div>
        </div>
      </li>
    </ul>
  </list-page>
</template>

<script>
import ListPage from '@/components/common/ListPage';
import NavBar from '@/components/common/NavBar';

export default {
  data() {
    return { data: {} };
  },
  props: ['id'],
  components: { ListPage, NavBar },
  mounted() {
    this.data = this.$t('protal')[this.id];
  },
};
</script>

<style lang="less">
.white .rebate-description .rule-list {
  color: #716D6D;
  .list-row:first-child .list-cell { border-top: .01rem solid #716D6D; }
  .list-cell {
    border-right: .01rem solid #716D6D;
    border-bottom: .01rem solid #716D6D;
  }
  .list-cell:first-child { border-left: .01rem solid #716D6D; }
}
.black .rebate-description .rule-list {
  color: #bababa;
  .list-row:first-child .list-cell { border-top: .01rem solid #bababa; }
  .list-cell {
    border-right: .01rem solid #bababa;
    border-bottom: .01rem solid #bababa;
  }
  .list-cell:first-child { border-left: .01rem solid #bababa; }
}
.rebate-description .rule-list {
  padding: 0 .1rem 0 .15rem;
  li {
    margin-top: 0;
    list-style: none;
    .list-str { margin-top: .15rem; }
    .list-table {
      margin-top: .05rem;
      width: 100%;
      .list-row {
        height: .24rem;
        .list-cell { width: 100%; height: 100%; }
      }
      .list-row:first-child { height: .26rem; }
    }
  }
}
</style>
