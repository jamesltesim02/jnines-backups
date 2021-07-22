<template>
  <div class="nb-history-item" >
    <bet-history-title :data="data" @change="changeFun" />
    <bet-history-body :data="data" @change="changeFun" />
  </div>
</template>

<script>
import BetHistoryBody from '@/components/Bet/BetComps/BetHistoryBody';
import BetHistoryTitle from '@/components/Bet/BetComps/BetHistoryTitle';

export default {
  inheritAttrs: false,
  name: 'BetHistoryItem',
  props: { data: Object },
  components: { BetHistoryBody, BetHistoryTitle },
  methods: {
    changeFun(v) {
      this.$emit('change', v);
    },
  },
};
</script>
