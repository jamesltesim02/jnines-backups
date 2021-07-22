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
    <v-touch slot="control" @tap="loadCaptcha" >
      <cimg :src="captchaData" />
    </v-touch>
  </input-field>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { findRegisterCode } from '@/api/activity';
import InputField from '@/components/Sign/InputField';

export default {
  model: { prop: 'value', event: 'input' },
  props: { value: { default: '' } },
  data() {
    return { captchaData: '' };
  },
  computed: {
    ...mapState('app', ['scanInfo']),
  },
  components: { InputField },
  created() {
    this.loadCaptcha();
  },
  methods: {
    ...mapMutations('app', ['updateScanInfo']),
    async loadCaptcha() {
      const dt = await findRegisterCode();
      if (dt && dt.image) {
        this.captchaData = `data:image/png;base64,${dt.image.trim()}`;
        if (this.scanInfo) {
          const sObj = JSON.parse(JSON.stringify(this.scanInfo));
          if (dt.AG_JSESSIONID) {
            sObj.jSession = dt.AG_JSESSIONID;
          }
          if (dt.AG_FCN) {
            sObj.fcn = dt.AG_FCN;
          }
          if (dt.AG_JSESSIONID || dt.AG_FCN) {
            this.updateScanInfo(sObj);
          }
        }
      }
    },
  },
};
</script>
<style lang="less">
.captcha-field .control { width: .98rem; }
.captcha-field .control > div {
  width: .88rem;
  padding: .13rem 0 .07rem;
  img { height: .3rem; background: #fff; border-radius: 6px; }
}
</style>
