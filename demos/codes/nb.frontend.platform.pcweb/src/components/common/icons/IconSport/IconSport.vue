<template>
  <component :is="icon" />
</template>
<script>
import Soccer from './Soccer';
import Basketball from './Basketball';
import LOL from './LOL';
import Dota2 from './Dota2';
import ArenaOfValor from './ArenaOfValor';
import CounterStrike from './CounterStrike';
import StarCraft from './StarCraft';
import Overwatch from './Overwatch';

/*
  体育定义 - SportID
  10 = Soccer 足球
  11 = Basketball 篮球
  12 = Tennis 网球
  14 = LOL 英雄联盟
  15 = Dota2 刀塔2
  16 = ArenaOfValor 王者荣耀
  17 = CounterStrike 反恐精英
  18 = StarCraft 星际争霸
  19 = Overwatch 守望先锋
*/
const SPORTS_MAPPING = {
  10: Soccer,
  11: Basketball,
  // 12: Tennis,
  14: LOL,
  15: Dota2,
  16: ArenaOfValor,
  17: CounterStrike,
  18: StarCraft,
  19: Overwatch,
};

export default {
  props: ['sno'],
  computed: {
    icon() {
      return SPORTS_MAPPING[this.sno];
    },
  },
};
</script>
