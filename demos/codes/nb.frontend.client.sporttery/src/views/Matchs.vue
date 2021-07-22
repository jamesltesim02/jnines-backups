<template>
  <list-page class="matchs" @scrollBottom="toBottomFun" v-if="!horizScreen" >
    <match-list-head
      :sno="sno"
      :multitype="multitype"
      :state.sync="filterState"
      slot="header"
    />
    <blockade v-if="/^8{3}$/.test(sno)" />
    <match-list
      v-else
      :sno="sno"
      ref="matchList"
      :filter-state="filterState"
      :show-date="filterState.state === 0"
    />
  </list-page>
  <div class="matchs-horiz" v-else>
    <div class="matchs-horiz-left">
      <match-list-head
        :sno="sno"
        :multitype="multitype"
        :state.sync="filterState"
      />
      <transition name="match-item" v-if="horizScreen" >
        <div class="match-list-ad-box">
          <v-touch tag="img" class="match-list-ad"
            v-if="!!adObject && horizScreen"
            :src="adObject.img"
            @tap="toUrl(adObject.url)"
          />
        </div>
      </transition>
    </div>
    <list-page class="matchs-horiz-right" @scrollBottom="toBottomFun" >
      <blockade v-if="/^8{3}$/.test(sno)" />
      <match-list
        v-else
        :sno="sno"
        :filter-state="filterState"
        :show-date="filterState.state === 0"
        ref="matchList"
      />
    </list-page>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { openInBrowser } from '@/utils/app/AppUtils';
import ListPage from '@/components/common/ListPage';
import Blockade from '@/components/Matchs/Blockade';
import MatchList from '@/components/Matchs/MatchList';
import MatchListHead from '@/components/Matchs/MatchListHead';

export default {
  props: {
    sno: { default: 10 },
    multitype: { default: 0 },
  },
  data() {
    return {
      filterState: { state: 0, count: 0 },
    };
  },
  computed: {
    ...mapState('app', ['userinfo', 'horizScreen', 'adObject']),
  },
  watch: {
    sno() {
      if (this.userinfo && this.userinfo.token) {
        this.transferToNB();
      }
    },
    multitype(n) {
      this.updateMultType(n);
      if (this.userinfo && this.userinfo.token) {
        this.transferToNB();
      }
    },
  },
  created() {
    this.updateMultType(this.multitype);
  },
  components: {
    ListPage,
    Blockade,
    MatchList,
    MatchListHead,
  },
  methods: {
    ...mapMutations('app', ['updateMultType']),
    ...mapActions('app', ['transferToNB']),
    toUrl(url) {
      if (/^https?:\/\//i.test(url)) {
        openInBrowser(url);
      } else {
        this.$router.push(url);
      }
    },
    toBottomFun() {
      if (!/^[5-9]\d{2}$/.test(this.sno)) {
        this.$refs.matchList.nextPage();
      }
    },
  },
  mounted() {
    if (this.userinfo && this.userinfo.token) {
      this.transferToNB();
    }
  },
};
</script>

<style lang="less">
.matchs-horiz-left { width: 3.75rem; float: left; }
.matchs-horiz-right { padding-top: .05rem; float: right; }
.horizontal .matchs-horiz { width: 100%; height: 100%; }
.match-item-enter-active, .match-item-leave-active { transition: all .25s linear; }
.match-item-enter, .match-item-leave-active { transform: scaleY(0); }
.match-list-ad-box {
  width: 3.52rem;
  margin: .1rem auto;
  .match-list-ad { width: 100%; box-shadow: 0 10px 20px 0 rgba(236, 236, 236, 0.5); }
}
.black .match-list-ad { box-shadow: 0 10px 20px 0 rgba(37, 37, 37, 0.5); }
</style>
