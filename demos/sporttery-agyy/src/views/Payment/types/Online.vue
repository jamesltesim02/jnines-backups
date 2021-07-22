<template>
  <commpn-payment
    :type="type"
    :channel-cols="2"
  />
</template>
<script>
import CommpnPayment from './CommonPayment';

export default {
  props: ['type'],
  components: { CommpnPayment },
};
</script>
