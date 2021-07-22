<template>
<div class="nb-publish-detail-foot flex-between" :style="boxStyle">
  <v-touch class="foot-rtn flex-center" :style="btnStyle" @tap="rtnFun">{{$t('share.rtnChange')}}</v-touch>
  <v-touch class="foot-sub flex-center" :style="btnStyle" @tap="subFun">{{$t('share.sureSubmit')}}</v-touch>
</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { postPublishPlan } from '@/api/bet';

export default {
  inheritAttrs: false,
  name: 'PublishDetailFoot',
  props: { data: Object },
  computed: {
    ...mapState('app', ['userinfo', 'tabHeight']),
    noLogin() {
      return !(this.userinfo && this.userinfo.token && this.userinfo.nbUser);
    },
    rout() {
      return this.$route.path;
    },
    boxStyle() {
      const num = +(`${this.tabHeight}`.replace(/[a-z]/gi, ''));
      return { height: `${0.56 + num}rem` };
    },
    btnStyle() {
      return { paddingBottom: this.tabHeight };
    },
  },
  methods: {
    ...mapMutations(['updateTicket', 'setFinishTask']),
    ...mapMutations('app', ['setShareTarget']),
    rtnFun() {
      this.$router.replace(this.rout.replace(/^(.*)\/\d+$/, '$1/0'));
    },
    publishSucFun() {
      const content = this;
      this.setFinishTask({
        title: content.$t('share.publishSucc'),
        detail: [{
          text: content.$t('share.pubDetailOne'),
          style: { fontSize: '.2rem', fontWeight: 500 },
        }, {
          text: content.$t('share.pubDetailTwo'),
          style: { fontSize: '.2rem', fontWeight: 500, color: '#ff5353' },
        }, {
          text: content.$t('share.pubDetailThree'),
          style: { fontSize: '.16rem', marginTop: '.04rem' },
        }],
        button: {
          text: content.$t('share.shareNow'),
          fun: () => {
            content.setShareTarget('publish');
            content.$router.go(-1);
          },
        },
        close: () => {
          content.$router.go(-1);
        },
      });
    },
    async subFun() {
      if (this.noLogin) {
        this.$toast(this.$t('share.noLogin'));
        this.updateTicket();
        this.$router.go(-1);
      } else if (!/^.{5,20}$/.test(this.data.title)) {
        this.$toast(this.$t('share.pubTitleError'));
      } else if (this.data.remark && !/^.{10,30}$/.test(this.data.remark)) {
        this.$toast(this.$t('share.pubDetailError'));
      } else {
        try {
          await postPublishPlan(this.data);
          this.updateTicket();
          this.publishSucFun();
        } catch (ev) {
          console.log(ev);
        }
      }
    },
  },
};
</script>

<style lang="less">
.nb-publish-detail-foot {
  width: 100%;
  .foot-rtn { width: 40%; height: 100%; font-size: .16rem; background: #eeeeee; color: #999999; }
  .foot-sub { width: 60%; height: 100%; font-size: .16rem; background: #ff5353; color: #ffffff; }
}
.blue .nb-publish-detail-foot {
  .foot-rtn { background: #2e2f34; color: #909090; }
  .foot-sub { background: #00b5b3; color: #ffffff; }
}
</style>
