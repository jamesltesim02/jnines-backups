<template>
  <div class="x-right-detail">
    <group-tab
      :value="group"
      :groups="groups"
      @change="groupChange"
    />
    <section ref="gamesContainer">
      <perfect-scrollbar ref="ps" @ps-scroll-y="scrollHanle">
        <template v-for="group in groupedMatch.groupGames">
          <div
            :key="group.key"
            class="group-holder"
            :id="group.key"
          ></div>
          <detail-item
            v-for="g in group.games"
            :class="group.key"
            :key="g.gameID"
            :expanded="g.expanded"
            :game="g"
            :match="match"
          />
        </template>
        <div
          class="blank-holder"
          :style="{
            height: `${blankHeight}px`,
          }"
        ></div>
      </perfect-scrollbar>
    </section>
  </div>
</template>
<script>
import GroupTab from './GroupTab';
import matchinfoToGroup from './matchinfoToGroup';
import DetailItem from './DetailItem';

export default {
  props: {
    match: {},
  },
  data() {
    return {
      group: null,
      groupTops: null,
      groupTopsEntries: null,
      groupSetting: false,
      groupScollingTo: null,
      psel: null,
      blankHeight: 0,
    };
  },
  computed: {
    groupedMatch() {
      return {
        ...this.match,
        groupGames: matchinfoToGroup(this.match || {}),
      };
    },
    groups() {
      const groups = this.groupedMatch.groupGames.map(({ key }) => key);
      if (!this.group) {
        [this.group] = groups;
      }
      return groups;
    },
  },
  components: {
    DetailItem,
    GroupTab,
  },
  mounted() {
    this.psel = this.$refs.ps.$el;
    this.groupScrollInit();
  },
  methods: {
    /**
     * 获取每个group分隔符在容器中的top位置
     */
    groupScrollInit() {
      const groupDoms = this.$refs.gamesContainer.querySelectorAll('.group-holder');
      const blankDom = this.$refs.gamesContainer.querySelector('.blank-holder');
      const gts = {};
      groupDoms.forEach(({ id, offsetTop }) => {
        gts[id] = offsetTop;
      });
      this.groupTops = gts;

      const entries = Object.entries(gts);
      entries.sort((e1, e2) => e1[1] - e2[1]);
      this.groupTopsEntries = entries;

      const { clientHeight } = this.psel.parentElement;
      const { offsetTop } = blankDom;
      this.blankHeight = clientHeight - offsetTop + entries[entries.length - 1][1];
    },
    /**
     * 点击tab修改分组
     */
    groupChange(group) {
      this.group = group;
      this.groupSetting = true;
      if (this.$refs.ps.$el) {
        this.psel.style.scrollBehavior = 'smooth';
        this.groupScollingTo = this.groupTops[group];
        this.psel.scrollTop = this.groupScollingTo;
      }
    },
    scrollHanle() {
      const { scrollTop } = this.psel;

      if (this.groupSetting) {
        if (this.psel.scrollTop !== this.groupScollingTo) {
          return;
        }

        this.groupScollingTo = null;
        this.psel.style.scrollBehavior = 'auto';
        this.groupSetting = false;
        return;
      }

      let groupTemp = null;
      for (let i = 0; i < this.groupTopsEntries.length; i += 1) {
        const [k, v] = this.groupTopsEntries[i];
        if (v <= scrollTop) {
          groupTemp = k;
        } else {
          break;
        }
      }
      if (groupTemp) {
        this.group = groupTemp;
      }
    },
  },
};
</script>
<style lang="less">
.x-right-detail {
  padding: 17px 0 0 10px;
  overflow: hidden;
  .x-group-tab {
    margin-right: 10px;
  }
  & > section {
    overflow: hidden;
    height: calc(100% - 43px);
    .ps {
      position: relative;
      padding-bottom: 17px;
      padding-right: 10px;
    }
  }
}
</style>
