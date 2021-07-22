<template>
  <div
    class="payment-edittext"
    :class="{ empty: !value }"
  >
    <input
      :type="type"
      :value="value"
      :placeholder="placeholder"
      @input="({target: { value: v }}) => $emit('update', v)"
    />
    <slot />
  </div>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'update',
  },
  props: {
    type: {
      default: 'text',
    },
    value: {},
    placeholder: {},
  },
};
</script>
<style lang="less">
.payment-edittext {
  position: relative;
  display: flex;
  width: 3.75rem;
  padding: 0 .1rem 0 .15rem;
  input {
    background: transparent;
    border: 1px solid #ff5353;
    border-radius: 4px;
    line-height: .43rem;
    flex-grow: 1;
    text-align: center;
    font-size: .2rem;
    color: #ff5353;
    &::placeholder {
      font-size: .12rem;
      text-align: left;
      padding-left: .45rem;
      letter-spacing: 1.3px;
      color: #bababa;
    }
  }
  &.empty input {
    border-color: #bababa;
  }
  &.empty::before {
    position: absolute;
    content: "";
    display: block;
    width: 1px;
    height: .2rem;
    background: #979797;
    left: .53rem;
    top: .14rem;
  }
}

.black .payment-edittext {
  input {
    border-color: #716d6d;
    &::placeholder {
      color: #716d6d;
    }
  }
  &.empty input {
    border-color: #716d6d;
  }
  &.empty::before {
    background: #bababa #979797;
  }
}
</style>
