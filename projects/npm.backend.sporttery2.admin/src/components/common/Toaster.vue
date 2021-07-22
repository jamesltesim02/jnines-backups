<template>
  <div v-if="false"></div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('app', ['toast']),
  },
  watch: {
    toast: 'doToast',
  },
  mounted () {
    this.doToast()
  },
  methods: {
    doToast () {
      if (!this.toast) {
        return;
      }
      const {
        msg,
        normal
      } = this.toast;

      if (msg || normal) {
        this.$toast.center(msg || normal);
      }
    }
  }
};
</script>
