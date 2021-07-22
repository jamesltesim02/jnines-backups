<template>
  <edit-text
    type="number"
    :value="value"
    :placeholder="placeholder"
    @update="v => $emit('update', v)"
  />
</template>
<script>
import EditText from '@/components/Payment/EditText';
import moneyFormat from '@/filters/moneyFormat';

export default {
  model: {
    prop: 'value',
    event: 'update',
  },
  props: {
    max: {},
    min: {},
    placeholder: {
      default() {
        return this.$t('payment.amountRange', {
          min: moneyFormat(this.min),
          max: moneyFormat(this.max),
        });
      },
    },
    value: {
      default: '',
    },
  },
  components: {
    EditText,
  },
  mounted() {
    if (this.value && this.value > this.max) {
      this.$emit('update', this.max);
    }
  },
  watch: {
    value(n) {
      if (+n <= this.max) {
        return;
      }

      this.$nextTick(() => {
        this.$emit('update', this.max);
      });
    },
  },
};
</script>
