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
    @tap="refresh"
  >
    <cimg :src="src" />
  </v-touch>
  </input-field>
</template>
<script>
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
      timestamp: 1 - new Date(),
    };
  },
  computed: {
    src() {
      return `${window.NBConfig.PORTAL_API_URL}/api/captcha?type=${this.type}&_d=${this.timestamp}`;
    },
  },
  components: {
    InputField,
  },
  methods: {
    refresh() {
      this.timestamp = 1 - new Date();
      this.$emit('input', '');
    },
  },
};
</script>
<style lang="less">
.captcha-field .control {
  width: .98rem;
}
.captcha-field .control > div{
  width: .88rem;
  padding: .13rem 0 .07rem;
  img {
    height: .3rem;
    background: #fff;
    border-radius: 6px;
  }
}
</style>
