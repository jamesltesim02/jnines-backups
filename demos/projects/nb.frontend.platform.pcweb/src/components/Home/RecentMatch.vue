<template>
  <div class="recent-match">
    <h3>
      {{$t('page.blocktitle.recent')}}
      <i>{{(matchs || []).length}}</i>
    </h3>
    <loading-bar
      full
      v-if="loading"
    />
    <no-more-bar
      full
      v-if="!hasMore"
    />
    <match-item
      v-for="m in matchs"
      :key="m.matchID"
      :match="m"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex';
import MatchItem from '@/components/Matchs/MatchItem';

export default {
  props: ['matchs', 'loading'],
  computed: {
    ...mapState('app', ['contentHeight']),
    hasMore() {
      return this.loading || (this.matchs && this.matchs.length > 0);
    },
    hmHeight() {
      if (!this.contentHeight) {
        return 'auto';
      }

      return `${this.contentHeight - 375}px`;
    },
  },
  components: {
    MatchItem,
  },
};
</script>
<style lang="less">
.recent-match {
  overflow: hidden;
  h3 {
    line-height: 35px;
    border-left: 7px solid #ff5353;
    padding-left: 15px;
    font-size: 20px;
    font-weight: normal;
    color: #b0b0b0;
    margin-bottom: 10px;
    i {
      font-size: 14px;
      color: #9b9b9b;
      display: inline-block;
      width: 22px;
      line-height: 22px;
      background: #3f3f3f;
      text-align: center;
      border-radius: 50%;
      margin-left: 12px;
      font-weight: normal;
      font-style: normal;
    }
  }
  .match-list-title {
    margin-top: -10px;
  }
  .ps {
    margin-top: 10px;
    padding: 10px 12px 40px 10px;
  }
  .icon-sport {
    display: inline-block;
  }
}
</style>
