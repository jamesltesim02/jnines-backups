<template>
  <ul class="detail-options">
    <li
      v-for="(ocol, ci) in game.options"
      :key="ci"
    >
      <ul
        v-if="Array.isArray(ocol)"
      >
        <li
          v-for="(item, ii) in ocol"
          :key="ii"
        >
          <game-option
            :option="item"
            :game="game"
            :match="match"
            :games="[game]"
          />
        </li>
      </ul>
      <game-option
        v-else
        :option="ocol"
        :game="game"
        :match="match"
        :games="[game]"
      />
    </li>
  </ul>
</template>
<script>
import GameOption from '@/components/common/GameOption';

export default {
  props: ['game', 'match'],
  components: {
    GameOption,
  },
};
</script>
<style lang="less">
.detail-options {
  border-top: 1px solid #ecebeb;
  display: flex;
  & > li {
    width: 100%;
    border-left: 1px solid #ecebeb;
    &:first-child{
      border-left: 0;
    }
  }
  ul > li {
    border-bottom: 1px solid #ecebeb;
    &:last-child {
      border-bottom: 0;
    }
  }
}
.black .detail-options {
  &, & > li, & ul > li {
    border-color: #2e2f34;
  }
}
</style>
