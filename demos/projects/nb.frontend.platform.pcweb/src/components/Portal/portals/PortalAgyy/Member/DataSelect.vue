<template>
  <div :class="inputClass" :style="inputStyle" @click.stop="showFun">
    <div class="select-title arrow-title flex-start">
      <span class="sel-text arrow-text" v-if="dtDefault">{{dtDefault}}</span>
      <span class="sel-def arrow-def" v-else>{{placeholder}}</span>
    </div>
    <div class="select-arrow flex-center">
      <svg class="arrow-svg" width="10px" height="10px" style="width:10px;height:10px" viewBox="0 0 100 100">
        <path class="arrow-path" d="M 0 14.5 L 100 14.5 L50 85.5 Z" :fill="iconFill"></path>
      </svg>
    </div>
    <transition name="select-toggle" >
      <div class="select-list flex-between" :style="listStyle" v-if="selectShow">
        <perfect-scrollbar class="select-row" v-for="(row, rid) in dtList" :key="rid">
          <div :class="getItemClass(v)" v-for="(v, k) in row" :key="k" @click.stop="selectFun(v)">{{v.text}}</div>
        </perfect-scrollbar>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  inheritAttrs: false,
  name: 'DataSelect',
  data() {
    return { selectShow: false, select: [] };
  },
  props: { data: Object, placeholder: String, join: String },
  computed: {
    ...mapState('app', { theme: state => state.theme }),
    ...mapState('agyy', ['bankInputFlag']),
    dtDefault() {
      return this.data.default;
    },
    dtJoin() {
      return this.join !== undefined ? this.join : ' ';
    },
    dtLen() {
      let len = 0;
      for (let i = 0; i < this.data.data.length; i += 1) {
        len = this.data.data[i].length > len ? this.data.data[i].length : len;
      }
      return len;
    },
    dtList() {
      const dt = [];
      for (let i = 0; i < this.data.data.length; i += 1) {
        dt.push([]);
        const rw = this.data.data[i];
        for (let j = 0; j < rw.length; j += 1) {
          let obj = rw[j];
          obj = typeof obj === 'string' ? { text: obj } : obj;
          obj.value = obj.value || obj.text || obj.id;
          obj.text = obj.text || obj.value || obj.id;
          obj.id = i;
          dt[dt.length - 1].push(obj);
        }
      }
      return dt;
    },
    inputClass() {
      return `bank-select ${this.selectShow ? 'active' : ''} flex-between`;
    },
    oddsColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (!/^white$/i.test(this.theme)) {
        return pSet && pSet.BLACK_OPTION_COLOR ? pSet.BLACK_OPTION_COLOR : '#ff5353';
      }
      return pSet && pSet.WHITE_OPTION_COLOR ? pSet.WHITE_OPTION_COLOR : '#ff5353';
    },
    inputStyle() {
      return this.selectShow ? { border: `1px solid ${this.oddsColor}` } : { };
    },
    iconFill() {
      const defColor = !/^white$/i.test(this.theme) ? '#909090' : '#EBE9E9';
      return this.selectShow ? this.oddsColor : defColor;
    },
    listStyle() {
      return this.selectShow ? { border: `1px solid ${this.oddsColor}`, borderTop: 'none' } : { };
    },
  },
  watch: {
    bankInputFlag() {
      this.hideFun();
    },
    dtDefault() {
      const defStr = this.select.join(this.dtJoin);
      if (defStr !== this.dtDefault) {
        const defArr = this.dtDefault.split(this.dtJoin);
        for (let i = 0; i < defArr.length; i += 1) {
          this.select[i] = defArr[i] || this.select[i] || '';
        }
      }
    },
  },
  methods: {
    ...mapMutations('agyy', ['setBankInputFlag']),
    getItemClass(v) {
      const [id, sel] = [v && v.id ? v.id : 0, this.select];
      const actPass = v && sel[id] && `${sel[id]}` === `${v.text}`;
      return `select-item${actPass ? ' active' : ''} flex-center`;
    },
    showFun() {
      if (!this.selectShow) {
        this.setBankInputFlag();
      }
      setTimeout(() => {
        this.selectShow = !(this.selectShow || !this.dtLen);
      }, 1);
    },
    hideFun() {
      this.selectShow = false;
    },
    selectFun(v) {
      this.select[v.id] = v.text;
      const dt = JSON.parse(JSON.stringify(this.data));
      dt.default = this.select.join(this.dtJoin);
      this.$emit('update:data', dt);
      if (v.id + 1 === this.select.length) {
        this.hideFun();
      }
    },
  },
  mounted() {
    this.select = [];
    for (let i = 0; i < this.data.data.length; i += 1) {
      this.select.push('');
    }
  },
};
</script>

<style lang="less">
.select-toggle-enter, .select-toggle-leave { transition: top 1.15s linear; }
.select-toggle-enter, .select-toggle-leave-active { top: 0; }
.bank-select { position: relative; border-radius: 4px; }
.bank-select.active { border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
.bank-select .select-title, .bank-select .select-arrow { height: 100%; font-size: 16px; font-family: PingFangSC; }
.bank-select .select-title { width: 85%; padding: 0 15px; .sel-text, .sel-def { font-family: PingFangSC; } }
.bank-select .select-title .sel-text { font-size: 14px; color: #ecebeb; }
.bank-select .select-title .sel-def { font-size: 14px; color: #909090; }
.bank-select .select-arrow { width: 15%; border-left: 1px solid #3f3f3f; }
.bank-select .select-list { position: absolute; z-index: 50; left: -1px; right: -1px; top: 49px; padding: 8px 0; background: linear-gradient(to bottom, #3c3b43, #33323b); border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; }
.bank-select .select-list { .ps__rail-y, .ps__rail-y:hover { background: transparent; .ps__thumb-y { width: 4px; background-color: transparent; } } }
.bank-select .select-row { width: 100%; max-height: 150px; overflow: hidden; }
.bank-select .select-item { width: 100%; height: 30px; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bank-select .select-item:hover { font-size: 12px; color: #ff5353; }
.bank-select .select-item.active { font-size: 16px; color: #ff5353; }
</style>
