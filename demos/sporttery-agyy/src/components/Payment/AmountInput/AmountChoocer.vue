<template>
  <div class="amount-choocer">
    <ul>
      <v-touch
        v-for="(a, i) in amounts"
        :key="i"
        tag="li"
        :class="{active: a === value}"
        @tap="$emit('update', a)"
      >{{a | moneyFormat}}</v-touch>
    </ul>
  </div>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'update',
  },
  props: {
    list: {
      default: () => [],
      type: Array,
    },
    min: {},
    max: {},
    value: {},
  },
  computed: {
    amounts() {
      return [...new Set(this.list.filter(a => a >= this.min && a <= this.max))];
    },
  },
  mounted() {
    if (this.value && !this.amounts.includes(this.value)) {
      this.$emit('update', '');
    }
  },
};
</script>
<style lang="less">
.amount-choocer {
  width: 3.75rem;
  padding: 0 .1rem 0 .15rem;
  text-align: center;
  font-size: .2rem;
  color: #ff5353;
  ul {
    display: flex;
    flex-wrap: wrap;
  }
  li {
    width: .81rem;
    line-height: .4rem;
    height: .41rem;
    border-radius: 4px;
    border: 1px solid #ff5353;
    margin-right: .08rem;
    transition: all .3s;
    &:nth-child(4n) {
      margin-right: 0;
    }
    &:nth-child(n + 5) {
      margin-top: .06rem;
    }
    &::before {
      content: "¥";
      margin-right: .05rem;
      font-size: .12rem;
      color: #ff5353;
      transition: all .3s;
    }
    &.active {
      background: #ff5353;
      border-color: #ff5353;
      color: #fff;
    }
    &.active::before {
      color: #ecebeb;
    }
  }
}

.black .amount-choocer {
  color: #bababa;
  li {
    border-color: #716d6d;
    &::before {
      color: #909090;
    }
    &.active{
      border-color: #ff5353;
      &::before {
        color: #fff;
      }
    }
  }
}
</style>
