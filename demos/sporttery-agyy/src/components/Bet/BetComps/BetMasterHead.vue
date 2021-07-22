<template>
  <div class="nb-bet-master-head">
    <nav-bar :title="$t('pageBet.mySelect')" @back="backFun" custBack />
    <div class="master-head-change flex-between">
      <v-touch tag="div" :class="`change-item-${multType ? 'normal' : 'active'} flex-center`" @tap="updateMultType(0)">
        {{$t('pageBet.single')}}
      </v-touch>
      <v-touch tag="div" :class="`change-item-${multType ? 'active' : 'normal'} flex-center`" @tap="updateMultType(1)">
        {{$t('pageBet.multiple')}}
      </v-touch>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import NavBar from '@/components/common/NavBar';

export default {
  inheritAttrs: false,
  name: 'BetMasterHead',
  computed: {
    ...mapState('app', {
      multType: state => state.multType,
    }),
  },
  watch: {
    multType() {
      this.quoteBetCart();
    },
  },
  components: {
    NavBar,
  },
  methods: {
    ...mapMutations([
      'changeSubStatus',
    ]),
    ...mapMutations('app', [
      'updateMultType',
    ]),
    ...mapActions(['quoteBetCart']),
    backFun() {
      this.$router.go(-1);
      this.changeSubStatus(false);
    },
  },
};
</script>

<style lang="less">
.white .nb-bet-master-head {
  background: #FFF;
  .master-head-title {
    color: #2E2F34;
  }
  .master-head-change {
    border-top: .01rem solid #ECEBEB;
    border-bottom: .01rem solid #ECEBEB;
    .change-item-normal {
      background: #ECEBEB;
      color: #AAA;
    }
    .change-item-active {
      background: #FFF;
      color: #2E2F34;
    }
  }
}
.black .nb-bet-master-head {
  background: #28272d;
  .master-head-title {
    color: #FFF;
  }
  .master-head-change {
    border-top: .01rem solid #2a2a2f;
    border-bottom: .01rem solid #28272d;
    .change-item-normal {
      background: #232327;
      color: #716d6d;
    }
    .change-item-active {
      background-image: linear-gradient(to bottom, #3a393f, #333238);
      color: #ecebeb;
    }
  }
}
.nb-bet-master-head {
  width: 3.75rem;
  .master-head-box {
    width: 3.75rem;
    height: .45rem;
    position: relative;
    .master-head-back {
      width: .45rem;
      height: .45rem;
    }
    .master-head-title {
      width: 100%;
      height: .45rem;
      font-size: .18rem;
    }
  }
  .master-head-change {
    width: 100%;
    height: .35rem;
    .change-item-normal, .change-item-active {
      width: 50%;
      height: .33rem;
      font-size: .14rem;
      user-select: none;
    }
  }
}
</style>
