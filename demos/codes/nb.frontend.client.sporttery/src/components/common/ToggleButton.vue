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
  height: .3rem;
  background: #ecebeb;
  border-radius: 10rem;
  text-align: left;
  overflow: hidden;
  transition: all  .25s ease-out;
  &::before {
    position: absolute;
    content: "";
    top: .02rem;
    left: .01rem;
    display: inline-block;
    width: .25rem;
    height: .26rem;
    border-radius: 50%;
    background: #fff;
    border: 0 solid rgba(0, 0, 0, 0.04);
    box-shadow: 0 3px 8px 0 rgba(0,0,0,0.15),
                0 1px 1px 0 rgba(0,0,0,0.16),
                0 3px 1px 0 rgba(0,0,0,0.10);
    transition: left  .25s ease-out;
  }
}
.toggle-button.checked {
  background: #ff5353;
  &::before { left: .26rem; }
}
.black .toggle-button {
  &::before { background: #ecebeb; }
  background: #3a3a3a;
}
.black .toggle-button.checked {
  background: #ff5353;
}
.blue .toggle-button {
  &::before { background: #ecebeb; }
  background: linear-gradient(to bottom, #3a393f, #333238);
}
.blue .toggle-button.checked {
  background: #00b5b3;
}
</style>
