<template>
  <div class="agyy-arrivalamount">
    <span>{{(afterWater || '_ _ _') | moneyFormat(2)}}</span>
    <label>
      {{
        water > 0 ? `${water}% `: $t('agPage.payment.free')
      }}{{
        $t('agPage.payment.waterLabel')
      }}
    </label>
  </div>
</template>
<script>
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
};
</script>

<style lang="less">
.agyy-arrivalamount {
  line-height: 50px;
  display: flex;
  span {
    width: 334px;
    padding-left: 18px;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    border: solid 1px #716d6d;
    border-right: 0;
    font-size: 20px;
    color: #ff5353;
  }
  label {
    width: 111px;
    background: #ff5353;
    text-align: center;
    color: #fff;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
}
</style>
