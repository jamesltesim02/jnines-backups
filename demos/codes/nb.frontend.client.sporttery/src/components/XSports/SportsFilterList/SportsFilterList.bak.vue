<template>
  <ul class="x-sports">
    <v-touch
      tag="li"
      :class="{ active: isActiveAll }"
      @tap="setActiveAll"
    >
      <div class="icon-container"><icon-xsports /></div>
      <div class="name">全部</div>
    </v-touch>
    <v-touch
      tag="li"
      v-for="s in sports"
      :key="s.sno"
      :class="{ active: s.available && (isActiveAll || activeSports.includes(s.sno)) }"
      @tap="toggleActive(s)"
    >
      <div class="icon-container"><icon-xsports :sno="s.sno" /></div>
      <div class="name">{{$t(`xsports.sports.${s.sno}`)}}</div>
    </v-touch>
  </ul>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { SportsList } from '@/config/constants';
import IconXsports from '@/views/XSports/icons/IconXsports';

export default {
  data() {
    return {
      availables: [],
      disableds: [],
      sports: [],
    };
  },
  computed: {
    ...mapState('xsports', ['activeSports']),
    isActiveAll() {
      return this.activeSports.length === this.availables.length;
    },
    avalebleSports() {
      return this.availables.map(({ sno }) => sno);
    },
  },
  created() {
    const visbles = SportsList.filter(({ visible }) => visible);
    this.availables = visbles
      .filter(({ available }) => available)
      .sort((s1, s2) => s1.sno - s2.sno);
    this.disableds = visbles
      .filter(({ available }) => !available)
      .sort((s1, s2) => s1.sno - s2.sno);
    this.sports = [...this.availables, ...this.disableds];
  },
  components: { IconXsports },
  methods: {
    ...mapMutations('xsports', ['toggleActiveSports', 'setActiveSports']),
    setActiveAll() {
      this.setActiveSports(this.avalebleSports);
    },
    toggleActive({ sno, available }) {
      if (!available) {
        return;
      }
      if (this.activeSports.length === this.avalebleSports.length) {
        this.setActiveSports([sno]);
        return;
      }
      this.toggleActiveSports(sno);
    },
  },
};
</script>
<style lang="less">
.x-sports {
  display: flex;
  flex-wrap: wrap;
  padding: 0 .1rem;
  margin-top: .1rem;
  text-align: center;
  li {
    padding-top: .1rem;
    border-radius: 4px;
    background: #fcfcfc;
    color: #333339;
    width: .84rem;
    height: .84rem;
    margin-right: .06rem;
    margin-top: .1rem;
    opacity: .3;
    transition: opacity .25s ease-out;
    &:nth-child(4n) {
      margin-right: 0;
    }
    &.active {
      opacity: 1;
    }
    &.hidden {
      display: none;
    }
    .icon-container {
      display: flex;
      height: .38rem;
      align-items: center;
      justify-content: center;
    }
    .name {
      letter-spacing: -0.3px;
      margin-top: .05rem;
      font-size: .12rem;
    }
  }
}
.blue .x-sports li {
  background: #2e2f34;
  color: #ecebeb;
}
</style>
