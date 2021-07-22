<template>
  <section v-if="tournament && tournament.matchs && tournament.matchs.length" class="tournament">
    <tour-header
      :expanded.sync="expanded"
      :name="tournament.tournamentName"
      :count="tournament.matchs.length"
    />
    <expand-box :expanded="expanded">
      <match-list-title :sno="tournament.sportID" />
      <match-item
        v-for="m in tournament.matchs"
        :key="m.matchID"
        :match="m"
      />
    </expand-box>
  </section>
</template>
<script>
import MatchListTitle from '@/components/Matchs/MatchListTitle';
import TourHeader from './TourHeader';
import MatchItem from '../MatchItem';

export default {
  props: ['tournament'],
  data() {
    return {
      expanded: true,
    };
  },
  components: {
    TourHeader,
    MatchListTitle,
    MatchItem,
  },
};
</script>

<style lang="less">
.tournament {
  padding-top: 30px;
}
</style>
