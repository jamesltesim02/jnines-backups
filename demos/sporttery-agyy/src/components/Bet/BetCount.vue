<template>
  <span v-if="show || betCnt" class="nb-bet-number" v-bind="attrs">{{betCnt}}</span>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'BetCount',
  props: {
    animate: [Boolean, Number, String],
    show: Boolean,
  },
  computed: {
    betCnt() {
      if (this.$store.state.bet) {
        return this.$store.state.bet.betCount || 0;
      }
      return 0;
    },
    betPct() {
      if (this.animate && this.$store.state.bet) {
        return `${this.$store.state.bet.betPerct || 1}`;
      }
      return 1;
    },
    attrs() {
      return Object.assign({}, this.$attrs, {
        style: { transform: `scale(${this.betPct},${this.betPct})` },
      });
    },
  },
};
</script>
