<template>
  <div
    class="x-sports-chooser"
    @click.self="setSelected"
    v-if="sportsChoosing"
  >
    <div
      @click.self="setSelected"
      class="choose-panel"
    >
      <div
        :class="{
          chooser: true,
          active: active,
        }"
      >
        <i class="triangle"></i>
        <ul>
          <li
            :class="{
              active: selected.length === sports.length,
            }"
            @click.stop="toggleActiveSports"
          >
            <div class="icon">
              <icon-xsports />
            </div>
            <div class="name">全部</div>
          </li>
          <li
            v-for="s in sports"
            :key="s.sno"
            :class="{
              active: selected.includes(s.sno)
            }"
            @click.stop="toggleActiveSports(s.sno)"
          >
            <div class="icon">
              <icon-xsports :sno="s.sno" />
            </div>
            <div class="name">{{$t(`xsports.sports.${s.sno}`)}}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { isEqual } from 'lodash';
import { mapState, mapMutations } from 'vuex';
import { SportsList } from '@/config/constants';
import IconXsports from './icons/IconXsports';

export default {
  data() {
    return {
      sports: [],
      selected: [],
      active: false,
    };
  },
  computed: {
    ...mapState('xsports', ['sportsChoosing', 'activeSports']),
  },
  components: {
    IconXsports,
  },
  watch: {
    sportsChoosing(n) {
      if (n) {
        this.$nextTick(() => {
          this.active = true;
        });
      }
    },
  },
  created() {
    this.sports = SportsList.filter(({ visible }) => visible).sort((s1, s2) => {
      if (s1.available === s2.available) {
        // 篮球世界杯活动, 赛完后换成下一行排序代码
        // return s1.sno === 11 ? -1 : s1.sno - s2.sno;

        return s1.sno - s2.sno;
      }

      return s1.available ? -1 : 1;
    });
    this.selected = [...this.activeSports];
  },
  methods: {
    ...mapMutations('xsports', ['setSportsChoosing', 'setActiveSports']),
    toggleActiveSports(sport) {
      const { selected, sports } = this;

      if (typeof sport !== 'number') {
        this.selected = sports.map(({ sno }) => sno);
        return;
      }

      if (selected.length === sports.length) {
        this.selected = [sport];
        return;
      }

      if (!selected.includes(sport)) {
        selected.push(sport);
        return;
      }
      if (selected.length <= 1) {
        return;
      }
      selected.splice(selected.findIndex(sno => sno === sport), 1);
    },
    setSelected() {
      if (!isEqual(this.selected, this.activeSports)) {
        // 篮球世界杯活动, 赛完后换成下一行排序代码
        // this.selected.sort((sno1, sno2) => {
        //   // 篮球世界杯活动, 赛完后直接删除 start
        //   if (sno1 === 11) {
        //     return -1;
        //   }
        //   if (sno2 === 11) {
        //     return 1;
        //   }
        //   // 篮球世界杯活动, 赛完后直接删除 end

        //   return sno1 - sno2;
        // });
        this.selected.sort((sno1, sno2) => sno1 - sno2);

        this.setActiveSports([...this.selected]);
      }
      this.active = false;
      setTimeout(() => {
        this.setSportsChoosing(false);
      }, 250);
    },
  },
};
</script>
<style lang="less">
.x-sports-chooser {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 6;
  .choose-panel {
    position: relative;
    width: 100%;
    height: 100%;
    max-width: 1440px;
    z-index: 1;
    margin: 0 auto;
  }
  .chooser {
    position: absolute;
    top: 72px;
    left: 250px;
    background: #fff;
    box-shadow: 0 10px 20px -1px rgba(141, 141, 141, 0.5);
    border: solid 1px #e5e5e5;
    border-radius: 6px;
    font-size: 12px;
    color: #333339;
    letter-spacing: -0.3px;
    text-align: center;
    transform: scale(0);
    opacity: 0;
    transform-origin: -20px 28px;
    transition: all 0.25s ease-out;
    &.active {
      transform: none;
      opacity: 1;
    }
    .triangle {
      position: absolute;
      display: block;
      left: -10px;
      top: 28px;
      width: 11px;
      height: 11px;
      z-index: 2;
      &::before, &::after {
        position: absolute;
        content: "";
        display: block;
        top: 0;
        left: 0;
        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;
        border-right: 9px solid #e5e5e5;
      }
      &::after {
        left: 1px;
        border-right: 9px solid #fff;
      }
    }
    ul {
      display: grid;
      padding: 13px;
      grid-template-columns: repeat(4, 84px);
      grid-row-gap: 13px;
      grid-column-gap: 5px;
      li {
        flex-direction: column;
        border-radius: 4px;
        background-color: #f5f5f5;
        height: 84px;
        padding-top: 10px;
        cursor: pointer;
        opacity: 0.3;
        transition: opacity 0.25s ease-out;
        &.active {
          opacity: 1;
        }
      }
    }
    .icon {
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .name {
      margin-top: 5px;
    }
  }
}

.dark .x-sports-chooser {
  .chooser {
    background-color: #3b3a41;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.3);
    border-color: #3d3c43;
    color: #ecebeb;
    .triangle {
      &::before {
        border-right-color: #3d3c43;
      }
      &::after {
        border-right-color: #3b3a41;
      }
    }
    ul li {
      background-color: #46454c;
      .icon-xsport-10 {
        background: #B8B8BA;
        border-radius: 50%;
      }
    }
  }
}
</style>
