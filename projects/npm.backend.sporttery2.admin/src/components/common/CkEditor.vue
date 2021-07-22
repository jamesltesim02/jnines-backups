<template>
  <textarea></textarea>
</template>
<script>

const CkEditor = window.CKEDITOR

export default {
  model: {
    prop: 'content',
    event: 'change'
  },
  props: ['content', 'id'],
  data () {
    return {
      editor: null
    };
  },
  watch: {
    'id' (n) {
      this.editor.setData(this.content || '')
    }
  },
  mounted () {
    this.editor = CkEditor.replace(this.$el)
    this.editor.on('change', ({ editor }) => {
      this.$emit(
        'change',
        editor.getData()
      )
    })
    this.editor.setData(this.content || '')
  }
}
</script>