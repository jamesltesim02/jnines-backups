<template>
  <section class="x-program-match-items">
    <program-match-item
      v-if="items.length === 1"
      :match="items[0]"
      class="items-line"
      :ensure-odds="ensureOdds"
    />
    <template v-else>
      <v-touch
        tag="a"
        class="items-line"
        @tap="expanded = !expanded"
      >
        {{ '一二三四五六七八九十'.charAt(items.length - 1) }}串一
        <icon-arrow
          :direction="expanded ? 'up' : 'down'"
          color="#bababa"
        />
        <span
          v-if="ensureOdds"
          class="ensure-odds"
        >保底{{ensureOdds}}</span>
      </v-touch>
      <expand-transition :expanded="expanded">
        <program-match-item
          v-for="(item, i) in items"
          :key="i"
          :match="item"
        />
      </expand-transition>
    </template>
  </section>
</template>
<script>
import ProgramMatchItem from './ProgramMatchItem';

export default {
  props: {
    items: {
      default: () => [],
    },
    ensureOdds: {
      default: null,
    },
  },
  data() {
    return {
      expanded: false,
    };
  },
  components: {
    ProgramMatchItem,
  },
};
</script>
<style lang="less">
.x-program-match-items {
  font-size: .12rem;
  color: #aaa;
  margin: 0 -.1rem;
  .items-line {
    // display: block;
    background-image: linear-gradient(to top, #fcfcfc, #f3f3f3);
    line-height: .3rem;
    padding: 0 .1rem;
    border-top: solid 1px #f6f6f6;
    border-bottom: solid 1px #f6f6f6;
    white-space: nowrap;
  }
  .icon-arrow {
    height: .12rem !important;
    margin-left: .06rem;
  }
  .ensure-odds {
    display: inline-block;
    background: #ff5353;
    color: #fff;
    line-height: .14rem;
    font-size: .12rem;
    padding: .01rem .06rem;
    border-radius: 10rem;
    margin-left: .1rem;
  }
}
.blue .x-program-match-items {
  color: #909090;
  .items-line {
    background: linear-gradient(to top, #303030, #343438);
    border-top: solid 1px #2e2f34;
    border-bottom: solid 1px #2e2f34;
  }
  .ensure-odds {
    background: #ff5353;
    color: #fff;
  }
}
</style>
