<template>
  <div class="nb-shine-new-body">
    <div class="shine-new-body-title flex-start">{{$t('share.pubBodyTitle')}}</div>
    <div class="shine-new-title-input">
      <textarea v-model="data.shareTitle" :placeholder="$t('share.pubPlaceTitle')" maxlength="20" />
    </div>
    <div class="shine-new-body-title flex-start">{{$t('share.pubBodyDetail')}}</div>
    <div class="shine-new-detail-input">
      <textarea v-model="data.shareRemark" :placeholder="$t('share.pubPlaceDetail')" maxlength="30" />
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'ShineNewBody',
  props: { data: Object },
};
</script>

<style lang="less">
.nb-shine-new-body {
  width: 100%;
  height: 2.5rem;
  margin-top: .11rem;
  padding-top: .01rem;
  box-shadow: 0 .1rem .2rem 0 rgba(0,0,0,.03);
  background: #ffffff;
  .shine-new-body-title { width: 100%; height: .2rem; padding: 0 .12rem; margin-top: .09rem; font-size: .14rem; font-weight: 600; color: #2e2f34; }
  .shine-new-title-input { width: 3.55rem; height: .6rem; margin: .04rem auto .1rem; }
  .shine-new-detail-input { width: 3.55rem; height: 1.06rem; margin: .04rem auto 0; }
  textarea { width: 100%; height: 100%; padding: .12rem .12rem; font-size: .12rem; font-weight: 600; overflow: hidden; resize: none; border-radius: .02rem; border: .01rem solid #dadada; color: #2e2f34; }
  textarea::-webkit-input-placeholder { color: #cccccc; }
}
.blue .nb-shine-new-body {
  box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1);
  background: linear-gradient(to bottom, #3a393f, #333238);
  .shine-new-body-title { color: #ecebeb; }
  textarea { border: .01rem solid #2b2b2b; background: linear-gradient(to bottom, #323137, #302f35); color: #cccccc; }
  textarea::-webkit-input-placeholder { color: #666666; }
}
</style>
