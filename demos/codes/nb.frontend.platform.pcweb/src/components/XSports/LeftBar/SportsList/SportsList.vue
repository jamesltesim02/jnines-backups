<template>
  <div class="x-sports-list">
    <header>
      <h4 @click="showAll">所有体育赛事</h4>
      <div class="sports-filter">
        <button
          @click="setSportsChoosing(true)"
          :class="{ active: sportsChoosing }"
        >筛选</button>
      </div>
    </header>
    <div class="sports-container">
      <perfect-scrollbar>
        <ul class="sports">
          <li
            v-for="asno in sports"
            :key="asno"
            :class="{
              active: asno === sno,
              expanded: asno === expandedSno,
              'tour-actived': !!mid,
              disabled: !sportCounts[asno]
            }"
          >
            <div
              class="sports-item"
              @click="toggleSno(asno)"
            >
              <div :class="['icon-container', `icon-${asno}`]">
                <span><icon-xsports :sno="asno" /></span>
              </div>
              <div class="name">
                <rolling-text
                  :text="$t(`xsports.sports.${asno}`)"
                  :max-length="12"
                  scrollamount="3"
                />
              </div>
              <div class="count">
                <span :class="[(sportCounts[asno] || 0) ? '' : 'zero-count']">{{sportCounts[asno] || 0}}</span>
              </div>
            </div>
            <div
              class="tours-container"
              :style="{
                height: `${expandedSno === asno ? ((stours[asno] || []).length * 40) : 0}px`,
              }"
            >
              <ul
                class="tours"
                v-if="(stours[asno] || []).length && asno === sno"
              >
                <li
                  v-for="(t, i) in stours[asno]"
                  :key="i"
                  :class="{ active: t.tid === mid }"
                  @click="$emit('update:mid', t.tid)"
                >
                  <rolling-text
                    class="tname"
                    :text="t.tn"
                    :max-length="20"
                    scrollamount="3"
                  />
                  <span class="tcount">{{t.num}}</span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </perfect-scrollbar>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import appConfig from '@/config/business.config';
import { countByTid, matchCountBySport } from '@/api/pull';
import IconXsports from './icons/IconXsports';

export default {
  props: {
    sno: {
      default: null,
    },
    mid: {
      default: null,
    },
  },
  data() {
    return {
      sports: [],
      stours: {},
      sportCounts: {},
      delayRefreshTimer: null,
      expandedSno: null,
    };
  },
  computed: {
    ...mapState('xsports', ['sportsChoosing', 'activeSports']),
  },
  components: {
    IconXsports,
  },
  watch: {
    activeSports: 'startQueryCount',
  },
  mounted() {
    this.startQueryCount();
  },
  methods: {
    ...mapMutations('xsports', ['setSportsChoosing']),
    startQueryCount() {
      this.sports = [...this.activeSports].sort((sno1, sno2) => sno1 - sno2);

      this.querySportCount();
      if (appConfig.matchsReloadTime) {
        this.delayRefreshTimer = setInterval(this.querySportCount.bind(this), appConfig.matchsReloadTime);
      }
    },
    async querySportCount() {
      const counts = await matchCountBySport();
      if (this.sno) {
        this.stours[this.sno] = await countByTid({ sportID: this.sno });
      }
      if (counts && counts.length) {
        const sc = {};
        counts.forEach(({ matNum, sportID }) => {
          sc[sportID] = matNum;
        });
        this.sportCounts = sc;
        this.sports.sort((sno1, sno2) => {
          const c1 = sc[sno1] || 0;
          const c2 = sc[sno2] || 0;

          // 篮球世界杯活动, 赛完后直接删除 start
          // if (sno1 === 11) {
          //   return -1;
          // }
          // if (sno2 === 11) {
          //   return 1;
          // }
          // 篮球世界杯活动, 赛完后直接删除 end

          if ((!c1 && !c2) || (c1 && c2)) {
            return sno1 - sno2;
          }

          return Math.min(Math.max(-1, c2 - c1), 1);
        });
      }
    },
    async toggleSno(sno) {
      if (this.expandedSno === sno) {
        this.$emit('update:mid', null);
        this.expandedSno = null;
        return;
      }
      if (this.sportCounts[sno] > 0) {
        this.stours[sno] = await countByTid({ sportID: sno });
        this.expandedSno = sno;
        this.$emit('update:sno', sno);
        this.$emit('update:mid', null);
      }
    },
    showAll() {
      this.expandedSno = null;
      this.$emit('update:sno', null);
      this.$emit('update:mid', null);
    },
  },
};
</script>
<style lang="less">
.x-sports-list {
  color: #2e2f34;
  transition: all .25s ease-out;
  header {
    padding: 0 15px 8px 18px;
    display: flex;
    h4 {
      font-weight: bolder;
      font-size: 16px;
      flex-grow: 1;
      cursor: pointer;
      transition: all .25s ease-out;
      &:hover {
        color: #ff5353;
      }
    }
    .sports-filter {
      width: 38px;
      button {
        font-size: 12px;
        letter-spacing: -0.25px;
        color: hsl(0, 0%, 56%);
        border-radius: 10.5px;
        border: solid 1px #ecebeb;
        transition: all .25s ease-out;
        white-space: nowrap;
      }
      button.active,
      button:hover {
        color: #fff;
        background: #ff5353;
        border-color: #ff5353;
      }
    }
  }
  .sports-container {
    overflow: hidden;
    height: calc(100% - 29px);
  }
  .sports {
    padding: 10px 15px 0 28px;
    & > li:last-child {
      border-bottom: 0;
    }
    .sports-item {
      position: relative;
      display: flex;
      align-items: center;
      height: 60px;
      border-bottom: 2px solid rgba(236, 235, 235, .43);
      cursor: pointer;
      transition: all .25s ease-out;
      &::before {
        content: "";
        position: absolute;
        height: 2px;
        bottom: -2px;
        left: 0;
        background: #ff5353;
        width: 0;
        transition: all .25s ease-out;
      }
    }
    & > li.active .sports-item,
    & > li .sports-item:hover {
      color: #ff5353;
      &::before {
        width: 100%;
      }
    }

    & > li.expanded .sports-item::before,
    & > li.expanded .sports-item:hover::before {
      width: 0;
    }

    & > li.disabled .sports-item {
      color: #2e2f34;
      cursor: default;
      &:hover::before {
        width: 0;
      }
    }

    .icon-container {
      width: 40px;
      span {
        display: flex;
        width: 40px;
        height: 40px;
        background: #fff;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        transition: all .25s ease-out;
      }
    }
    .name {
      flex-grow: 1;
      padding-left: 10px;
    }
    .count {
      width: 26px;
      span {
        display: block;
        font-size: 11px;
        background: #ecebeb;
        line-height: 25px;
        width: 26px;
        text-align: center;
        color: #3a3a3a;
        border-radius: 5px;
        &.zero-count {
          color: #bababa;
        }
      }
    }
  }
  .tours-container {
    overflow: hidden;
    transition: all .25s ease-out;
  }
  .tours li {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    font-size: 12px;
    white-space: nowrap;
    cursor: pointer;
    padding-left: 50px;
    .tname {
      flex-grow: 1;
      padding-right: 10px;
      transition: all .25s ease-out;
    }
    &.active .tname,
    &:hover .tname {
      color: #ff5353;
    }
    .tcount {
      display: block;
      background: #ecebeb;
      line-height: 20px;
      width: 20px;
      text-align: center;
      border-radius: 5px;
    }
  }
}

.dark .x-sports-list {
  color: #ddd;
  header {
    h4:hover {
      color: #53fffd;
    }
    .sports-filter {
      button {
        color: #909090;
        border-color: #4f5155;
      }
      button.active,
      button:hover {
        color: #fff;
        background: #53fffd;
        border-color: #53fffd;
      }
    }
  }
  .icon-container {
    span {
      background: #34333c;
    }
    &.icon-10 {
      span img {
        background: #d8d8d8;
        border-radius: 50%;
      }
    }
  }
  .sports {
    .sports-item {
      border-color: #3a393f;
      &::before {
        background: #53fffd;
      }
    }
    & > li.active .sports-item,
    & > li .sports-item:hover {
      color: #53fffd;
    }

    & > li.disabled .sports-item {
      color: #ddd;
      cursor: default;
      &:hover::before {
        width: 0;
      }
    }
    .count span {
      background-color: #36383d;
      color: #dddddd;
      &.zero-count {
        color: #bababa;
      }
    }
    .tours li {
      &.active .tname,
      &:hover .tname {
        color: #53fffd;
      }
      .tcount {
        background-color: #36383d;
        color: #dddddd;
      }
    }
  }
}
</style>
