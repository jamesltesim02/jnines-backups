<template>
<div></div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState('app', ['toPath'])
  },
  watch: {
    toPath (n) {
      console.log('will to path:', n)
      if (!n) {
        return;
      }

      if (n.type === 'replace') {
        this.$router.replace(n.path);
      } else {
        this.$router.push(n.path || n);
      }

      this.path(null);
    }
  },
  methods: {
    ...mapMutations('app', ['path'])
  }
};
</script>
<style scoped>
div {
  display: none;
}
</style>