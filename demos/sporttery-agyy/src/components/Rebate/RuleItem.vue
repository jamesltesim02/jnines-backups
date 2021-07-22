<template>
  <div
    class="rebate-rule-item"
    :class="{active: active}"
  >
    <span>{{values[0]}}</span>
    <span>{{values[1]}}</span>
    <span>{{values[2]}}</span>
  </div>
</template>
<script>
export default {
  props: ['values', 'active'],
};
</script>
<style lang="less">
.rebate-rule-item {
  display: flex;
  color: #716d6d;
  line-height: .33rem;
  border-bottom: 1px solid #ecebeb;
  text-align: center;
  font-size: .12rem;
  &:last-child {
    border: 0;
  }
  span:first-child, span:last-child {
    width: .95rem;
  }
  span:nth-child(2) {
    flex-grow: 1;
  }
}
.rebate-rule-item.active,.black .rebate-rule-item.active {
  color: #ff5353;
}
.black .rebate-rule-item {
  color: #bababa;
  border-color: #28272d;
}
</style>
