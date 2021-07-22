<template>
  <div>
    <v-touch
      class="icon-expand-all flex-center"
      @tap="toggleExpandAll"
    >
      <icon-expand :expanded="expandAll" />
    </v-touch>
    <div class="match-detail-games">
      <detail-game-item
        v-for="(g, i) in matchInfo.games"
        :key="i"
        :expanded.sync="g.expanded"
        :game="g"
        :match="matchInfo"
      />
    </div>
  </div>
</template>
<script>
import DetailGameItem from './DetailGameItem';
import IconExpand from './icons/IconExpand';

export default {
  props: {
    matchInfo: {
      default: {},
    },
  },
  components: {
    DetailGameItem,
    IconExpand,
  },
  computed: {
    expandAll() {
      if (!this.matchInfo || !this.matchInfo.games) {
        return false;
      }

      return this.matchInfo.games.reduce((acc, curr) => acc || curr.expanded, false);
    },
  },
  methods: {
    toggleExpandAll() {
      this.$emit('toggle-expand-all', !this.expandAll);
    },
  },
};
</script>
<style>
.match-detail-games {
  padding: .15rem .13rem;
}
.icon-expand-all {
  position: fixed;
  right: .3rem;
  bottom: .6rem;
  width: .4rem;
  height: .4rem;
  box-shadow: 0 4px 18px 0 rgba(58, 58, 58, 0.15);
  background-color: #ffffff;
  border-radius: 50%;
  z-index: 2;
  transform: translateY(-env(safe-area-inset-bottom))
}
.black .icon-expand-all {
  box-shadow: 0 4px 18px 0 #161616;
  background-color: #28272d;
}
</style>
