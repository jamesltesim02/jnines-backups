<template>
  <div :class="{
    'agyy-textcaptcha': true,
    visible: visible && !value,
  }">
    <button v-if="value" class="done">{{$t('message.wordCheckPass')}}</button>
    <button
      v-else
      @click="visible = !visible"
    >{{$t('message.clickForCheck')}}</button>
    <div class="text-area">
      <img
        :src="captchaData"
        ref="captchaEl"
        @click="addPoint"
      />
      <icon-loading
        :loading="loading"
        :size="20"
        @click="loadCaptcha"
      />
      <i
        v-for="(p, i) in points"
        :key="i"
        :style="{
          top: `${p.ry}px`,
          left: `${p.rx}px`,
        }"
      >{{i + 1}}</i>
      <div>{{texts}}</div>
    </div>
  </div>
</template>
<script>
import { getCaptcha, getWdCheckWord, checkingWords } from '@/api/portalAgyy';
import { getPosition } from '@/utils/DomUtil';
import IconLoading from '@/components/common/icons/IconLoading';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'login',
    },
  },
  data() {
    return {
      captchaData: '',
      visible: false,
      loading: false,
      submitting: false,
      words: [],
      position: null,
      naturalSize: { width: 0, height: 0 },
      size: { width: 0, height: 0 },
      points: [],
    };
  },
  watch: {
    visible(n) {
      if (n) {
        this.loadCaptcha();
      }
    },
  },
  computed: {
    texts() {
      return this.$t('agPage.sign.textCaptcha', { words: this.words.join('〕〔') });
    },
  },
  components: {
    IconLoading,
  },
  created() {
    this.loadCaptcha();
  },
  methods: {
    async loadCaptcha() {
      try {
        this.loading = true;
        // 获取验证码图片
        this.captchaData = await getCaptcha(this.type, 'text');
        // 获取验证码文字
        const result = await getWdCheckWord({ type: this.type });
        this.words = result.words || [];
        // 清空已选择的点
        this.points = [];
        // 初始化起始图片位置(用于计算点击时在图片上的位置)
        if (!this.position) {
          const el = this.$refs.captchaEl;
          this.position = getPosition(el);
          this.naturalSize = {
            width: el.naturalWidth,
            height: el.naturalHeight,
          };
          this.size = {
            width: el.offsetWidth,
            height: el.offsetHeight,
          };
        }
      } finally {
        this.loading = false;
      }
    },
    addPoint(e) {
      if (this.loading || this.submitting || this.points.length === this.words.length) {
        return;
      }

      // 点击图片的真实位置(用于显示标注图标)
      const [rx, ry] = [e.pageX - this.position.left, e.pageY - this.position.top];
      // 点击图片的相对位置,用于提交
      const [x, y] = [
        parseInt(rx / this.size.width * this.naturalSize.width + (this.naturalSize.width * 0.01) / 2, 10),
        parseInt(ry / this.size.height * this.naturalSize.height + (this.naturalSize.height * 0.01) / 2, 10),
      ];

      // 添加点
      this.points.push({
        rx,
        ry,
        x,
        y,
      });

      // 如果满足数量则提交check请求
      if (this.points.length === this.words.length) {
        this.submit();
      }
    },
    async submit() {
      if (this.submitting) {
        return;
      }

      if (this.points.length < this.words.length) {
        this.$toast.center(this.$t('message.needChooseText'));
        return;
      }

      try {
        this.submitting = true;
        const code = btoa(JSON.stringify(this.points.map(({ x, y }) => ({ x, y }))));
        await checkingWords({
          type: this.type,
          code,
        });
        this.$emit('change', code);
      } catch (e) {
        this.points = [];
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>
<style lang="less">
.portal-agyy .agyy-textcaptcha {
  margin-top: 20px;
  height: 40px;
  overflow: hidden;
  transition: height .35s ease-out;
  &.visible {
    height: 185px;
  }
  button {
    margin-top: 0;
    padding: 0 0 0 20px;
    border-radius: 100px;
    color: #f5f4f5;
    background: #ff5353;
    line-height: 40px;
    font-size: 14px;
    text-align: left;
    border: 0;
    &.done {
      cursor: default;
    }
  }
  .text-area {
    position: relative;
    margin-top: 10px;
    img {
      width: 100%;
    }
    .icon-loading {
      position: absolute;
      right: 5px;
      top: 5px;
      cursor: pointer;
    }
    i {
      position: absolute;
      color: #fff;
      font-size: 12px;
      background: rgba(255, 83, 83, .4);
      display: block;
      font-style: normal;
      line-height: 16px;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      text-align: center;
      border: 1px solid #fff;
      transform: translate(-50%, -50%);
    }
    div {
      position: absolute;
      font-size: 14px;
      bottom: 0;
      width: 100%;
      line-height: 35px;
      background: rgba(0, 0, 0, .7);
      text-align: center;
      color: #f5f5f5;
    }
  }
}
</style>
