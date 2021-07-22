<template>
  <div class="nb-publish-new-body">
    <div class="publish-new-body-title flex-start">{{$t('share.pubBodyTitle')}}</div>
    <div class="publish-new-title-input">
      <textarea v-model="data.title" :placeholder="$t('share.pubPlaceTitle')" maxlength="20" />
    </div>
    <div class="publish-new-body-title flex-start">{{$t('share.pubBodyDetail')}}</div>
    <div class="publish-new-detail-input">
      <textarea v-model="data.remark" :placeholder="$t('share.pubPlaceDetail')" maxlength="30" />
    </div>
    <v-touch class="publish-new-body-select" @tap="showAmtFun" >
      <div class="publish-new-body-select-box flex-between">
        <div class="publish-new-body-select-title">{{$t('share.minFlwAmt')}}</div>
        <div class="publish-new-body-select-right flex-end">
          <span class="publish-new-right-num" v-if="/^[\d.]+$/.test(amtObj.default)">{{amtObj.default}}</span>
          <span class="publish-new-right-txt" v-else>{{amtObj.default}}</span>
          <icon-arrow size="0.13rem" direction="right" />
        </div>
      </div>
    </v-touch>
    <v-touch class="publish-new-body-select" @tap="showOddsFun" >
      <div class="publish-new-body-select-box flex-between">
        <div class="publish-new-body-select-title">{{$t('share.minFlwAmt')}}</div>
        <div class="publish-new-body-select-right flex-end">
          <span class="publish-new-right-num" v-if="/^[\d.]+$/.test(oddsObj.default)">{{oddsObj.default}}</span>
          <span class="publish-new-right-txt" v-else>{{oddsObj.default}}</span>
          <icon-arrow size="0.13rem" direction="right" />
        </div>
      </div>
    </v-touch>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  inheritAttrs: false,
  name: 'PublishNewBody',
  data() {
    return {
      amtObj: { hide: true, default: '500', data: ['50', '100', '200', '500', '1000', '2000', '5000'] },
      oddsObj: { hide: true, default: '', data: [] },
    };
  },
  props: { data: Object, odds: String },
  computed: {
    ...mapState('query', ['pickSelect']),
  },
  watch: {
    pickSelect(v) {
      const dt = JSON.parse(JSON.stringify(this.data));
      if (v && v.default && `${v.title}` === `${this.amtObj.title}`) {
        dt.minBetAmount = +(v.default || 0);
        this.amtObj.default = v.default || '';
        this.$emit('change', dt);
      } else if (v && v.default && `${v.title}` === `${this.oddsObj.title}`) {
        dt.guaranteeOdds = +(/^[\d.]+$/.test(v.default) ? v.default : 0);
        this.oddsObj.default = v.default || '';
        this.$emit('change', dt);
      }
    },
    odds() {
      this.initBodyFun();
    },
  },
  methods: {
    ...mapMutations('query', ['setPickerData']),
    getOddsList() {
      const oStr = `${this.odds}`.replace('x', '.');
      let [odds, oddStr] = [+(oStr || '0') + 1, ''];
      const dt = [this.$t('share.noFlwOdds')];
      for (let i = 0; i < 10; i += 1) {
        const rate = i > 0 ? 0.98 : 0.97;
        odds *= i > 1 ? 0.99 : rate;
        oddStr = this.numFmt(odds, true);
        odds = +(oddStr || '0');
        if (odds < 1.01) break;
        dt.push(oddStr);
      }
      return dt;
    },
    showAmtFun() {
      const dt = this.amtObj;
      dt.hide = false;
      this.setPickerData(JSON.parse(JSON.stringify(dt)));
    },
    showOddsFun() {
      const dt = this.oddsObj;
      dt.hide = false;
      this.setPickerData(JSON.parse(JSON.stringify(dt)));
    },
    initBodyFun() {
      this.amtObj.title = this.$t('share.minFlwAmt');
      this.oddsObj.title = this.$t('share.minFlwOdds');
      this.oddsObj.data = this.getOddsList();
      this.oddsObj.default = this.oddsObj.data[0];
    },
  },
  mounted() {
    this.initBodyFun();
  },
};
</script>

<style lang="less">
.nb-publish-new-body {
  width: 100%;
  height: 3.54rem;
  margin-top: .11rem;
  padding-top: .01rem;
  box-shadow: 0 .1rem .2rem 0 rgba(0,0,0,.03);
  background: #ffffff;
  .publish-new-body-title { width: 100%; height: .2rem; padding: 0 .12rem; margin-top: .09rem; font-size: .14rem; font-weight: 600; color: #2e2f34; }
  .publish-new-title-input { width: 3.55rem; height: .6rem; margin: .04rem auto .1rem; }
  .publish-new-detail-input { width: 3.55rem; height: 1.06rem; margin: .04rem auto 0; }
  textarea { width: 100%; height: 100%; padding: .12rem .12rem; font-size: .12rem; font-weight: 600; overflow: hidden; resize: none; border-radius: .02rem; border: .01rem solid #dadada; color: #2e2f34; }
  textarea::-webkit-input-placeholder { color: #cccccc; }
  .publish-new-body-select { width: 100%; height: .6rem; padding: 0 .12rem; span { height: .6rem; line-height: .6rem; } svg path { fill: #909090; } }
  .publish-new-body-select-box { width: 100%; height: 100%; border-bottom: .01rem solid #ebebeb; }
  .publish-new-body-select:last-child .publish-new-body-select-box { border: none; }
  .publish-new-body-select-title { font-size: .14rem; color: #505050; }
  .publish-new-right-num { font-size: .18rem; font-weight: 500; color: #505050; }
  .publish-new-right-txt { font-size: .15rem; font-weight: 500; color: #505050; }
}
.blue .nb-publish-new-body {
  box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1);
  background: linear-gradient(to bottom, #3a393f, #333238);
  .publish-new-body-title { color: #ecebeb; }
  textarea { border: .01rem solid #2b2b2b; background: linear-gradient(to bottom, #323137, #302f35); color: #cccccc; }
  textarea::-webkit-input-placeholder { color: #666666; }
  .publish-new-body-select svg path { fill: #909090; }
  .publish-new-body-select-box { border-bottom: .01rem solid #2e2f34; }
  .publish-new-body-select-title { color: #909090; }
  .publish-new-right-num { color: #ecebeb; }
  .publish-new-right-txt { color: #ecebeb; }
}
</style>
