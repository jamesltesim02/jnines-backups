<template>
  <div
    class="focus-options"
    v-if="match.games && match.games.length"
  >
    <ul
      v-for="(g, gi) in vgames"
      :key="gi"
    >
      <template v-if="g && g.options">
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
      </template>
    </ul>
  </div>
</template>
<script>
import GameOption from '@/components/Matchs/GameOption';

export default {
  props: ['match'],
  computed: {
    vgames() {
      const vg = [...this.match.games];
      if (vg) {
        vg.length = 2;
      }
      return vg;
    },
  },
  components: {
    GameOption,
  },
};
</script>
<style lang="less">
.focus-options {
  padding-top: 5px;
  ul {
    display:  flex;
    position: relative;
    line-height: 38px;
    border-radius: 6px;
    border: 1px solid #323237;
    overflow: hidden;
    margin-top: 8px;
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
      border-right: solid 1px #2e2f34;
      width: 100%;
      text-align: center;
    }
  }
}
</style>
