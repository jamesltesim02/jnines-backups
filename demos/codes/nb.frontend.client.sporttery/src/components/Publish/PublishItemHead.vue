<template>
<div class="nb-publish-item-head">
  <div class="publish-item-head-tp">
    <div class="publish-item-tp-box">
      <div class="publish-item-head-left flex-start">
        <div class="publish-item-img publish-user flex-center" >
          <icon-head class="publish-user" :src="data.header" />
        </div>
        <div class="publish-item-name-box flex-center-col">
          <div class="publish-item-name-tp flex-start">
            <span class="publish-item-name publish-user">{{userName}}</span>
            <span :class="getTagClass(v)" v-for="(v, k) in tagList" :key="k">{{getTagStr(v)}}</span>
            <span class="publish-item-red flex-center" v-if="data.longRedCount">{{data.longRedCount}}{{$t('share.longRed')}}</span>
          </div>
          <div class="publish-item-name-btm flex-start"><slot name="time" /></div>
        </div>
      </div>
      <div class="publish-item-head-right flex-end" v-if="isAnBtn" >
        <v-touch :class="btnClass" @tap="focusFun" >
          <span class="focus-btn" v-if="data.isFocus || data.focus">{{$t('share.focused')}}</span>
          <span class="focus-btn btn-add" v-if="!(data.isFocus || data.focus)">+</span>
          <span class="focus-btn" v-if="!(data.isFocus || data.focus)">{{$t('share.focus')}}</span>
        </v-touch>
      </div>
      <div class="publish-item-head-right" v-else >
        <div class="publish-item-rate-tp flex-end">
          <div class="publish-item-text-box flex-center-col">
            <span class="publish-rate-tp flex-center"></span>
            <span class="publish-rate-btm flex-center"><slot name="left" /></span>
          </div>
          <div class="publish-item-rate-ctr flex-center"><slot /></div>
          <div class="publish-item-rate-box flex-center-col">
            <span class="publish-rate-tp flex-center"></span>
            <span class="publish-rate-btm flex-center"><slot name="right" /></span>
          </div>
        </div>
        <div class="publish-item-rate-btm flex-end" :style="btmStyle"><slot name="bottom" /></div>
      </div>
    </div>
  </div>
  <div class="publish-item-head-btm flex-start" v-if="showTitle">
    {{data.planTitle || data.shareTitle || data.planRemarks || data.shareRemark || ''}}
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';
import { fansFocus, cancelFocus } from '@/api/activity';
import IconHead from '@/components/XSports/Xmember/icons/IconHead';

export default {
  inheritAttrs: false,
  name: 'PublishItemHead',
  data() {
    return { btmStyle: { }, focusTime: 0 };
  },
  props: { data: Object, showTitle: Boolean, isButton: Boolean },
  computed: {
    ...mapState('app', ['userinfo']),
    isAnBtn() {
      const rst = this.userinfo && this.userinfo.nbUser && this.data.userId;
      return !!(rst && this.isButton && `${this.data.userId}` !== `${this.userinfo.nbUser}`);
    },
    userName() {
      return this.data.nickName || `${this.data.userId}`.slice(0, 8) || '';
    },
    btnClass() {
      return `nb-publish-item-btn focus-btn${this.data.isFocus || this.data.focus ? '' : ' active'} flex-center`;
    },
    tagList() {
      return this.data.tags ? `${this.data.tags}`.split('#') : [];
    },
  },
  components: { IconHead },
  methods: {
    getTagClass(v) {
      let clsStr = /^1/.test(v) ? 'tags' : 'tags';
      clsStr = /^0/.test(v) ? 'red' : clsStr;
      return `publish-item-${clsStr} flex-center`;
    },
    getTagStr(v) {
      return /^\d/.test(v) ? `${v}`.slice(1) : `${v}`;
    },
    async focusFun() {
      if (Date.now() - this.focusTime < 1000) return;
      this.focusTime = Date.now();
      if (this.userinfo && this.userinfo.token && this.userinfo.nbUser) {
        if (this.data.isFocus || this.data.focus) {
          try {
            await cancelFocus({ memberUserId: this.data.userId, myUserId: this.userinfo.nbUser });
            const dt = JSON.parse(JSON.stringify(this.data));
            [dt.isFocus, dt.focus] = [false, false];
            setTimeout(() => { this.$emit('focus', dt); }, 200);
          } catch (ev) {
            console.log(ev);
          }
        } else {
          try {
            await fansFocus({ memberUserId: this.data.userId, myUserId: this.userinfo.nbUser });
            const dt = JSON.parse(JSON.stringify(this.data));
            [dt.isFocus, dt.focus] = [true, true];
            setTimeout(() => { this.$emit('focus', dt); }, 200);
          } catch (ev) {
            console.log(ev);
          }
        }
      } else {
        this.$toast(this.$t('share.noLogin'));
      }
    },
  },
  mounted() {
    const bottomEle = this.$el.querySelector('.publish-item-rate-btm span');
    const middleEle = this.$el.querySelector('.publish-item-rate-ctr');
    const rightEle = this.$el.querySelector('.publish-item-rate-box');
    if (bottomEle && middleEle && rightEle) {
      const bottomWidth = parseFloat(window.getComputedStyle(bottomEle).width);
      const middleWidth = parseFloat(window.getComputedStyle(middleEle).width);
      const rightWidth = parseFloat(window.getComputedStyle(rightEle).width);
      const marginLeft = parseFloat(window.getComputedStyle(rightEle).marginLeft);
      const delWidth = rightWidth + marginLeft + (middleWidth - bottomWidth) / 2;
      this.btmStyle = delWidth > 0 ? { paddingRight: `${delWidth}px` } : { };
    }
  },
};
</script>

<style lang="less">
.nb-publish-item-head {
  width: 100%;
  .publish-item-head-tp { width: 100%; height: .6rem; padding: .15rem .1rem .05rem .1rem; }
  .publish-item-tp-box { position: relative; width: 100%; height: 100%; z-index: 1; }
  .publish-item-head-left { position: absolute; width: 100%; height: 100%; left: 0; top: 0; z-index: 2; }
  .publish-item-head-right { position: absolute; width: 60%; height: 100%; right: 0; top: 0; z-index: 3; }
  .publish-item-img { width: .4rem; height: .4rem; margin-right: .08rem; border: none; border-radius: 100%; overflow: hidden; }
  .publish-item-img img { width: 100%; height: 100%; }
  .publish-item-name-box { flex-grow: 1; height: 100%; }
  .publish-item-name-tp { width: 100%; height: .21rem; margin-bottom: .03rem; }
  .publish-item-name { margin-right: .06rem; font-size: .16rem; font-weight: 500; color: #2e2f34; }
  .publish-item-tags, .publish-item-red { height: .16rem; padding: 0 .06rem; border-top-right-radius: .08rem; border-bottom-left-radius: .08rem; border-bottom-right-radius: .08rem; }
  .publish-item-tags { margin-right: .06rem; font-size: .1rem; color: #6eb4ff; border: .01rem solid #6eb4ff; background: rgba(110,180,255,.1); }
  .publish-item-red { margin-right: .06rem; font-size: .1rem; color: #ff5353; border: .01rem solid #ff5353; background: rgba(255,83,83,.1); }
  .publish-item-name-btm { width: 100%; height: .16rem; font-size: .12rem; color: #bababa; span { color: #ff5353; } span.num { font-size: .14rem; padding: 0 .02rem; } }
  .publish-item-rate-tp { width: 100%; height: .24rem; margin-bottom: .02rem; }
  .publish-item-rate-btm { width: 100%; height: .14rem; font-size: .1rem; font-weight: 500; color: #ff1d1d; }
  .publish-item-text-box, .publish-item-rate-box { width: auto; height: 100%; margin-left: .02rem; }
  .publish-rate-tp, .publish-rate-btm { font-size: .1rem; color: #ff5353; }
  .publish-rate-tp { height: .12rem; }.publish-rate-btm { height: .12rem; }
  .publish-item-rate-ctr { width: auto; height: 100%; margin-left: .02rem; font-size: .32rem; font-family: AlternateGothicNo2BT; letter-spacing: -.005rem; color: #ff5353; }
  .publish-item-head-btm { width: 100%; height: .2rem; margin-top: .03rem; padding: 0 .1rem; font-size: .14rem; color: #505050; }
  .nb-publish-item-btn { width: .56rem; height: .24rem; border-radius: .22rem; margin-left: .08rem; font-size: .12rem; color: #ffffff; background: #ccc; }
  .nb-publish-item-btn.active { color: #ffffff; background: #ff5353; }
  .nb-publish-item-btn .btn-add { margin-right: .05rem; font-size: .16rem; padding-bottom: .03rem; }
}
.blue .nb-publish-item-head {
  .publish-item-name { color: #ecebeb; }
  .publish-item-tags { color: #53fffd; border: .01rem solid #53fffd; background: rgba(83,255,253,.1); }
  .publish-item-red { color: #ff5353; border: .01rem solid #ff5353; background: rgba(255,83,83,.1); }
  .publish-item-name-btm { color: #666666; span { color: #ff5353; } }
  .publish-item-rate-btm { color: #909090; }
  .publish-item-head-btm { color: #bababa; }
  .nb-publish-item-btn { color: #777777; background: #434249; }
  .nb-publish-item-btn.active { color: #53fffd; background: #434249; }
}
</style>
