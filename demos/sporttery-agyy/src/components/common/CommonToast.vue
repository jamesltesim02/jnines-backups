<template>
  <i class="commont-toast-hidden"></i>
</template>
<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('app', ['toast']),
  },
  watch: {
    toast(toast) {
      if (!toast) {
        return;
      }
      const {
        msg,
        normal,
        params,
      } = toast;
      if (msg) {
        if (this.$te(msg)) {
          this.$toast.center(this.$t(msg, params));
          return;
        }

        if (!normal) {
          this.$toast.center(msg);
          return;
        }
      }

      if (!normal) {
        return;
      }

      if (this.$te(normal)) {
        this.$toast.center(this.$t(normal, params));
        return;
      }

      this.$toast.center(normal);
    },
  },
};
</script>

<style lang="less">
.commont-toast-hidden {
  display: none;
}
</style>
