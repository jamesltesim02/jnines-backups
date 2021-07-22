<template>
  <acount-block :userinfo="userinfo">
    <div class="walletinfo">
      <div class="title flex-end-bottom">
        <span>{{$t('page.wallettitle')}}</span>
      </div>
      <div class="balance">
        <span v-if="balanceLoading">{{$t('message.loading')}}</span>
        <span v-else>{{userinfo.balance | moneyFormat(2)}}</span>
      </div>
      <div class="operate flex-start">
        <v-touch
          tag="button"
          @tap="reloadBalance()"
          :class="{
            rolling: balanceLoading
          }"
        >
          <icon-reload
            width=".23rem"
            height=".23rem"
          />
        </v-touch>
      </div>
    </div>
  </acount-block>
</template>
<script>
import AcountBlock from '@/components/common/AcountBlock';

import { mapState, mapActions } from 'vuex';
import IconReload from './icons/IconReload';

export default {
  props: ['userinfo'],
  computed: {
    ...mapState('app', ['balanceLoading', 'isLite']),
  },
  components: {
    IconReload,
    AcountBlock,
  },
  mounted() {
    this.reloadBalance();
    if (this.isLite) {
      this.agRealodUserinfo();
    }
  },
  methods: {
    ...mapActions('app', ['reloadBalance', 'agRealodUserinfo']),
  },
};
</script>
<style lang="less">
.walletinfo {
  display: flex;
  margin-top: .2rem;
  .title {
    width: .9rem;
    text-align: right;
    font-size: .12rem;
    color: #2e2f34;
  }
  .balance {
    position: relative;
    flex-grow: 1;
    color: #ff5353;
    font-size: .3rem;
    line-height: .3rem;
    padding-left: .15rem;
    text-align: center;
    &::before {
      content: "￥";
      position: absolute;
      left: 15px;
      bottom: 0;
      color: #909090;
      font-size: .18rem;
      line-height: .18rem;
      margin-right: .1rem;
      opacity: .7;
      transition: all .15s;
    }
  }
  .operate {
    width: .48rem;
    button {
      line-height: 0;
      border-radius: 50%;
      overflow: hidden;
      svg path {
        fill: #fff;
      }
    }
  }
}
.black .walletinfo {
  .title {
    color: #909090;
  }
  .operate {
    button {
      box-shadow: 1px -1px 32px -1px #ff5353;
      svg path {
        fill: rgb(46, 45, 51);
      }
    }
  }
}
</style>
