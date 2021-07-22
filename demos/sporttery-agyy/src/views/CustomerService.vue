<template>
  <div class="cuservice-page">
    <nav-bar
      :title="$t('pagelite.custService')"
    />
    <iframe scrolling="0" :src="src"></iframe>
  </div>
</template>
<script>
import { live800Url } from '@/utils/AgPortalUtils';
import NavBar from '@/components/common/NavBar';

export default {
  computed: {
    src() {
      return live800Url(this);
    },
  },
  components: {
    NavBar,
  },
};
</script>
<style lang="less">
.cuservice-page {
  width: 3.75rem;
  height: 100%;
  overflow: hidden;
  .nav-bar {
    position: fixed;
    width: 100%;
  }
  .nav-bar,
  .nav-operators,
  .nav-content,
  .nav-bar .nav-operators .opr-others {
    height: .42rem;
    line-height: .42rem;
  }
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
}
</style>
