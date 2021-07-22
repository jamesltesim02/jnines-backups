<template>
<list-page class="home">
  <home-nav slot="header" />
  <sliders />
  <ads />
  <hot-news />
</list-page>
</template>
<script>
import ListPage from '@/components/common/ListPage';
import HomeNav from '@/components/Home/HomeNav';
import Sliders from '@/components/Home/Sliders';
import Ads from '@/components/Home/Ads';
import HotNews from '@/components/Home/HotNews';

export default {
  components: {
    ListPage,
    HomeNav,
    Sliders,
    Ads,
    HotNews,
  },
};
</script>
<style lang="less">
.home {
  background-image: url(./images/white_bg.png);
  background-repeat: no-repeat;
  background-size: 100%;
}
.webp .home {
  background-image: url(./images/white_bg.webp);
}

.black .home {
  background-image: url(./images/black_bg.png);
}
.black.webp .home {
  background-image: url(./images/black_bg.webp);
}

</style>
