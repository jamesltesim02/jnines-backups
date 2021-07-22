<template>
  <list-options
    v-if="match.fromList"
    :match="match"
    :games="games"
  />
  <detail-options
    v-else
    :game="games[0]"
    :match="match"
  />
</template>
<script>
import ListOptions from '@/components/Matchs/MatchList/ListOptions';
import DetailOptions from '@/components/MatchDetail/DetailOptions';

export default {
  props: ['match', 'games'],
  components: {
    ListOptions,
    DetailOptions,
  },
};
</script>
