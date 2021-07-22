<template>
  <div class="match-panel"><slot /></div>
</template>
<style lang="less">
  .match-panel {
    background-image: linear-gradient(-90deg, @panelBgColorStart 0%, @panelBgColorEnd 100%);
    box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,0.10);
    border-radius: .1rem;
    box-sizing: border-box;
  }
</style>
