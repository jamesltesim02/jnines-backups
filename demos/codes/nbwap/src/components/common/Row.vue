<template>
  <div class="row"><slot /></div>
</template>
<style lang="less" scoped>
.row {
  &::after {
    content: "";
    width: 100%;
    display: block;
  }
}
</style>
