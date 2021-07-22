<template>
<div class="agyy-tips"><slot /></div>
</template>
<style lang="less">
.agyy-tips {
    font-size: 12px;
    color: #716d6d;
    line-height: 17px;
    margin-top: 6px;
    &::before {
      content: "!";
      display: inline-block;
      height: 14px;
      width: 14px;
      border-radius: 50%;
      background: #ff5353;
      color: #2E2F34;
      text-align: center;
      line-height: 14px;
      font-weight: bolder;
      margin-right: 5px;
    }
}
</style>
