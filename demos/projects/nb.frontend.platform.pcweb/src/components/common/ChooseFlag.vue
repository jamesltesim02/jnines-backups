<template>
  <i
    :class="{
      'choose-flag': true,
      active,
    }"
  ></i>
</template>
<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="less">
.choose-flag {
  position: absolute;
  display: block;
  bottom: 0;
  right: 0;
  border-top: 11px solid rgba(255, 83, 83, 0);
  border-left: 13px solid rgba(255, 83, 83, 0);
  border-bottom: 11px solid rgba(255, 83, 83, 0);
  border-right: 13px solid rgba(255, 83, 83, 0);
  transition: all .35s ease-out;
  &::before,
  &::after {
    content: "";
    position: absolute;
    height: 2px;
    background: rgba(255, 255, 255, 0);
    border-radius: 3px;
    transition: all .35s ease-out;
  }
  &::before {
    width: 7px;
    transform: rotate(45deg);
    top: 5px;
    left: -2px;
  }
  &::after {
    width: 10px;
    transform: rotate(-45deg);
    top: 3px;
    left: 2px;
  }
  &.active {
    border-bottom-color:  rgba(255, 83, 83, 1);
    border-right-color: rgba(255, 83, 83, 1);
    &::before,
    &::after {
      background: rgba(255, 255, 255, 1);
    }
  }
}
</style>
