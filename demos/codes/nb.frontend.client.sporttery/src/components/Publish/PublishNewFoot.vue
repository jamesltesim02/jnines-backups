<template>
  <div class="nb-publish-new-foot">
    <div class="nb-publish-new-foot-explan flex-between">
      <v-touch class="publish-new-foot-box flex-start" :class="{ select: !data.isRake }" @tap="changeWater">
        <publish-select :select="!data.isRake" />
        <span>{{$t('share.noWater')}}</span>
      </v-touch>
      <v-touch class="publish-new-foot-box flex-start" @tap="showPubRule">
        <publish-alert :color="altColor" />
        <span>{{$t('share.waterRule')}}</span>
      </v-touch>
    </div>
    <v-touch class="publish-new-foot-btn flex-center" @tap="publishNow">{{$t('share.pubNow')}}</v-touch>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import PublishSelect from '@/components/Publish/PublishSelect';
import PublishAlert from '@/components/Publish/PublishAlert';

export default {
  inheritAttrs: false,
  name: 'PublishNewFoot',
  props: { data: Object },
  computed: {
    ...mapState('app', ['userinfo', 'theme']),
    noLogin() {
      return !(this.userinfo && this.userinfo.token && this.userinfo.nbUser);
    },
    rout() {
      return this.$route.path;
    },
    altColor() {
      return /blue/.test(this.theme) ? '#53fffd' : '#ff5353';
    },
  },
  components: { PublishSelect, PublishAlert },
  methods: {
    ...mapMutations(['updateTicket']),
    ...mapMutations('app', ['setJumpNewObject']),
    changeWater() {
      const dt = JSON.parse(JSON.stringify(this.data));
      dt.isRake = !dt.isRake;
      this.$emit('change', dt);
    },
    showPubRule() {
      this.setJumpNewObject({ title: this.$t('share.waterRule'), detail: this.$t('share.ruleDetail') });
    },
    publishNow() {
      if (this.noLogin) {
        this.$toast(this.$t('share.noLogin'));
        this.updateTicket();
        this.$router.go(-1);
      } else if (!/^.{5,20}$/.test(this.data.title)) {
        this.$toast(this.$t('share.pubTitleError'));
      } else if (this.data.remark && !/^.{10,30}$/.test(this.data.remark)) {
        this.$toast(this.$t('share.pubDetailError'));
      } else {
        this.$router.replace(this.rout.replace(/^(.*)\/\d+$/, '$1/1'));
      }
    },
  },
};
</script>

<style lang="less">
.nb-publish-new-foot {
  width: 100%;
  .nb-publish-new-foot-explan { width: 100%; height: .16rem; margin-top: .1rem; padding: 0 .12rem; }
  .publish-new-foot-box span { padding-left: .06rem; font-size: .12rem; font-weight: 500; color: #aaaaaa; }
  .publish-new-foot-box svg { rect { stroke: #ff5353; fill: none; } path { fill: #ff5353; } }
  .publish-new-foot-btn { width: 3.55rem; height: .44rem; margin: .15rem auto; border-radius: .06rem; font-size: .16rem; font-weight: 500; background: #ff5353; color: #ffffff; }
}
.blue .nb-publish-new-foot {
  .publish-new-foot-box span { color: #aaaaaa; }
  .publish-new-foot-box svg { rect { stroke: #00b5b3; fill: none; } path { fill: #ffffff; } }
  .publish-new-foot-box.select svg rect { fill: #00b5b3; }
  .publish-new-foot-btn { background: #00b5b3; color: #ffffff; }
}
</style>
