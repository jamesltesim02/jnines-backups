<template>
  <div class="scroll-panel">
    <div class="scroll-header">
      <slot name="header" />
    </div>
    <perfect-scrollbar class="scroll-content">
      <slot />
    </perfect-scrollbar>
    <div class="scroll-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
<style lang="less">
.scroll-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  .scroll-content {
    flex-grow: 1;
  }
}
</style>
