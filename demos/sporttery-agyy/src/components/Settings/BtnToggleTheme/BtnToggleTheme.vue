<template>
  <v-touch
    tag="button"
    @tap="toggleTheme"
    class="btn-theme-toggle"
  ><component :is="icon" /></v-touch>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import IconSun from './icons/IconSun';
import IconMoon from './icons/IconMoon';

export default {
  computed: {
    ...mapState('app', ['theme']),
    icon() {
      return {
        white: IconMoon,
        black: IconSun,
      }[this.theme];
    },
  },
  methods: {
    ...mapMutations('app', ['toggleTheme']),
  },
};
</script>
<style lang="less">
.btn-theme-toggle {
  padding: 0.12rem;
  img {
    width: .32rem;
    height: .32rem;
  }
}
</style>
