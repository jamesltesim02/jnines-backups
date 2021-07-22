<template>
  <v-touch
    tag="li"
    class="oper-item"
    @tap="$emit('click')"
  >
    <slot />
    <span class="arrow"><icon-arrow direction="right" /></span>
  </v-touch>
</template>
<script>
import IconArrow from '@/components/common/icons/IconArrow';

export default {
  components: {
    IconArrow,
  },
};
</script>
<style lang="less">
.oper-item {
  position: relative;
  padding-left: .15rem;
  border-bottom: 1px solid #ecebeb;
  color: #2e2f34;
  transition: all .5s;
  &:last-child {
    border-bottom: 1px solid #fff;
  }
  span {
    position: absolute;
    right: 0;
    height: .5rem;
    padding: 0 .22rem;
  }
  svg {
    width: .07rem;
    height: .12rem;
    path{
      fill: #CECECE;
      transition: all .5s;
    }
  }
}
.black .oper-item {
  border-color: #333339;
  color: #c2cacb;
  svg path{
    fill: #CDCDCD;
  }
}
</style>
