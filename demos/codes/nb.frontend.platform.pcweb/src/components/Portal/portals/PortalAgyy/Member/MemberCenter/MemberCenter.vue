<template>
<scroll-panel class="agyy-member">
  <member-info slot="header" />
  <div class="member-conent">
    <main-operation />
    <secondary-operation />
  </div>
  <div
    slot="footer"
    class="quit"
  >
    <button @click="quit">{{$t('agPage.member.quitBtn')}}</button>
  </div>
</scroll-panel>
</template>
<script>
import { mapMutations } from 'vuex';
import ScrollPanel from '../../common/ScrollPanel';
import MemberInfo from './MemberInfo';
import MainOperation from './MainOperation';
import SecondaryOperation from './SecondaryOperation';

export default {
  components: {
    ScrollPanel,
    MemberInfo,
    MainOperation,
    SecondaryOperation,
  },
  methods: {
    ...mapMutations('app', ['setUserinfo']),
    ...mapMutations('agyy', ['pushRouter']),
    quit() {
      this.setUserinfo(null);
      this.$toast.center(this.$t('message.quitSuccess'));
      this.pushRouter('/signin');
    },
  },
};
</script>
<style lang="less">
.agyy-member {
  .member-conent {
    padding: 0 18px 30px;
  }
  .quit {
    padding: 10px 20px 30px;
    text-align: center;
    button {
      width: 100%;
      background: #323136;
      line-height: 40px;
      font-size: 14px;
      color: #716d6d;
      border: 0;
      &:hover {
        background: #323136;
      }
    }
  }
}
</style>
