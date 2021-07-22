<template>
  <div class="color-list-picker">
    <ColorPicker
      v-for="(c, i) in colors"
      :key="i"
      :color="c"
      @change="color => handleColorChange(color, i)"
      @remove="() => colorRemove(i)"
    />
    <ColorPicker
      v-if="plusColor"
      :color="plusColor"
      @change="plusColorChange"
      @check="plusColorCheck"
      plus
    />
    <button
      v-if="!plusColor"
      class="btn btn-sm btn-info"
      type="button"
      @click="addColor"
    >
      <i class="fa fa-plus"></i> 添加颜色
    </button>
  </div>
</template>
<script>
import ColorPicker from './ColorPicker'

const $ = window.jQuery

export default {
  model: {
    prop: 'colors',
    event: 'change'
  },
  props: {
    colors: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      plusColor: null
    };
  },
  components: {
    ColorPicker
  },
  methods: {
    addColor () {
      if (this.plusColor) {
        return
      }
      this.plusColor = {
        name: '',
        value: ''
      }
    },
    handleColorChange (color, index) {
      this.colors[index] = color
      this.$emit('change', [...this.colors])
    },
    plusColorChange (color) {
      this.plusColor = color
    },
    plusColorCheck () {
      if (this.plusColor.name && this.plusColor.value) {
        this.$emit('change', [...this.colors, this.plusColor])
        this.plusColor = null
        return
      }
    },
    colorRemove (index) {
      this.colors.splice(index, 1)
      this.$emit('change', [...this.colors])
    }
  }
}
</script>
<style scoped>
.color-list-picker {
  padding: 12px 0;
}
.color-picker {
  margin-bottom: 10px;
}
</style>