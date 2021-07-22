<template>
<list-page
  ref="container"
  :class="{
    'x-matchinfo': true,
    pin: pin,
    'nav-fixed': !loaded || (navVisible && !pin),
    grouped: groupTabAvailable,
  }"
  @scroll="pageScroll"
  @scrollBottom="scrollBottom"
>
  <nav-bar
    custBack
    transparent
    :opacity="opacity"
    @back="backEvent"
    slot="header"
  >
    <detail-title
      slot="content"
      :match-info="matchInfo"
    />
  </nav-bar>
  <loading-bar v-if="loading" />
  <template v-if="loaded">
    <media-block
      :matchInfo="matchInfo"
      v-model="mediaType"
      :pin.sync="pin"
    />
    <div class="x-tabs-box">
      <detail-tabs
        :match-state="matchInfo.matchState"
        :mid="mid"
        :value="tabName"
        @change="tabNameChange"
      />
      <game-group-tabs
        v-if="groupTabAvailable"
        :groups="groups"
        :value="group"
        @change="groupChange"
      />
    </div>
    <div
      class="tabs-placeholder"
      :style="{
        height: groupTabPlaceHeight
      }"
    ></div>
    <tab-content
      ref="tagContent"
      :match-info="match"
      :tab-name="tabName"
      :style="{
        minHeight: tabContentMinHeight,
        paddingBottom: tabContentPaddingBottom,
      }"
      @tStart="clearFlag"
    />
  </template>
</list-page>
</template>
<script>
import { mapState } from 'vuex';
import { findmatch } from '@/api/pull';
import gameSorter from '@/components/XSports/MatchInfo/gameSorter';
import pushoperator from '@/components/XSports/MatchInfo/pushoperator';
import DetailTitle from '@/components/XSports/MatchInfo/DetailTitle';
import DetailTabs from '@/components/XSports/MatchInfo/DetailTabs';
import GameGroupTabs from '@/components/XSports/MatchInfo/GameGroupTabs';
import TabContent from '@/components/XSports/MatchInfo/TabContent';
import MediaBlock from '@/components/XSports/MatchInfo/MediaBlock';
import matchinfoToGroup from './matchinfoToGroup';

const DETAIL_BACKGROUND = require('@/views/MatchDetail/images/detail-bg.jpg');

export default {
  props: ['mid', 'sno'],
  data() {
    return {
      loading: false,
      loaded: false,
      tabName: null,
      group: null,
      matchInfo: null,
      pinTab: false,
      pin: false,
      mediaType: 0,
      // doms
      container: null,
      // height
      mediaBlockHeight: 0,
      // nav控制相关
      navHeight: 0,
      navVisible: false,
      groupTops: null,
      scrollTop: 0,
      opacity: 0,
      stopUpdate: false,
      stopUpdateTimer: null,
      tabContentMinHeight: '0px',
      tabContentPaddingBottom: '0px',
    };
  },
  computed: {
    ...mapState('app', ['matchListStyle', 'lastPath', 'tabHeight']),
    detailBg() {
      return DETAIL_BACKGROUND;
    },
    liveUrl() {
      if (!this.loaded) {
        return null;
      }
      return this.matchInfo.matchState === 1
        ? this.matchInfo.matchVideo
        : null;
    },
    match() {
      return {
        ...this.matchInfo,
        groupGames: matchinfoToGroup(this.matchInfo || {}),
      };
    },
    groups() {
      const groups = this.match.groupGames.map(({ key }) => key);
      return groups;
    },
    groupTabAvailable() {
      return this.tabName === 'betting' && this.groups && this.groups.length > 1;
    },
    groupTabPlaceHeight() {
      if (this.pin) {
        return `${2.6 + (this.groupTabAvailable ? 0.3 : 0)}rem`;
      }
      return this.groupTabAvailable ? '0.7rem' : '0.4rem';
    },
  },
  watch: {
    pin() {
      this.container.scorllTo(0);
      this.$nextTick(() => {
        this.groupScrollInit();
      });
      this.setTabContentMinHeight();
    },
    loaded() {
      this.setTabContentMinHeight();
    },
    tabHeight() {
      this.setTabContentMinHeight();
    },
    groupTabAvailable() {
      this.setTabContentMinHeight();
    },
    groupTabPlaceHeight() {
      this.setTabContentMinHeight();
    },
    groups() {
      this.stopUpdate = false;
      this.pageScroll({
        target: {
          scrollTop: this.scrollTop,
        },
      });
    },
  },
  components: {
    DetailTitle,
    DetailTabs,
    GameGroupTabs,
    TabContent,
    MediaBlock,
  },
  created() {
    this.queryMatchInfo();
  },
  mounted() {
    this.container = this.$refs.container;
    this.setTabContentMinHeight();
  },
  methods: {
    async queryMatchInfo() {
      try {
        this.loading = true;
        // 查询比赛信息
        const matchInfo = await findmatch({
          matchID: this.mid,
          sportID: this.sno,
          versionNum: 1,
        });

        // 如果没有查询到比赛
        if (!matchInfo) {
          this.$toast(this.$t('message.noMatchinfo'));
          this.$router.replace('/xsports/1');
          return;
        }

        if (matchInfo.games && matchInfo.games.length) {
          // 对game排序
          matchInfo.games = gameSorter(matchInfo.games);
          matchInfo.games.forEach((g) => {
            g.expanded = true;
          });
        }

        matchInfo.videoId = (matchInfo.betradarKey || '').split(':').pop();

        this.matchInfo = matchInfo;
        this.$regpush(
          {
            Matchs: [
              {
                Mids: [this.mid],
                GameTypes: [-1],
              },
            ],
          },
          (msg) => {
            pushoperator(this, msg);
          },
        );
        this.loaded = true;
      } finally {
        this.loading = false;
      }
    },
    pageScroll({ target: { scrollTop } }) {
      this.scrollTop = scrollTop;
      this.navScroll(scrollTop);
      if (!this.stopUpdate) {
        this.groupScroll(scrollTop);
      }
      this.navOpacity(scrollTop);
    },
    navScroll(scrollTop) {
      if (!this.pin) {
        const nav = this.container.$el.querySelector('.page-header');
        const mediaBlock = this.container.$el.querySelector('.x-media-block');
        const mediaHeight = mediaBlock ? mediaBlock.clientHeight : 1000;
        const navHeight = nav ? nav.clientHeight : 0;
        this.navVisible = scrollTop >= (mediaHeight - navHeight - 1);
      }
    },
    navOpacity(scrollTop) {
      const nav = this.container.$el.querySelector('.page-header');
      const mediaBlock = this.container.$el.querySelector('.x-media-block');
      const mediaHeight = mediaBlock ? mediaBlock.clientHeight : 1000;
      const navHeight = nav ? nav.clientHeight : 0;
      const maxHeight = mediaHeight - navHeight;
      const minHeight = maxHeight - navHeight;
      if (this.pin || scrollTop < minHeight) {
        this.opacity = 0;
      } else if (scrollTop > maxHeight) {
        this.opacity = 1;
      } else if (navHeight) {
        const percent = (scrollTop - minHeight) / navHeight;
        this.opacity = parseInt(percent * 1000, 10) / 1000;
      }
    },
    setTabContentMinHeight() {
      this.tabContentPaddingBottom = '0px';
      setTimeout(() => {
        const nav = this.container.$el.querySelector('.page-header');
        const foot = this.container.$el.querySelector('.page-footer');
        const content = this.container.$el.querySelector('.page-content');
        const blank = this.container.$el.querySelector('.tabs-placeholder');
        const contentBottom = content ? parseFloat(window.getComputedStyle(content).paddingBottom) : 0;
        const footBottom = foot ? parseFloat(window.getComputedStyle(foot).paddingBottom) : 0;
        const blankHeight = blank ? parseFloat(window.getComputedStyle(blank).height) : 0;
        const navHeight = nav ? nav.clientHeight : 0;
        let height = window.innerHeight - footBottom - contentBottom - blankHeight;
        height -= !this.pin ? navHeight : 0;
        this.tabContentMinHeight = `${height}px`;
        this.groupScrollInit();
        this.setTabContentPaddingBottom(height);
      }, 100);
    },
    setTabContentPaddingBottom(height) {
      if (!this.groupTabAvailable) {
        return;
      }
      const tops = Object.entries(this.groupTops);
      tops.sort((a, b) => b[1] - a[1]);
      const clsName = tops[0][0];
      const boxDom = this.container.$el.querySelector('.x-match-detail-games');
      const boxPadTop = boxDom ? parseFloat(window.getComputedStyle(boxDom).paddingTop) : 0;
      const boxPadBtm = boxDom ? parseFloat(window.getComputedStyle(boxDom).paddingBottom) : 0;
      let padHeight = height - boxPadTop - boxPadBtm;
      const gameCalDoms = this.container.$el.querySelectorAll(`.detail-game-item.${clsName}`);
      for (let i = 0; i < gameCalDoms.length; i += 1) {
        const v = gameCalDoms[i];
        padHeight -= parseFloat(window.getComputedStyle(v).marginBottom) + v.clientHeight;
      }
      this.tabContentPaddingBottom = `${padHeight > 0 ? (padHeight + 6) : 0}px`;
    },
    groupScrollInit() {
      if (!this.groupTabAvailable) {
        return;
      }
      const groupDoms = this.container.$el.querySelectorAll('.group-holder');
      const nav = this.container.$el.querySelector('.page-header');
      const mediaBlock = this.container.$el.querySelector('.x-media-block');
      const gameDom = this.container.$el.querySelector('.detail-game-item');
      const gameMargin = gameDom ? parseFloat(window.getComputedStyle(gameDom).marginBottom) : 0;
      const mediaHeight = mediaBlock ? mediaBlock.clientHeight : 0;
      const navHeight = nav ? nav.clientHeight : 0;
      const holderHeight = !this.pin ? mediaHeight - navHeight : 0;
      const gts = {};
      groupDoms.forEach(({ id, offsetTop }) => {
        gts[id] = holderHeight + offsetTop - gameMargin;
      });
      this.groupTops = gts;
    },
    groupScroll(scrollTop) {
      if (!this.groupTabAvailable) {
        return;
      }
      if (!this.groupTops) {
        this.groupScrollInit();
      }
      let groupTemp = null;
      const tops = Object.entries(this.groupTops);
      tops.sort((e1, e2) => e1[1] - e2[1]);
      for (let i = 0; i < tops.length; i += 1) {
        const [k, v] = tops[i];
        if (v <= scrollTop + 1) {
          groupTemp = k;
        } else {
          break;
        }
      }
      if (groupTemp) {
        this.group = groupTemp;
      }
    },
    tabNameChange(tabName) {
      if (this.scrollTop > 0) {
        this.container.scorllTo(0);
        setTimeout(() => {
          this.group = this.groups[0];
          this.tabName = tabName;
        }, 300);
      } else {
        this.group = this.groups[0];
        this.tabName = tabName;
      }
    },
    groupChange(group) {
      this.groupScrollInit();
      this.stopUpdate = true;
      this.container.scorllTo(this.groupTops[group]);
      this.group = group;
      clearTimeout(this.stopUpdateTimer);
      this.stopUpdateTimer = setTimeout(() => {
        this.stopUpdate = false;
      }, 2500);
    },
    clearFlag() {
      clearTimeout(this.stopUpdateTimer);
      this.stopUpdate = false;
    },
    backEvent() {
      if (this.mediaType !== 0) {
        this.mediaType = 0;
        return;
      }
      this.$router.replace(this.lastPath || '/xsports/1');
    },
    scrollBottom() {
      this.$refs.tagContent.scrollBottom();
    },
  },
  beforeDestroy() {
    this.$regpush({}, () => {});
    clearTimeout(this.stopUpdateTimer);
  },
};
</script>
<style lang="less">
.x-matchinfo {
  .page-header {
    .nav-bar {
      position: relative;
      z-index: 2;
    }
    .x-media-block {
      position: relative;
      z-index: 1;
    }
  }
  .no-more, .loading-bar {
    margin-top: .64rem;
  }
  .tabs-placeholder { display: none; }
  .x-tabs-box { position: static; }
  &.nav-fixed {
    .nav-bar .icon-arrow path { fill: #fff; }
    .tabs-placeholder { display: block; }
    .x-tabs-box {
      position: fixed;
      z-index: 3;
      width: 100%;
      top: .44rem;
    }
  }
  .page-header .x-media-block, .page-content { margin-top: -.44rem; }
  &.pin {
    .x-media-block, .x-tabs-box {
      position: fixed;
      z-index: 3;
      width: 100%;
    }
    .x-media-block { top: 0; }
    .x-tabs-box { top: 2.2rem; }
    .tabs-placeholder { display: block; }
  }
}
</style>
