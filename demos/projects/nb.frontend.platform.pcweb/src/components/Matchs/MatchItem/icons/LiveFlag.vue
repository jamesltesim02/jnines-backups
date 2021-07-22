<template>
  <i class="live-flag" :class="{ active: active }" />
</template>
<script>
export default {
  props: { active: Boolean },
};
</script>
<style lang="less">
.live-flag {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 4px solid #716d6d;
  background: #9B9B9B;
  vertical-align: middle;
  margin: 0 12px;
  &.active {
    background: #fe6246;
    animation: liveblink linear 1.5s infinite;
  }
}
@keyframes liveblink {
  from, 50%, to {
    opacity: .6;
  }
  25%, 75% {
    opacity: 1;
  }
}
.black .live-flag {
  border-color: #4b4c52;
}
</style>
