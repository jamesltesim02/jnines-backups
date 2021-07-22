<template>
  <v-touch
    tag="i"
    class="toggle-button"
    :class="{checked: checked}"
    @tap="$emit('change', !checked)"
  ></v-touch>
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
  width: .52rem;
  height: .32rem;
  background: #FFFFFF;
  border: .01rem solid #E5E5EA;
  border-radius: 10rem;
  text-align: left;
  overflow: hidden;
  transition: all .15s;
  &::before {
    position: absolute;
    content: "";
    top: .01rem;
    left: .01rem;
    display: inline-block;
    width: .28rem;
    height: .28rem;
    border-radius: 50%;
    background: #fff;
    border: 0 solid rgba(0, 0, 0, 0.04);
    box-shadow: 0 3px 8px 0 rgba(0,0,0,0.15),
                0 1px 1px 0 rgba(0,0,0,0.16),
                0 3px 1px 0 rgba(0,0,0,0.10);
    transition: left .15s;
  }
}
.toggle-button.checked, .black .toggle-button.checked {
  background: #ff5353;
  border: .01rem solid #ff5353;
  &::before {
    left: .23rem;
  }
}
.black .toggle-button {
  background: #3a3a3a;
  border-color: #28272d;
}
</style>
