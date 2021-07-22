<template>
<perfect-scrollbar class="agyy-paytypes">
  <ul :style="{
    width: `${124 * typeList.length}px`
  }">
    <li
      v-for="t in typeList"
      :key="t"
      :class="{
        active: type === t
      }"
      @click="$emit('change', t)"
    >{{$t(`agPage.payment.types.${t}`)}}</li>
  </ul>
</perfect-scrollbar>
</template>
<script>
export default {
  model: {
    prop: 'type',
    event: 'change',
  },
  props: {
    typeList: {
      type: Array,
      default() {
        return [];
      },
    },
    type: {},
  },
};
</script>
<style lang="less">
.agyy-paytypes {
  width: 100%;
  border-bottom: 1px solid #3c3d44;
  .ps__rail-y {
    display: none;
  }
  ul {
    display: flex;
    font-size: 18px;
    color: #716d6d;
    li {
      position: relative;
      width: 124px;
      text-align: center;
      padding-bottom: 10px;
      transition: all .15s ease-out;
      cursor: pointer;
      &::after {
        position: absolute;
        content: "";
        display: block;
        height: 3px;
        width: 70px;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 5px;
        transition: all .15s ease-out;
      }
      &.active {
        color: #ff5353;
        &::after {
          background: #ff5353;
        }
      }
    }
  }
}
</style>
