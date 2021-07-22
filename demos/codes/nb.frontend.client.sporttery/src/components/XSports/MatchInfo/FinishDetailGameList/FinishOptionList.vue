<template>
  <ul class="x-finish-options">
    <template v-for="(ocol, ci) in game.options">
      <template v-if="ocol">
        <li :key="Array.isArray(ocol) || !ocol ? ci : ocol.optionID">
          <ul v-if="Array.isArray(ocol)">
            <li
              v-for="(item, oi) in ocol"
              :key="item ? item.optionID : oi"
            >
              <finish-option
                :sno="match.sportID"
                :game="game"
                :option="item"
              />
            </li>
          </ul>
          <finish-option
            v-else
            :sno="match.sportID"
            :game="game"
            :option="ocol"
          />
        </li>
      </template>
    </template>
  </ul>
</template>
<script>
import FinishOption from './FinishOption';

export default {
  props: ['game', 'match'],
  components: {
    FinishOption,
  },
};
</script>
<style lang="less">
.x-finish-options {
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
.blue .x-finish-options {
  border-top: 1px solid #2e2f34;
  & > li { border-left: 1px solid #2e2f34; }
  ul > li { border-bottom: 1px solid #2e2f34; }
}
</style>
