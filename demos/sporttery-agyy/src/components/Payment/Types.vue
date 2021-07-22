<template>
  <div class="payment-types">
    <ul :style="{width: ptWidth}">
      <v-touch
        v-for="(group, i) in typeList"
        :key="i"
        tag="li"
        :class="{ active: group === type }"
        @tap="$router.replace(`/payment/${group}`)"
      >
        {{$t(`payment.types.${group}`)}}
      </v-touch>
    </ul>
  </div>
</template>
<script>
export default {
  props: ['type', 'typeList'],
  computed: {
    ptWidth() {
      return `${this.typeList.length * 0.8}rem`;
    },
  },
};
</script>
<style lang="less">
.payment-types {
  color: #2e2f34;
  font-size: .14rem;
  text-align: center;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: .05rem;
  ul {
    display: flex;
    border-bottom: 1px solid #ecebeb;
  }
  li {
    position: relative;
    width: .8rem;
    line-height: .44rem;
    height: .44rem;
    transition: all .15s;
    &::before {
      position: absolute;
      content: "";
      display: block;
      bottom: -.01rem;
      left: 50%;
      transform: translateX(-50%);
      width: .3rem;
      height: .03rem;
      border-radius: .02rem;
      box-shadow: 0 -1px 6px 0 #ff5353;
      background: linear-gradient(95deg, #fe6246, rgba(245, 56, 1, 0.61));
      opacity: 0;
      transition: all .3s;
    }
    &.active {
      color: #ff5353;
    }
    &.active::before {
      opacity: 1;
    }
  }
}

.black .payment-types {
  color: #909090;
  ul {
    border-color: #232227;
  }
}
</style>
