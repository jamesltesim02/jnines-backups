<template>
  <i class="live-flag" :class="{active: active}"></i>
</template>
<script>
export default {
  props: {
    active: {
      default: false,
    },
  },
};
</script>

<style lang="less">
.live-flag {
  display: inline-block;
  width: .18rem;
  height: .18rem;
  background: #9B9B9B;
  border: .044rem solid #E7E7E7;
  border-radius: 50%;
  margin-top: -.01rem;
  &.active {
    border-color: #ffe8e3;
    background: #fe6246;
    animation: halfblink linear 1.5s infinite;
  }
}

@keyframes halfblink {
  from,
  50%,
  to {
    opacity: .6;
  }

  25%,
  75% {
    opacity: 1;
  }
}

.black .live-flag {
  border-color: #4b4c52;
}
</style>
