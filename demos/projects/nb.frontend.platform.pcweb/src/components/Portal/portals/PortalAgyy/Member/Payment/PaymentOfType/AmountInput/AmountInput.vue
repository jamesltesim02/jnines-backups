<template>
  <amount-chooser
    v-if="chooseType"
    :list="amountValuesList"
    :min="minamount"
    :max="maxamount"
    :value="value"
    @update="v => $emit('update', v)"
  />
  <amount-edittext
    v-else
    :value="value"
    :min="minamount"
    :max="maxamount"
    :type="amountType"
    :auto-decimal="autoDecimal"
    @update="v => $emit('update', v)"
  />
</template>
<script>
import AmountChooser from './AmountChooser';
import AmountEdittext from './AmountEdittext';

export default {
  model: {
    props: 'value',
    event: 'update',
  },
  props: {
    amountType: {
      default: 0,
    },
    amountValuesList: {
      type: Array,
      default: () => [],
    },
    minamount: {
      type: Number,
      default: 1,
    },
    maxamount: {
      type: Number,
    },
    value: {
      default: '',
    },
    autoDecimal: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    chooseType() {
      return this.amountValuesList && this.amountValuesList.length;
    },
  },
  components: {
    AmountChooser,
    AmountEdittext,
  },
};
</script>
