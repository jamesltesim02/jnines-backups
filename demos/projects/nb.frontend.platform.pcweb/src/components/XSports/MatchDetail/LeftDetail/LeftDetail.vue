<template>
  <div class="x-left-detail">
    <media-block :match="match" />
    <detail-tab
      :match-state="match.matchState"
      :mid="match.matchID"
      v-model="tabName"
    />
    <tab-content
      :tab-name="tabName"
      :match="match"
    />
  </div>
</template>
<script>
import MediaBlock from './MediaBlock';
import DetailTab from './DetailTab';
import TabContent from './TabContent';

export default {
  props: {
    match: {},
  },
  data() {
    return {
      tabName: null,
    };
  },
  components: {
    MediaBlock,
    DetailTab,
    TabContent,
  },
};
</script>
<style lang="less">
.x-left-detail {
  padding: 17px 13px 0 13px;
  display: flex;
  flex-direction: column;
  .x-tab-content {
    flex-grow: 1;
    overflow: hidden;
    height: 100%;
  }
}
</style>
