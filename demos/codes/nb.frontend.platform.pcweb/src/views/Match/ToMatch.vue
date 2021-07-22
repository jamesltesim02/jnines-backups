<template>
  <div v-if="false"></div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { findCountInfo } from '@/api/pull';

export default {
  props: ['sno'],
  async created() {
    this.setSno(this.sno);
    const stateCounts = await findCountInfo(this.sno);
    this.setStateCounts(stateCounts);
    const validState = this.stateList.find(s => s.count > 0);
    this.$router.push(`/matchs/${this.sno}/${validState ? validState.value : 0}`);
  },
  computed: {
    ...mapState('match', ['stateList']),
  },
  methods: {
    ...mapMutations('match', ['setSno', 'setStateCounts']),
  },
};
</script>
