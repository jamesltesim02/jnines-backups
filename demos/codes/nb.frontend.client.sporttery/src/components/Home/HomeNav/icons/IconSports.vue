<template>
  <component :is="icon" :color="iconColor" />
</template>
<script>
import { mapState } from 'vuex';
import IconAll from './IconAll';
import IconOneFootball from './IconOneFootball';
import IconOneBasketball from './IconOneBasketball';
import IconOneLOL from './IconOneLOL';
import IconOneDota2 from './IconOneDota2';
import IconOneCounterStrike from './IconOneCounterStrike';
import IconOneStarCraft from './IconOneStarCraft';
import IconOneOverwatch from './IconOneOverwatch';
import IconOneArenaOfValor from './IconOneArenaOfValor';
import IconOneBlockade from './IconOneBlockade';
import IconOneJackpot from './IconOneJackpot';
import IconTwoFootball from './IconTwoFootball';
import IconTwoBasketball from './IconTwoBasketball';
import IconTwoLOL from './IconTwoLOL';
import IconTwoDota2 from './IconTwoDota2';
import IconTwoCounterStrike from './IconTwoCounterStrike';
import IconTwoStarCraft from './IconTwoStarCraft';
import IconTwoOverwatch from './IconTwoOverwatch';
import IconTwoArenaOfValor from './IconTwoArenaOfValor';
import IconTwoBlockade from './IconTwoBlockade';
import IconTwoJackpot from './IconTwoJackpot';

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
  888 = Blockade 闯关
  999 = Jackpot 奖池
*/
const iconMapOne = {
  0: IconAll,
  10: IconOneFootball,
  11: IconOneBasketball,
  14: IconOneLOL,
  15: IconOneDota2,
  16: IconOneArenaOfValor,
  17: IconOneCounterStrike,
  18: IconOneStarCraft,
  19: IconOneOverwatch,
  888: IconOneBlockade,
  999: IconOneJackpot,
};
const iconMapTwo = {
  0: IconAll,
  10: IconTwoFootball,
  11: IconTwoBasketball,
  14: IconTwoLOL,
  15: IconTwoDota2,
  16: IconTwoArenaOfValor,
  17: IconTwoCounterStrike,
  18: IconTwoStarCraft,
  19: IconTwoOverwatch,
  888: IconTwoBlockade,
  999: IconTwoJackpot,
};

export default {
  props: ['sno'],
  computed: {
    ...mapState('app', ['theme']),
    icon() {
      return /^3$/.test(window.NBConfig.HOME_STYLE) ? iconMapTwo[this.sno] : iconMapOne[this.sno];
    },
    iconColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_HOME_ICON_COLOR ? pSet.BLACK_HOME_ICON_COLOR : '#ff5353';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_HOME_ICON_COLOR ? pSet.BLUE_HOME_ICON_COLOR : '#53fffd';
      }
      return pSet && pSet.WHITE_HOME_ICON_COLOR ? pSet.WHITE_HOME_ICON_COLOR : '#ff5353';
    },
  },
};
</script>
