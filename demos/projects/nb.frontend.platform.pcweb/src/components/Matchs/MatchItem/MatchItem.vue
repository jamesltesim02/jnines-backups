<template>
  <div class="match-item">
    <match-info :match="match" />
    <list-options :match="match" />
  </div>
</template>
<script>
import ListOptions from './ListOptions';
import MatchInfo from './MatchInfo';

export default {
  props: ['match'],
  components: {
    MatchInfo,
    ListOptions,
  },
};
</script>
<style lang="less">
.match-item {
  position: relative;
  margin-bottom: 10px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 4px 0 rgba(37, 37, 37, 0.5);
  background-image: linear-gradient(to bottom, #29282e, #2b2a31);
  display: flex;
  * {
    position: relative;
    z-index: 2;
  }
  .match-info {
    width: 33.33%;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      display: block;
      width: 2px;
      height: 100%;
      right: 0;
      top: 0;
      background: linear-gradient(to top, #3c3b43, #2b2a31);
      opacity: .5;
      transition: all .35s ease-out;
    }
  }
  .list-options {
    width: 66.67%;
  }
  &:hover {
    background: linear-gradient(94deg, #7a3636, #29292e);
  }
  &::before {
    content: "";
    position: absolute;
    z-index: 0;
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    top: 1px;
    left: 1px;
    background-image: linear-gradient(to bottom, #29282e, #2b2a31);
    border: 1px solid transparent;
    border-radius: 6px;
  }
}
</style>
