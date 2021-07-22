<template>
  <input
    :class="{
      'agyy-edittext': true,
      focus: focus,
    }"
    :value="value"
    @input="({ target: { value }}) => $emit('change', value)"
    :placeholder="placeholder"
    :readonly="readonly"
    @focus="focus = !readonly"
    @blur="focus = false"
  />
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {},
    placeholder: {},
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      focus: false,
    };
  },
};
</script>
<style lang="less">
.agyy-edittext {
  width: 445px;
  line-height: 48px;
  border-radius: 6px;
  border: solid 1px #716d6d;
  background: transparent;
  padding: 0 15px;
  color: #ff5353;
  font-size: 20px;
  &::placeholder {
    font-size: 14px;
    line-height: 48px;
    color: #716d6d;
  }
  &[readonly] {
    cursor: default;
  }
}
</style>
