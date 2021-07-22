<template>
  <input-field
    :label="$t('agPage.sign.captcha')"
    maxlength="6"
    size="6"
    name="captcha"
    @input="value => $emit('input', value)"
    @keypress="e => $emit('keypress', e)"
  >
    <span
      slot="icon"
      class="captcha-img"
      @click="loadCaptcha"
    >
      <cimg
        :src="captchaData"
      />
    </span>
  </input-field>
</template>
<script>
import { getCaptcha } from '@/api/portalAgyy';
import InputField from './InputField';

export default {
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      default: '',
    },
    type: {
      default: 'login',
    },
  },
  data() {
    return {
      captchaData: '',
    };
  },
  components: {
    InputField,
  },
  created() {
    this.loadCaptcha();
  },
  methods: {
    async loadCaptcha() {
      this.captchaData = await getCaptcha(this.type);
    },
  },
};
</script>
<style lang="less">
.captcha-img {
  display: block;
  background: #fff;
  width: 80px;
  img {
    width: 100%;
    cursor: pointer;
  }
}
</style>
