<template>
  <div class="x-programs">
    <div
      v-if="programs && programs.length"
      class="items"
    >
      <program-item
        v-for="p in programs"
        :key="p.ticketId"
        :program="p"
        :type="type"
      />
    </div>
    <div
      v-else-if="!loading"
      class="empty"
    >
      <cimg src="./images/no-program.png" />
      <p>暂无相关提案</p>
    </div>
  </div>
</template>
<script>
import ProgramItem from './ProgramItem';

export default {
  props: {
    programs: {
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    type: Number,
  },
  components: {
    ProgramItem,
  },
};
</script>
<style lang="less">
.x-programs {
  padding-bottom: .1rem;
  .items {
    padding: 0 .1rem;
  }
  .x-program-item {
    margin-top: .15rem;
  }
  .x-program-item:first-child {
    margin-top: 0;
  }
  .empty {
    color: #777;
    text-align: center;
    padding: .2rem 0;
    img {
      width: 1.3rem;
    }
    p {
      margin-top: .1rem;
    }
  }
}
</style>
