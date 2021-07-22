<template>
  <ul class="list-options">
    <template v-for="(g, gi) in games">
      <li
        v-if="gameAvailable(g)"
        :key="gi"
      >
        <ul class="game">
          <li v-for="(o, oi) in g.options" :key="oi" >
            <game-option
              :match="match"
              :game="g"
              :option="o"
              :games="games"
            />
          </li>
        </ul>
      </li>
    </template>
  </ul>
</template>
<script>
import GameOption from '@/components/common/GameOption';

export default {
  props: ['match', 'games'],
  components: {
    GameOption,
  },
  methods: {
    gameAvailable(game) {
      return game.options.filter(o => o && o.betStatus >= 6).length > 0;
    },
  },
};
</script>
<style lang="less">
.list-options {
  & > li { border-top: 1px solid #ecebeb; }
  .game {
    display: flex;
    li {
      width: 100%;
      border-right: 1px solid #ecebeb;
      &:last-child { border-right: 0; }
    }
  }
}
.black .list-options > li, .black .list-options .game li { border-color: #2e2f34; }
.blue .list-options > li, .blue .list-options .game li { border-color: #2e2f34; }
</style>
