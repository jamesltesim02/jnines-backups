<template>
  <div class="icon-calendar">
    <span>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
    </span>
  </div>
</template>
<style lang="less">
.icon-calendar {
  width: .19rem;
  height: .18rem;
  transform: scale(.8);
  padding-top: .02rem;
  span {
    position: relative;
    display: block;
    border: 1px solid #565656;
    border-radius: .02rem;
    height: .16rem;
    padding-top: .06rem;
    &::before, &::after {
      position: absolute;
      content: "";
      display: block;
    }
    &::before {
      height: .05rem;
      width: .06rem;
      top: -.03rem;
      left: 50%;
      transform: translateX(-50%);
      border-left: .01rem solid #565656;
      border-right: .01rem solid #565656;
    }
    &::after {
      top: .04rem;
      height: .01rem;
      width: 100%;
      background: #565656;
    }
    i {
      display: inline-block;
      height: .01rem;
      width: .03rem;
      background: #565656;
      margin: .02rem .01rem 0;
    }
  }
}
.blue .icon-calendar {
  span {
    border: 1px solid #909090;
    &::before {
      border-left: .01rem solid #909090;
      border-right: .01rem solid #909090;
    }
    &::after { background: #909090; }
    i { background: #909090; }
  }
}
</style>
