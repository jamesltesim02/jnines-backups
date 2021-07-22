<template>
  <div class="x-list-item">
    <match-info
      :match="match"
      @click="toDetail"
    />
    <item-games :match="match" />
    <div
      class="x-gcount"
      @click="toDetail"
    >+{{match.matchGame || match.scoreGame.length || 0}}</div>
  </div>
</template>
<script>
import MatchInfo from './MatchInfo';
import ItemGames from './ItemGames';

export default {
  props: {
    match: {},
  },
  components: {
    MatchInfo,
    ItemGames,
  },
  methods: {
    toDetail() {
      if (this.match.matchState === 3) {
        this.$router.push(`/finished/${this.match.sportID}/${this.match.matchID}`);
      } else {
        this.$router.push(`/detail/${this.match.sportID}/${this.match.matchID}`);
      }
    },
  },
};
</script>
<style lang="less">
.x-list-item {
  position: relative;
  margin-bottom: 16px;
  border-radius: 6px;
  box-shadow: 0 10px 20px 0 rgba(223, 222, 223, 0.5);
  display: grid;
  grid-template-columns: 306px 1fr 55px;
  background: #f2f1f1;
  overflow: hidden;
  padding: 1px;
  & * {
    position: relative;
    z-index: 2;
  }
  &::before {
    content: "";
    position: absolute;
    display: block;
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    top: 1px;
    left: 1px;
    border-radius: 6px;
    background-image: linear-gradient(to top, #f9f9f9, #ffffff);
    z-index: 1;
  }
  &:hover {
    background: linear-gradient(to bottom, #ff5353, rgba(255, 83, 83, 0.3));
  }
  .x-match-info {
    cursor: pointer;
  }
  .x-gcount {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    letter-spacing: -0.23px;
    color: #ff5353;
    box-shadow: 0 10px 20px 0 rgba(223, 222, 223, 0.5);
    border-left: solid 1px #f2f1f1;
    cursor: pointer;
  }
}

.dark .x-list-item {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: transparent;
  &::before {
    background-image: linear-gradient(to bottom, #3a393f, #333238);
  }
  &:hover {
    background: linear-gradient(to bottom, #53fffd, rgba(83, 255, 253, 0.3));
  }
  .x-gcount {
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.3);
    border-left-color: #2e2f34;
    background-image: linear-gradient(to bottom, #36353d, #2f2d34);
    color: #53fffd;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
}
</style>
