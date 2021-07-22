<template>
  <div class="navigation">
    <hot-tournament />
    <state-filter />
    <sports-filter />
  </div>
</template>
<script>
import HotTournament from './HotTournament';
import StateFilter from './StateFilter';
import SportsFilter from './SportsFilter';

export default {
  components: {
    HotTournament,
    StateFilter,
    SportsFilter,
  },
};
</script>
