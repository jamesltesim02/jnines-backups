<template>
  <div class="calendar-box">
    <div class="calendar-show-box flex-between" @click.stop="toggleFun">
      <div class="show-text flex-center">{{showDate}}</div>
      <div class="show-icon flex-center"><icon-calendar /></div>
    </div>
    <div class="select-box" v-if="show" @click.stop >
      <div class="c">
        <div class="h flex-between">
          <a class="yl bl" @click="changeYear('-1')"><i></i></a>
          <div class="yy flex-center" @click="checkYearData(currArr[0], currArr[0])">{{currArr[0]}} {{$t('agPage.calendar.year')}}</div>
          <a class="yr br" @click="changeYear('+1')"><i></i></a>
          <a class="ml bl" @click="changeMonth('-1')"><i></i></a>
          <div class="my flex-center" @click="checkMonthData">{{currArr[1]}} {{$t('agPage.calendar.month')}}</div>
          <a class="mr br" @click="changeMonth('+1')"><i></i></a>
        </div>
        <div class="b">
          <div class="hd">
            <a v-for="(v, k) in $t('agPage.calendar.wkDays')" :key="k">{{v}}</a>
          </div>
          <div class="bd">
            <a :class="v.class" v-for="(v, k) in dayArr" :key="k" v-html="v.text" @click="changeDay(v)"></a>
          </div>
        </div>
        <div class="f flex-between" v-if="showTimeBox" >
          <div class="ti flex-center" >
            <a class="tx">{{$t('agPage.calendar.time')}}</a>
            <div class="tbx flex-center">
              <a class="hh" :class="{ 'st': tObj.show && !tObj.id }" @click="showTimeFun(0)">{{currArr[3]}}</a>
              <a class="pt">:</a>
              <a class="mm" :class="{ 'st': tObj.show && tObj.id === 1 }" @click="showTimeFun(1)">{{currArr[4]}}</a>
              <a class="pt">:</a>
              <a class="ss" :class="{ 'st': tObj.show && tObj.id === 2 }" @click="showTimeFun(2)">{{currArr[5]}}</a>
            </div>
          </div>
          <div class="bt flex-center">
            <a class="btn clr" @click="clearFun">{{$t('agPage.calendar.clear')}}</a>
            <a class="btn tdy" @click="todayFun">{{$t('agPage.calendar.today')}}</a>
            <a class="btn act" @click="submitFun">{{$t('agPage.calendar.submit')}}</a>
          </div>
        </div>
        <div class="d" :style="dObj.style" v-if="dObj.show">
          <a :class="v.class" v-for="(v, k) in dObj.data" :key="k" v-html="v.text" @click="clickYYMM(v)"></a>
        </div>
        <div class="t" :style="tObj.style" v-if="tObj.show">
          <a :class="v.class" :style="v.vStyle" v-for="(v, k) in tObj.data" :key="k" v-html="v.text" @click="clickHMS(v)"></a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import IconCalendar from './IconCalendar';

export default {
  data() {
    return {
      show: false,
      saveDate: '',
      showDate: '',
      showDur: 40,
      lastArr: [],
      dObj: Object.assign({ show: false, style: { left: '4%' }, data: [] }, { id: 0 }),
      tObj: Object.assign({ show: false, style: { width: '84px' }, data: [] }, { id: 0 }),
    };
  },
  props: ['data', 'type', 'min', 'max', 'format'],
  computed: {
    ...mapState('agyy', ['bankInputFlag']),
    minDate() {
      const dt = new Date();
      return this.getTime(this.min || `${dt.getFullYear() - 100}-01-01 00:00:00`, 1);
    },
    maxDate() {
      const dt = new Date();
      return this.getTime(this.max || `${dt.getFullYear() + 100}-12-31 23:59:59`, 1);
    },
    regArr() {
      const nStr = '([^YMDhms\\d]*)';
      const rStr = `^([Y\\d]{4})?${nStr}([M\\d]*)${nStr}([D\\d]*)${nStr}([h\\d]*)${nStr}([m\\d]*)${nStr}([s\\d]*)${nStr}$`;
      const fStr = this.format || 'YYYY-MM-DD hh:mm:ss';
      const fArr = fStr.match(new RegExp(rStr));
      if (fArr) {
        for (let i = 0; i < fArr.length; i += 1) {
          fArr[i] = fArr[i] || '';
          fArr[i] = !(i % 2) && fArr[i].length > 4 ? fArr[i].slice(-4) : fArr[i];
        }
      }
      const jStr = fArr ? `${fArr[1]}${fArr[3]}${fArr[5]}${fArr[7]}${fArr[9]}${fArr[11]}` : '';
      return !/(Y{4}|M|D)/.test(fStr) || !fArr || !jStr ? [] : fArr.splice(1, 13);
    },
    timePass() {
      return !!(this.regArr[6] || this.regArr[8] || this.regArr[10]);
    },
    showTimeBox() {
      const [rs, re, rt] = [this.regArr[6], this.regArr[8], this.regArr[10]];
      return !!((rs && !/^\d+$/.test(rs)) || (re && !/^\d+$/.test(re)) || (rt && !/^\d+$/.test(rt)));
    },
    typeData() {
      return this.type && this.data ? this.data[this.type] : '';
    },
    currDate() {
      return this.getTime(this.saveDate || '', this.timePass, true);
    },
    currArr() {
      return this.currDate.split(/[^\d]+/);
    },
    btnClass() {
      const cDate = new Date(this.currDate);
      const minDate = new Date(this.minDate);
      const maxDate = new Date(this.maxDate);
      return cDate < minDate || cDate > maxDate ? 'svd' : 'act';
    },
    dayArr() {
      const [arr, cDate] = [[], new Date(`${this.currArr[0]}-${this.currArr[1]}-1 00:00:00`)];
      const [dStart, dMon] = [new Date(cDate.getTime() - cDate.getDay() * 86400000), cDate.getMonth()];
      const [dDay, minDate] = [+this.currArr[2], new Date(`${this.minDate.split(' ')[0]} 00:00:00`)];
      const maxDate = new Date(`${this.maxDate.split(' ')[0]} 23:59:59`);
      for (let i = 0; i < 42; i += 1) {
        const wDate = new Date(dStart.getTime() + i * 86400000);
        const [wMon, wDay] = [wDate.getMonth(), wDate.getDate()];
        const obj = { text: `<span class="flex-center">${wDay}</span>`, id: i };
        if (wDate < minDate || wDate > maxDate) {
          obj.class = wMon === dMon && wDay === dDay ? 'vst' : 'vd';
        } else {
          obj.class = wMon !== dMon ? 'nt' : `${wDay !== dDay ? 'nl' : 'st'}`;
        }
        arr.push(obj);
      }
      return arr;
    },
  },
  watch: {
    typeData() {
      this.saveDate = this.typeData;
      this.getShowDate();
    },
    bankInputFlag() {
      [this.show, this.dObj.show, this.tObj.show] = [false, false, false];
    },
    show() {
      if (this.show) {
        this.saveDate = this.typeData;
        this.getShowDate();
      }
    },
  },
  components: { IconCalendar },
  methods: {
    ...mapMutations('agyy', ['setBankInputFlag']),
    updateData(dateStr) {
      if (this.type && this.data) {
        const dt = JSON.parse(JSON.stringify(this.data));
        dt[this.type] = (dateStr || '').replace(/-/g, '/');
        this.$emit('change', dt);
      }
    },
    getLastArr() {
      if (this.typeData && this.lastArr.length < 3) {
        const tArr = this.typeData.split(/[^\d]+/);
        this.lastArr = tArr.length > 5 ? tArr.slice(3, 6) : this.lastArr;
      }
    },
    getTime(time, flag, formart) {
      const [dt, rArr, cArr] = [time ? new Date(time) : new Date(), this.regArr, this.lastArr];
      const [hStr, mStr, sStr] = [flag ? dt.getHours() : '0', flag ? dt.getMinutes() : '0', flag ? dt.getSeconds() : '0'];
      let dStr = `${dt.getFullYear()}-${`0${dt.getMonth() + 1}`.slice(-2)}-${`0${dt.getDate()}`.slice(-2)} `;
      dStr += `${`0${formart && /^\d+$/.test(rArr[6]) ? rArr[6] : `${formart && !rArr[6] && cArr[0] ? cArr[0] : hStr}`}`.slice(-2)}:`;
      dStr += `${`0${formart && /^\d+$/.test(rArr[8]) ? rArr[8] : `${formart && !rArr[8] && cArr[1] ? cArr[1] : mStr}`}`.slice(-2)}:`;
      dStr += `0${formart && /^\d+$/.test(rArr[10]) ? rArr[10] : `${formart && !rArr[10] && cArr[2] ? cArr[2] : sStr}`}`.slice(-2);
      return dStr;
    },
    toggleFun() {
      if (!this.show) {
        this.setBankInputFlag();
      }
      setTimeout(() => { this.show = !(this.show || !this.regArr.length); }, 10);
    },
    getShowDate() {
      const [rArr, cArr] = [JSON.parse(JSON.stringify(this.regArr)), this.currArr];
      for (let i = 0; i < 6; i += 1) {
        const len = i && /^[1-9]\d+$/.test(cArr[i]) ? 2 : rArr[2 * i].length;
        const noPass = rArr[2 * i] && /[^\d]/.test(rArr[2 * i]);
        rArr[2 * i] = noPass ? `000${cArr[i]}`.slice(-len) : rArr[2 * i];
      }
      this.showDate = this.typeData ? rArr.join('') : '';
      this.getLastArr();
    },
    checkYearData(yy, check) {
      const needHide = !this.dObj.id && this.dObj.show;
      [this.dObj.show, this.tObj.show] = [false, false];
      if (needHide) return;
      [this.dObj.data, this.dObj.style, this.dObj.id] = [this.changeYearData(yy, check), { left: '4%' }, 0];
      setTimeout(() => { this.dObj.show = true; }, this.showDur);
    },
    changeYearData(yy, check) {
      const [ft, dt] = [parseInt(yy / 10, 10) * 10, []];
      const minArr = this.minDate.split(/[^\d]+/);
      const maxArr = this.maxDate.split(/[^\d]+/);
      dt.push({ class: ft - 1 < +minArr[0] ? 'bnt' : 'bt', text: '<i></i>' });
      for (let i = 0; i < 10; i += 1) {
        const [obj, num] = [{ flag: 0, text: `${ft + i} ${this.$t('agPage.calendar.year')}` }, ft + i];
        obj.class = num < +minArr[0] || num > +maxArr[0] ? 'yvd' : `${num === +check ? 'yst' : 'ynl'}`;
        dt.push(obj);
      }
      dt.push({ class: ft + 10 > +maxArr[0] ? 'bnb' : 'bb', text: '<i></i>' });
      return dt;
    },
    checkMonthData() {
      const needHide = this.dObj.id && this.dObj.show;
      [this.dObj.show, this.tObj.show] = [false, false];
      if (needHide) return;
      const [yy, mm, dt] = [this.currArr[0], this.currArr[1], []];
      for (let i = 0; i < 12; i += 1) {
        const monStr = `${`0${i + 1}`.slice(-2)} ${this.$t('agPage.calendar.month')}`;
        dt.push({ flag: 1, class: this.checkMonth(yy, i + 1, mm), text: monStr });
      }
      [this.dObj.data, this.dObj.style, this.dObj.id] = [dt, { right: '4%' }, 1];
      setTimeout(() => { this.dObj.show = true; }, this.showDur);
    },
    checkMonth(YY, MM, compare) {
      const [yn, mn, cp] = [+YY, +MM, +compare];
      const dMax = new Date(`${yn}-${mn}-1 00:00:00`);
      const dMin = new Date(new Date(`${mn < 12 ? `${yn}-${mn + 1}` : `${yn + 1}-1`}-1 00:00:00`).getTime() - 1);
      return dMin < new Date(this.minDate) || dMax > new Date(this.maxDate) ? 'mvd' : `${mn === cp ? 'mst' : 'mnl'}`;
    },
    replaceCurr(...nArr) {
      const cArr = JSON.parse(JSON.stringify(this.currArr));
      for (let i = 0; i < nArr.length; i += 2) {
        cArr[nArr[i] || 0] = `${nArr[i] ? '0' : '000'}${nArr[i + 1] || 0}`.slice(nArr[i] ? -2 : -4);
      }
      return `${cArr[0]}-${cArr[1]}-${cArr[2]} ${cArr[3]}:${cArr[4]}:${cArr[5]}`;
    },
    changeYear(num) {
      const [ny, nm] = [/[+-]/.test(num) ? +this.currArr[0] + (+num) : +num, +this.currArr[1]];
      [this.dObj.show, this.tObj.show] = [false, false];
      if (!/vd/i.test(this.checkMonth(ny, nm, 1))) {
        this.saveDate = this.replaceCurr(0, ny);
      }
    },
    changeMonth(num) {
      let [ny, nm] = [+this.currArr[0], /[+-]/.test(num) ? +this.currArr[1] + (+num) : +num];
      ny = nm < 1 ? ny - 1 : +`${nm > 12 ? ny + 1 : ny}`;
      nm = nm < 1 ? nm + 12 : +`${nm > 12 ? nm - 12 : nm}`;
      [this.dObj.show, this.tObj.show] = [false, false];
      if (!/vd/i.test(this.checkMonth(ny, nm, 1))) {
        this.saveDate = this.replaceCurr(0, ny, 1, nm);
      }
    },
    clickYYMM(v) {
      const [yy, check] = [this.dObj.data[1].text.replace(/[^\d]/g, ''), +this.currArr[0]];
      const num = v.text.replace(/[^\d]/g, '');
      if (/^bt$/i.test(v.class)) {
        this.dObj.data = this.changeYearData((+yy) - 10, check);
      } else if (/^bb$/i.test(v.class)) {
        this.dObj.data = this.changeYearData((+yy) + 10, check);
      } else if (!v.flag && num) {
        this.changeYear(num);
      } else if (num) {
        this.changeMonth(num);
      }
    },
    clickHMS(v) {
      const minDate = new Date(`${this.minDate.split(' ')[0]} 00:00:00`);
      const maxDate = new Date(`${this.maxDate.split(' ')[0]} 23:59:59`);
      const currStr = this.replaceCurr(3 + (v.flag || 0), (v.text || '0').replace(/[^\d]/g, ''));
      const curDate = new Date(currStr);
      [this.dObj.show, this.tObj.show] = [false, false];
      if (curDate >= minDate && curDate <= maxDate) {
        this.saveDate = currStr;
      }
    },
    changeDay(v) {
      let [ny, nm, nd] = [+this.currArr[0], +this.currArr[1], +(v.text.replace(/[^\d]/g, '') || 0)];
      if (nd > 20 && v.id < 10) {
        ny = nm < 2 ? ny - 1 : ny;
        nm = nm < 2 ? 12 : nm - 1;
      } else if (nd < 10 && v.id > 20) {
        ny = nm > 11 ? ny + 1 : ny;
        nm = nm > 11 ? 1 : nm + 1;
      }
      nd = nd || 1;
      [this.dObj.show, this.tObj.show] = [false, false];
      if (!/^(vst|vd)$/.test(v.class)) {
        this.updateData(this.replaceCurr(0, ny, 1, nm, 2, nd));
        this.show = false;
      }
    },
    showTimeFun(id) {
      const needHide = `${this.tObj.id}` === `${id || 0}` && this.tObj.show;
      [this.tObj.show, this.dObj.show] = [false, false];
      if (needHide) return;
      const [dt, len, sArr] = [[], id ? 60 : 24, [{ width: '40%' }, { width: '92.887%' }, { width: '92.887%' }]];
      const [pass, num] = [!/^\d+$/.test(this.regArr[6 + 2 * (id || 0)]), +this.currArr[3 + (id || 0)]];
      for (let i = 0; i < len; i += 1) {
        const obj = { class: i === num ? 'st' : 'nl', text: `<span class="flex-center">${`0${i}`.slice(-2)}</span>` };
        [obj.vStyle, obj.flag] = [{ width: !id ? '25%' : '10%' }, id || 0];
        dt.push(obj);
      }
      [this.tObj.data, this.tObj.style, this.tObj.id] = [dt, sArr[id || 0], id || 0];
      setTimeout(() => { this.tObj.show = this.regArr[6 + 2 * (id || 0)] && pass; }, this.showDur);
    },
    clearFun() {
      this.updateData('');
      this.show = false;
    },
    todayFun() {
      const minDate = new Date(`${this.minDate.split(' ')[0]} 00:00:00`);
      const maxDate = new Date(`${this.maxDate.split(' ')[0]} 23:59:59`);
      const currStr = this.getTime(null, this.timePass, true);
      const curDate = new Date(currStr);
      if (curDate >= minDate && curDate <= maxDate) {
        this.updateData(currStr);
      }
      this.show = false;
    },
    submitFun() {
      const minDate = new Date(`${this.minDate.split(' ')[0]} 00:00:00`);
      const maxDate = new Date(`${this.maxDate.split(' ')[0]} 23:59:59`);
      const curDate = new Date(this.currDate);
      if (curDate >= minDate && curDate <= maxDate) {
        this.updateData(this.currDate);
      }
      this.show = false;
    },
  },
  mounted() {
    this.saveDate = this.typeData;
    this.getShowDate();
  },
};
</script>
<style lang="less">
.calendar-box {
  position: relative;
  .calendar-show-box { width: 100%; height: 100%; border-radius: 2px; background: linear-gradient(to bottom, #2a292f, #29292e); border: 0; }
  .calendar-show-box .show-text { width: 80%; height: 100%; font-size: 12px; color: #ecebeb; border-right: 1px solid #2e2f34; }
  .calendar-show-box .show-icon { width: 20%; height: 100%; }
  .select-box, .select-box div, .select-box a, .select-box input { padding: 0; margin: 0; color: #fff; border: none; user-select: none; }
  .select-box { width: 242px; position: absolute; left: 0; top: 115%; font-size: 12px; color: #00625A; border-radius: 6px; background: #fff; overflow: hidden; }
  .select-box a { display: flex; justify-content: center; align-items: center; cursor: pointer; }
  .select-box .c { width: 100%; position: relative; }
  .select-box .h { width: 100%; height: 36px; padding: 5px; background: #ff5353; }
  .select-box .h>div { width: 24%; height: 100%; font-size: 14px; cursor: pointer; }
  .select-box .h .bl, .select-box .h .br, .select-box .h .bt, .select-box .h .bb, .select-box .h .bnt, .select-box .h .bnb { width: 9%; height: 100%; }
  .select-box .bl:hover, .select-box .br:hover, .select-box .h>div:hover { background: #eb4544; border-radius: 2px; }
  .select-box .bt:hover i { border-bottom-color: #ff5353; } .select-box .bb:hover i { border-top-color: #ff5353; }
  .select-box .bl, .select-box .br, .select-box .bt, .select-box .bb, .select-box .bnt, .select-box .bnb { position: relative; }
  .select-box .bl i, .select-box .br i, .select-box .bt i, .select-box .bb i, .select-box .bnt i, .select-box .bnb i { display: block; position: absolute; width: 0; height: 0; left: 50%; top: 50%; border: 5px dashed transparent; overflow: hidden; }
  .select-box .bl i { margin: -5px 0 0 -7px; border-right-style: solid; border-right-color: #fff; }
  .select-box .br i { margin: -5px 0 0 -2px; border-left-style: solid; border-left-color: #fff; }
  .select-box .bt i { margin: -7px 0 0 -5px; border-bottom-style: solid; border-bottom-color: #6b6b6b; }
  .select-box .bb i { margin: -2px 0 0 -5px; border-top-style: solid; border-top-color: #6b6b6b; }
  .select-box .bnt i { margin: -7px 0 0 -5px; border-bottom-style: solid; border-bottom-color: #e2cece; }
  .select-box .bnb i { margin: -2px 0 0 -5px; border-top-style: solid; border-top-color: #e2cece; }
  .select-box .b { border-bottom: 1px solid #ecebeb; }
  .select-box .b>div { width: 100%; padding: 0 4px; display: flex; flex-wrap: wrap; align-content: center; justify-content: flex-start; align-items: center; }
  .select-box .b .hd { height: 22px; border-bottom: 1px solid #ecebeb; } .select-box .b a { width: 14.2857%; }
  .select-box .b .hd a { height: 100%; color: #909090; background: #fff; font-size: 13px; cursor: default; }
  .select-box .b .bd { padding: 2px 0; a { height: 20px; span { width: 18px; height: 18px; border-radius: 100%; } } }
  .select-box .b .nl span { color: #2e2f34; background: #fff; } .select-box .t .nl span { color: #bababa; background: #fff; }        /*正常*/
  .select-box .b .vd span, .select-box .t .vd span { color:#bababa; background: #fff; }         /*不可用*/
  .select-box .b .nt span, .select-box .t .nt span { color: #909090; background: #fff; }        /*其他月*/
  .select-box .b .st span { color: #fff; background: #ff5353; } .select-box .t .st span { font-size: 13px; font-weight: 600; color: #ff5353; }        /*选中*/
  .select-box .b .vst span { color: #bababa; background: #ff5353; } .select-box .t .vst span { font-size: 13px; font-weight: 600; color: #ff5353; }   /*选中不可用*/
  .select-box .b .vd:hover span, .select-box .t .vd:hover span { background: #efe6e6; }
  .select-box .b .nl:hover span, .select-box .b .nt:hover span, .select-box .t .nl:hover span, .select-box .t .nt:hover span { background: #efe6e6; }
  .select-box .b .vd:hover span, .select-box .b .nl:hover span, .select-box .b .nt:hover span { width: 20px; height: 20px; }
  .select-box .f { width: 100%; height: 32px; padding: 5px; }
  .select-box .f>div { width: 47%; height: 100%; }
  .select-box .f .ti .tx { width: 30%; height: 100%; padding-right: 2px; font-size: 12px; font-weight: 500; color: #bababa; cursor: default; }
  .select-box .f .ti .tbx { width: 70%; height: 100%; padding: 0 5px; border-radius: 4px; font-size: 12px; font-weight: 500; border: 1px solid #ecebeb; }
  .select-box .f .ti .hh, .select-box .f .ti .mm, .select-box .f .ti .ss { width: 28%; height: 100%; color: #909090; } .select-box .f .ti .pt { width: 8%; height: 100%; color: #909090; } .select-box .f .ti .st { color: #ff5353; font-size: 13px; font-weight: 600; }
  .select-box .f .btn { color: #909090; background: #fff; width: 34%; height: 100%; } .select-box .f .btn.clr { color:#bababa; }
  .select-box .f .btn.svd { color:#bababa; }
  .select-box .f .btn:hover { background: #ecebeb; border-radius: 5px; }
  .select-box .d { position: absolute; top: 36px; background: #fff; width: 42%; height: 121px; padding: 0 2px; display: flex; flex-wrap: wrap; align-content: center; justify-content: flex-start; align-items: center; border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; border: 1px solid #ff5353; border-top: none; box-shadow: 0 2px 4px 0 rgba(255, 83, 83, 0.43); overflow: hidden; }
  .select-box .d a, .select-box .d span { font-size: 10px; }
  .select-box .d .bt, .select-box .d .bb, .select-box .d .bnt, .select-box .d .bnb { width: 100%; height: 15px; }
  .select-box .d .ynl, .select-box .d .mnl { color: #716d6d; }
  .select-box .d .yvd, .select-box .d .mvd { color: #bababa; }
  .select-box .d .yst, .select-box .d .mst { color: #ff5353; font-size: 12px; font-weight: 600; }
  .select-box .d .ynl, .select-box .d .yvd, .select-box .d .yst { width: 50%; height: 18px; }
  .select-box .d .mnl, .select-box .d .mvd, .select-box .d .mst { width: 50%; height: 20px; }
  .select-box .d .ynl:hover, .select-box .d .yvd:hover, .select-box .d .mnl:hover, .select-box .d .mvd:hover { background: #f1f1f1; border-radius: 3px; }
  .select-box .t { position: absolute; border-radius: 6px; left: 5px; bottom: 33px; background:#fff; border: 1px solid #ff5353; box-shadow: 0 2px 4px 0 rgba(255, 83, 83, 0.43); height: 124px; padding: 2px; display: flex; flex-wrap: wrap; align-content: center; justify-content: flex-start; align-items: center; }
  .select-box .t a { height: 16.6667%; span { width: 90%; height: 80%; border-radius: 2px; } }
}
</style>
