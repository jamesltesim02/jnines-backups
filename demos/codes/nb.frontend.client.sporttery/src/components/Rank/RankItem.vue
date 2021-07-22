<template>
  <v-touch class="nb-rank-item flex-between" @tap="clickFun" >
    <div class="nb-rank-item-back flex-start" >
      <div class="nb-rank-item-index flex-center" v-if="!hide" >
        <rank-one v-if="/^0$/.test(num)" />
        <rank-two v-else-if="/^1$/.test(num)" />
        <rank-three v-else-if="/^2$/.test(num)" />
        <span v-else>{{num + 1}}</span>
      </div>
      <div class="nb-rank-item-img publish-user flex-center" >
        <icon-head class="publish-user" :src="data.header" />
      </div>
      <div class="nb-rank-item-name-box flex-center-col" >
        <div class="nb-rank-item-name publish-user flex-start">{{userName}}</div>
        <div class="nb-rank-item-detail flex-start">
          <span class="nb-rank-item-text">{{$t('share.plan')}}</span>
          <span class="nb-rank-item-num">{{data.planCount || 0}}</span>
        </div>
      </div>
    </div>
    <div class="nb-rank-item-front flex-end" >
      <div class="nb-rank-item-type-box flex-end" v-if="hide || /^0$/.test(idx)" >
        <div class="nb-rank-item-type-first flex-center-col">
          <span class="flex-end">{{$t('share.lastDay')}}</span>
          <span class="flex-end">{{$t('share.rtnRate')}}</span>
        </div>
        <div class="nb-rank-item-type-middle flex-center">{{100 * (data.returnRate || 0) | NumFmt}}</div>
        <div class="nb-rank-item-type-end flex-center-col">
          <span class="flex-end"></span>
          <span class="flex-end">%</span>
        </div>
      </div>
      <div class="nb-rank-item-type-box flex-end" v-if="/^1$/.test(idx)" >
        <div class="nb-rank-item-type-middle flex-center">{{data.longRedCount || 0}}</div>
        <div class="nb-rank-item-type-end flex-center-col">
          <span class="flex-end"></span>
          <span class="flex-end">{{$t('share.longRed')}}</span>
        </div>
      </div>
      <div class="nb-rank-item-type-box flex-end" v-if="/^2$/.test(idx)" >
        <div class="nb-rank-item-type-first flex-center-col">
          <span class="flex-end">{{$t('share.lastDay')}}</span>
          <span class="flex-end">{{$t('share.hitRate')}}</span>
        </div>
        <div class="nb-rank-item-type-middle flex-center">{{100 * (data.hitRate || 0) | NumFmt}}</div>
        <div class="nb-rank-item-type-end flex-center-col">
          <span class="flex-end"></span>
          <span class="flex-end">%</span>
        </div>
      </div>
      <div class="nb-rank-item-type-box flex-end" v-if="/^3$/.test(idx)" >
        <div class="nb-rank-item-type-first flex-center-col">
          <span class="flex-end">{{$t('share.guess')}}</span>
          <span class="flex-end">{{$t('share.totalBet')}}</span>
        </div>
        <div class="nb-rank-item-type-middle flex-center">{{(data.totalBet || 0) / 1000 | NumFmt(true)}}</div>
        <div class="nb-rank-item-type-end flex-center-col">
          <span class="flex-end"></span>
          <span class="flex-end">K</span>
        </div>
      </div>
      <div class="nb-rank-item-type-box flex-end" v-if="/^4$/.test(idx)" >
        <div class="nb-rank-item-type-first flex-center-col">
          <span class="flex-end">{{$t('share.guess')}}</span>
          <span class="flex-end">{{$t('share.commission')}}</span>
        </div>
        <div class="nb-rank-item-type-middle flex-center">{{(data.commission || 0) / 1000 | NumFmt(true)}}</div>
        <div class="nb-rank-item-type-end flex-center-col">
          <span class="flex-end"></span>
          <span class="flex-end">K</span>
        </div>
      </div>
      <div :class="btnClass">
        <span class="focus-btn" v-if="data.isFocus || data.focus">{{$t('share.focused')}}</span>
        <span class="focus-btn btn-add" v-if="!(data.isFocus || data.focus)">+</span>
        <span class="focus-btn" v-if="!(data.isFocus || data.focus)">{{$t('share.focus')}}</span>
      </div>
    </div>
  </v-touch>
</template>

<script>
import { mapState } from 'vuex';
import { fansFocus, cancelFocus } from '@/api/activity';
import RankOne from '@/components/Rank/RankOne';
import RankTwo from '@/components/Rank/RankTwo';
import RankThree from '@/components/Rank/RankThree';
import IconHead from '@/components/XSports/Xmember/icons/IconHead';

export default {
  inheritAttrs: false,
  name: 'RankItem',
  data() {
    return { focusTime: 0 };
  },
  props: {
    id: Number,
    num: Number,
    data: Object,
    hide: Boolean,
  },
  computed: {
    ...mapState('app', ['userinfo']),
    idx() {
      let indx = /^-?\d+$/.test(this.id) ? +this.id : 0;
      indx = indx < 0 ? 0 : indx;
      return indx > 4 ? 4 : indx;
    },
    userName() {
      return this.data.nickName || `${this.data.userId}`.slice(0, 8) || '';
    },
    btnClass() {
      return `nb-rank-item-btn focus-btn${this.data.isFocus || this.data.focus ? '' : ' active'} flex-center`;
    },
  },
  components: {
    RankOne,
    RankTwo,
    RankThree,
    IconHead,
  },
  methods: {

    async clickFun() {
      const e = window.event ? window.event : null;
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      if (/focus-btn/i.test(cName)) {
        if (Date.now() - this.focusTime < 1000) return;
        this.focusTime = Date.now();
        if (this.userinfo && this.userinfo.token && this.userinfo.nbUser) {
          if (this.data.isFocus || this.data.focus) {
            try {
              await cancelFocus({ memberUserId: this.data.userId, myUserId: this.userinfo.nbUser });
              const dt = JSON.parse(JSON.stringify(this.data));
              [dt.isFocus, dt.focus] = [false, false];
              setTimeout(() => { this.$emit('change', dt); }, 200);
            } catch (ev) {
              console.log(ev);
            }
          } else {
            try {
              await fansFocus({ memberUserId: this.data.userId, myUserId: this.userinfo.nbUser });
              const dt = JSON.parse(JSON.stringify(this.data));
              [dt.isFocus, dt.focus] = [true, true];
              setTimeout(() => { this.$emit('change', dt); }, 200);
            } catch (ev) {
              console.log(ev);
            }
          }
        } else {
          this.$toast(this.$t('share.noLogin'));
        }
      } else {
        this.$router.push(`/member/specialist/${this.data.userId}/0`);
      }
    },
  },
};
</script>

<style lang="less">
.nb-rank-item {
  position: relative;
  width: 100%;
  height: .6rem;
  margin-top: .07rem;
  border-radius: .06rem;
  box-shadow: 0 .1rem .2rem 0 rgba(223,222,223,.5);
  border: .01rem solid #ecebeb;
  background: linear-gradient(to top, #f9f9f9, #ffffff);
  overflow: hidden;
  z-index: 1;
  .nb-rank-item-back { position: absolute; width: 100%; height: 100%; left: 0; top: 0; z-index: 2; }
  .nb-rank-item-front { position: absolute; width: 100%; height: 100%; right: 0; top: 0; padding-right: .1rem; z-index: 3; }
  .nb-rank-item-index { width: .2rem; height: 100%; margin-left: .1rem; font-size: .18rem; color: #bababa; }
  .nb-rank-item-img { width: .4rem; height: .4rem; margin: 0 .06rem; border: none; border-radius: 100%; overflow: hidden; }
  .nb-rank-item-img img { width: 100%; height: 100%; }
  .nb-rank-item-name-box { flex-grow: 1; height: 100%; padding: .08rem 0; }
  .nb-rank-item-name { width: 100%; height: 60%; font-size: .14rem; color: #2e2f34; }
  .nb-rank-item-detail { width: 100%; height: 40%; }
  .nb-rank-item-text { font-size: .12rem; padding-right: .04rem; color: #999999; }
  .nb-rank-item-num { font-size: .14rem; font-weight: bold; color: #ff5353; }
  .nb-rank-item-btn { width: .56rem; height: .24rem; border-radius: .22rem; margin-left: .08rem; font-size: .12rem; color: #ffffff; background: #ccc; }
  .nb-rank-item-btn.active { color: #ffffff; background: #ff5353; }
  .nb-rank-item-btn .btn-add { margin-right: .05rem; font-size: .16rem; padding-bottom: .03rem; }
  .nb-rank-item-type-box { flex-flow: 1; height: 100%; }
  .nb-rank-item-type-first { flex-flow: 1; height: 100%; font-size: .11rem; color: #bababa; span { width: 100%; height: .13rem; } }
  .nb-rank-item-type-middle { width: auto; height: 100%; margin-left: .03rem; font-size: .32rem; font-family: AlternateGothicNo2BT; letter-spacing: -.005rem; color: #ff5353; }
  .nb-rank-item-type-end { width: auto; height: 100%; margin-left: .01rem; font-size: .1rem; color: #ff5353; span { height: .13rem; } }
}
.blue .nb-rank-item {
  box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1);
  border: .01rem solid #2e2f34;
  background: linear-gradient(to bottom, #3a393f, #333238);
  .nb-rank-item-index { color: #666666; }
  .nb-rank-item-name { color: #ecebeb; }
  .nb-rank-item-text { color: #777777; }
  .nb-rank-item-num { color: #53fffd; }
  .nb-rank-item-btn { color: #777777; background: #434249; }
  .nb-rank-item-btn.active { color: #53fffd; background: #434249; }
  .nb-rank-item-type-first { color: #777777; }
  .nb-rank-item-type-middle { color: #ff5353; }
  .nb-rank-item-type-end { color: #ff5353; }
}
</style>
