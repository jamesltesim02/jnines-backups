<template>
  <i
    tag="i"
    class="toggle-button"
    :class="{checked: checked}"
    @click="$emit('change', !checked)"
  ></i>
</template>
<script>
export default {
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: ['checked'],
};
</script>
<style lang="less">
.toggle-button {
  position: relative;
  display: inline-block;
  width: 54px;
  height: 34px;
  background: #3a3a3a;
  // border: 1px solid #28272d;
  border-radius: 100px;
  text-align: left;
  overflow: hidden;
  transition: all .35s ease-out;
  &::before,
  &::after {
    position: absolute;
    content: "";
    display: inline-block;
  }
  &::before {
    top: 0px;
    left: 0px;
    width: 54px;
    height: 34px;
    background-color: #3a3a3a;
    transform: translateX(-20px);
    border-radius: 100px;
    transition: all .35s ease-out;
  }
  &::after {
    top: 2px;
    left: 2px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #fff;
    border: 0 solid rgba(0, 0, 0, 0.04);
    box-shadow: 0 3px 8px 0 rgba(0,0,0,0.15),
                0 1px 1px 0 rgba(0,0,0,0.16),
                0 3px 1px 0 rgba(0,0,0,0.10);
    transition: left .35s ease-out;
  }
}
.toggle-button.checked, .black .toggle-button.checked {
  &::before {
    background-color: #ff5353;
    transform: translateX(0);
  }
  &::after {
    left: 22px;
  }
}
</style>
