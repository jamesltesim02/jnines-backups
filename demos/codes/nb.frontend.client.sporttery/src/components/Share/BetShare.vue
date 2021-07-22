<template>
  <bet-cover-box class="nb-bet-share" :index="99999999" :show="show" @close="closeFun" >
    <div class="nb-bet-share-body flex-center" >
      <cimg :src="picUrl" v-if="picUrl" />
    </div>
    <div class="nb-bet-share-btns" :style="{ paddingBottom: tabHeight }">
      <div class="four-button flex-between">
        <v-touch tag="a" class="share-btn flex-between-col" :href="imgHref" v-bind="wDownName" @tap="downloadFun" >
          <div class="img-box flex-center"><share-we /></div>
          <div class="img-title flex-center">{{$t('share.wechart')}}</div>
        </v-touch>
        <v-touch tag="a" class="share-btn flex-between-col" :href="imgHref" v-bind="fDownName" @tap="downloadFun" >
          <div class="img-box flex-center"><share-fd /></div>
          <div class="img-title flex-center">{{$t('share.friend')}}</div>
        </v-touch>
        <v-touch tag="a" class="share-btn flex-between-col" :href="imgHref" v-bind="qDownName" @tap="downloadFun" >
          <div class="img-box flex-center"><share-qq /></div>
          <div class="img-title flex-center">{{$t('share.qq')}}</div>
        </v-touch>
        <v-touch tag="a" class="share-btn flex-between-col" :href="imgHref" v-bind="lDownName" @tap="downloadFun" >
          <div class="img-box flex-center"><share-lc /></div>
          <div class="img-title flex-center">{{$t('share.local')}}</div>
        </v-touch>
      </div>
      <div class="share-close flex-center">{{$t('share.cancel')}}</div>
    </div>
  </bet-cover-box>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { findSharePicture } from '@/api/activity';
import BetCoverBox from '@/components/Bet/BetComps/BetCoverBox';
import ShareWe from '@/components/Share/ShareWe';
import ShareFd from '@/components/Share/ShareFd';
import ShareLc from '@/components/Share/ShareLc';
import ShareQq from '@/components/Share/ShareQq';

export default {
  inheritAttrs: false,
  name: 'BetShare',
  data() {
    return { picUrl: '', imgHref: '#' };
  },
  computed: {
    ...mapState('app', ['userinfo', 'tabHeight', 'shareTarget']),
    show() {
      return !!(this.userinfo && this.userinfo.nbUser && this.shareTarget);
    },
    isHref() {
      return this.imgHref && this.imgHref.length > 3;
    },
    wDownName() {
      return this.isHref ? { download: `${this.$t('share.shareTo')}${this.$t('share.wechart')}` } : { };
    },
    fDownName() {
      return this.isHref ? { download: `${this.$t('share.shareTo')}${this.$t('share.friend')}` } : { };
    },
    qDownName() {
      return this.isHref ? { download: `${this.$t('share.shareTo')}${this.$t('share.qq')}` } : { };
    },
    lDownName() {
      return this.isHref ? { download: `${this.$t('share.local')}` } : { };
    },
    rout() {
      return this.$route.path;
    },
  },
  watch: {
    show() {
      if (this.show) {
        this.getFontPic();
      }
    },
    rout() {
      this.closeFun();
    },
  },
  components: {
    BetCoverBox,
    ShareWe,
    ShareFd,
    ShareLc,
    ShareQq,
  },
  methods: {
    ...mapMutations('app', ['setShareTarget']),
    closeFun() {
      this.setShareTarget();
    },
    downloadFun() {
      if (this.isHref) {
        this.$toast(this.$t('share.download'));
        setTimeout(() => { this.setShareTarget(); }, 1000);
      }
    },
    toBlobUrl(imageUrl) {
      const image = new Image();
      image.setAttribute('crossOrigin', 'Anonymous');
      image.src = imageUrl;
      image.onload = () => {
        let canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, image.width, image.height);
        const dataURL = canvas.toDataURL('image/png');
        canvas = null;
        const urlArr = dataURL.split(',');
        const typeStr = urlArr[0].match(/:(.*?);/)[1];
        const urlStr = window.atob(urlArr[1]);
        const len = urlStr.length;
        const u8Arr = new Uint8Array(len);
        for (let i = 0; i < len; i += 1) {
          u8Arr[i] = urlStr.charCodeAt(i);
        }
        const blobUrl = new Blob([u8Arr], { type: typeStr });
        this.imgHref = window.URL.createObjectURL(blobUrl);
      };
    },
    async getFontPic() {
      if (this.userinfo && this.userinfo.nbUser && this.shareTarget) {
        try {
          let from = /publish/i.test(this.shareTarget) ? 2 : 1;
          from = /follow/i.test(this.shareTarget) ? 3 : from;
          from = /shine/i.test(this.shareTarget) ? 4 : from;
          const actUrl = window.NBConfig.ACTIVITY_URL || '';
          const obj = { userId: this.userinfo.nbUser, shareFrom: from };
          const dt = await findSharePicture(obj);
          if (dt && /^https?:\/\//.test(dt)) {
            this.picUrl = dt;
            this.toBlobUrl(dt);
          } else if (dt && !/^https?:\/\//.test(dt) && dt.length > 100) {
            const dtStr = `data:image/png;base64,${dt}`;
            this.picUrl = dtStr;
            this.toBlobUrl(dtStr);
          } else if (dt && !/^https?:\/\//.test(dt) && actUrl) {
            const dtStr = `${actUrl}${dt}`.replace(/([^:])\/\/+/g, '$1/');
            this.picUrl = dtStr;
            this.toBlobUrl(dtStr);
          }
        } catch (e) {
          console.log(e);
        }
      }
    },
  },
  mounted() {
    if (this.show) this.getFontPic();
  },
};
</script>

<style lang="less">
.nb-bet-share .nb-bet-public-box-body {
  top: 0;
  height: 100%;
  .nb-bet-public-box-body-posit { width: 100%; height: 100%; }
  .nb-bet-share-body { width: 100%; height: auto; img { width: 100%; } }
  .nb-bet-share-btns { position: absolute; width: 100%; left: 0; bottom: 0; background: #fff; }
  .four-button { width: 100%; height: 1.26rem; padding: .09rem .23rem 0 .22rem; background: #f5f5f5; }
  .share-close { width: 100%; height: .48rem; font-size: .16rem; color: #666666; box-shadow: 0 -.02rem .2rem 0 rgba(0,0,0,.05); }
  .share-btn { width: .6rem; height: 100%; padding: .18rem 0; }
  .img-box { width: .54rem; height: .54rem; border-radius: 100%; overflow: hidden; background: #fff; }
  .img-title { width: 100%; height: .17rem; font-size: .12rem; color: #777777; }
}
</style>
