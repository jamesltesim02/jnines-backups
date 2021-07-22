<template>
  <div>
    <nav-bar />
    <row class="sports-bar">足球,篮球,棒球</row>
    <banner />
    <race-bar />
    <panel>
      aaa
    </panel>
    <router-link to="/operators">常用操作</router-link>
  </div>
</template>
<script>
import NavBar from '@/components/index/NavBar'
import Banner from '@/components/index/Banner'
import RaceBar from '@/components/index/RaceBar'
export default {
  components: {
    Banner,
    NavBar,
    RaceBar
  }
}
</script>
<style lang="less" scoped>
.sports-bar {
  background: @sportsBarBgColor;
  height: .44rem;
  line-height: .44rem;
}
</style>

