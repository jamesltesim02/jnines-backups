<template>
  <sub-panel
    :title="routerParam.title"
  >
    <div class="agyy-slidedesc" v-html="routerParam.content"></div>
  </sub-panel>
</template>
<script>
import { mapState } from 'vuex';
import SubPanel from './Member/SubPanel';

export default {
  computed: {
    ...mapState('agyy', ['routerParam']),
  },
  components: {
    SubPanel,
  },
};
</script>
<style lang="less">
.agyy-slidedesc {
  padding: 40px 60px;
  color: #bababa;
  font-size: 14px;
  p {
    margin: 5px 0;
  }
  table {
    width: 80%;
    line-height: 25px;
    margin: 10px 0 0 15px;
    background: linear-gradient(180deg,#2a292f,#29292e);
    td {
      border: 1px solid #2e2f34;
    }
  }
}
</style>
