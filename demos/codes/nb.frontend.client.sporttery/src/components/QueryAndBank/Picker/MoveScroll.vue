<template>
  <div class="nb-scroll" @touchstart.stop="setStart" @touchmove.stop="setMove" @touchend.stop="setEnd"
  @mousedown.stop="setStart" @mousemove.stop="setMove" @mouseup.stop="setEnd">
    <div class="top"></div>
    <div class="bottom"></div>
    <div class="list">
      <span v-for="v in nData" :key="v.id" :class="`scroll_spn_${v.id}`">{{v.text}}</span>
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'Scroll',
  data() {
    return {
      start: { t: 0, my: 0 },
      move: { t: 0, my: 0 },
      end: { t: 0, my: 0 },
      scroll: { v: 0, top: 9999, az: 0 },
      height: 0,
      clicked: false,
      sTimmer: null,
      last: -1,
      clickFlag: false,
      fun: null,
    };
  },
  props: {
    data: Object,
    i: Number,
    flg: Boolean,
    rotate: Boolean,
  },
  computed: {
    nId() {
      return this.i || 0;
    },
    nData() {
      const arr = [];
      if (this.data && this.data.data) {
        for (let i = 0; i < this.data.data.length; i += 1) {
          let obj = this.data.data[i];
          obj = typeof obj === 'string' ? { text: obj } : obj;
          obj.value = obj.value || obj.text || obj.id;
          obj.text = obj.text || obj.value || obj.id;
          obj.id = i;
          arr.push(obj);
        }
        if (arr.length && this.$el && !this.clickFlag) this.moveAction(arr);
      }
      return arr;
    },
  },
  watch: {
    rotate() {
      if (!this.rotate) {
        this.$el.querySelectorAll('span').forEach((v) => {
          v.style.transform = 'rotateX(0deg)';
          v.style.transition = 'none';
        });
      }
    },
  },
  methods: {
    enableMenu(e) {
      e.returnValue = false;
    },
    changeData(obj) {
      const { data } = this;
      Object.entries(obj).forEach(([k, v]) => {
        data[k] = v;
      });
      this.$emit('update:data', data);
    },
    getOffTop(el) {
      return el.offsetParent ? el.offsetTop + this.getOffTop(el.offsetParent) : el.offsetTop;
    },
    getHeight(arr) {
      let tHeight = this.$el.querySelector('.list').offsetHeight;
      tHeight -= parseFloat(window.getComputedStyle(this.$el.querySelector('.list')).paddingTop, 10);
      const nArr = arr || this.nData;
      const len = nArr && nArr.length ? nArr.length : 1;
      this.height = tHeight / len;
      if (this.scroll.top > 5000) {
        this.scroll.top = parseFloat(window.getComputedStyle(this.$el.querySelector('.list')).top, 10);
      }
    },
    getPosition(e) {
      let touch = e.targetTouches ? e.targetTouches[0] : e;
      touch = e.changedTouches ? e.changedTouches[0] : touch;
      return { t: Date.now(), my: touch.pageY, py: this.scroll.top };
    },
    stopPropFun(e) {
      clearInterval(this.sTimmer);
      this.setTransition();
      e.stopPropagation();
      e.preventDefault();
      this.getHeight();
      return this.getPosition(e);
    },
    setStart(e, flag) {
      if (this.clicked && !flag) return;
      this.start = this.stopPropFun(e);
      [this.move, this.scroll.az] = [this.start, 0];
      [this.clicked, this.clickFlag] = [true, true];
    },
    setMove(e) {
      if (!this.clicked) return;
      const [pPosit, pHeight] = [this.getOffTop(this.$el), this.$el.offsetHeight];
      const [lazi, lmy] = [this.scroll.az, this.move.my];
      this.move = this.stopPropFun(e);
      const end = this.move.my < pPosit || this.move.my > pPosit + pHeight;
      let azi = this.move.my < lmy ? -1 : 0;
      azi = this.move.my > lmy ? 1 : azi;
      this.scroll.az = azi;
      this.start = !end && lazi && azi && lazi !== azi ? this.move : this.start;
      const [height, disTop] = [this.height * (this.nData.length - 1), this.move.my - lmy];
      const newTop = this.scroll.top + disTop;
      const [t1, t2] = [disTop * (2 / 3), (newTop + height) / 3];
      if (newTop > 0 && disTop > 0) {
        this.scroll.top = this.scroll.top > 0 ? newTop - t1 : newTop / 3;
      } else if (newTop < -height && disTop < 0) {
        this.scroll.top = this.scroll.top < -height ? newTop - t1 : t2 - height;
      } else {
        this.scroll.top = newTop;
      }
      this.moveAction();
      if (end) this.setEnd(e);
    },
    setEnd(e) {
      if (!this.clicked) return;
      this.end = this.stopPropFun(e);
      const height = this.height * (this.nData.length - 1);
      const [ds, dt] = [this.end.my - this.start.my, this.end.t - this.start.t];
      let runTime = 0;
      if ((this.scroll.top > 0 && ds >= 0) || (this.scroll.top < -height && ds < 0)) {
        [this.scroll.top, runTime] = [ds >= 0 ? 0 : -height, 500];
        this.setAndChange('all 500ms');
      } else if (dt <= 0 || dt > 300 || Math.abs(ds) < 5) {
        [this.scroll.top, runTime] = [this.height * Math.round(this.scroll.top / this.height), 500];
        this.setAndChange('all 500ms');
      } else {
        const [dv, ads, dh] = [Math.abs(ds / dt), Math.abs(ds), 0.8 * this.height];
        let nTop = this.scroll.top + ds * dv * 8;
        nTop = this.height * Math.round(nTop / this.height);
        let cTop = nTop > dh ? dh : nTop;
        cTop = cTop < -height - dh ? -height - dh : cTop;
        const [nds, rad] = [ads > 100 ? 100 : ads, cTop / nTop];
        [runTime, this.scroll.top] = [20 * Math.round(nds * rad), cTop];
        this.setAndChange(`all ${runTime}ms cubic-bezier(0.1, 0.57, 0.1, 1)`);
      }
      this.clicked = false;
      this.sTimmer = setInterval(() => {
        runTime -= 20;
        let listTop = parseFloat(window.getComputedStyle(this.$el.querySelector('.list')).top, 10);
        listTop = Math.round(listTop * 1000) / 1000;
        if (runTime <= 0) {
          if (listTop > 0.2 || listTop < -height - 0.2) {
            [this.scroll.top, runTime] = [listTop > 0 ? 0 : -height, 500];
            this.setAndChange('all 500ms ease-in');
          } else {
            this.stopMove();
          }
        } else {
          this.emitChange();
        }
      }, 20);
    },
    stopMove() {
      this.emitChange(null, true);
      clearInterval(this.sTimmer);
      this.setTransition();
      this.clickFlag = false;
    },
    setAndChange(str) {
      this.setTransition(str);
      this.moveAction();
    },
    moveAction(arr, stopFlag) {
      if (!this.height && this.$el) this.getHeight(arr);
      this.changeStyle(arr);
      this.emitChange(arr, stopFlag);
    },
    setTransition(str) {
      this.$el.querySelector('.list').style.transition = str || 'none';
      if (this.rotate) this.$el.querySelectorAll('span').forEach((v) => { v.style.transition = str || 'none'; });
    },
    changeStyle(arr) {
      const data = arr || this.nData;
      this.scroll.top = Math.round(this.scroll.top * 1000) / 1000;
      let deId = this.data.select || 0;
      deId = deId > data.length - 1 ? data.length - 1 : deId;
      deId = deId < 0 ? 0 : deId;
      const id = this.height && this.clickFlag && !arr ? -this.scroll.top / this.height : deId;
      if (this.rotate) {
        for (let i = 0; i < data.length; i += 1) {
          const span = this.$el.querySelector(`.scroll_spn_${i}`);
          if (span) span.style.transform = `rotateX(${Math.round((id - i) * 25)}deg)`;
        }
      }
      const list = this.$el.querySelector('.list');
      if (list) list.style.top = this.height ? `${Math.round(-this.height * id)}px` : `${-0.44 * id}rem`;
      if (this.height && !this.clickFlag && arr) this.scroll.top = Math.round(-this.height * id);
    },
    emitChange(arr, stopFlag) {
      let listTop = parseFloat(window.getComputedStyle(this.$el.querySelector('.list')).top, 10);
      listTop = Math.round(listTop * 1000) / 1000;
      const data = arr || this.nData;
      let deId = this.data.select || 0;
      deId = deId > data.length - 1 ? data.length - 1 : deId;
      deId = deId < 0 ? 0 : deId;
      const id = this.height && this.clickFlag && !arr ? -listTop / this.height : deId;
      deId = id > data.length - 1 ? data.length - 1 : id;
      deId = Math.round(deId < 0 ? 0 : deId);
      if (this.fun && typeof this.fun === 'function' && this.last !== deId) {
        this.last = deId;
        this.changeData({ select: deId });
        this.fun(this.nId, data[deId], !arr, stopFlag);
      }
    },
  },
  mounted() {
    this.$el.oncontextmenu = this.enableMenu;
    this.clicked = false;
    if (this.$listeners.change) {
      this.fun = typeof this.$listeners.change === 'function' ? this.$listeners.change : null;
      delete this.$listeners.change;
    }
    if (this.$listeners.update) {
      this.fun = typeof this.$listeners.update === 'function' ? this.$listeners.update : null;
      delete this.$listeners.update;
    }
    if (this.$listeners.scroll) {
      this.fun = typeof this.$listeners.scroll === 'function' ? this.$listeners.scroll : null;
      delete this.$listeners.scroll;
    }
    this.end.t = Date.now();
    this.$emit('start', this.end.t);
    setTimeout(() => { this.moveAction(); }, 5);
  },
  beforeDestroy() {
    clearInterval(this.sTimmer);
  },
};
</script>

<style lang="less">
.white .nb-scroll {
  background: #f9f9f9;
  .top {
    border-bottom: .01rem solid #ebe9e9;
    background: linear-gradient(to bottom, rgba(249,249,249,1), rgba(249,249,249,.3));
  }
  .bottom {
    border-top: .01rem solid #ebe9e9;
    background: linear-gradient(to bottom, rgba(249,249,249,.3), rgba(249,249,249,1));
  }
  .list span { color: #2e2f34; }
}
.black .nb-scroll {
  background: #323237;
  .top {
    border-bottom: .01rem solid #28272d;
    background: linear-gradient(to bottom, rgba(50,50,55,1), rgba(50,50,55,.3));
  }
  .bottom {
    border-top: .01rem solid #28272d;
    background: linear-gradient(to bottom, rgba(50,50,55,.3), rgba(50,50,55,1));
  }
  .list span { color: #ecebeb; }
}
.blue .nb-scroll {
  background: #3f3e44;
  .top {
    border-bottom: .01rem solid #2E2F34;
    background: linear-gradient(to bottom, rgba(63,62,68,1), rgba(63,62,68,.3));
  }
  .bottom {
    border-top: .01rem solid #2E2F34;
    background: linear-gradient(to bottom, rgba(63,62,68,.3), rgba(63,62,68,1));
  }
  .list span { color: #ecebeb; }
}
.nb-scroll {
  position: relative;
  z-index: 0;
  width: 100%;
  height: 1.7rem;
  overflow: hidden;
  .top,.bottom,.list { position: absolute; left: 0; right: 0; }
  .top,.bottom { z-index: 99; height: .62rem; transform: translateZ(.6rem); }
  .top { top: 0; }
  .bottom { bottom: 0; }
  .list {
    padding-top: .63rem;
    span {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: .44rem;
      font-size: .17rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-family: PingFangSC-Regular;
      user-select: none;
    }
  }
}
</style>
