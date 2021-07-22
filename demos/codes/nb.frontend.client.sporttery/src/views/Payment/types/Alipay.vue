<template>
  <commpn-payment :type="type" />
</template>
<script>
import CommpnPayment from './CommonPayment';

export default {
  props: ['type'],
  components: { CommpnPayment },
};
</script>
