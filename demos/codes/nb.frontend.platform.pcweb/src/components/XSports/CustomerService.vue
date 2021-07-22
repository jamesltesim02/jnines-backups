<template>
  <a
    v-if="csUrl"
    class="x-btn-customer-service"
    @click="toPortalUrlByKey('SERVICE_CENTER_URL')"
    :title="$t('agPage.service.online')"
  >
    <span class="c1"></span>
  </a>
</template>
<script>
import { getSettingAttr, toPortalUrlByKey } from '@/utils/PortalUtils';

export default {
  computed: {
    csUrl() {
      return getSettingAttr('SERVICE_CENTER_URL');
    },
  },
  methods: {
    toPortalUrlByKey,
  },
};
</script>
<style lang="less">
.x-btn-customer-service {
  position: fixed;
  display: block;
  bottom: 135px;
  left: 4px;
  background: #ff5353;
  border-radius: 6px;
  padding: 13px 12px 11px;
  cursor: pointer;
  z-index: 4;
  &::before {
    content: "";
    display: block;
    position: absolute;
    border: 2px solid #fff;
    height: 5px;
    border-radius: 4px;
    width: 32px;
    top: 24px;
    left: 7px;
  }
  .c1 {
    display: block;
    position: relative;
    width: 26px;
    height: 30px;
    border: 2px solid #fff;
    border-radius: 100px;
    background: #ff5353;
    &::before {
      position: absolute;
      content: "";
      display: block;
      top: 21px;
      left: -4px;
      background: #ff5353;
      width: 14px;
      height: 5px;
      transform: rotate(57deg);
    }
    &::after {
      position: absolute;
      content: "";
      display: block;
      bottom: -3px;
      left: 7px;
      background: #fff;
      width: 7px;
      height: 4px;
      border-radius: 100px;
      z-index: 1;
    }
  }
}

.dark .x-btn-customer-service {
  &,
  .c1,
  .c1::before {
    background: #00b5b3;
  }
}
</style>
