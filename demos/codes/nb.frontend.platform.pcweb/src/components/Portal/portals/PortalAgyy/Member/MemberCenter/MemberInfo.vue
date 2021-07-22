<template>
  <div class="agyy-memberinfo">
    <img
      class="head-icon"
      src="./images/touxiang.png"
    />
    <div class="account">
      <span>{{ userinfo.loginName }}</span>
      <span class="level">{{$t(`agPage.levels.${userinfo.memberLevel}`)}}</span>
    </div>
    <div class="balance">￥{{userinfo.balance | moneyFormat(2)}}</div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState('app', ['userinfo']),
  },
  mounted() {
    this.reloadUserinfo();
  },
  methods: {
    ...mapActions('agyy', ['reloadUserinfo']),
  },
};
</script>

<style lang="less">
.agyy-memberinfo {
  padding: 80px 18px 0;
  text-align: center;
  letter-spacing: 0px;
  .head-icon {
    height: 80px;
    width: 80px;
    border-radius: 50%;
    background: #fff;
    overflow: hidden;
  }
  .account {
    margin-top: 10px;
    line-height: 20px;
    color: #eaeaea;
    font-size: 14px;
    .level {
      display: inline-block;
      font-size: 12px;
      margin-left: 10px;
      box-shadow: 0 2px 4px 2px rgba(255, 74, 74, 0.38);
      background-image: linear-gradient(105deg, #fe597d, #ffb775);
      padding: 0 10px 0 8px;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      letter-spacing: -.2px;
    }
  }
  .balance {
    margin-top: 10px;
    line-height: 40px;
    font-size: 32px;
    color: #ff5353;
  }
}
</style>
