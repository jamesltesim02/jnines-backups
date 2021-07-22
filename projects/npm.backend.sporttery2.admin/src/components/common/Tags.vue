<template>
  <input
    class="form-control"
    type="text"
    :value="value"
  >
</template>
<script>
// 参考文档 https://github.com/xoxco/jQuery-Tags-Input

// TODO 更新空间内容
const $ = window.jQuery

const DELIMITER = '|---|'

export default {
  model: {
    prop: 'capacity',
    event: 'change'
  },
  props: {
    capacity: {
      default: () => []
    }
  },
  data () {
    return {
      $tags: null,
      $tags: null
    };
  },
  computed: {
    value () {
      return this.capacity.join(DELIMITER)
    },
  },
  watch: {
    capacity (n) {
      this.$tags.importTags((n || []).join(DELIMITER))
    }
  },
  mounted () {
    this.$tags = $(this.$el)
    this.$tags.tagsInput({
      height: '36px',
      width: '100%',
      defaultText: 'Add tag',
      removeWithBackspace: true,
      delimiter: [DELIMITER],
      onAddTag: (e) => {
        this.$emit('change', this.$el.value.split(DELIMITER))
      },
      onRemoveTag: (e) => {
        this.$emit('change', this.$el.value.split(DELIMITER))
      }
    });
  }
}
</script>
<style scoped>
.tagsinput {
  line-height: 12px;
}
</style>