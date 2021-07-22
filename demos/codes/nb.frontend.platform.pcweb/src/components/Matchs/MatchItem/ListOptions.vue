<template>
  <div class="list-options" v-if="match.games && match.games.length">
    <template v-for="(g, gi) in vgames">
      <ul
        :key="gi"
        v-if="g && g.options && g.options.length"
        class="valid"
      >
        <li
          v-for="(o, oi) in g.options"
          :key="oi"
        >
          <game-option
            :match="match"
            :game="g"
            :option="o"
          />
        </li>
      </ul>
      <ul v-else :key="gi"><li>&nbsp;</li></ul>
    </template>
  </div>
  <div v-else class="list-options">
    <ul v-for="gk in gks" :key="gk"><li>&nbsp;</li></ul>
  </div>
</template>
<script>
import { MATCH_LIST_GAMES } from '@/config/constants';
import GameOption from '@/components/Matchs/GameOption';

export default {
  props: ['match'],
  computed: {
    gks() {
      return MATCH_LIST_GAMES[this.match.sportID];
    },
    vgames() {
      const {
        gks,
        match: {
          games,
        },
      } = this;
      const result = new Array(gks.length);

      if (games && games.length) {
        gks.forEach((gk, i) => {
          result[i] = games.find(({ gameType }) => gameType === gk);
        });
      }

      return result;
    },
  },
  components: { GameOption },
};
</script>

<style lang="less">
.list-options {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  ul {
    position: relative;
    width: 44.5%;
    display: flex;
    border-radius: 6px;
    line-height: 38px;
    border: 1px solid #323237;
    overflow: hidden;
    * {
      position: relative;
      z-index: 1;
    }
    &::before {
      content: "";
      position: absolute;
      display: block;
      background-image: linear-gradient(to bottom, #3a393f, #333238), linear-gradient(to bottom, #323237, #29292e);
      opacity: .75;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
    li {
      width: 100%;
      text-align: center;
    }
    &.valid li{
      border-right: solid 1px #2e2f34;
    }
  }
}
</style>
