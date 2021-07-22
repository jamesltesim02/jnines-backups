<template>
  <v-touch
    v-if="visible"
    :class="{
      'b06-siteswither': true,
      active: active,
    }"
    @tap="updateSiteswitcher(false)"
  >
    <ul>
      <v-touch
        tag="li"
        v-for="s in sites"
        :key="s.url"
        @tap="toSite(s.url)"
      >
        <cimg :src="s.icon" />
        <div>{{s.text}}</div>
      </v-touch>
    </ul>
  </v-touch>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

const {
  /**
   * FONT_ID对照
   * 亚游: 102001011JIaThBA
   * 凯时: 1000610117Qe1Gj0 (A06)
   * 酷游: 102061011cYgTGB2 (B06 凯发电游)
   * 和记: 1010410116Ea5Hq7 (E03)
   * 永乐: 101031011k3Lx9Tf (E04)
   */
  FRONT_ID,
  PORTAL_SETTING,
} = window.NBConfig;

const {
  SITE_LINK_GAMING,
  SITE_LINK_CASINO,
} = PORTAL_SETTING || {};

export default {
  data() {
    const defaultVisible = FRONT_ID === '102061011cYgTGB2' && this.b06Siteswither;
    return {
      visible: defaultVisible,
      active: defaultVisible,
    };
  },
  computed: {
    ...mapState('portal', ['b06Siteswither']),
    sites() {
      return [
        {
          icon: require('./images/dj.png'), // eslint-disable-line global-require
          url: SITE_LINK_GAMING,
          text: this.$t('portal.b06.sites.gaming'),
        },
        {
          icon: require('./images/zr.png'), // eslint-disable-line global-require
          url: SITE_LINK_CASINO,
          text: this.$t('portal.b06.sites.casino'),
        },
      ];
    },
  },
  watch: {
    b06Siteswither(n) {
      if (n) {
        this.visible = true;
        setTimeout(() => {
          this.active = true;
        }, 2);
      } else {
        this.active = false;
        setTimeout(() => {
          this.visible = false;
        }, 200);
      }
    },
  },
  methods: {
    ...mapMutations('portal', ['updateSiteswitcher']),
    toSite(url) {
      if (!url) {
        this.$toast.center(this.$t('portal.b06.sites.noavailable'));
        return;
      }
      window.open(url);
    },
  },
};
</script>
<style lang="less">
.b06-siteswither {
  position: fixed;
  top: .44rem;
  width: 100%;
  height: calc(100% - .44rem);
  background-color: rgba(0, 0, 0, 0);
  transition: background-color .2s ease-out;
  z-index: 10;
  ul {
    padding: 0 .1rem;
    background: #141010;
    box-shadow: 0 3px 6px 0 rgba(0,0,0,0.10);
    display: flex;
    height: 0;
    transition: all .2s ease-out;
    overflow: hidden;
    li {
      background: #222020;
      border-radius: 5px;
      width: 1.15rem;
      height: .9rem;
      margin-right: .05rem;
      font-size: .12rem;
      color: #F87051;
      text-align: center;
      &:nth-child(1) img {
        margin: .23rem 0 .09rem;
        width: .23rem;
        height: .21rem;
      }
      &:nth-child(2) img {
        margin: .24rem 0 .07rem;
        width: .39rem;
        height: .22rem;
      }
    }
  }
  &.active {
    background-color: rgba(0, 0, 0, .8);
    ul {
      height: 1.1rem;
      padding: .1rem;
    }
  }
}
</style>
