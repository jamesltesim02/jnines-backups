<template>
  <label>
    {{name.prefix || ''}}
    {{keyValue}}
    {{name.value || ''}}
    {{name.suffix || ''}}
  </label>
</template>
<script>
import devConfig from '@/config/config.dev'
import toOptionName from '@/utils/to-option-name'

export default {
  props: ['gameType', 'betBar', 'betOption'],
  computed: {
    name () {
      return toOptionName(
        this.gameType,
        this.betBar,
        this.betOption
      )
    },
    keyValue () {
      if(!this.name.key) {
        return ''
      }
      return devConfig.option[this.name.key]
    }
  }
}
</script>
