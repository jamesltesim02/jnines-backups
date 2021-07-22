<template>
  <v-touch class="nb-picker" v-if="boxShow" :style="{ height: pHeight }" @touchmove.stop @tap="clickFun">
    <div class="cover" :style="cStyle"></div>
    <div class="box" v-bind="$attrs" :style="bStyle" >
      <div class="title">
        <div class="cancel">取消</div>
        <div class="text">{{nTitle}}</div>
        <div class="confirm">确定</div>
      </div>
      <div class="body">
        <scroll v-for="(v, i) in arr" :data.sync="arr[i]" :key="i" :i="i"
        :flg="obj.flg" @change="fun" @start="stFun" :rotate="rotate" />
      </div>
    </div>
  </v-touch>
</template>

<script>
import Scroll from './MoveScroll.vue';

export default {
  inheritAttrs: false,
  name: 'Picker',
  data() {
    return {
      pHeight: 0,
      rotate: true,
      boxShow: false,
      cStyle: {},
      bStyle: {},
      obj: { c: 0, t: 0, flg: false },
      sArr: [],
      sel: { id: [], val: [], text: [] },
      reg: [/^[12]\d{3}([/-]\d{1,2}){2}$/, /^([01]?\d|2[0-3])(:([0-5]\d)){2}$/],
      changeFun: null,
      selectFun: null,
      cancel: { t: 0, show: false },
    };
  },
  props: { data: Object },
  components: { Scroll },
  computed: {
    nTitle() {
      return this.data.title || '选择数据';
    },
    show() {
      const nShow = this.data && this.data.hide !== undefined && !this.data.hide;
      const delShow = !this.cancel.show && nShow;
      const delTa = Date.now() - this.cancel.t;
      if (!delShow || (delShow && delTa > 300)) {
        [this.cancel.t, this.cancel.show] = [Date.now(), nShow];
        return !delShow ? nShow : true;
      }
      return false;
    },
    dFrom() {
      const min = this.data.from || this.data.start || this.data.min || '_';
      return /^([a-z0-9]+[-/.,;:])*[a-z0-9]+$/i.test(min) ? `${min}`.toUpperCase() : '';
    },
    dTo() {
      const max = this.data.to || this.data.end || this.data.max || '_';
      return /^([a-z0-9]+[-/.,;:])*[a-z0-9]+$/i.test(max) ? `${max}`.toUpperCase() : '';
    },
    dtData() {
      return this.data.data || [];
    },
    arr: {
      get() {
        return this.sArr;
      },
      set(nArr) {
        this.sArr = nArr;
      },
    },
    type() {
      let result = 0;
      if (this.reg[0].test(this.dFrom) || this.reg[0].test(this.dTo)) {
        result = 1;
      } else if (this.reg[1].test(this.dFrom) || this.reg[1].test(this.dTo)) {
        result = 2;
      } else if (/^\d+(\.\d+)?$/.test(this.dFrom) || /^\d+(\.\d+)?$/.test(this.dTo)) {
        result = 3;
      } else if (/^[a-z]+$/i.test(this.dFrom) || /^[a-z]+$/i.test(this.dTo)) {
        result = 4;
      } else if (/^[a-f0-9]+(\.[a-f0-9]+)?$/i.test(this.dFrom) || /^[a-f0-9]+(\.[a-f0-9]+)?$/i.test(this.dTo)) {
        result = 5;
      } else if (/^\d+([-/.,;:]\d+)+$/.test(this.dFrom) || /^\d+([-/.,;:]\d+)+$/.test(this.dTo)) {
        result = 6;
      } else if (this.data.data && this.data.data.length && this.data.data[0].constructor !== Array) {
        result = 7;
      }
      return result;
    },
    join() {
      let joinStr = '';
      if (this.type === 1) {
        joinStr = '-';
      } else if (this.type === 2) {
        joinStr = ':';
      } else if (this.type === 6) {
        joinStr = ',';
      } else if (this.type === 7) {
        joinStr = ' ';
      }
      return this.data.join || (this.type ? joinStr : ' ');
    },
    min() {
      if (this.type === 1) {
        return this.getTime(this.dFrom, this.dFrom ? 0 : -20);
      }
      if (this.type === 2) {
        return (this.dFrom || '0:00:00').split(':');
      }
      if ([3, 4, 5, 6].indexOf(this.type) > -1) {
        return this.getNum(0);
      }
      return [];
    },
    max() {
      if (this.type === 1) {
        return this.getTime(this.dTo, this.dTo ? 0 : +20);
      }
      if (this.type === 2) {
        return (this.dTo || '23:59:59').split(':');
      }
      if ([3, 4, 5, 6].indexOf(this.type) > -1) {
        return this.getNum(1);
      }
      return [];
    },
    default() {
      if (this.type === 1) {
        if (/^\d{4}[^\d]+\d{1,2}[^\d]+\d{1,2}$/.test(this.data.default)) {
          return this.data.default.split(/[^\d]+/);
        }
        return this.getTime();
      }
      if (this.type === 2) {
        if (/^\d{1,2}[^\d]+\d{1,2}[^\d]+\d{1,2}$/.test(this.data.default)) {
          return this.data.default.split(/[^\d]+/);
        }
        return null;
      }
      if ([3, 4, 5, 6].indexOf(this.type) > -1) {
        if (this.data.default) {
          return this.data.default.split(this.join);
        }
        return this.min;
      }
      const str = this.data.default || new Array(this.arr.length).join(this.join);
      return str.split(this.join);
    },
  },
  watch: {
    nTitle() {
      this.sel = { id: [], val: [], text: [] };
      this.sArr = this.getArrData();
    },
    dtData() {
      this.sArr = this.getArrData(true);
    },
    show() {
      this.pHeight = `${document.getElementById('app').offsetHeight}px`;
      this.$emit('filter', !!this.show);
      if (this.show) {
        this.boxShow = this.show;
        this.cStyle = { animation: 'covershow 0.15s linear' };
        this.bStyle = { animation: 'bodymoveup 0.15s linear' };
      } else {
        this.cStyle = { animation: 'coverhide 0.15s linear' };
        this.bStyle = { animation: 'bodymovedown 0.15s linear' };
        setTimeout(() => { this.boxShow = this.show; }, 150);
      }
    },
    boxShow() {
      this.$emit('show', !!this.boxShow);
    },
  },
  methods: {
    changeData(obj) {
      const { data } = this;
      Object.entries(obj).forEach(([k, v]) => {
        data[k] = v;
      });
      this.$emit('update:data', data);
      this.arr = this.getArrData();
    },
    changeKeys(data) {
      let dt = JSON.stringify(data);
      if (this.data.replace) {
        dt = dt.replace(new RegExp(`"(${this.data.replace.value || 'value'})":`, 'gi'), '"value":');
        dt = dt.replace(new RegExp(`"(${this.data.replace.text || 'text'})":`, 'gi'), '"text":');
        dt = dt.replace(new RegExp(`"(${this.data.replace.data || 'data'})":`, 'gi'), '"data":');
      }
      return JSON.parse(dt);
    },
    getArrData(flag) {
      let dArr = [];
      if (this.type === 1) {
        dArr = this.getDateData(flag);
      } else if (this.type === 2) {
        dArr = this.getTimeData(flag);
      } else if ([3, 4, 5, 6].indexOf(this.type) > -1) {
        dArr = this.getOtherData(flag);
      } else if (this.type === 7) {
        dArr = this.getTwoArrData(this.changeKeys(this.data.data), flag);
      } else if (this.data.data) {
        dArr = this.getArrayData(this.changeKeys(this.data.data), flag);
      }
      this.rotate = dArr.length === 1 && dArr[0].data.length < 21;
      return dArr;
    },
    getDateData(flag) {
      const def = this.default;
      const yearObj = this.getSelect(this.min[0], this.max[0], def[0], 4, flag);
      const YY = yearObj.data[yearObj.select];
      const monthObj = this.getSelect(1, 12, def[1], 2, flag, YY);
      const MM = monthObj.data[monthObj.select];
      const maxDay = this.getMaxDay(YY, MM).getDate();
      const dayObj = this.getSelect(1, maxDay, def[2], 2, flag, YY, MM);
      return [yearObj, monthObj, dayObj];
    },
    getTimeData(flag) {
      const def = this.default || this.getHour();
      const hourObj = this.getSelect(this.min[0], this.max[0], def[0], 1, flag);
      const HH = hourObj.data[hourObj.select];
      const minuteObj = this.getSelect(0, 59, def[1], 2, flag, HH);
      const MM = minuteObj.data[minuteObj.select];
      const secondObj = this.getSelect(1, 59, def[2], 2, flag, HH, MM);
      return [hourObj, minuteObj, secondObj];
    },
    getOtherData(flag) {
      const [def, items, sel] = [this.default, [], []];
      const aMin = this.type === 4 ? 'A' : '0';
      let aMax = this.type === 3 ? '9' : '';
      aMax = this.type === 4 ? 'Z' : aMax;
      aMax = this.type === 5 ? 'F' : aMax;
      for (let i = 0; i < this.min.length; i += 1) {
        let dMax = aMax || '';
        if (this.type === 6) {
          dMax = +this.min[i] > +this.max[i] ? this.min[i] : this.max[i];
        }
        const obj = this.getSelect(aMin, dMax, def[i], 1, flag, sel);
        items.push(obj);
        sel.push(obj.data[obj.select]);
      }
      return items;
    },
    getSelect(min, max, deft, bit, flag, ...obj) {
      const opt = !obj || obj[0] === undefined ? [] : obj;
      const arr = opt[0] && opt[0].constructor === Array ? opt[0] : opt;
      let nMin = /^[a-z]$/i.test(min) ? min.charCodeAt() - 55 : +min;
      let nMax = /^[a-z]$/i.test(max) ? max.charCodeAt() - 55 : +max;
      const [nBit, len] = [new Array(bit + 1).join('0'), arr.length];
      const [item, defStr] = [{ select: 0, data: [] }, deft || ''];
      const def = defStr.length > bit ? defStr : `${nBit}${defStr}`.slice(-bit);
      const aMin = this.getNumber(this.min.slice(0, len + 1));
      const aMax = this.getNumber(this.max.slice(0, len + 1));
      if (deft === '.') {
        item.data.push('.');
      } else {
        for (let i = nMin; i <= nMax; i += 1) {
          const num = [4, 5].indexOf(this.type) > -1 && i > 9 ? String.fromCharCode(i + 55) : `${i}`;
          if (this.compareNum(aMin, aMax, arr.concat(i))) item.data.push(num.length > bit ? num : `${nBit}${num}`.slice(-bit));
        }
      }
      const nLen = item.data.length - 1;
      nMin = /^[a-z]$/i.test(item.data[0]) ? item.data[0].charCodeAt() - 55 : +item.data[0];
      nMax = /^[a-z]$/i.test(item.data[nLen]) ? item.data[nLen].charCodeAt() - 55 : +item.data[nLen];
      if (flag && deft !== '.') {
        let val = this.sel.val[len];
        val = /^[a-z]$/i.test(val) ? val.charCodeAt() - 55 : +val;
        val = val < nMin ? nMin : val;
        val = val > nMax ? nMax : val;
        item.select = val - nMin;
      } else if (item.data.indexOf(def) > -1) {
        item.select = item.data.indexOf(def);
      }
      [this.sel.id[len], this.sel.val[len], this.sel.text[len]] = [item.select, item.data[item.select], item.data[item.select]];
      return item;
    },
    compareNum(min, max, ...obj) {
      const opt = !obj || obj[0] === undefined ? [] : obj;
      const arr = opt[0] && opt[0].constructor === Array ? opt[0] : opt;
      const num = this.getNumber(arr);
      return num >= min && num <= max;
    },
    getNumber(...obj) {
      const opt = !obj || obj[0] === undefined ? [] : obj;
      const arr = opt[0] && opt[0].constructor === Array ? opt[0] : opt;
      let [result, mul] = [0, 1];
      for (let i = arr.length - 1; i >= 0; i -= 1) {
        if (arr[i] !== '.') {
          const sNum = /[a-z]/i.test(arr[i]) ? arr[i].charCodeAt() - 55 : +arr[i];
          result += mul * sNum;
          mul *= 1000;
        }
      }
      return result;
    },
    getMaxDay(YY, MM) {
      const dStr = +MM < 12 ? `${YY}/${+MM + 1}/1 00:00:00` : `${+YY + 1}/1/1 00:00:00`;
      return new Date(new Date(dStr).getTime() - 1);
    },
    getTime(time, num) {
      const [nDate, n] = [time ? new Date(time) : new Date(), num || 0];
      return [`${nDate.getFullYear() + n}`, `${nDate.getMonth() + 1}`, `${nDate.getDate()}`];
    },
    getHour(time) {
      const nDate = time ? new Date(time) : new Date();
      return [`${nDate.getHours()}`, `${nDate.getMinutes()}`, `${nDate.getSeconds()}`];
    },
    getLayer(arr, len, deep) {
      const nLen = arr.length ? len + 1 : len;
      let nDeep = deep > nLen ? deep : nLen;
      for (let i = 0; i < arr.length; i += 1) {
        if (typeof arr[i] === 'object' && arr[i].data && arr[i].data.constructor === Array) {
          const rst = this.getLayer(arr[i].data, nLen, nDeep);
          nDeep = rst > nDeep ? rst : nDeep;
        }
      }
      return nDeep;
    },
    getNewArr(arr, n, deep, data, flag) {
      let sel = 0;
      const [nArr, nData] = [arr, JSON.parse(JSON.stringify(data || []))];
      if (nData.length) {
        let len = this.sel.id[n] < 0 ? 0 : this.sel.id[n];
        len = len > nData.length - 1 ? nData.length - 1 : len;
        sel = flag ? len : this.getDefault(nData, n, len);
      }
      nArr.push({ select: sel, data: nData.length ? nData : [''] });
      if (n >= deep - 1) {
        return nArr;
      }
      const selPass = nData[sel] && nData[sel].data && typeof nData[sel].data === 'object';
      const selData = selPass && nData[sel].data.constructor === Array ? nData[sel].data : [];
      return this.getNewArr(nArr, n + 1, deep, selData, flag);
    },
    getTwoArrData(data, flag) {
      return this.getNewArr([], 0, this.getLayer(data, 0, 0), data, flag);
    },
    getArrayData(data, flag) {
      const [arr, newData] = [[], JSON.parse(JSON.stringify(data))];
      for (let i = 0; i < newData.length; i += 1) {
        let len = this.sel.id[i] < 0 ? 0 : this.sel.id[i];
        len = len > newData[i].length - 1 ? newData[i].length - 1 : len;
        const sel = flag ? len : this.getDefault(newData[i], i, len);
        arr.push({ select: sel, data: newData[i] });
      }
      return arr;
    },
    getDefault(item, i, len) {
      if (!this.default[i]) return 0;
      for (let j = 0; j < item.length; j += 1) {
        let result = typeof item[j] === 'string' && this.default[i] === item[j];
        result = result || (item[j].text && this.default[i] === item[j].text);
        result = result || (item[j].value && this.default[i] === item[j].value);
        if (result || this.default[i] === `${j}`) return j;
      }
      return len;
    },
    getNum(type) {
      let [str, mStr] = [type ? this.dTo : this.dFrom, type ? this.dFrom : this.dTo];
      if (this.type !== 6) {
        if (!str || str.length < mStr.length || str.indexOf('.') !== mStr.indexOf('.')) {
          str = mStr;
        }
        return str.split('');
      }
      [str, mStr] = [str || mStr, mStr || str];
      str = str.split(/[-/.,;:]/).length < mStr.split(/[-/.,;:]/).length ? mStr : str;
      return str.split(/[-/.,;:]/);
    },
    clickFun(e) {
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      for (let i = 0; i < this.sArr.length; i += 1) {
        const c = this.sArr[i].data[this.sel.id[i]];
        const obj = typeof c === 'string' ? { text: c } : c || { };
        obj.value = obj.value || obj.text || obj.id;
        obj.text = obj.text || obj.value || obj.id;
        [this.sel.val[i], this.sel.text[i]] = [obj.value, obj.text];
      }
      if (/(cover|cancel|picker|confirm)/i.test(cName)) {
        this.obj.flg = true;
        if (/confirm/i.test(cName) && this.selectFun && typeof this.selectFun === 'function') {
          this.selectFun({ default: this.sel.text.join(this.join), title: this.nTitle, ...this.sel });
          this.changeData({ default: this.sel.text.join(this.join) });
        }
        this.changeData({ hide: true });
        this.obj.flg = false;
        setTimeout(() => {
          this.changeData({ hide: true });
          this.obj.flg = false;
        }, 50);
      }
    },
    async fun(id, item, updateFlag, stopFlag) {
      if (item) {
        [this.sel.val[id], this.sel.id[id], this.sel.text[id]] = [item.value, item.id, item.text];
      }
      if (!this.type && this.changeFun && typeof this.changeFun === 'function') {
        await this.changeFun(Object.assign({ id, select: item, stop: !!stopFlag }, { title: this.nTitle }));
      }
      if (updateFlag) {
        const [data, num] = [this.getArrData(true), this.obj.c ? 1 : 0];
        for (let i = id + num; i < data.length; i += 1) {
          this.$set(this.sArr, i, data[i]);
        }
        this.obj.c += 1;
      }
    },
    stFun(t) {
      if (t - this.obj.t > 500) {
        this.sArr = this.getArrData();
        [this.obj.t, this.obj.c] = [t, 0];
      }
    },
  },
  mounted() {
    if (this.$listeners.change) {
      this.changeFun = typeof this.$listeners.change === 'function' ? this.$listeners.change : null;
      delete this.$listeners.change;
    }
    if (this.$listeners.select) {
      this.selectFun = typeof this.$listeners.select === 'function' ? this.$listeners.select : null;
      delete this.$listeners.select;
    }
    [this.obj.flg, this.cancelTime] = [false, 0];
    this.pHeight = `${document.getElementById('app').offsetHeight}px`;
    this.sArr = this.getArrData();
  },
};
</script>

<style lang="less">
@keyframes bodymoveup { from { bottom: -3rem; } to { bottom: 0; } }
@keyframes bodymovedown { from { bottom: 0; } to { bottom: -3rem; } }
@keyframes covershow { from { background: rgba(0,0,0,0); } to { background: rgba(0,0,0,0.5); } }
@keyframes coverhide { from { background: rgba(0,0,0,0.5); } to { background: rgba(0,0,0,0); } }
.white .nb-picker {
  .box {
    box-shadow: 0 .02rem .04rem 0 rgba(223, 222, 223, 0.5);
    background: #f9f9f9;
    border-top: .01rem solid #ebe9e9;
    .title {
      border-bottom: .01rem solid rgba(46,47,52,0.2);
      .cancel { color: rgba(46,47,52,0.7); }
      .confirm { color: #ff5353; }
      .text { color: #2e2f34; }
    }
  }
}
.black .nb-picker {
  .box {
    box-shadow: 0 .02rem .04rem 0 rgba(37, 37, 37, 0.5);
    background: #323237;
    border-top: .01rem solid #2E2F34;
    .title {
      border-bottom: .01rem solid rgba(0,0,0,0.3);
      .cancel { color: #909090; }
      .confirm { color: #ff5353; }
      .text { color: #ecebeb; }
    }
  }
}
.blue .nb-picker {
  .box {
    box-shadow: 0 .02rem .04rem 0 rgba(0, 0, 0, 0.5);
    background: #3f3e44;
    border-top: .01rem solid #2E2F34;
    .title {
      border-bottom: .01rem solid rgba(0,0,0,0.3);
      .cancel { color: #909090; }
      .confirm { color: #53fffd; }
      .text { color: #ecebeb; }
    }
  }
}
.nb-picker {
  position: fixed;
  z-index: 99990000;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  transform: translateZ(1rem);
  .cover {
    position: fixed;
    z-index: 99990003;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
  }
  .box {
    position: fixed;
    z-index: 99990006;
    width: 3.75rem;
    height: 2.16rem;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    .title {
      width: 100%;
      height: .45rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .cancel,.text,.confirm {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        user-select: none;
      }
      .cancel,.confirm { width: .6rem; font-size: .15rem; }
      .text { width: 2.4rem; font-size: .17rem; }
    }
    .body {
      width: 100%;
      height: 1.7rem;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
}
</style>
