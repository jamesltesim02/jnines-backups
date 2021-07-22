<template>
  <label>
    {{gameName}}
  </label>
</template>
<script>
import devConfig from '@/config/config.dev'

export default {
  props: [
    'sportId',
    'groupType',
    'betStage',
    'gameType'
  ],
  computed: {
    gameName () {
      return devConfig.game[`${this.sportId}_${this.groupType}_${this.betStage}_${this.gameType}`];
    }
  }
}
</script>