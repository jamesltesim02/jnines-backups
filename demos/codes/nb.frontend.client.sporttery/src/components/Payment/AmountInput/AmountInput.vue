<template>
  <div class="amount-input">
    <amount-choocer
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
      @update="v => $emit('update', v)"
    />
  </div>
</template>
<script>
import AmountChoocer from './AmountChoocer';
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
    maxamount: {
      type: Number,
    },
    minamount: {
      type: Number,
      default: 1,
    },
    value: {
      default: '',
    },
  },
  computed: {
    chooseType() {
      return this.amountValuesList && this.amountValuesList.length;
    },
  },
  components: {
    AmountEdittext,
    AmountChoocer,
  },
};
</script>
<style lang="less">
.amount-input {
  padding-top: .2rem;
  min-height: .45rem;
}
</style>
