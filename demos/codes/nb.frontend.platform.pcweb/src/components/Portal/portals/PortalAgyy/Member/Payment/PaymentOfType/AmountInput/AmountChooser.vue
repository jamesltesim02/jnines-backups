<template>
  <ul class="agyy-amountchoocer">
    <li
      v-for="a in amounts"
      :key="a"
      :class="{ active: +value === +a }"
      @click="$emit('update', a)"
    >
      ￥{{a | moneyFormat}}
      <choose-flag active />
    </li>
  </ul>
</template>
<script>
import ChooseFlag from '@/components/common/ChooseFlag';

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
  components: {
    ChooseFlag,
  },
  mounted() {
    if (this.value && !this.amounts.includes(this.value)) {
      this.$emit('update', '');
    }
  },
};
</script>
<style lang="less">
.agyy-amountchoocer {
  display: flex;
  flex-wrap: wrap;
  margin: -15px 0 0 -15px;
  font-size: 20px;
  li {
    position: relative;
    line-height: 50px;
    height: 50px;
    width: 114px;
    text-align: center;
    border-radius: 6px;
    color: #ff5353;
    margin-left: 15px;
    margin-top: 15px;
    transition: all .35s ease-out;
    cursor: pointer;
    overflow: hidden;
    &::before {
      content: "";
      position: absolute;
      height: 48px;
      width: 112px;
      border: 1px solid #ff5353;
      border-radius: 6px;
      top: 0;
      left: 0;
    }
    &.more {
      font-size: 16px;
    }
    .choose-flag {
      opacity: 0;
      transition: opacity .35s ease-out;
      border-bottom-color:  #fff;
      border-right-color: #fff;
      &::before,
      &::after {
        background: #ff5353;
      }
    }
    &.active {
      background: #ff5353;
      color: #fff;
      .choose-flag {
        opacity: 1;
      }
    }
  }
}
</style>
