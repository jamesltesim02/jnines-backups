<template>
<div class="nb-publish-detail-follow-head">
  <div class="detail-follow-head-tp flex-between">
    <div class="detail-follow-head-buy flex-center">
      <span class="detail-follow-head-tp-txt">{{$t('share.selfBuy')}}</span>
      <span class="detail-follow-head-tp-num">{{(data.betAmount || data.tamt || 0) | NumFmt}}</span>
      <span class="detail-follow-head-tp-txt">{{$t('share.rmb')}}</span>
    </div>
    <div class="detail-follow-head-flw flex-end">
      <span class="detail-follow-head-tp-txt">{{$t('share.follow')}}</span>
      <span class="detail-follow-head-tp-num">{{data.followCount || 0}}</span>
      <span class="detail-follow-head-tp-txt">{{$t('share.person')}}</span>
    </div>
    <div class="detail-follow-head-mon flex-center">
      <span class="detail-follow-head-tp-txt">{{$t('share.flwTotal')}}</span>
      <span class="detail-follow-head-tp-num">{{(data.followAmount || 0) | NumFmt(true)}}</span>
      <span class="detail-follow-head-tp-txt">{{$t('share.rmb')}}</span>
    </div>
  </div>
  <div class="detail-follow-head-btm flex-between">
    <div class="detail-follow-head-id flex-center">{{$t('share.flwId')}}</div>
    <div class="detail-follow-head-name flex-start">{{$t('share.flwName')}}</div>
    <div class="detail-follow-head-amt flex-center">{{$t('share.flwBtAmt')}}</div>
  </div>
</div>
</template>
<script>
export default {
  inheritAttrs: false,
  name: 'PublishDetailFollowHead',
  props: { data: Object },
};
</script>

<style lang="less">
.nb-publish-detail-follow-head {
  width: 100%;
  border-top: .01rem solid #f6f6f6;
  border-top-left-radius: .06rem;
  border-top-right-radius: .06rem;
  overflow: hidden;
  .detail-follow-head-tp { width: 100%; height: .36rem; padding: 0 .1rem; background: rgba(255,83,83,.1); }
  .detail-follow-head-buy { width: 28%; height: 100%; }
  .detail-follow-head-flw { width: 22%; height: 100%; }
  .detail-follow-head-mon { width: 50%; height: 100%; }
  .detail-follow-head-tp-txt { height: 100%; line-height: .36rem; font-size: .12rem; color: #2e2f34; }
  .detail-follow-head-tp-num { height: 100%; line-height: .36rem; padding: 0 .03rem; font-size: .16rem; font-weight: 500; font-family: DIN; color: #ff5353; }
  .detail-follow-head-btm { width: 100%; height: .36rem; padding: 0 .1rem; background: #fcfcfc; }
  .detail-follow-head-id { width: 20%; height: 100%; font-size: .12rem; color: #999999; }
  .detail-follow-head-name { width: 50%; height: 100%; padding-left: .26rem; font-size: .12rem; color: #999999; }
  .detail-follow-head-amt { width: 30%; height: 100%; font-size: .12rem; color: #999999; }
}
.blue .nb-publish-detail-follow-head {
  border-top: none;
  border-top-left-radius: .06rem;
  .detail-follow-head-tp { background: rgba(83,255,253,.3); }
  .detail-follow-head-tp-txt { color: #eeeeee; }
  .detail-follow-head-tp-num { color: #53fffd; }
  .detail-follow-head-btm { background: #3a393f; }
  .detail-follow-head-id { color: #666666; }
  .detail-follow-head-name { color: #666666; }
  .detail-follow-head-amt { color: #666666; }
}
</style>
