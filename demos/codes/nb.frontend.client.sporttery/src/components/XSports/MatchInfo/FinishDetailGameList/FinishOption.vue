<template>
  <div class="x-finish-option">
    <template v-if="!!option">
      <div class="name">
        <span v-if="optionName.prefix" class="option-bar" >{{optionName.prefix}}</span>
        <span v-if="optionName.key">{{$t(`common.optionNames.${optionName.key}`)}}</span>
        <span v-if="optionName.value">{{optionName.value}}</span>
        <span v-if="optionName.suffix">{{optionName.suffix}}</span>
      </div>
      <div
        v-if="sno === 10 && game.gameType === 16"
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
    </template>
  </div>
</template>
<script>
import toOptionName from '@/components/common/GameOption/toOptionName';

export default {
  props: ['sno', 'game', 'option'],
  computed: {
    optionName() {
      return toOptionName(this.game.gameType, this.option.betBar, this.option.betOption);
    },
  },
};
</script>
<style lang="less">
.x-finish-option {
  display: flex;
  line-height: .38rem;
  height: .38rem;
  transition: all  .25s ease-out;
  position: relative;
  div {
    display: block;
    width: 100%;
  }
  .name {
    padding-right: .05rem;
    text-align: right;
    font-size: .12rem;
    color: #666;
  }
  .option-bar {
    color: #bababa;
    margin-right: .08rem;
  }
  .result, .score {
    padding-left: .05rem;
    font-size: .12rem;
    color: #2e2f34;
    span {
      display: inline-block;
      padding: .05rem;
      border-radius: 3px;
      line-height: .12rem;
      color: #bababa;
      border: 1px solid #bababa;
    }
  }
  .result.win span {
    color: #fe6246;
    border: 1px solid #fe6246;
  }
}
.blue .x-finish-option {
  .name { color: #666; }
  .option-bar { color: #bababa; }
  .result, .score {
    color: #ecebeb;
    span { color: #777777; border: 1px solid #777777; }
  }
  .result.win span { color: #53fffd; border: 1px solid #00e5fe; }
}
</style>
