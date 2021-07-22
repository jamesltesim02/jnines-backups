<template>
  <div>
    <a @click="goback" href="javascript: void(0);">返回</a>
    <h3>通过vuex调用接口,以及交互</h3>
    <div>
      <football-race
        v-for="league in leagues"
        :key="league.rid"
        :data="league"
      ></football-race>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'

import FootballRace from '@/components/football/Race'

export default {
  computed: {
    ...mapState({
      footballMatchs: state => state.matchs.footballMatchs
    }),
    leagues () {
      return this.footballMatchs.races || []
    }
  },
  components: {
    FootballRace
  },
  created () {
    this.queryFooball()
  },
  methods: {
    ...mapActions('matchs', [
      'queryFooball'
    ]),
    goback () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    }
  }
}
</script>
