<template>
  <div class="x-match-item">
    <match-header
      :match="match"
      @tap="$router.push(`/matchinfo/${match.sportID}/${match.matchID}`)"
    />
    <list-options
      :match="match"
      :games="match.games"
    />
  </div>
</template>
<script>
import ListOptions from '@/components/Matchs/MatchList/ListOptions';
import MatchHeader from './MatchHeader';

export default {
  props: ['match'],
  components: {
    ListOptions,
    MatchHeader,
  },
};
</script>
<style lang="less">
.x-match-item {
  border-radius: 6px;
  box-shadow: 0 10px 20px 0 rgba(223, 222, 223, 0.5);
  border: 1px solid #ecebeb;
  background: linear-gradient(to top, #f9f9f9, #ffffff);
  overflow: hidden;
}
.blue .x-match-item {
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #2e2f34;
  background: linear-gradient(to bottom, #3a393f, #333238);
}
</style>
