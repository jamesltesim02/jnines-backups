<template>
  <a
    class="btn-customer-service"
    @click="toPortalUrlByKey('SERVICE_CENTER_URL')"
    :title="$t('agPage.service.online')"
  >
    <span class="c1"></span>
  </a>
</template>
<script>
import { toPortalUrlByKey } from '@/utils/PortalUtils';

export default {
  methods: {
    toPortalUrlByKey,
  },
};
</script>
<style lang="less">
.btn-customer-service {
  position: fixed;
  display: block;
  bottom: 135px;
  left: 4px;
  background: #ff5353;
  border-radius: 6px;
  padding: 13px 12px 11px;
  cursor: pointer;
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
</style>
