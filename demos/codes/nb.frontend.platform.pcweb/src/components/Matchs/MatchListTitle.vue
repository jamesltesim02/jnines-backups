<template>
  <div class="match-list-title">
    <span>{{$t(`common.wf.wf_${sno}_1_0_${gks[0]}`)}}</span>
    <span>{{$t(`common.wf.wf_${sno}_1_0_${gks[1]}`)}}</span>
  </div>
</template>
<script>
import { MATCH_LIST_GAMES } from '@/config/constants';

export default {
  props: {
    sno: {
      default: 10,
    },
  },
  computed: {
    gks() {
      return MATCH_LIST_GAMES[this.sno];
    },
  },
};
</script>
<style lang="less">
.match-list-title {
  position: relative;
  line-height: 50px;
  height: 50px;
  font-size: 14px;
  color: #6b6b6b;
  span {
    display: inline-block;
    padding: 0 25px;
    position: absolute;
    background: #1e1d23;
    bottom: 8px;
    line-height: 14px;
    transform: translateX(50%);
    &:first-child {
      right: 49.5%;
    }
    &:last-child {
      right: 17.666666666666668%;
    }
  }
  &::before {
    position: absolute;
    content: "";
    display: block;
    bottom: 14px;
    height: 0;
    width: 85%;
    right: -35px;
    opacity: .4;
    border-style: solid;
    border-width: 1px;
    border-image-source: linear-gradient(to right, #28272d, #666666 51%, #1e1d23);
    border-image-slice: 1;
  }
}
</style>
