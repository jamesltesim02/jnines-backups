<template>
  <div class="radio-field">
    <label>{{label}}</label>
    <span class="field-content">
      <slot />
    </span>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
    },
  },
};
</script>
<style lang="less">
.radio-field {
  display: flex;
  align-items: center;
  height: .57rem;
  padding: 0 .1rem 0 .3rem;
  background: #fff;
  border-bottom: 1px solid #f5f4f5;
  transition: all  .25s ease-out;
  &:last-child {
    border-bottom: 0;
  }
  label, .field-content {
    flex-grow: 1;
  }
  .field-content {
    text-align: right;
    & select, & input {
      background: transparent;
      color: #fff;
      border: 0;
      font-size: .15rem;
      appearance: none;
      text-align: right;
      option {
        color: #666;
      }
    }
  }
  .icon-show-expand {
    margin-left: .1rem;
  }
}
.black .radio-field {
  background: #28272d;
  border-bottom: 1px solid #333339;
  color: #c2cacb;
  &:last-child {
    border-bottom: 0;
  }
}
.blue .radio-field {
  background: #28272d;
  border-bottom: 1px solid #2e2f34;
  color: #c2cacb;
  &:last-child {
    border-bottom: 0;
  }
}
</style>
