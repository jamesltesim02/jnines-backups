<template>
  <revert-label-text>
    <template slot="value">
      <span>{{$t('payment.arrivalLabel')}}: </span>
      <span class="after-water">{{(afterWater || ' _ _ _') | moneyFormat(2)}}</span>
    </template>
    <template slot="label">
      <span :class="{ 'water-source': water > 0 }">
        {{water > 0 ? `${water}% `: $t('payment.free')}}
      </span>
      <span>{{$t('payment.waterLabel')}}</span>
    </template>
  </revert-label-text>
</template>
<script>
import RevertLabelText from '@/components/Payment/RevertLabelText';

export default {
  props: {
    water: {
      default: 0,
    },
    amount: {
      default: 0,
    },
  },
  computed: {
    afterWater() {
      if (!+this.amount) {
        return this.amount;
      }
      return this.amount * (10000 - this.water * 100) / 10000;
    },
  },
  components: {
    RevertLabelText,
  },
};
</script>
<style lang="less">
.after-water, .water-source {
  color: #ff5353;
}
</style>
