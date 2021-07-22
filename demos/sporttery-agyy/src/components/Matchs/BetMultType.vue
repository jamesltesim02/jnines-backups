<template>
  <div class="but-container">
    <ul class="bet-mult-type">
      <v-touch
        tag="li"
        v-for="(t, i) in types"
        :key="i"
        @tap="$emit('update:multitype', i)"
        :class="{active: i === multitype}"
        class="flex-center"
      >{{$t(t)}}</v-touch>
    </ul>
    <ul v-if="isSeamless" class="contrls">
      <li class="historys flex-center">
        <v-touch
          tag="span"
          :class="[
            `icon-history`,
            succStatus ? 'order-changed' : ''
          ]"
          @tap="$router.push('/history')"
        >
          <icon-history />
        </v-touch>
      </li>
      <li class="settings flex-center">
        <v-touch
          tag="span"
          @tap="$router.push('/settings')"
        >
        <icon-setting />
        </v-touch>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { AppModes } from '@/config/constants';
import IconHistory from '@/components/common/TabBar/icons/IconHistory';
import IconSetting from './icons/IconSetting';


const { APP_MODE } = window.NBConfig;

export default {
  props: ['multitype'],
  data() {
    return {
      isSeamless: APP_MODE === AppModes.SEAMLESS,
      types: [
        'page.betType.single',
        'page.betType.multiple',
      ],
    };
  },
  computed: {
    ...mapState({
      succStatus: state => state.bet.succStatus,
    }),
  },
  components: {
    IconHistory,
    IconSetting,
  },
};
</script>
<style lang="less">
.bet-mult-type {
  background: #ecebeb;
  display: flex;
  font-size: .14rem;
  li {
    width: 100%;
    text-align: center;
    line-height: .35rem;
    color: #aaa;
    &.active {
      background: #fff;
      color: #2e2f34;
    }
  }
}
.but-container {
  border-top: 1px solid #ecebeb;
  border-bottom: 1px solid #ecebeb;
  width: 3.75rem;
  .contrls {
    display: none;
    width: 1.05rem;
    line-height: 0;
    li {
      width: 100%;
      padding-bottom: .055rem;
    }
  }
}
.seamless {
  .but-container {
    display: flex;
    .contrls {
      display: flex;
    }
  }
  .bet-mult-type {
    width: 2.7rem;
  }
}
.black .but-container {
  border-color: #26252b;
}
.black .bet-mult-type {
  background: #232327;
  li {
    color: #716d6d;
    &.active {
      color: #ecebeb;
      background: linear-gradient(to bottom, #3a393f, #333238);
    }
  }
}
</style>
