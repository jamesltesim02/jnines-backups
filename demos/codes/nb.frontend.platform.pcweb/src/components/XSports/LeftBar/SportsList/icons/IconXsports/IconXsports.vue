<template>
  <cimg
    :class="`icon-xsports icon-xsport-${sno || 'all'}`"
    :src="src"
  />
</template>
<script>
import { mapState } from 'vuex';

/**
 * 开放的体育类型列表
 *
 *   10 = Soccer 足球
 *   11 = Basketball 篮球
 *   12 = Tennis 网球
 *   13 = 台球
 *   14 = LOL 英雄联盟
 *   15 = Dota2 刀塔2
 *   16 = ArenaOfValor 王者荣耀
 *   17 = CounterStrike 反恐精英
 *   18 = StarCraft 星际争霸
 *   19 = Overwatch 守望先锋
 *   20 = 乒乓
 *   21 = 保龄球
 *   22 = 拳击
 *   23 = 排球
 *   24 = 橄榄球
 *   25 = 羽毛球
 *   26 = 高尔夫
 */
const ICON_MAPPING = {
  '0-white': require('./all-white.png'),
  '0-dark': require('./all-dark.png'),
  10: require('./10.png'),
  11: require('./11.png'),
  12: require('./12.png'),
  13: require('./13.png'),
  14: require('./14.png'),
  15: require('./15.png'),
  16: require('./16.png'),
  17: require('./17.png'),
  18: require('./18.png'),
  19: require('./19.png'),
  20: require('./20.png'),
  21: require('./21.png'),
  22: require('./22.png'),
  23: require('./23.png'),
  24: require('./24.png'),
  25: require('./25.png'),
  26: require('./26.png'),
};

export default {
  props: ['sno'],
  computed: {
    ...mapState('app', ['theme']),
    src() {
      if (!this.sno) {
        return ICON_MAPPING[`0-${this.theme}`];
      }
      return ICON_MAPPING[this.sno];
    },
  },
};
</script>
<style lang="less">
.icon-xsport-all {
  width: 22px;
  height: 22px;
}
// 10 = Soccer 足球
.icon-xsport-10 {
  width: 24px;
  height: 24px;
}
// 11 = Basketball 篮球
.icon-xsport-11 {
  width: 24px;
  height: 24px;
}
// 12 = Tennis 网球
.icon-xsport-12 {
  width: 24px;
  height: 26px;
}
// 13 = 台球
.icon-xsport-13 {
  width: 24px;
  height: 24px;
}
// 14 = LOL 英雄联盟
.icon-xsport-14 {
  width: 25px;
  height: 25px;
}
// 15 = Dota2 刀塔2
.icon-xsport-15 {
  width: 23px;
  height: 23px;
}
// 16 = ArenaOfValor 王者荣耀
.icon-xsport-16 {
  width: 45px;
  height: 33px;
}
// 17 = CounterStrike 反恐精英
.icon-xsport-17 {
  width: 26px;
  height: 26px;
}
// 18 = StarCraft 星际争霸
.icon-xsport-18 {
  width: 28px;
  height: 28px;
}
// 19 = Overwatch 守望先锋
.icon-xsport-19 {
  width: 26px;
  height: 26px;
}
// 20 = 乒乓
.icon-xsport-20 {
  width: 23px;
  height: 30px;
}
// 21 = 保龄球
.icon-xsport-21 {
  width: 32px;
  height: 36px;
}
// 22 = 拳击
.icon-xsport-22 {
  width: 35px;
  height: 30px;
}
// 23 = 排球
.icon-xsport-23 {
  width: 24px;
  height: 24px;
}
// 24 = 橄榄球
.icon-xsport-24 {
  width: 31px;
  height: 22px;
}
// 25 = 羽毛球
.icon-xsport-25 {
  width: 30px;
  height: 24px;
}
// 26 = 高尔夫
.icon-xsport-26 {
  width: 24px;
  height: 33px;
}
</style>
