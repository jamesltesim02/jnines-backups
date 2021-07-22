<template>
  <div class="x-filter-bar">
    <state-filter
      :value="value"
      @change="state => $emit('change', state)"
    />
    <i class="x-filter-line" v-if="!horizScreen"></i>
    <v-touch
      tag="button"
      v-if="!horizScreen"
      @tap="$router.push('/sportsfilter')"
    >
      <icon-filter />
    </v-touch>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import IconFilter from './icons/IconFilter';
import StateFilter from './StateFilter';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      default: 1,
    },
  },
  computed: {
    ...mapState('app', ['horizScreen']),
  },
  components: {
    IconFilter,
    StateFilter,
  },
};
</script>
<style lang="less">
.x-filter-bar {
  background: #fff;
  box-shadow: 0 1px 6px 0 rgba(236, 236, 236, 0.5);
  display: flex;
  .x-state-filter { flex-grow: 1; }
  .x-filter-line { display: inline-block; width: 1px; height: .4rem; background: #f5f4f5; }
  button { width: .47rem; }
}
.blue .x-filter-bar {
  background: #2e2f34;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.5);
  .x-filter-line { background: linear-gradient(to bottom, #2e2f34, rgba(72, 74, 82, 0.5) 75%, rgba(54, 55, 60, 0.5) 100%); }
}
</style>
