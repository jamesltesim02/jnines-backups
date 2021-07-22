<template>
  <div class="detail-games">
    <detail-item
      v-for="(g, i) in match.games"
      :key="i"
      :game="g"
      :match="match"
    />
  </div>
</template>
<script>
import DetailItem from './DetailItem';

export default {
  props: ['match'],
  components: {
    DetailItem,
  },
};
</script>
<style lang="less">
.detail-games {
  padding: 10px 0 5px 0;
}
</style>
