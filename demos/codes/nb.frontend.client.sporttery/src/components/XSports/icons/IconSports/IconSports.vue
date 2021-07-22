<template>
  <component :is="icon" />
</template>
<script>
import IconFootball from './IconFootball';
import IconBasketball from './IconBasketball';
import IconLOL from './IconLOL';
import IconDota2 from './IconDota2';
import IconCounterStrike from './IconCounterStrike';
import IconStarCraft from './IconStarCraft';
import IconOverwatch from './IconOverwatch';
import IconArenaOfValor from './IconArenaOfValor';

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
const iconMap = {
  10: IconFootball,
  11: IconBasketball,
  14: IconLOL,
  15: IconDota2,
  16: IconArenaOfValor,
  17: IconCounterStrike,
  18: IconStarCraft,
  19: IconOverwatch,
};

export default {
  props: ['sno'],
  computed: {
    icon() {
      return iconMap[this.sno];
    },
  },
};
</script>
