<template>
  <ul v-if="selected" class="tab-menu">
    <v-touch
      tag="li"
      v-for="m in menus"
      :key="m"
      :class="{active: m === selected}"
      @tap="$emit('update:selected', m)"
    >
      <span>
        {{$t(`page.detailmenu.${m}`)}}
        <i v-if="/early/i.test(m) && count" >{{count}}</i>
      </span>
    </v-touch>
  </ul>
</template>
<script>
import { mapState } from 'vuex';

export default {
  props: {
    selected: {
      type: String,
    },
    menus: {
      type: Array,
    },
  },
  computed: {
    ...mapState({ count: state => state.bet.matchHisCount }),
  },
};
</script>
<style lang="less">
.tab-menu {
  display: flex;
  line-height: .44rem;
  background: #fbfbfb;
  overflow: hidden;
  li {
    position: relative;
    width: 100%;
    text-align: center;
    color: #909090;
    span {
      position: relative;
      display: inline-block;
      line-height: .14rem;
      i {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(88%, -50%);
        display: inline-block;
        font-style: normal;
        color: #fff;
        background: #ff5353;
        font-size: .12rem;
        font-weight: normal;
        line-height: .13rem;
        width: .23rem;
        border-radius: 5px;
      }
    }
    &.active {
      color: #2e2f34;
      font-weight: bolder;
      &::before {
        content: "";
        position: absolute;
        display: inline-block;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        height: .03rem;
        width: .3rem;
        border-radius: 2px;
        background: linear-gradient(95deg, rgb(254, 98, 70), rgba(245, 56, 1, 0.61));
      }
    }
  }
}

.black .tab-menu{
  background: #232327;
  li {
    color: #bababa;
    &.active {
      color: #fff;
      &::before {
        box-shadow: rgb(255, 83, 83) 0px -1px 6px 0px;
      }
    }
  }
}
</style>
