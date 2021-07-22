<template>
  <select
    :value="value"
    @change="({ target: { value }}) => $emit('change', value)"
  ><slot /></select>
</template>
<script>
// 参考文档: https://select2.org/

const $ = window.jQuery

// @change="({ target: { value } }) => $emit('change', value)"

export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: ['value'],
  data() {
    return {
      $select: null
    };
  },
  watch: {
    value (n) {
      if (n) {
        this.$select.val(n).trigger('change') // 修改时选中已存在的值
      } else {
        this.$select.val(99999999).trigger('change')
      }
    }
  },
  mounted () {
    this.$select = $(this.$el)
    this.$select.select2({
      width: '100%',
      minimumResultsForSearch: Infinity
    }).on(
      'select2:select',
      e => e.target.dispatchEvent(new Event('change'))
    );
  },
}
</script>