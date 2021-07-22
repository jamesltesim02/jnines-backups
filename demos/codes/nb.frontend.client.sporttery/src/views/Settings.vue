<template>
  <list-page class="seamless" :class="{'img-bg-page': isSeamless}" v-if="!horizScreen" >
    <nav-bar
      :title="$t('page.setLabel')"
      slot="header"
      custBack
      @back="$router.replace('/')"
    >
      <btn-toggle-theme />
    </nav-bar>
    <member-info v-if="isSeamless" />
    <!-- <betting-type-mode /> -->
    <toggle-list />
  </list-page>
  <div class="seamless" v-else>
    <div class="seamless-left flex-none-col" :class="{'img-bg-page': isSeamless}" >
      <div class="seamless-left-header">
        <nav-bar :title="$t('page.setLabel')" />
      </div>
      <div class="seamless-left-content">
        <member-info v-if="isSeamless" />
        <!-- <betting-type-mode /> -->
      </div>
    </div>
    <div class="seamless-right">
      <list-page>
        <nav-bar :backable="false" slot="header" >
          <btn-toggle-theme />
        </nav-bar>
        <div class="seamless-right-body">
          <toggle-list />
        </div>
      </list-page>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { AppModes } from '@/config/constants';
import ListPage from '@/components/common/ListPage';
import NavBar from '@/components/common/NavBar';
import MemberInfo from '@/components/Settings/MemberInfo';
// import BettingTypeMode from '@/components/Settings/BettingTypeMode';
import ToggleList from '@/components/Settings/ToggleList';
import BtnToggleTheme from '@/components/Settings/BtnToggleTheme';

const { NBConfig: { APP_MODE } } = window;

export default {
  computed: {
    ...mapState('app', ['horizScreen']),
    isSeamless() {
      return APP_MODE === AppModes.SEAMLESS;
    },
  },
  components: {
    ListPage,
    NavBar,
    MemberInfo,
    // BettingTypeMode,
    ToggleList,
    BtnToggleTheme,
  },
};
</script>
<style lang="less">
.setting {
  transition: all .25s ease-out;
}
.img-bg-page.setting {
  background-image: url(./Home/images/white_bg.png);
  background-repeat: no-repeat;
  background-size: 3.75rem auto;
}
.webp .img-bg-page.setting {
  background-image: url(./Home/images/white_bg.webp);
}
.black .img-bg-page.setting {
  background-image: url(./Home/images/black_bg.png);
}
.black .webp .img-bg-page.setting {
  background-image: url(./Home/images/black_bg.webp);
}
.blue .img-bg-page.setting {
  background-image: url(./Home/images/black_bg.png);
}
.blue .webp .img-bg-page.setting {
  background-image: url(./Home/images/black_bg.webp);
}
.seamless-left {
  float: left;
  width: 3.75rem;
  height: 100%;
  .seamless-left-header {
    position: relative;
    z-index: 13;
  }
  .seamless-left-content {
    position: relative;
    flex-grow: 1;
    z-index: 10;
    width: 3.75rem;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: .1rem;
  }
}
.seamless-right {
  float: right;
  width: 3.75rem;
  height: 100%;
  .seamless-right-body {
    padding-top: .1rem;
    padding-left: .08rem;
  }
}
.horizontal .seamless {
  width: 100%;
  height: 100%;
}
</style>
