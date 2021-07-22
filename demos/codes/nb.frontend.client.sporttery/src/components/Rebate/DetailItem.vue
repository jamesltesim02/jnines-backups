<template>
  <div class="rebate-detail-item">
    <label>{{label}}</label>
    <slot />
  </div>
</template>
<script>
export default {
  props: ['label', 'value'],
};
</script>
<style lang="less">
.rebate-detail-item {
  line-height: .33rem;
  font-size: .12rem;
  color: #ff5353;
  letter-spacing: 0.2px;
  border-bottom: 1px solid #ecebeb;
  &:last-child {
    border: 0;
  }
  label {
    display: inline-block;
    width: 1.46rem;
    color: #716d6d;
    padding-left: .2rem;
  }
}

.black .rebate-detail-item {
  label {
    color: #bababa;
  }
  border-color: #28272d;
}
</style>
