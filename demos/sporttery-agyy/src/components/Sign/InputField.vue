<template>
  <div class="input-field">
    <div class="input-text-box">
      <input
        v-bind="$attrs"
        :type="type"
        :value="value"
        autocomplete="off"
        autocapitalize="off"
        autocorrect="off"
        @input="({target: { value }}) => $emit('input', value)"
        @keypress="e => $emit('keypress', e)"
      />
    </div>
    <div class="control">
      <slot name="control" />
    </div>
  </div>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    type: {
      default: 'text',
    },
    value: {
      default: '',
    },
  },
};
</script>
<style lang="less">
.input-field {
  position: relative;
  padding-left: .3rem;
  display: flex;
  overflow: hidden;
  line-height: .2rem;
  &::after {
    content: "";
    display: block;
    position: absolute;
    bottom: 0;
    left: .3rem;
    height: 1px;
    width: 100%;
    background: rgba(255, 255, 255, .5);
  }
  .input-text-box {
    flex-grow: 1;
    padding: .1rem 0;
    display: flex;
  }
  input {
    background: transparent;
    border: 0;
    border-radius: 0;
    line-height: .3rem;
    height: .3rem;
    width: 100%;
    padding: 0 .2rem;
    color: #fff;
    font-size: .14rem;
  }
  input::-webkit-input-placeholder {
    color: rgba(255, 255, 255, .5);
    font-size: .14rem;
  }
  input:-webkit-autofill, input:-webkit-autofill-strong-password {
    background-color: #fd6b64 !important;
    background-image: none !important;
    color: #fff !important;
    -webkit-tap-highlight-color:#fd6b64 !important;
    -webkit-box-shadow: 0 0 0px 1000px #fd6b64 inset !important;
  }
  .control {
    width: .42rem;
    height: .5rem;
  }
  .control > div {
    width: .42rem;
    right: 0;
    text-align: center;
    padding: .15rem 0;
  }
}
</style>
