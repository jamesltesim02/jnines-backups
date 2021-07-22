<template>
  <ul class="detail-options">
    <li
      v-for="(ocol, ci) in game.options"
      :key="ci"
    >
      <ul
        v-if="Array.isArray(ocol)"
      >
        <template v-for="(item, ii) in ocol">
          <li :key="ii">
            <div
              :class="{
                'option-item': true,
                unempty: item
              }"
            >
              <game-option
                v-if="item"
                :option="item"
                :game="game"
                :match="match"
              />
            </div>
          </li>
        </template>
      </ul>
      <div
        v-else
        :class="{
          'option-item': true,
          unempty: ocol
        }"
      >
        <game-option
          :option="ocol"
          :game="game"
          :match="match"
        />
      </div>
    </li>
  </ul>
</template>
<script>
import GameOption from '@/components/Matchs/GameOption';

export default {
  props: ['game', 'match'],
  components: { GameOption },
};
</script>
<style lang="less">
.detail-options {
  display: flex;
  & > li {
    width: 100%;
    margin: 10px;
    li {
      margin-top: 10px;
      &:first-child {
        margin-top: 0;
      }
    }
  }
  .option-item {
    height: 38px;
    line-height: 38px;
    border-radius: 6px;
    overflow: hidden;
  }
  .option-item.unempty {
    position: relative;
    * {
      position: relative;
      z-index: 1;
    }
    &::before {
      content: "";
      border-radius: 6px;
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
  }
}
</style>
