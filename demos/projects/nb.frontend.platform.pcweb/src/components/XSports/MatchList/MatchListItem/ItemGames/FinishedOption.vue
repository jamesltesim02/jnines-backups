<template>
  <div
    v-if="option"
    class="x-finished-option"
  >
    <div class="name">
      <span v-if="optionName.prefix" class="option-bar" >{{optionName.prefix}}</span>
      <span v-if="optionName.key">{{$t(`common.optionNames.${optionName.key}`)}}</span>
      <span v-if="optionName.value">{{optionName.value}}</span>
      <span v-if="optionName.suffix">{{optionName.suffix}}</span>
    </div>
    <div
      v-if="match.sportID === 10 && game.gameType === 16"
      class="score"
    ><span>{{option.matchResult }}</span></div>
    <div
      v-else
      :class="{
        'result': true,
        'win': (option.settleResult || '').includes('赢'),
        'lose': (option.settleResult || '').includes('输'),
      }"
    ><span>{{option.settleResult}}</span></div>
  </div>
</template>
<script>
import toOptionName from '@/components/Matchs/GameOption/toOptionName';

export default {
  props: ['match', 'game', 'option'],
  computed: {
    optionName() {
      if (!this.game || !this.option) {
        return '';
      }
      return toOptionName(
        this.game.gameType,
        this.game.betBar || this.option.betBar,
        this.option.betOption,
      );
    },
  },
};
</script>
<style lang="less">
.x-finished-option {
  display: flex;
  .name {
    width: 52%;
    text-align: right;
    color: #666;
    font-size: 12px;
    transition: color .35s ease-out;
    padding-right: 7px;
  }
  .option-bar {
    margin-right: 4px;
  }
  .result, .score {
    padding-left: 6px;
    font-size: 12px;
    color: #2e2f34;
    span {
      display: inline-block;
      padding: 5px;
      border-radius: 3px;
      line-height: 12px;
      color: #bababa;
      border: 1px solid #bababa;
    }
  }
  .result.win span {
    color: #fe6246;
    border: 1px solid #fe6246;
  }
}

.dark .x-finished-option {
  .result, .score {
    span {
      color: #909090;
      border-color: #909090;
    }
  }
  .result.win span {
    color: #53fffd;
    border-color: #53fffd;
  }
}
</style>
