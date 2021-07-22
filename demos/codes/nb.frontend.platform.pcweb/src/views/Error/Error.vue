<template>
  <div class="error-page">
    <div class="error-img">
      <img :src="src" />
    </div>
    <div class="error-info">
      <div class="content">
        <h1><span>{{$t('errorPage.codeTitle')}}</span>{{code}}</h1>
        <h2>{{$t(`errorPage.${code}.header`)}}</h2>
        <div class="description">
          <div>{{$t(`errorPage.${code}.desc_cn`)}}</div>
          <div>{{$t(`errorPage.${code}.desc_en`)}}</div>
        </div>
        <button
          v-if="code === '404'"
          @click="$router.replace('/')"
        >{{$t(`errorPage.${code}.btn`)}}</button>
        <button
          v-else
          @click="toPortalUrlByKey('SERVICE_CENTER_URL')"
        >{{$t(`errorPage.${code}.btn`)}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { toPortalUrlByKey } from '@/utils/PortalUtils';

const errorImage = {
  403: require('./images/403.png'), // eslint-disable-line global-require
  404: require('./images/404.png'), // eslint-disable-line global-require
  503: require('./images/503.png'), // eslint-disable-line global-require
};

export default {
  props: ['code'],
  computed: {
    src() {
      return errorImage[this.code];
    },
  },
  methods: {
    toPortalUrlByKey,
  },
};
</script>

<style lang="less">
.error-page {
  display: flex;
  .error-img {
    padding-top: 55px;
    text-align: right;
    width: 604px;
    img {
      width: 387px;
    }
  }
  .error-info {
    display: flex;
    align-items: center;
    padding-left: 40px;
    h1 {
      color: #909090;
      font-size: 100px;
      margin: 0;
      span {
        color: #979797;
        font-size: 14px;
        margin-right: 40px;
      }
    }
    h2 {
      font-size: 48px;
      color: #ff5353;
    }
    .description {
      font-size: 12px;
      color: #716d6d;
      margin-top: 21px;
    }
    button {
      margin-top: 40px;
      width: 180px;
      line-height: 38px;
      background: #ff5353;
      color: #fff;
      border-radius: 6px;
    }
  }
}
.container.error {
  .head-bar {
    text-align: center;
    .menus {
      display: none;
    }
  }
  .left-side {
    display: none;
  }
  .main-content {
    width: 100%;
  }
}
</style>
