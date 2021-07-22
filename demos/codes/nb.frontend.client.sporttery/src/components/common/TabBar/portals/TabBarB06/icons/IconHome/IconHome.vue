<template>
  <img
    class="icon-home-b06"
    src="./icon-home.png"
    :class="{ active: active }"
  />
</template>
<script>
export default {
  props: ['active'],
};
</script>

<style lang="less">
.icon-home-b06 {
  width: .22rem;
  height: .22rem;
  filter: grayscale(100%);
}
.icon-home-b06.active {
  filter: none;
}
</style>
