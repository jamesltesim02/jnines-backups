<template>
  <list-page
    class="seamless"
    :class="{'img-bg-page': isSeamless}"
  >
    <nav-bar
      :title="$t('page.setLabel')"
      :transparent="isSeamless"
      slot="header"
    >
      <btn-toggle-theme />
    </nav-bar>
    <member-info v-if="isSeamless" />
    <betting-type-mode />
    <toggle-list />
  </list-page>
</template>
<script>
import { AppModes } from '@/config/constants';
import ListPage from '@/components/common/ListPage';
import NavBar from '@/components/common/NavBar';
import MemberInfo from '@/components/Settings/MemberInfo';
import BettingTypeMode from '@/components/Settings/BettingTypeMode';
import ToggleList from '@/components/Settings/ToggleList';
import BtnToggleTheme from '@/components/Settings/BtnToggleTheme';

const { NBConfig: { APP_MODE } } = window;

export default {
  computed: {
    isSeamless() {
      return APP_MODE === AppModes.SEAMLESS;
    },
  },
  components: {
    ListPage,
    NavBar,
    MemberInfo,
    BettingTypeMode,
    ToggleList,
    BtnToggleTheme,
  },
};
</script>
<style lang="less">
.setting {
  transition: all .15s;
}

.img-bg-page.setting {
  background-image: url(./Home/images/white_bg.png);
}
.webp .img-bg-page.setting {
  background-image: url(./Home/images/white_bg.webp);
}

.black .img-bg-page.setting {
  background-image: url(./Home/images/black_bg.png);
}
.black.webp .img-bg-page.setting {
  background-image: url(./Home/images/black_bg.webp);
}
</style>
