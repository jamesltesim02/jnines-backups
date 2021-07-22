<template>
  <register-ag v-if="isAg" />
  <register-com v-else />
</template>
<script>
import { mapState } from 'vuex';
import RegisterAg from './RegisterAg';
import RegisterCom from './RegisterCom';

export default {
  computed: {
    ...mapState('app', ['frontId']),
    isAg() {
      return this.frontId === '102001011JIaThBA';
    },
  },
  components: { RegisterAg, RegisterCom },
};
</script>
