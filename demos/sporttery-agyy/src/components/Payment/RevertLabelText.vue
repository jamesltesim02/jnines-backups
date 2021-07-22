<template>
  <div class="revertlabel-text">
    <div class="value-site">
      <slot name="value" />
    </div>
    <div class="label-site">
      <slot name="label" />
    </div>
  </div>
</template>
<style lang="less">
.revertlabel-text {
  width: 3.75rem;
  line-height: .5rem;
  padding: 0 .1rem 0 .15rem;
  display: flex;
  font-size: .14rem;
  color: #909090;
  margin-top: .2rem;
  .value-site,.label-site {
    border: 1px solid #bababa;
    border-radius: 6px;
  }
  .value-site {
    flex-grow: 1;
    border-right: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    padding: 0 .15rem;
  }
  .label-site {
    width: 1.06rem;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    text-align: center;
  }
}

.black .revertlabel-text {
  .value-site,.label-site {
    border-color:#3a3a3a;
  }
}
</style>
