<template>
  <div class="match">
    <div class="names">
      <div>{{data.htn}}</div>
      vs
      <div>{{data.atn}}</div>
    </div>
    <ul class="games">
      <v-touch
        tag="li"
        v-for="o in data.games[0].options"
        :key="o.oid"
        v-on:tap="toggleBetting({
          option: o, 
          match: data, 
          game: data.games[0]
        })"
        :class="{
          active: !!findCart(o.oid)
        }"
      >{{o.odds}}</v-touch>
    </ul>
  </div>
</template>
<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  props: ['data'],
  data () {
    return {}
  },
  computed: {
    ...mapState('betcart', [
      'bettingList'
    ])
  },
  methods: {
    ...mapMutations('betcart', [
      'toggleBetting'
    ]),
    findCart (oid) {
      return this.bettingList.find(o => o.oid === oid)
    }
  }
}
</script>
<style lang="less" scoped>
.match {
  display: flex;
  margin-top: .05rem;

  .names {
    width: 1.4rem;
    height: .5rem;
    border: 1px solid red;
    text-align: center;
  }

  .games {
    flex-grow: 1;
    display: flex;

    li {
      flex-grow: 1;
      width: 33.333333333333%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background .5s;
      border: 2px solid #fff;
      box-sizing: border-box;

      &.active {
        color: #fff;
        background: violet;
      }
    }
  }
}
</style>
