<template>
  <div :class="{
    'x-sports-filter-list':  true,
    'checked-all': matchFilter.all,
  }">
    <ul class="sports">
      <v-touch
        tag="li"
        @tap="checkAll"
      >
        <div class="icon-container"><icon-xsports /></div>
        <div class="name">全部</div>
      </v-touch>
      <v-touch
        tag="li"
        v-for="sno in sports"
        :key="sno"
        :class="{
          checked: matchFilter.sports.includes(sno)
        }"
        @tap="checkSport(sno)"
      >
        <div class="icon-container"><icon-xsports :sno="sno" /></div>
        <div class="name">{{$t(`xsports.sports.${sno}`)}}</div>
      </v-touch>
    </ul>
    <ul class="tours">
      <v-touch
        tag="li"
        v-for="t in tours"
        :key="t.id"
        :class="{
          checked: (
            matchFilter.tours.includes(t.id)
            || matchFilter.sports.includes(t.sportID)
          )
        }"
        @tap="checkTour(t.id)"
      >
        <div class="icon-container">
          <span>
            <cimg
              remote
              :src="`logo/${t.logo}`"
            />
          </span>
        </div>
        <div class="name">{{ t.abbr || t.name }}</div>
      </v-touch>
    </ul>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { without } from 'lodash';
import { findhot } from '@/api/pull';
import IconXsports from '@/components/XSports/SportsFilterList/icons/IconXsports';
// import IconTour from '@/components/XSports/SportsFilterList/icons/IconTour';

/*
const availableTours = [
  {
    tourId: 1,
    tourkey: 1,
    name: 'NBA',
    sportId: 11,
  },
  {
    tourId: 2,
    tourkey: 2,
    name: '中超',
    sportId: 10,
  },
  {
    tourId: 3,
    tourkey: 3,
    name: '篮球世界杯',
    sportId: 10,
  },
  {
    tourId: 4,
    tourkey: 4,
    name: '西甲',
    sportId: 10,
  },
  {
    tourId: 5,
    tourkey: 5,
    name: '欧冠',
    sportId: 10,
  },
  {
    tourId: 6,
    tourkey: 6,
    name: '英超',
    sportId: 10,
  },
  {
    tourId: 7,
    tourkey: 7,
    name: '意甲',
    sportId: 10,
  },
  {
    tourId: 8,
    tourkey: 8,
    name: '亚冠',
    sportId: 10,
  },
  {
    tourId: 9,
    tourkey: 9,
    name: 'CBA',
    sportId: 11,
  },
  {
    tourId: 10,
    tourkey: 10,
    name: '欧联杯',
    sportId: 11,
  },
  {
    tourId: 11,
    tourkey: 11,
    name: '德甲',
    sportId: 10,
  },
  {
    tourId: 12,
    tourkey: 12,
    name: '法甲',
    sportId: 11,
  },
  {
    tourId: 13,
    tourkey: 13,
    name: '日职',
    sportId: 11,
  },
  {
    tourId: 14,
    tourkey: 14,
    name: '欧洲杯预选赛',
    sportId: 11,
  },
];
*/
export default {
  data() {
    return {
      tours: [],
    };
  },
  computed: {
    ...mapState('xsports', ['matchFilter']),
    sports: () => (
      [
        // 10 = Soccer 足球
        10,
        // 11 = Basketball 篮球
        11,
        // 12 = Tennis 网球 (暂不支持) *
        12,
      ]
    ),
  },
  components: {
    IconXsports,
    // IconTour,
  },
  created() {
    this.queryHotTours();
  },
  methods: {
    ...mapMutations('xsports', ['setMatchFilter']),
    async queryHotTours() {
      this.tours = await findhot();
    },
    checkAll() {
      this.setMatchFilter({ all: true });
    },
    checkSport(sno) {
      const { sports } = this.matchFilter;

      if (sports.includes(sno)) {
        if (sports.length === 1) {
          return;
        }
        this.setMatchFilter({
          all: false,
          sports: without(sports, sno),
        });
        return;
      }

      this.setMatchFilter({
        all: false,
        sports: [...sports, sno],
      });
    },
    checkTour(tid) {
      const { tours } = this.matchFilter;
      if (tours.includes(tid)) {
        if (tours.length === 1) {
          return;
        }
        this.setMatchFilter({
          all: false,
          tours: without(tours, tid),
        });
        return;
      }
      this.setMatchFilter({
        all: false,
        tours: [...tours, tid],
      });
    },
  },
};
</script>
<style lang="less">
.x-sports-filter-list {
  padding: .1rem;
  font-size: .12rem;
  ul {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-row-gap: .1rem;
    grid-column-gap: .05rem;
    margin-bottom: .2rem;
    li {
      height: .84rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #fcfcfc;
      border-radius: 4px;
      opacity: .3;
      transition: opacity .25s ease-out;
      .icon-container {
        display: flex;
        height: .38rem;
        align-items: center;
        justify-content: center;
        span {
          display: block;
          width: .26rem;
          height: .26rem;
          overflow: hidden;
          text-align: center;
          img {
            width: .26rem;
          }
        }
      }
      .name {
        letter-spacing: -0.3px;
        margin-top: .05rem;
        font-size: .12rem;
      }
      &.checked {
        opacity: 1;
      }
    }
  }
  &.checked-all ul li {
    opacity: 1;
  }
}
.blue .x-sports-filter-list ul li {
  background: #2e2f34;
  color: #ecebeb;
}
</style>
