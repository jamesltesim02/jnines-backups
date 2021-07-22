<template>
  <button
    class="x-theme-toggle"
    @click="updateTheme('whitedark'.replace(theme, ''))"
  >
    <cimg :src="src" />
  </button>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

const THEME_ICONS = {
  white: require('./images/moon.png'),
  dark: require('./images/sun.png'),
};

export default {
  computed: {
    ...mapState('app', ['theme']),
    src() {
      return THEME_ICONS[this.theme];
    },
  },
  methods: {
    ...mapMutations('app', ['updateTheme']),
  },
};
</script>
<style lang="less">
.x-theme-toggle {
  vertical-align: middle;
  img {
    max-height: 30px;
  }
}
</style>
