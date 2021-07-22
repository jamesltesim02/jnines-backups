<template>
  <div class="payment-container">
    <tips :type="type" />
    <slot />
  </div>
</template>
<script>
import Tips from '@/components/Payment/Tips';

export default {
  props: ['type'],
  components: {
    Tips,
  },
};
</script>
