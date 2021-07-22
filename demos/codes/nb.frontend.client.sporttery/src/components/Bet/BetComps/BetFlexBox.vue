<template>
  <div class="nb-bet-flex-box" v-bind="attrs" @touchstart="sFun" @touchmove="mFun"
  @touchend="eFun" @mousedown="sFun" @mousemove="mFun" @mouseup="eFun">
    <span v-for="wave in waves" :key="wave.id" class="wave" :style="wave.style"></span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BetFlexBox',
  data() {
    return {
      id: 0,
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      radius: 0,
      waves: [],
      clicked: false,
      posit: [0, 0],
      t: { max: 2000, st: 0, timer: null },
      waveFlag: false,
      touchFlag: false,
      attrs: [],
      fun: null,
    };
  },
  props: {
    column: Boolean,
    animate: Boolean,
    position: String,
    align: String,
  },
  methods: {
    sFun(e) {
      if (this.touchFlag && !e.targetTouches) return;
      this.t.st = Date.now();
      if (!this.clicked) {
        this.getClick(e);
        this.clicked = true;
        if (this.waveFlag) this.createWave(e);
        clearTimeout(this.t.timer);
        this.t.timer = setTimeout(() => {
          if (this.clicked) {
            this.t.st = Date.now();
            this.eFun(e);
          }
        }, this.t.max);
        this.$emit('start', true);
      }
    },
    mFun(e) {
      if (this.touchFlag && !e.targetTouches) return;
      this.getPosit();
      const [ex, ey] = this.getClick(e);
      let rst = ex < this.left || ex > this.left + this.width;
      rst = rst || ey < this.top || ey > this.top + this.height;
      this.$emit('move', true);
      if (this.clicked && rst) {
        this.eFun(e);
      }
    },
    eFun(e) {
      if (this.touchFlag && !e.targetTouches) return;
      this.changeWave();
      const tFlag = Date.now() - this.t.st > this.t.max;
      if (this.clicked && !tFlag && this.fun && typeof this.fun === 'function') {
        this.fun(e);
        clearTimeout(this.t.timer);
      }
      this.clicked = false;
    },
    getLeft(el) {
      return el.offsetParent ? el.offsetLeft + this.getLeft(el.offsetParent) : el.offsetLeft;
    },
    getTop(el) {
      return el.offsetParent ? el.offsetTop + this.getTop(el.offsetParent) : el.offsetTop;
    },
    getClick(e) {
      this.touchFlag = e.targetTouches ? true : this.touchFlag;
      let touch = e.targetTouches ? e.targetTouches[0] : e;
      touch = e.changedTouches ? e.changedTouches[0] : touch;
      const [ex, ey] = [touch.clientX, touch.clientY];
      this.posit = [ex, ey];
      return [ex, ey];
    },
    getPosit() {
      [this.left, this.top] = [this.getLeft(this.$el), this.getTop(this.$el)];
    },
    getXAndY(ex, ey) {
      const [hw, hh] = [this.width / 2, this.height / 2];
      let [x, y] = [ex - this.left - hw, ey - this.top - hh];
      x = Math.abs(x) > hw ? 0 : x;
      y = Math.abs(y) > hh ? 0 : y;
      return [x, y, hw, hh];
    },
    getPara(e) {
      this.id += 1;
      this.getPosit();
      const [ex, ey] = this.getClick(e);
      const [x, y, hw, hh] = this.getXAndY(ex, ey);
      return [this.id, hw, hh, x, y, 0];
    },
    runWave() {
      for (let i = this.waves.length - 1; i >= 0; i -= 1) {
        this.waves[i].scale += this.waves[i].speed;
        this.waves[i].style.transform = `scale(${this.waves[i].scale},${this.waves[i].scale})`;
        if (this.waves[i].scale >= 1) {
          this.waves.splice(i, 1);
        }
      }
      if (this.waves.length) {
        setTimeout(this.runWave, 20);
      }
    },
    createWave(e) {
      const [id, hWidth, hHeight, x, y, scale] = this.getPara(e);
      const obj = {
        id,
        scale,
        speed: 0.01,
        style: {
          'z-index': id + 100,
          width: `${2 * this.radius}px`,
          height: `${2 * this.radius}px`,
          top: `${hHeight - this.radius}px`,
          left: `${hWidth - this.radius}px`,
          'transform-origin': `${this.radius + x}px ${this.radius + y}px`,
          transform: `scale(${scale},${scale})`,
        },
      };
      this.waves.push(obj);
      if (this.waves.length < 2) {
        this.runWave();
      }
    },
    changeWave() {
      for (let i = 0; i < this.waves.length; i += 1) {
        this.waves[i].speed = 0.08;
      }
    },
  },
  created() {
    if (this.$listeners.click) {
      this.fun = typeof this.$listeners.click === 'function' ? this.$listeners.click : null;
      delete this.$listeners.click;
    }
    if (this.$listeners.clicked) {
      this.fun = typeof this.$listeners.clicked === 'function' ? this.$listeners.clicked : null;
      delete this.$listeners.clicked;
    }
    if (this.$listeners.tap) {
      this.fun = typeof this.$listeners.tap === 'function' ? this.$listeners.tap : null;
      delete this.$listeners.tap;
    }
    if (this.$listeners.touch) {
      this.fun = typeof this.$listeners.touch === 'function' ? this.$listeners.touch : null;
      delete this.$listeners.touch;
    }
    if (this.$listeners.touched) {
      this.fun = typeof this.$listeners.touched === 'function' ? this.$listeners.touched : null;
      delete this.$listeners.touched;
    }
    if (this.$listeners.touchend) {
      this.fun = typeof this.$listeners.touchend === 'function' ? this.$listeners.touchend : null;
      delete this.$listeners.touchend;
    }
    if (this.$listeners.submit) {
      this.fun = typeof this.$listeners.submit === 'function' ? this.$listeners.submit : null;
      delete this.$listeners.submit;
    }
    const ats = Object.assign({}, this.$attrs || {}, { style: {} });
    ats.style['flex-direction'] = this.column ? 'column' : 'row';
    ats.style.position = this.animate ? 'relative' : 'static';
    ats.style.position = this.position ? this.position : ats.style.position;
    this.waveFlag = this.animate && ats.style.position === 'relative';
    if (!this.align) {
      ats.style['justify-content'] = 'center';
    } else if (/(start|left|begin)/i.test(this.align)) {
      ats.style['justify-content'] = 'flex-start';
    } else if (/(end|right|finish)/i.test(this.align)) {
      ats.style['justify-content'] = 'flex-end';
    } else if (/(bet|twe|wee|een)/i.test(this.align)) {
      ats.style['justify-content'] = 'space-between';
    } else if (/(aro|rou|oun|und)/i.test(this.align)) {
      ats.style['justify-content'] = 'space-around';
    } else {
      ats.style['justify-content'] = 'center';
    }
    this.attrs = ats;
  },
  mounted() {
    this.width = this.$el.offsetWidth;
    this.height = this.$el.offsetHeight;
    const [sWidth, sHeight] = [this.width * this.width, this.height * this.height];
    const rds = Math.sqrt(sWidth + sHeight) / 2;
    this.radius = parseInt(rds, 10) + 1;
  },
};
</script>

<style lang="less">
.nb-bet-flex-box {
  display: flex;
  align-items: center;
  user-select: none;
  overflow: hidden;
  cursor: pointer;
  z-index: 90;
  -webkit-tap-highlight-color: transparent;
  .wave {
    position: absolute;
    display: block;
    border-radius: 100%;
    background: rgba(0,0,0,0.1);
  }
}
</style>
