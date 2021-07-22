<template>
  <ul class="list-options">
    <li
      v-for="(g, gi) in games"
      :key="gi"
    >
      <ul class="game">
        <li
          v-for="(o, oi) in g.options"
          :key="oi"
        >
          <game-option
            :match="match"
            :game="g"
            :option="o"
            :games="games"
          />
        </li>
      </ul>
    </li>
  </ul>
</template>
<script>
import GameOption from '@/components/common/GameOption';

export default {
  props: ['match', 'games'],
  components: {
    GameOption,
  },
};
</script>
<style lang="less">
.list-options {
  & > li {
    border-top: 1px solid #ecebeb;
  }
  .game {
    display: flex;
    li {
      width: 100%;
      border-right: 1px solid #ecebeb;
      &:last-child {
        border-right: 0;
      }
    }
  }
}

.black .list-options > li, .black .list-options .game li {
  border-color: #2e2f34;
}
</style>
