<template>
  <list-page>
    <nav-bar
      title="个人信息"
      slot="header"
    />
    <div class="x-member-info">
      <info-item
        label="头像"
        @tap="$router.push('/member/info/headicon')"
      ><icon-head :src="memberInfo.header" /></info-item>
      <info-item
        label="昵称"
        @tap="$router.push('/member/editinfo/nickname')"
      >{{ memberInfo.nickName }}</info-item>
      <info-item
        label="自我介绍"
        @tap="$router.push('/member/editinfo/introduction')"
      >{{ memberInfo.remark }}</info-item>
    </div>
  </list-page>
</template>
<script>
import { mapState } from 'vuex';
import IconHead from '@/components/XSports/Xmember/icons/IconHead';
import InfoItem from '@/components/XSports/Xmember/InfoItem';

export default {
  computed: {
    ...mapState('member', ['memberInfo']),
  },
  components: {
    IconHead,
    InfoItem,
  },
};
</script>
<style lang="less">
.x-member-info {
  box-shadow: 0 .1rem .2rem 0 rgba(0,0,0,.03);
  background: #ffffff;
  padding: 0 .12rem;
  .icon-head {
    width: .4rem;
    height: .4rem;
    vertical-align: middle;
  }
}
.blue .x-member-info {
  box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1);
  background: linear-gradient(to bottom, #3a393f, #333238);
}
</style>
