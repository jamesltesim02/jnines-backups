<template>
  <div class="x-program-match-item">
    <span class="sport">{{ match.sportName }}</span>
    <span class="date">{{ +match.matchDate | dateFormat('MM/dd') }}</span>
    <span class="container">
      {{match.tourName}}<span class="spliter">|</span>{{match.homeName}} vs {{match.awayName}}
    </span>
    <span
      v-if="ensureOdds"
      class="ensure-odds"
    >保底{{ensureOdds}}</span>
  </div>
</template>
<script>
export default {
  props: {
    match: {
      default: () => ({}),
    },
    ensureOdds: {
      default: null,
    },
  },
};
</script>
<style lang="less">
.x-program-match-item {
  display: flex;
  align-items: center;
  padding: 0 .1rem;
  line-height: .3rem;
  border-bottom: 1px solid #f4f4f4;
  span {
    display: inline-block;
  }
  .container {
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    padding-left: .06rem;
    .spliter {
      background: #e2e2e2;
      color: transparent;
      width: 0.01rem;
      margin: 0 0.08rem;
      height: 0.12rem;
      vertical-align: middle;
      margin-top: -.01rem;
    }
  }
  .sport {
    color: #ff5353;
    border: 1px solid #ff5353;
    padding: 0 .04rem;
    border-radius: .02rem;
    line-height: .2rem;
    height: .2rem;
    transform: scale(.8);
  }
  .date {
    margin-left: .06rem;
  }
  marquee {
    display: inline-block;
    vertical-align: middle;
  }
  .tour {
    margin-left: .03rem;
    // max-width: .8rem;
  }
  .teams {
    margin-left: .16rem;
    // max-width: 1rem;
  }
}
.blue .x-program-match-item {
  border-bottom: 1px solid #2e2f34;
  background: linear-gradient(to top, #303030, #343438);
  .container {
    .spliter {
      background: #444444;
    }
  }
  .sport {
    color: #53fffd;
    border: 1px solid #53fffd;
  }
}
</style>
