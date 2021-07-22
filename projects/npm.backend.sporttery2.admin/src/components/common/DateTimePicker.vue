<template>
  <input
    ref="dp"
    type="text"
    :value="strValue"
    @input="({ target: { value } }) => $emit('change', value)"
  />
</template>
<script>
// 参考文档: https://eonasdan.github.io/bootstrap-datetimepicker/

import sdf from '@/utils/simple-date-format'

export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {},
    options: {
      default: () => {}
    }
  },
  computed: {
    strValue () {
      if (typeof this.value === 'string') {
        return this.value
      }

      return sdf(this.value, 'yyyy-MM-dd HH:mm:ss')
    }
  },
  mounted() {
    $(this.$refs.dp).datetimepicker({
      // 时间格式
      format: 'YYYY-MM-DD HH:mm:ss',
      // 是否显示清除按钮
      showClear: true,
      // 是否显示关闭按钮
      showClose: true,
      // 是否显示今日按钮
      showTodayButton: true,
      // 自定义的options
      ...this.options
    }).on(
      'dp.change',
      ({ target : { value } }) => {
        if (!value) {
          this.$emit('change', null)
          return
        }

        return this.$emit('change', new Date(value).getTime())
      }
    );
  }
}
</script>