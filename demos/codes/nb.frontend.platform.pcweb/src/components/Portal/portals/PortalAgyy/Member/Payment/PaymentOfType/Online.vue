<template>
  <common-pay v-bind="$attrs" />
</template>
<script>
import CommonPay from './CommonPay';

export default {
  components: {
    CommonPay,
  },
};
</script>
