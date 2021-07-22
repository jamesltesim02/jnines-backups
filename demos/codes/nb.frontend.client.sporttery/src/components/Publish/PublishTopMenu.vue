<template>
  <div class="nb-publish-top-menu flex-between" :type="type" >
    <div class="top-menu-img-box flex-start" :type="type" >
      <cimg :src="`./img/publish/left_${type}.png`" :type="type" />
    </div>
    <div class="top-menu-list-box" :type="type" >
      <div class="top-menu-item flex-start" :type="type" v-for="(v, k) in data" :key="k" >
        <div class="top-menu-item-left flex-start" :type="type" >
          <span class="top-menu-item-id flex-center" :type="type">{{k + 1}}</span>
          <v-touch class="top-menu-item-img publish-user flex-center" :type="type" @tap="clickFun(v)" >
            <icon-head class="publish-user" :src="v.header" :type="type" />
          </v-touch>
          <span class="top-menu-item-name flex-start" :type="type">{{getUserName(v)}}</span>
        </div>
        <div class="top-menu-item-right flex-end" :type="type" >
          <span class="top-menu-item-rtn flex-center" v-if="/^0$/.test(type)" :type="type">
            {{100 * v.returnRate | NumFmt}}
            <span class="top-menu-item-small flex-center" :type="type">%</span>
          </span>
          <span class="top-menu-item-rtn flex-center" v-else-if="/^1$/.test(type)" :type="type">
            {{v.longRedCount}}
            <span class="top-menu-item-small flex-center" :type="type">{{$t('share.longRed')}}</span>
          </span>
          <span class="top-menu-item-rtn flex-center" v-else-if="/^2$/.test(type)" :type="type">
            {{100 * v.hitRate | NumFmt}}
            <span class="top-menu-item-small flex-center" :type="type">%</span>
          </span>
          <span class="top-menu-item-rtn flex-center" v-else-if="/^3$/.test(type)" :type="type">
            {{(v.totalBet / 1000) | NumFmt(true)}}
            <span class="top-menu-item-small flex-center" :type="type">K</span>
          </span>
          <span class="top-menu-item-rtn flex-center" v-else-if="/^4$/.test(type)" :type="type">
            {{(v.commission / 1000) | NumFmt(true)}}
            <span class="top-menu-item-small flex-center" :type="type">K</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconHead from '@/components/XSports/Xmember/icons/IconHead';

export default {
  inheritAttrs: false,
  name: 'PublishTopMenu',
  props: { data: Array, type: String },
  components: { IconHead },
  methods: {
    getUserName(v) {
      return v.nickName || `${v.userId}`.slice(0, 8) || '';
    },
    clickFun(v) {
      if (v && v.userId) {
        this.$router.push(`/member/specialist/${v.userId}/0`);
      }
    },
  },
};
</script>

<style lang="less">
.nb-publish-top-menu {
  width: 2.7rem;
  height: 2rem;
  border-radius: .06rem;
  box-shadow: 0 .02rem .1rem 0 rgba(0,0,0,.1);
  background: linear-gradient(to top, #fff, #fff);
  overflow: hidden;
  .top-menu-img-box { width: .6rem; height: 100%; overflow: hidden; img { height: 105%; } }
  .top-menu-list-box { width: 2.1rem; height: 100%; padding: .1rem .15rem; overflow: hidden; }
  .top-menu-item { position: relative; width: 100%; height: 20%; z-index: 1; }
  .top-menu-item-left { position: absolute; width: 1.5rem; height: 100%; left: 0; top: 0; z-index: 2; }
  .top-menu-item-right { position: absolute; width: 1.1rem; height: 100%; right: 0; top: 0; z-index: 3; }
  .top-menu-item-id { height: 100%; font-size: .14rem; color: #bababa; }
  .top-menu-item-img { width: .2rem; height: .2rem; margin: 0 .06rem; border: none; border-radius: 100%; overflow: hidden; }
  .top-menu-item-img img { width: 100%; height: 100%; }
  .top-menu-item-name { width: 1.1rem; height: 100%; font-size: .14rem; overflow: hidden; white-space: nowrap; color: #777777; }
  .top-menu-item-rtn { height: 100%; font-size: .16rem; font-weight: 500; color: #555555; }
  .top-menu-item-small { height: 100%; padding-top: .02rem; font-size: .1rem; color: #777777; }
}
</style>
