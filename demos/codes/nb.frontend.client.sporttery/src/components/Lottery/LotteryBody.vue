<template>
  <div class="nb-lottery-body" >
    <cimg class="nb-lottery-background" :src="backUrl" />
    <div class="nb-lottery-txt-box-tp flex-center" v-if="!open" >
      <span class="nb-lottery-text">{{$t('share.pkgTpStr')}}</span>
    </div>
    <div class="nb-lottery-txt-box-btm">
      <span class="nb-lottery-text flex-start">1. 888{{cardText}}</span>
      <span class="nb-lottery-text flex-start">2. 688{{cardText}}</span>
      <span class="nb-lottery-text flex-start">3. 188{{cardText}}</span>
      <span class="nb-lottery-text flex-start">4. 88{{cardText}}</span>
      <span class="nb-lottery-text flex-start">5. 18{{cardText}}</span>
      <span class="nb-lottery-text flex-start">6. 8{{cardText}}</span>
    </div>
    <div class="nb-lottery-pkg-box">
      <div :class="className(v - 1)" v-for="(v, k) in list" :key="k" >
        <v-touch class="nb-lottery-cover" @tap="getTaskPackage(v)"></v-touch>
        <cimg class="nb-lottery-front" :src="closeUrl" v-if="!open" />
        <cimg class="nb-lottery-front" :src="openUrl" v-else-if="/^1$/.test(open)" />
        <cimg class="nb-lottery-front" :src="selectUrl(v - 1)" v-else-if="/^2$/.test(open)" />
        <div class="nb-lottery-open-text flex-center" v-if="/^1$/.test(open)">{{cardTitle}}</div>
        <div class="nb-lottery-select-text flex-center" v-if="/^2$/.test(open)">{{cardTitle}}</div>
        <div class="nb-lottery-amt-box flex-center-bottom" v-if="/^2$/.test(open)">
          <span class="nb-lottery-amt flex-end-col">{{data.amountList[v - 1]}}</span>
          <span class="nb-lottery-txt flex-end-col">{{$t('share.rmb')}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { getTaskReward } from '@/api/activity';

export default {
  inheritAttrs: false,
  name: 'LotteryBody',
  data() {
    return {
      open: 0,
      index: 0,
      list: [1, 2, 3, 4, 5, 6],
      data: { amountList: [0, 0, 0, 0, 0, 0] },
    };
  },
  props: { recordId: String, type: Number },
  computed: {
    ...mapState('app', ['userinfo']),
    userValid() {
      return !!(this.userinfo && this.userinfo.token && this.userinfo.nbUser);
    },
    cardTitle() {
      return /^(4|11)$/.test(this.type) ? this.$t('share.guarantCard') : this.$t('share.amountCard');
    },
    cardText() {
      return /^(4|11)$/.test(this.type) ? this.$t('share.rmbComp') : this.$t('share.rmbCard');
    },
    backUrl() {
      return './img/package/background.jpg';
    },
    closeUrl() {
      return './img/package/close.png';
    },
    openUrl() {
      return './img/package/opening.png';
    },
  },
  methods: {
    ...mapMutations(['setTaskReward']),
    className(id) {
      return `nb-lottery-pkg${this.index === id ? ' select' : ''} flex-end-col`;
    },
    selectUrl(id) {
      return `./img/package/${this.index === id ? 'selected' : 'unselect'}.png`;
    },
    radomPakageNum(data, id, len) {
      const dt = JSON.parse(JSON.stringify(data));
      if (dt && dt.amountList && dt.amountList.length === len) {
        const [amt, arr] = [dt.amountList[id], []];
        const list = [888, 8, 188, 88, 18, 688].filter(v => v !== amt);
        for (let i = 0; i < len; i += 1) {
          if (i === id) {
            arr.push(amt);
          } else {
            const rNum = parseInt(list.length * Math.random(), 10);
            arr.push(list[rNum]);
            list.splice(rNum, 1);
          }
        }
        dt.amountList = arr;
      }
      return dt;
    },
    async getTaskPackage(id) {
      if (this.userValid && this.recordId && !this.open) {
        this.setTaskReward();
        const params = { userId: this.userinfo.nbUser, ActivityRecordId: this.recordId, activityRecordId: this.recordId };
        [params.count, params.index] = [6, id || 1];
        params.index = params.index < 1 ? 1 : params.index;
        params.index = params.index > params.count ? params.count : params.index;
        try {
          const bdt = await getTaskReward(params);
          if (bdt && bdt.amountList && bdt.amountList.length === params.count) {
            const dt = this.radomPakageNum(bdt, params.index - 1, params.count);
            [this.data, this.index] = [dt, params.index - 1];
            setTimeout(() => { this.open = 1; }, 350);
            setTimeout(() => { this.open = 2; }, 550);
            setTimeout(() => {
              const obj = Object.assign({ type: this.type }, dt || { });
              this.setTaskReward(obj);
              this.$router.go(-1);
            }, 2000);
          }
        } catch (e) {
          if (e && e.msg) {
            this.$toast(e.msg);
          }
        }
      }
    },
  },
  mounted() {
    [this.open, this.index, this.data] = [0, 0, { amountList: [0, 0, 0, 0, 0, 0] }];
  },
};
</script>

<style lang="less">
.nb-lottery-body {
  position: relative;
  width: 100%;
  height: 7.38rem;
  z-index: 10;
  .nb-lottery-background { position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 11; }
  .nb-lottery-txt-box-tp { position: absolute; width: 100%; height: .18rem; top: 3.5rem; left: 0; z-index: 12; }
  .nb-lottery-txt-box-btm { position: absolute; width: 100%; height: .54rem; top: 6.64rem; left: 0; padding: 0 .15rem 0 .35rem; z-index: 13; display: grid; grid-template-rows: repeat(2, 1fr); grid-template-columns: repeat(3, 1fr); }
  .nb-lottery-pkg-box { position: absolute; width: 100%; height: 2.4rem; top: 3.65rem; left: 0; padding: 0 .25rem; z-index: 14; display: grid; grid-template-rows: repeat(2, 1fr); grid-template-columns: repeat(3, 1fr); }
  .nb-lottery-text { font-size: .13rem; color: #b64900; font-weight: 500; }
  .nb-lottery-pkg { position: relative; width: 100%; height: 100%; z-index: 20; img { width: 100%; height: 1.2rem; } }
  .nb-lottery-cover { position: absolute; width: 90%; height: 1.06rem; left: 5%; bottom: .08rem; z-index: 21; }
  .nb-lottery-open-text, .nb-lottery-select-text { position: absolute; width: 90%; font-size: .1rem; font-weight: 500; }
  .nb-lottery-open-text { height: .16rem; left: 5%; bottom: .87rem; z-index: 22; color: #a85211; }
  .nb-lottery-select-text { height: .16rem; left: 5%; bottom: 1.18rem; z-index: 23; color: rgba(168,82,17,.5); }
  .nb-lottery-pkg.select .nb-lottery-select-text { color: #a85211; }
  .nb-lottery-amt-box { position: absolute; width: 90%; height: .3rem; left: 5%; bottom: .88rem; z-index: 24; }
  .nb-lottery-amt { height: 100%; line-height: .3rem; font-size: .35rem; color: rgba(168,82,17,.5); }
  .nb-lottery-pkg.select .nb-lottery-amt { color: #a85211; }
  .nb-lottery-txt { height: 100%; font-size: .12rem; color: rgba(193,105,37,.5); }
  .nb-lottery-pkg.select .nb-lottery-txt { color: #c16925; }
}
</style>
