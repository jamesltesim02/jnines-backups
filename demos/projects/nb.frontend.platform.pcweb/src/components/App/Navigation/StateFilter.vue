<template>
  <ul class="state-filter">
    <li
      v-for="s in stateList"
      :key="s.value"
      :class="{ active: state === s.value }"
      @click="changeState(s)"
    >
      {{$t(`common.states.${s.value}`)}}
      <span>{{s.count}}</span>
    </li>
  </ul>
</template>
<script>
import appConfig from '@/config/business.config';
import { mapState, mapMutations } from 'vuex';
import { findCountInfo } from '@/api/pull';

export default {
  computed: {
    ...mapState('match', ['sno', 'stateList', 'state']),
  },
  async created() {
    this.queryStateCounts();
    if (appConfig.matchsReloadTime) {
      this.setQueryTimer();
    }
  },
  watch: {
    stateList: {
      deep: true,
      handler() {
        if (appConfig.matchsReloadTime) {
          this.setQueryTimer();
        }
      },
    },
  },
  methods: {
    ...mapMutations('match', ['setStateCounts']),
    changeState({ value }) {
      if (this.state === value) {
        return;
      }

      this.$router.push(`/matchs/${this.sno || 10}/${value}`);
    },
    setQueryTimer() {
      clearInterval(this.delayRefreshTimer);
      this.delayRefreshTimer = setInterval(this.queryStateCounts.bind(this), appConfig.matchsReloadTime);
    },
    async queryStateCounts() {
      const stateCounts = await findCountInfo(this.sno);
      this.setStateCounts(stateCounts);
    },
  },
};
</script>

<style lang="less">
.state-filter {
  margin: 50px 0;
  line-height: 40px;
  color: #b0b0b0;
  li {
    position: relative;
    padding-left: 18px;
    border-bottom: 2px solid #2e2f34;
    cursor: pointer;
    transition: color .35s ease-out;
    span {
      position: absolute;
      right: 15px;
      font-size: 12px;
    }
    &.active {
      color: #ff5353;
    }
  }
}
</style>
