<template>
  <div class="race">
    <div>
      <h3>{{data.rn}}</h3>
    </div>
    <div>
      <match
        v-for="m in data.matchs"
        :key="m.mid"
        :data="m"
      ></match>
    </div>
  </div>
</template>
<script>
import Match from './Match'

export default {
  props: ['data'],
  computed: {
  },
  components: {
    Match
  }
}
</script>
<style lang="less" scoped>
.race {
  margin-bottom: .1rem;
}
</style>
