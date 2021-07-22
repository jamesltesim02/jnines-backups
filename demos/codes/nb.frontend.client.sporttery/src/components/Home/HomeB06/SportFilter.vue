<template>
  <div class="sport-filter-b06">
    <ul>
      <v-touch
        tag="li"
        v-for="s in sports"
        :key="s"
        :class="{active: sno === s}"
        @tap="$emit('update:sno', s)"
      >
        <i><icon-sports :sno="s" /></i>
        <div>{{$t(`common.sports.${s}`)}}</div>
      </v-touch>
    </ul>
  </div>
</template>
<script>
import IconSports from '../HomeNav/icons/IconSports';

const availabelSports = window.NBConfig.AVAILABLE_SPORTS;

export default {
  props: {
    sno: {
      default: 0,
    },
  },
  components: {
    IconSports,
  },
  computed: {
    sports() {
      return [
        0,
        ...availabelSports.map(s => s.SPORT_ID || s).filter(s => s < 100),
      ];
    },
  },
};
</script>
<style lang="less">
.sport-filter-b06 {
  border-bottom: 1px solid #e3e3e3;
  ul {
    display: flex;
    font-size: .12rem;
    padding: .02rem 0 .05rem;
    li {
      width: .68rem;
      text-align: center;
      color: #9b9b9b;
      svg {
        filter: grayscale(100%);
      }
      i {
        display: flex;
        height: .34rem;
        align-items: center;
        justify-content: center;
      }
      &.active {
        color: #ff5353;
        svg {
          filter: none;
        }
      }
    }
  }
}
</style>
