<template>
  <list-page
    class="matchs"
    @scrollBottom="$refs.matchList.toNext()"
  >
    <template slot="header">
      <match-nav
        :sno="sno"
        @update:sno="sno => $router.replace(`/matchs/${multitype}/${sno}`)"
      />
      <bet-mult-type
        :multitype="multitype"
        @update:multitype="t => $router.replace(`/matchs/${t}/${sno}`)"
      />
    </template>
    <match-list
      :sno="sno"
      ref="matchList"
    />
  </list-page>
</template>
<script>
import { mapMutations } from 'vuex';
import ListPage from '@/components/common/ListPage';
import MatchNav from '@/components/Matchs/MatchNav';
import BetMultType from '@/components/Matchs/BetMultType';
import MatchList from '@/components/Matchs/MatchList';

export default {
  props: {
    sno: {
      default: 10,
    },
    multitype: {
      default: 0,
    },
  },
  watch: {
    multitype(n) {
      this.updateMultType(n);
    },
  },
  created() {
    this.updateMultType(this.multitype);
  },
  components: {
    ListPage,
    MatchNav,
    BetMultType,
    MatchList,
  },
  methods: {
    ...mapMutations('app', ['updateMultType']),
  },
};
</script>
