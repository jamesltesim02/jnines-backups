<template>
  <div class="to-customer-service" :class="serClass" >
    <icon-alert class="service-flag" />
    <span :class="`service-${v.type} flex-center`" v-for="(v, k) in textArr" :key="k" @click.stop="clickFun(v)">{{v.text}}</span>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import IconAlert from './IconAlert';
import { toPortalUrlByKey } from '@/utils/PortalUtils';

export default {
  props: {
    start: Boolean,
    end: Boolean,
    text: String,
    detail: Array,
  },
  computed: {
    serClass() {
      const serStr = this.end ? 'end' : 'center';
      return `flex-${this.start ? 'start' : serStr}-wrap`;
    },
    textArr() {
      const dt = this.detail && typeof this.detail === 'object' ? this.detail : null;
      const [arr, tArr] = [dt && dt.constructor === Array ? dt : [], []];
      if (this.text) {
        arr.push({ text: this.text, type: 'text' });
      }
      for (let i = 0; i < arr.length; i += 1) {
        const obj = arr[i];
        if (typeof arr[i] === 'object' && arr[i].text) {
          const type = /alert/i.test(obj.type) ? 'alert' : 'text';
          obj.type = /button/i.test(obj.type) ? 'button' : type;
          tArr.push(obj);
        } else if (typeof arr[i] === 'string') {
          tArr.push({ text: obj, type: 'text' });
        }
      }
      if (!tArr.length) {
        tArr.push({ text: this.$t('agPage.service.hasQuestion'), type: 'text' });
        tArr.push({ text: this.$t('agPage.service.online'), type: 'button' });
      }
      return tArr;
    },
  },
  components: { IconAlert },
  methods: {
    ...mapMutations('agyy', ['pushRouter']),
    clickFun(v) {
      if (v && typeof v === 'object' && /button/i.test(v.type)) {
        if (/^\/(member|signin|signup)/.test(v.url)) {
          this.pushRouter(v.url);
        } else if (/^\//.test(v.url)) {
          this.$router.push(v.url);
        } else if (/^https?:\/\//.test(v.url)) {
          window.open(v.url, '_blank');
        } else {
          toPortalUrlByKey('SERVICE_CENTER_URL');
        }
      }
    },
  },
};
</script>
<style lang="less">
.to-customer-service { width: 100%; height: 30px; font-size: 14px; .service-flag { margin: 1px 6px 0 4px; } .service-text { color: #bababa; } }
.to-customer-service .service-alert, .to-customer-service .service-button { height: 100%; color: #ff5353; }
.to-customer-service .service-button { padding: 0 8px; cursor: pointer; }
</style>
