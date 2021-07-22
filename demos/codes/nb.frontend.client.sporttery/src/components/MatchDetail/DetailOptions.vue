<template>
  <ul class="detail-options">
    <template v-for="(ocol, ci) in game.options">
      <template v-if="ocol">
        <li :key="Array.isArray(ocol) || !ocol ? ci : ocol.optionID">
          <ul v-if="Array.isArray(ocol)">
            <li
              v-for="(item, oi) in ocol"
              :key="item ? item.optionID : oi"
            >
              <!-- :option="item" -->
              <game-option
                :game="game"
                :match="match"
                :games="[game]"
                :options="ocol"
                :option-index="oi"
                :option-value="item"
                :option-value-str="JSON.stringify(item)"
              />
            </li>
          </ul>
          <!-- :option="ocol" -->
          <game-option
            v-else
            :game="game"
            :match="match"
            :games="[game]"
            :options="game.options"
            :option-index="ci"
            :option-value="ocol"
            :option-value-str="JSON.stringify(ocol)"
          />
        </li>
      </template>
    </template>
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
.blue .detail-options {
  &, & > li, & ul > li {
    border-color: #2e2f34;
  }
}
</style>
