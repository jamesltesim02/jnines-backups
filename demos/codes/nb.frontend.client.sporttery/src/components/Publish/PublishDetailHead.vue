<template>
<v-touch class="nb-publish-detail-head" @tap="clickFun" >
  <publish-item-head class="detail-head-tp" :data="data" isButton @focus="focusFun" >
    <div slot="time" >
      <span>{{$t('share.totalRed')}}</span>
      <span class="num">{{data.totalRed || 0}}</span>
      <span>{{$t('share.redPerson')}}</span>
    </div>
  </publish-item-head>
  <div class="detail-head-btm">
    <div class="detail-head-btm-title flex-start">
      <p>{{data.planTitle || data.title || ''}}</p>
    </div>
    <div class="detail-head-btm-body flex-start">{{data.planRemarks || data.remark || ''}}</div>
    <div class="detail-head-btm-foot flex-between">
      <span class="detail-head-btm-foot-txt flex-start-bottom">{{publishTime}}</span>
      <div class="detail-head-btm-foot-odd flex-center" v-if="odds">
        <span class="btm-foot-odd-txt flex-center">{{$t('share.ensure')}}</span>
        <span class="btm-foot-odd-num flex-center">{{odds}}</span>
      </div>
    </div>
  </div>
</v-touch>
</template>

<script>
import { mapMutations } from 'vuex';
import PublishItemHead from '@/components/Publish/PublishItemHead';

export default {
  inheritAttrs: false,
  name: 'PublishDetailHead',
  props: { data: Object },
  computed: {
    odds() {
      return this.data.ensureOdds || this.data.guaranteeOdds || 0;
    },
    publishTime() {
      if (!this.data.planCreateDate) {
        return this.$t('share.notPublish');
      }
      const pdt = `${this.data.planCreateDate}`.replace(/-/g, '/');
      const [dtNow, dtPub] = [new Date(), new Date(pdt)];
      const delYear = dtNow.getFullYear() - dtPub.getFullYear();
      const delMonth = delYear * 12 + dtNow.getMonth() - dtPub.getMonth();
      const delTime = (dtNow.getTime() - dtPub.getTime()) / 1000;
      let str = this.$t('share.resent');
      str = delTime < 60 ? str : `${parseInt(delTime / 60, 10)}${this.$t('share.minute')}`;
      str = delTime < 3600 ? str : `${parseInt(delTime / 3600, 10)}${this.$t('share.hour')}`;
      str = delTime < 86400 ? str : `${parseInt(delTime / 86400, 10)}${this.$t('share.day')}`;
      str = delMonth < 1 ? str : `${delMonth}${this.$t('share.month')}`;
      str = delYear < 1 ? str : `${delYear}${this.$t('share.year')}`;
      return `${str}${this.$t('share.frmPublish')}`;
    },
  },
  components: { PublishItemHead },
  methods: {
    ...mapMutations('app', ['setPageAziFlag']),
    focusFun(v) {
      this.$emit('change', v);
    },
    clickFun() {
      const e = window.event ? window.event : null;
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      if (/(publish|shine)-user/i.test(cName)) {
        this.setPageAziFlag(1);
        this.$router.push(`/member/specialist/${this.data.userId}/0`);
      }
    },
  },
};
</script>

<style lang="less">
.nb-publish-detail-head {
  width: 100%;
  background: #ffffff;
  .detail-head-tp { padding: 0 .1rem .05rem .1rem; box-shadow: 0 .1rem .2rem 0 rgba(0,0,0,.01); border-bottom: .01rem solid #ecebeb; }
  .detail-head-btm { width: 100%; padding: .18rem .2rem .13rem .2rem; }
  .detail-head-btm-title { width: 100%; p { text-align: left; display: inline-block; font-size: .2rem; font-weight: 500; color: #2e2f34; } }
  .detail-head-btm-body { width: 100%; margin-top: .08rem; font-size: .14rem; letter-spacing: .01rem; color: #999999; }
  .detail-head-btm-foot { width: 100%; height: .2rem; margin-top: .1rem; }
  .detail-head-btm-foot-txt { height: .2rem; font-size: .12rem; color: #bababa; }
  .detail-head-btm-foot-odd { width: auto; height: .2rem; padding: 0 .08rem; border-radius: .1rem; border: .01rem solid #ff5353; background: rgba(255,83,83,.1); }
  .btm-foot-odd-txt { height: .18rem; line-height: .18rem; padding-right: .01rem; font-size: .12rem; color: #ff5353; }
  .btm-foot-odd-num { height: .18rem; line-height: .18rem; font-size: .14rem; font-family: DIN; color: #ff5353; }
}
.blue .nb-publish-detail-head {
  width: 100%;
  background: #28272d;
  .detail-head-tp { box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1); background: linear-gradient(to bottom, #3a393f, #333238); border-bottom: .01rem solid #2e2f34; }
  .detail-head-btm { box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1); background: linear-gradient(to bottom, #3a393f, #333238); }
  .detail-head-btm-title p { color: #ecebeb; }
  .detail-head-btm-body { color: #999999; }
  .detail-head-btm-foot-txt { color: #bababa; }
  .detail-head-btm-foot-odd { border: .01rem solid #ff5353; background: rgba(255,83,83,.1); }
  .btm-foot-odd-txt { color: #ff5353; }
  .btm-foot-odd-num { color: #ff5353; }
}
</style>
