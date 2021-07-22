<template>
  <v-touch
    @tap="toggleTheme"
    class="btn-theme-toggle"
  >
    <component :is="icon" />
  </v-touch>
</template>
<script>
import IconMoon from './icons/IconMoon';
import IconSun from './icons/IconSun';

export default {
  computed: {
    ...mapState('app', ['theme']),
    icon() {
      return {
        white: IconMoon,
        black: IconSun,
        blue: IconSun,
      }[this.theme];
    },
  },
  methods: {
    ...mapMutations('app', ['toggleTheme']),
  },
};
</script>
