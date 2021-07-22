<template>
  <div class="word-check">
    <div class="check-box" :style="`bottom: ${btnClick ? '-.3rem' : '0'}`">
      <v-touch tag="div" class="img-box" v-if="btnClick" @tap="imgBoxFun">
        <cimg class="img-picture" :src="src" />
        <cimg :class="`img-loading${loading ? ' rolling' : ''}`" src="@/components/common/icons/IconLoading/icon-loading.png" />
        <div class="img-text flex-center">
          {{$t('message.stepClick')}}
          <span class="img-word" v-for="(v, k) in textArr" :key="k">{{v}}</span>
        </div>
      </v-touch>
      <v-touch tag="div" :class="`check-btn${pass ? '-active' : ''} flex-center`" @tap="checkBtnFun">
        {{$t(`message.${pass ? 'wordCheckPass' : 'clickForCheck'}`)}}
      </v-touch>
    </div>
  </div>
</template>

<script>
import JSBase from 'js-base64';
import { getWdCheckWord, checkingWords } from '@/api/portalAgyy';

export default {
  data() {
    return {
      btnClick: false,
      pass: false,
      textArr: [],
      clickArr: [],
      ts: 1 - new Date(),
      ct: 0,
      loading: false,
    };
  },
  model: { prop: 'value', event: 'change' },
  props: {
    value: { default: false },
    type: { default: 'login' },
  },
  computed: {
    src() {
      return `${window.NBConfig.PORTAL_API_URL}/api/captcha/CLICK_TEXT/img?type=${this.type}&_d=${this.ts}`;
    },
  },
  watch: {
    btnClick(n) {
      if (n) this.updatePicAndWords();
    },
    value() {
      this.pass = !!this.value;
    },
  },
  methods: {
    changeData(dt) {
      this.pass = !!dt;
      this.$emit('change', this.pass);
    },
    async updatePicAndWords() {
      [this.textArr, this.clickArr, this.loading] = [[], [], true];
      this.changeData();
      this.ts = 1 - new Date();
      await this.getWords();
      this.loading = false;
    },
    async getWords() {
      try {
        const wds = await getWdCheckWord({ type: this.type });
        if (wds && wds.words && wds.words.length) {
          this.textArr = wds.words;
        }
      } catch (err) {
        console.log(err);
      }
    },
    checkBtnFun() {
      if (!this.pass) {
        this.btnClick = !this.btnClick;
      }
    },
    getPosit(e) {
      let touch = e.targetTouches ? e.targetTouches[0] : e;
      touch = e.changedTouches ? e.changedTouches[0] : touch;
      return [touch.pageX, touch.pageY];
    },
    getLeft(el) {
      return el.offsetParent ? el.offsetLeft + this.getLeft(el.offsetParent) : el.offsetLeft;
    },
    getTop(el) {
      return el.offsetParent ? el.offsetTop + this.getTop(el.offsetParent) : el.offsetTop;
    },
    async imgBoxFun() {
      if (Date.now() - this.ct < 100) return;
      const [ele, pic] = [this.$el.querySelector('.img-box'), this.$el.querySelector('.img-picture')];
      const [ntWidth, ntHeight] = [pic.naturalWidth || 330, pic.naturalHeight || 170];
      const [width, height] = [pic.offsetWidth, pic.offsetHeight];
      const [ax, ay] = [ntWidth / width, ntHeight / height];
      const [px, py] = this.getPosit(window.event);
      const [left, top] = [this.getLeft(ele), this.getTop(ele)];
      let [x, y] = [px - left, py - top];
      [x, y, this.ct] = [parseInt(x * ax, 10), parseInt(y * ay, 10), Date.now()];
      if (x >= ntWidth - 30 && x <= ntWidth && y >= 0 && y <= 30) {
        this.updatePicAndWords();
        return;
      }
      if (this.clickArr.length >= this.textArr.length) return;
      if (x >= 0 && x <= ntWidth && y >= 0 && y <= ntHeight) {
        this.clickArr.push({ x, y });
        if (this.clickArr.length === this.textArr.length) {
          try {
            await checkingWords({ type: this.type, code: JSBase.Base64.encode(JSON.stringify(this.clickArr)) });
            this.btnClick = false;
            this.changeData(true);
          } catch (err) {
            this.clickArr = [];
            console.log(err);
          }
        }
      }
    },
  },
  mounted() {
    [this.textArr, this.clickArr, this.loading] = [[], [], false];
    this.changeData();
  },
};
</script>
<style lang="less">
.word-check {
  position: relative;
  height: .6rem;
  margin-left: 0.3rem;
  .check-box {
    position: absolute;
    width: 3.3rem;
    left: 0;
    .img-box {
      position: relative;
      width: 3.55rem;
      height: 1.85rem;
      margin-left: -.2rem;
      border-radius: .06rem;
      background: #d8d8d8;
      box-shadow: 0 .1rem .11rem 0 #e54848;
      overflow: hidden;
      .img-text {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: .34rem;
        background: #727171;
        color: #f9f8f8;
        font-family: PingFangTC;
        font-size: .14rem;
        font-weight: 500;
        .img-word {
          position: relative;
          margin: 0 .15rem;
        }
        .img-word::before, .img-word::after {
          content: "";
          display: block;
          position: absolute;
          width: .03rem;
          height: .07rem;
        }
        .img-word::before {
          left: -.05rem;
          top: .04rem;
          border-top: .01rem solid #f9f8f8;
          border-left: .01rem solid #f9f8f8;
        }
        .img-word::after {
          right: -.05rem;
          bottom: .03rem;
          border-bottom: .01rem solid #f9f8f8;
          border-right: .01rem solid #f9f8f8;
        }
      }
      .img-picture {
        width: 3.55rem;
        height: 1.51rem;
      }
      .img-loading {
        position: absolute;
        right: .05rem;
        top: .05rem;
        width: .2rem;
        height: .2rem;
      }
    }
    .check-btn, .check-btn-active {
      height: .4rem;
      margin-top: .1rem;
      border-radius: .2rem;
      font-size: .16rem;
    }
    .check-btn {
      width: 100%;
      border: .01rem solid #ffeeee;
      color: #ffffff;
    }
    .check-btn-active {
      width: 1.3rem;
      margin-left: 2rem;
      border: .01rem solid #ddc9c9;
      background: linear-gradient(130deg, rgba(255, 255, 255, 0.9), #ffb8b4 86%, #ffbab6);
      color: #ff5353;
    }
  }
}
</style>
