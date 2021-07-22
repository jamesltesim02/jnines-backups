<template>
  <span>{{gameName}}</span>
</template>

<script>
import toOptionName from './GameOption/toOptionName';

export default {
  props: ['gameType', 'betBar', 'betOption'],
  computed: {
    gameName() {
      const optionName = toOptionName(this.gameType, this.betBar, this.betOption);
      return `${
        optionName.prefix || ''
      }${
        optionName.key ? this.$t(`common.optionNames.${optionName.key}`) : ''
      }${
        optionName.value || ''
      }${
        optionName.suffix || ''
      }`;
    },
  },
};
</script>
