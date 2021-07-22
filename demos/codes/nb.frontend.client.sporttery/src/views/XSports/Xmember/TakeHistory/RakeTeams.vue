<template>
<span class="x-rake-teams">
  <template v-for="(m, i) in items">
    <div
      :key="i"
      v-if="expanded || i <= 2"
    >{{m.homeName}} vs {{m.awayName}}</div>
  </template>
  <div
    v-if="items.length > 3 && !expanded"
    class="expand-opr"
  >
    <v-touch
      tag="button"
      @tap="expanded = true"
    >...</v-touch>
  </div>
</span>
</template>
<script>
export default {
  props: {
    items: {
      default: () => [],
    },
  },
  data() {
    return {
      expanded: false,
    };
  },
};
</script>
<style lang="less">
.x-rake-teams {
  div {
    display: block;
    width: 100%;
    &.expand-opr {
      text-align: left;
      padding: 0 .15rem;
    }
  }
}
</style>
