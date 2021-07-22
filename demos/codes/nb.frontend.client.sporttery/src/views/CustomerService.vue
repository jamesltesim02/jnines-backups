<template>
  <div class="cuservice-page">
    <div class="cuservice-head">
      <nav-bar :title="$t('pagelite.custService')" />
    </div>
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
  width: 100%;
  height: 100%;
  overflow: hidden;
  .cuservice-head {
    position: fixed;
    width: 100%;
    height: .44rem;
    background: #fff;
    color: #2e2f34;
  }
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
    padding-top: .08rem;
  }
}
.black .cuservice-page .cuservice-head {
  background: #28272d;
  color: #fff;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.25);
}
.horizontal .cuservice-page iframe {
  padding-top: .11rem;
}
</style>
