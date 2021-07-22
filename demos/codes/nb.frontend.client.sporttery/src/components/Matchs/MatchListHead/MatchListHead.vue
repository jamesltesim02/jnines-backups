<template>
  <div class="nb-match-list-head">
    <match-nav
      :sno="sno"
      @update:sno="sno => $router.replace(`/matchs/${multitype}/${sno}`)"
    />
    <div class="sub-headers" v-if="!/^(888|999)$/.test(sno)" >
      <div class="match-state-filter-container">
        <state-filter
          :state="state"
          :sno="sno"
          @update:state="v => $emit('update:state', v)"
        />
      </div>
      <div class="bet-type-choocer-container">
        <bet-mult-type
          :multitype="multitype"
          :sno="sno"
          @update:multitype="t => $router.replace(`/matchs/${t}/${sno}`)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MatchNav from '@/components/Matchs/MatchNav';
import BetMultType from './BetMultType';
import StateFilter from './StateFilter';

export default {
  props: {
    sno: { default: 10 },
    multitype: { default: 0 },
    state: { default: 0 },
  },
  components: { MatchNav, BetMultType, StateFilter },
};
</script>
<style lang="less">
.nb-match-list-head {
  width: 3.75rem;
  position: relative;
}
.sub-headers {
  border-top: 1px solid #ecebeb;
  border-bottom: 1px solid #ecebeb;
  background: #f9f9f9;
  display: flex;
}
.match-state-filter-container {
  flex-grow: 1;
}
.bet-type-choocer-container {
  width: 1.32rem;
}
.black .sub-headers {
  background: #28272D;
  border-top: 1px solid #222227;
  border-bottom: 1px solid #222227;
}
</style>
