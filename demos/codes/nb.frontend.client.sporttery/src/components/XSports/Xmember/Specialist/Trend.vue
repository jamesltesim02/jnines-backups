<template>
  <div
    v-if="trends.length"
    class="x-trend"
  >
    <block-header>近期走势</block-header>
    <div class="items">
      <win-or-lose
        v-for="t in trends"
        :key="t.ticketId"
        :win="t.settleResult >= 0"
      />
    </div>
  </div>
</template>
<script>
import BlockHeader from './BlockHeader';
import WinOrLose from './WinOrLose';

export default {
  props: {
    tickets: {
      default: () => ([]),
    },
  },
  computed: {
    trends() {
      const ts = this.tickets.filter(t => t.settleResult !== 0);
      if (ts.length > 10) {
        ts.length = 10;
      }
      return ts;
    },
  },
  components: {
    BlockHeader,
    WinOrLose,
  },
};
</script>
<style lang="less">
.x-trend {
  margin: .1rem 0;
  padding: .12rem 0 .02rem;
  background: #fff;
  .items {
    padding: .14rem .08rem;
    display: grid;
    grid-template-columns: repeat(10, .26rem);
    justify-content: space-around;
  }
}
.blue .x-trend {
  box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1);
  background: linear-gradient(to bottom, #3a393f, #333238);
}
</style>
