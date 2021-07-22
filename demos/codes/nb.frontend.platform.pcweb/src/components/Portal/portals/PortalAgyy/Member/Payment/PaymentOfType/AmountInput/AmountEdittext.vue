<template>
  <div class="agyy-amountedit">
    <input
      :class="{
        'agyy-edittext': true,
        focus: focus,
      }"
      v-model="inputValue"
      :placeholder="placeholder"
      @focus="focus = true"
      @blur="focus = false"
    />
    <tips v-if="autoDecimal">{{$t('agPage.payment.results.dib1')}}</tips>
  </div>
</template>
<script>
import moneyFormat from '@/filters/moneyFormat';
import Tips from '../../Tips';

export default {
  model: {
    prop: 'value',
    event: 'update',
  },
  props: {
    max: {},
    min: {},
    value: {
      default: '',
    },
    autoDecimal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputValue: '',
      focus: false,
    };
  },
  computed: {
    placeholder() {
      return this.$t('agPage.payment.amountRange', {
        min: moneyFormat(this.min),
        max: moneyFormat(this.max),
      });
    },
  },
  watch: {
    inputValue(n) {
      let nv = String(n).replace(/[^\d.]/gi, '');
      if ((nv.split('.')[1] || '').length > 2) {
        nv = parseInt(+nv * 100, 10) / 100;
      }
      if (+nv > this.max) {
        nv = this.max;
      }
      this.inputValue = nv;
      this.$emit('update', +nv);
    },
  },
  mounted() {
    if (this.value) {
      this.inputValue = this.value;
    }
  },
  components: {
    Tips,
  },
};
</script>
