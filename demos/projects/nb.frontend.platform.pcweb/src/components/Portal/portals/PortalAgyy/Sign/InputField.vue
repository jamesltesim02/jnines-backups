<template>
  <div class="agyy-input-field">
    <label>{{label}}</label>
    <div>
      <input
        :type="type"
        :value="value"
        v-bind="$attrs"
        autocapitalize="off"
        autocorrect="off"
        :placeholder="placeholder"
        @input="({ target: { value }}) => $emit('input', value)"
        @keypress="e => $emit('keypress', e)"
      />
    </div>
    <slot
      class="icon"
      name="icon"
    />
  </div>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    label: {},
    type: {
      default: 'text',
    },
    placeholder: {},
    value: {},
    maxlength: {},
  },
};
</script>
<style lang="less">
.agyy-input-field {
  display: flex;
  border-bottom: 1px solid #353535;
  height: 50px;
  align-items: center;
  label {
    font-size: 14px;
    width: 60px;
  }
  div {
    flex-grow: 1;
  }
  input {
    background: transparent;
    border: 0;
    width: 100%;
    color: #eaeaea;
    &::placeholder {
      font-size: 14px;
    }
  }
  .icon {
    display: block;
  }
}
</style>
