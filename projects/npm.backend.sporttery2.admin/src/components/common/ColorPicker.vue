<template>
<div class="color-picker">
  <input
    class="name"
    type="text"
    :value="color.name"
    placeholder="名称"
    @change="nameChange"
  />:
  <div
    ref="picker"
    class="input-group"
  >
    <input
      class="value"
      type="text"
      :value="color.value"
      placeholder="色值"
      @input="({ target: { value } }) => $emit('change', { name: color.name, value })"
    >
    <span class="input-group-addon"><i></i></span>
  </div>
  <span
    class="btn-opr"
    @click="handleOperation"
  >
    <i
      :class="['fa', plus ? 'fa-check' : 'fa-remove']"
      :style="{
        color: plus
        ? (
          color.name && color.value
          ? '#46c37b'
          : 'inherit'
        )
        : '#d26a5c'
      }"
    ></i>
  </span>
</div>
</template>
<script>
// 参考文档 https://itsjavi.com/bootstrap-colorpicker/v2/
const $ = window.jQuery

export default {
  props: {
    color: {},
    plus: {
      type: Boolean
    }
  },
  data () {
    return {
      $picker: null
    }
  },
  mounted () {
    this.$picker = $(this.$refs.picker)
    this.$picker.colorpicker({
      'format': 'hex',
      'inline': false
    }).on(
      'changeColor',
      (e) => {
        this.$emit(
          'change',
          {
            name: this.color.name,
            value: e.color.toHex()
          }
        )
      }
    );
  },
  methods: {
    nameChange({ target: { value } }) {
      this.$emit(
        'change',
        {
          name: value,
          value: this.color.value
        }
      )
    },
    handleOperation () {
      this.$emit(this.plus ? 'check' : 'remove')
    }
  }
}
</script>
<style scoped>
.color-picker {
  white-space: nowrap;
  border: 1px solid #e6e6e6;
  border-radius: 3px;
  width: 213px;
  overflow: hidden;
}
.input-group {
  display: inline-block;
}
.color-picker input {
  border: 0;
  vertical-align: middle;
  height: 28px;
}
.name {
  width: 60px;
  text-align: center;
}
.value {
  width: 70px;
}
.input-group span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 41px;
  border: 0;
  border-left: 1px solid #e6e6e6;
}
.btn-opr {
  display: inline-block;
  vertical-align: middle;
  padding: 4px 10px;
  border: 0;
  border-left: 1px solid #e6e6e6;
  cursor: pointer;
  background-color: #f9f9f9;
}
</style>
