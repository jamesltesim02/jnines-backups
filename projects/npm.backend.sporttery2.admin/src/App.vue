<template>
<div id="root">
  <!-- 判断是否需要全屏显示该路由 -->
  <router-view v-if="fullpage" />
  <div
    v-else
    id="page-container"
    class="sidebar-l sidebar-o side-scroll header-navbar-fixed"
  >
    <Sidebar />
    <Header />
    <main id="main-container">
      <!-- <PageHeader /> -->
      <router-view class="content"/>
    </main>
  </div>
  <Toaster />
  <StoreRouter />
</div>
</template>
<script>
import devConfig from '@/config/config.dev';

import Toaster from '@/components/common/Toaster';
import StoreRouter from '@/components/common/StoreRouter';
import Sidebar from '@/components/common/Sidebar';
import Header from '@/components/common/Header';
import PageHeader from '@/components/common/PageHeader';

export default {
  computed: {
    // 是否需要全屏显示该路由
    fullpage() {
      return devConfig.fullPages.findIndex(pattern => pattern.test(this.$route.path)) > -1
    },
  },
  components: {
    Toaster,
    StoreRouter,
    Sidebar,
    Header,
    PageHeader
  }
}
</script>
<style>
#root, #page-container {
  min-height: 100%;
}
</style>
