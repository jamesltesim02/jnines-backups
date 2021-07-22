<template>
  <div class="sliders">
    <banner :banners="slides.banners" />
    <match-swiper
      v-if="slides.matchs && slides.matchs.length && showMatchs"
      :matchs="slides.matchs"
    />
  </div>
</template>
<script>
import { findSlide } from '@/api/pull';
import { StorageKey, AppModes } from '@/config/constants';
import { loadFromStorage, saveToStorage } from '@/utils/StorageUtil';
import Banner from './Banner';
import MatchSwiper from './MatchSwiper';

const {
  NBConfig: { APP_MODE },
} = window;

export default {
  data() {
    return {
      loading: false,
      showMatchs: APP_MODE !== AppModes.STANDALONE_LITE,
      slides: {
        banners: [],
        matchs: [],
      },
    };
  },
  components: {
    Banner,
    MatchSwiper,
  },
  async created() {
    this.slides = loadFromStorage(StorageKey.SLIDE_DATA_KEY, []);
    try {
      this.loading = true;
      const slideData = await findSlide();
      if (!slideData || !slideData.length) {
        return;
      }
      this.slides = {
        banners: [],
        matchs: [],
      };
      slideData.forEach((s) => {
        // 比赛
        if (s.matchID > 0) {
          if (s.slideMatch) {
            this.slides.matchs.push(s);
          }
          return;
        }
        // 普通banner
        this.slides.banners.push(s);
      });
      saveToStorage(StorageKey.SLIDE_DATA_KEY, this.slides);
    } catch (e) {
      console.log(e);
    } finally {
      this.loading = true;
    }
  },
};
</script>
<style lang="less">
.sliders {
  width: 3.75rem;
}
</style>
