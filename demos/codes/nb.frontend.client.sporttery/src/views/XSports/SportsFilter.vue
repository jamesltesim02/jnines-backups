<template>
  <list-page class="x-sports-filter">
    <nav-bar
      title="赛事种类"
      slot="header"
    />
    <sports-filter-list />
  </list-page>
</template>
<script>
import SportsFilterList from '@/components/XSports/SportsFilterList';

export default {
  components: { SportsFilterList },
};
</script>
<style lang="less">
.x-sports-filter {
  .nav-bar {
    border-bottom: 1px solid #ecebeb;
  }
  .nav-content {
    font-size: .18rem;
    letter-spacing: -0.4px;
  }
}
.blue .x-sports-filter {
  .nav-bar {
    border-bottom: 1px solid #2e2f34;
  }
}
</style>
