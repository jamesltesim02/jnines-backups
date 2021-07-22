<template>
  <nav-bar>
    <div class="nav-bar-home-box flex-between">
      <v-touch class="nav-bar-home-item flex-center" :class="{ active: /^[12]?\d$/.test(showId) }" @tap="toHomePage(0)">
        {{$t('common.tabs.bets')}}
      </v-touch>
      <v-touch class="nav-bar-home-item flex-center" :class="{ active: /^[3-5]\d$/.test(showId) }" @tap="toHomePage(1)">
        {{$t('common.tabs.publish')}}
      </v-touch>
      <v-touch class="nav-bar-home-item flex-center" :class="{ active: /^[6-8]\d$/.test(showId) }" @tap="toHomePage(2)">
        {{$t('common.tabs.share')}}
      </v-touch>
    </div>
    <menu-button />
  </nav-bar>
</template>
<script>
import NavBar from '@/components/common/NavBar';
import MenuButton from '@/components/XSports/MenuButton';

export default {
  props: { id: Number },
  computed: {
    showId() {
      return /^[1-8]?\d$/.test(this.id) ? this.id : 0;
    },
  },
  components: { NavBar, MenuButton },
  methods: {
    toHomePage(id) {
      if (id === 0) {
        this.$router.replace('/xsports/1');
      } else if (id === 1) {
        this.$router.replace('/xsports/31');
      } else if (id === 2) {
        this.$router.replace('/xsports/60');
      }
    },
  },
};
</script>

<style lang="less">
.nav-bar-home-box {
  width: 2.17rem;
  margin-right: .25rem;
  .nav-bar-home-item { width: .6rem; height: 100%; font-size: .16rem; color: #2e2f34; }
  .nav-bar-home-item.active { font-size: .18rem; font-weight: bold; color: #ff5353; }
}
.black .nav-bar-home-box {
  .nav-bar-home-item { color: #bababa; }
  .nav-bar-home-item.active { color: #ff5353; }
}
.blue .nav-bar-home-box {
  .nav-bar-home-item { color: #bababa; }
  .nav-bar-home-item.active { color: #53fffd; }
}
</style>
