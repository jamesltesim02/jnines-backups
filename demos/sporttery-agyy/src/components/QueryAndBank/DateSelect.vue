<template>
  <div class="date-select flex-around">
    <v-touch tag="div" class="select-from flex-center" @tap="showFrom">
      <span class="sel-text" v-if="fDef">{{fDef}}</span>
      <span class="sel-def" v-else>{{data.from}}</span>
    </v-touch>
    <span class="select-mid flex-center">{{$t('pageQuery.joinDate')}}</span>
    <v-touch tag="div" class="select-to flex-center" @tap="showTo">
      <span class="sel-text" v-if="tDef">{{tDef}}</span>
      <span class="sel-def" v-else>{{data.to}}</span>
    </v-touch>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { getDateData } from '@/utils/queryUtils';

export default {
  inheritAttrs: false,
  name: 'DateSelect',
  data() {
    return {
      id: 0,
      fHide: true,
      fFrom: this.getDate(null, -10, 0, 0),
      fTo: this.getDate(null, 0, 0, 0),
      fDef: getDateData(0),
      tHide: true,
      tFrom: this.getDate(null, -10, 0, 0),
      tTo: this.getDate(null, 0, 0, 0),
      tDef: getDateData(1),
    };
  },
  props: {
    data: Object,
  },
  computed: {
    ...mapState('query', { pickSelect: state => state.pickSelect }),
    min() {
      const nMin = this.data.min;
      let result = [null, -10, 0, 0];
      if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(nMin)) {
        result = [nMin, 0, 0, 0];
      } else if (/^[+-]?\d{1,3}([,;]+[+-]?\d{1,3}){2}$/.test(nMin)) {
        result = [null].concat(nMin.split(/[,;]+/));
      }
      return result;
    },
    max() {
      const nMax = this.data.max;
      let result = [null, 0, 0, 0];
      if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(nMax)) {
        result = [nMax, 0, 0, 0];
      } else if (/^[+-]?\d{1,3}([,;]+[+-]?\d{1,3}){2}$/.test(nMax)) {
        result = [null].concat(nMax.split(/[,;]+/));
      }
      return result;
    },
    fromData() {
      const obj = { hide: this.fHide, default: this.fDef, join: '/' };
      [obj.title, obj.from, obj.to] = [this.data.from, this.fFrom, this.fTo];
      return obj;
    },
    toData() {
      const obj = { hide: this.tHide, default: this.tDef, join: '/' };
      [obj.title, obj.from, obj.to] = [this.data.to, this.tFrom, this.tTo];
      return obj;
    },
  },
  watch: {
    pickSelect(v) {
      if (v && v.val && v.val.length && v.default && `${v.title}` === `${this.data.from}`) {
        this.tFrom = v.val && v.val.length ? v.val.join('/') : '';
        this.fDef = v.default || '';
      } else if (v && v.val && v.val.length && v.default && `${v.title}` === `${this.data.to}`) {
        this.fTo = v.val && v.val.length ? v.val.join('/') : '';
        this.tDef = v.default || '';
      }
      if (`${v.title}` === `${this.data.from}` || `${v.title}` === `${this.data.to}`) {
        setTimeout(() => { this.$emit('change', this.fDef, this.tDef); }, 10);
      }
    },
  },
  methods: {
    ...mapMutations('query', ['setPickerData']),
    getTStr(time) {
      const dt = time ? new Date(time) : new Date();
      return `${dt.getFullYear()}/${`0${dt.getMonth() + 1}`.slice(-2)}/${`0${dt.getDate()}`.slice(-2)}`;
    },
    getDate(time, y, m, d) {
      const [dt, sd] = [time ? new Date(time) : new Date(), d * 86400000];
      let [year, month] = [dt.getFullYear() + y, dt.getMonth() + m + 1];
      const [num, flag] = [parseInt(month / 12, 10), month < 0 ? 1 : 0];
      if (month < 0 || month > 12) {
        year += num - flag;
        month += (flag - num) * 12;
      }
      const ndt = new Date(`${year}/${month}/${dt.getDate()}`);
      return this.getTStr(ndt.getTime() + sd);
    },
    showFrom() {
      [this.id, this.fHide] = [1, false];
      setTimeout(() => {
        this.setPickerData(JSON.parse(JSON.stringify(this.fromData)));
      }, 5);
    },
    showTo() {
      [this.id, this.tHide] = [2, false];
      setTimeout(() => {
        this.setPickerData(JSON.parse(JSON.stringify(this.toData)));
      }, 5);
    },
  },
  mounted() {
    this.fFrom = this.getDate(this.min[0], +this.min[1], +this.min[2], +this.min[3]);
    this.fTo = this.getDate(this.max[0], +this.max[1], +this.max[2], +this.max[3]);
    this.tFrom = this.getDate(this.max[0], +this.max[1], +this.max[2], +this.max[3]);
    this.tTo = this.getDate(this.max[0], +this.max[1], +this.max[2], +this.max[3]);
    this.fFrom = new Date(this.fFrom) < new Date('2019/01/01') ? '2019/01/01' : this.fFrom;
    this.fDef = this.fDef && new Date(this.fDef) < new Date(this.fFrom) ? this.fFrom : this.fDef;
    this.fDef = this.fDef && new Date(this.fDef) > new Date(this.tTo) ? this.tTo : this.fDef;
    this.tDef = this.tDef && new Date(this.tDef) > new Date(this.tTo) ? this.tTo : this.tDef;
    this.tDef = this.fDef && this.tDef && new Date(this.fDef) > new Date(this.tDef) ? this.fDef : this.tDef;
    [this.fTo, this.tFrom] = [this.tDef || this.fTo, this.fDef || this.tFrom];
  },
};
</script>

<style lang="less">
.white .date-select {
  background: #fff;
  .select-from, .select-to {
    .sel-text { color: #ff5353; }
    .sel-def { color: #909090; }
  }
  .select-mid { color: rgba(46,47,52,0.7); }
}
.black .date-select {
  background: #28272d;
  .select-from, .select-to {
    .sel-text { color: #ff5353; }
    .sel-def { color: #909090; }
  }
  .select-mid { color: rgba(255,255,255,0.7); }
}
.date-select {
  width: 100%;
  height: .44rem;
  .select-from, .select-mid, .select-to { height: .42rem; font-size: .15rem; }
  .select-from, .select-to {
    width: 1.6rem;
    .sel-text, .sel-def { font-size: .15rem; font-family: PingFangSC-Regular; }
  }
  .select-mid { width: .55rem; }
}
</style>
