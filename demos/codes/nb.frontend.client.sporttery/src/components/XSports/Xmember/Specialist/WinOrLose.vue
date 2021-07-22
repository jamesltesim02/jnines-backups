<template>
  <i :class="{
    'x-win-or-lose': true,
    'win': win,
  }">{{win ? '红' : '黑'}}</i>
</template>
<script>
export default {
  props: {
    win: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="less">
.x-win-or-lose {
  line-height: .26rem;
  height: .26rem;
  width: .26rem;
  border-radius: 50%;
  color: #fff;
  text-align: center;
  background: #2e2f34;
  display: inline-block;
  font-style: normal;
  &.win {
    background: #ff5353;
  }
}
.blue .x-win-or-lose {
  color: #fff;
  background: #4d4d4d;
  &.win {
    background: #ff5353;
  }
}
</style>
