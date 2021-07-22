<template>
  <i
    class="live-flag"
    :class="{ active: active }"
    :style="{ background: liveColor }"
  ></i>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: { active: { default: false } },
  computed: {
    ...mapState('app', ['theme']),
    liveColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (this.active) {
        if (/^black$/i.test(this.theme)) {
          return pSet && pSet.BLACK_LIVE_FLAG_COLOR ? pSet.BLACK_LIVE_FLAG_COLOR : '#fe6246';
        }
        if (/^blue$/i.test(this.theme)) {
          return pSet && pSet.BLUE_LIVE_FLAG_COLOR ? pSet.BLUE_LIVE_FLAG_COLOR : '#fe6246';
        }
        return pSet && pSet.WHITE_LIVE_FLAG_COLOR ? pSet.WHITE_LIVE_FLAG_COLOR : '#fe6246';
      }
      return '#9B9B9B';
    },
  },
};
</script>

<style lang="less">
.live-flag {
  display: inline-block;
  width: .18rem;
  height: .18rem;
  border: .044rem solid #E7E7E7;
  border-radius: 50%;
  &.active { border-color: #ffe8e3; animation: halfblink linear 1.5s infinite; }
}
@keyframes halfblink {
  from, 50%, to { opacity: .6; } 25%, 75% { opacity: 1; }
}
.black .live-flag {
  border-color: #4b4c52;
}
</style>
