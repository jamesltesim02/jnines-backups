<template>
  <div class="but-container">
    <ul class="bet-mult-type">
      <v-touch
        tag="li"
        v-for="(t, i) in types"
        :key="i"
        @tap="$emit('update:multitype', i)"
        :class="{active: i === multitype}"
        class="flex-center"
      >{{$t(t)}}</v-touch>
    </ul>
  </div>
</template>
<script>

export default {
  props: ['multitype', 'sno'],
  data() {
    return {
      types: ['page.betType.single', 'page.betType.multiple'],
    };
  },
};
</script>
<style lang="less">
.bet-mult-type {
  background: #ecebeb;
  display: flex;
  font-size: .14rem;
  li {
    width: 100%;
    text-align: center;
    line-height: .37rem;
    color: #aaa;
    &:first-child {
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
      overflow: hidden;
    }
    &.active {
      background: #fff;
      color: #2e2f34;
      box-shadow: 0 2px 10px 0 rgba(179, 178, 178, 0.5);
    }
  }
}
.but-container {
  width: 100%;
  height: 100%;
  .contrls {
    display: none;
    // width: 1.05rem;
    width: 100%;
    height: 100%;
    line-height: 0;
    li {
      width: 100%;
      // padding-bottom: .055rem;
    }
  }
}
.seamless {
  .but-container {
    display: flex;
    .contrls { display: flex; }
  }
  .bet-mult-type { width: 2.7rem; }
}
.black .but-container {
  border-color: #26252b;
}
.black .bet-mult-type {
  background: #2a2a2c;
  li {
    color: #716d6d;
    &.active {
      color: #ecebeb;
      background: #37383e;
      box-shadow: none;
    }
  }
}
</style>
