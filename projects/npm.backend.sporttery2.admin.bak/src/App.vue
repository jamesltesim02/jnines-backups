<template>
  <div
    id="page-container"
    class="sidebar-l sidebar-o side-scroll header-navbar-fixed"
  >
    <Sidebar />
    <Header />
    <main id="main-container">
      <PageHeader />
      <router-view class="content"/>
    </main>
  </div>
</template>
<script>
import Sidebar from '@/components/common/Sidebar'
import Header from '@/components/common/Header'
import PageHeader from '@/components/common/PageHeader'

export default {
  components: {
    Sidebar,
    Header,
    PageHeader
  }
}
</script>