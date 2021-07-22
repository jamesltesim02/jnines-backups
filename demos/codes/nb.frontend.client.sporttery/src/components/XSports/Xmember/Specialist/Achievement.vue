<template>
  <ul class="achievement">
    <li>
      <div>
        <span>{{ parseInt(memberInfo.returnRate * 100, 10) }}</span>
        <i>%</i>
      </div>
      <label>近7天回报率</label>
    </li>
    <li>
      <div>
        <span>{{ parseInt(memberInfo.hitRate * 100, 10) }}</span>
        <i>%</i>
      </div>
      <label>近7天命中率</label>
    </li>
    <li>
      <div>
        <span>{{ memberInfo.longRedCount }}</span>
        <i>连红</i>
      </div>
      <label>近期连红</label>
    </li>
    <li>
      <div>
        <span>{{ commission.value | moneyFormat }}</span>
        <i v-if="commission.moreThan1k">k</i>
      </div>
      <label>方案佣金</label>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    memberInfo: {
      default: () => ({}),
    },
  },
  computed: {
    commission() {
      const moreThan1k = this.memberInfo.commission > 1000;
      return {
        moreThan1k,
        value: moreThan1k ? moreThan1k / 1000 : this.memberInfo.commission,
      };
    },
  },
};
</script>
<style lang="less">
.achievement {
  padding: 0 .1rem .1rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  text-align: center;
  label {
    font-size: .12rem;
    color: #999;
    display: block;
  }
  div {
    color: #ff5353;
    span {
      font-family: AlternateGothicNo2BT;
      font-size: .32rem;
    }
    i {
      font-size: .12rem;
      font-style: normal;
    }
  }
}
.blue .achievement {
  label { color: #999999; }
  div { color: #ff5353; }
}
</style>
