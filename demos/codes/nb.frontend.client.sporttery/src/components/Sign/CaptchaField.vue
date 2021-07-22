<template>
  <input-field
    class="captcha-field"
    :value="value"
    :placeholder="$t('pagelite.captchaHolder')"
    maxlength="6"
    autocomplete="off"
    @input="value => $emit('input', value)"
    @keypress="e => $emit('keypress', e)"
  >
  <v-touch
    slot="control"
    @tap="loadCaptcha"
  >
    <cimg :src="captchaData" />
  </v-touch>
  </input-field>
</template>
<script>
import { getCaptcha } from '@/api/portalAgyy';
import InputField from '@/components/Sign/InputField';

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
.captcha-field .control {
  width: .98rem;
}
.captcha-field .control > div {
  width: .88rem;
  padding: .13rem 0 .07rem;
  img {
    height: .3rem;
    background: #fff;
    border-radius: 6px;
  }
}
</style>
