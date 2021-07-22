<template>
<div class="nb-publish-detail-follow-body">
  <div class="publish-detail-follow-body-item flex-between" v-for="(v, k) in list" :key="k">
    <div class="detail-follow-item-id flex-center">{{k + 1}}</div>
    <div class="detail-follow-item-name-box flex-start" v-if="v.userId">
      <div class="detail-follow-item-img flex-center" >
        <icon-head :src="v.header" />
      </div>
      <span class="detail-follow-item-name-txt flex-center">{{getUserName(v)}}</span>
    </div>
    <div class="detail-follow-item-name-box flex-start" v-else> _ _ _ _ _ _ _</div>
    <div class="detail-follow-item-amt flex-center">{{(v.betAmount || 0) | NumFmt}}</div>
  </div>
</div>
</template>

<script>
import IconHead from '@/components/XSports/Xmember/icons/IconHead';

export default {
  inheritAttrs: false,
  name: 'PublishDetailFollowBody',
  props: { data: Array },
  computed: {
    list() {
      const dt = this.data ? JSON.parse(JSON.stringify(this.data)) : [];
      for (let i = dt.length; i < 10; i += 1) {
        dt.push({ });
      }
      return dt;
    },
  },
  components: { IconHead },
  methods: {
    getUserName(v) {
      return v.nickName || `${v.userId}`.slice(0, 8) || '';
    },
  },
};
</script>

<style lang="less">
.nb-publish-detail-follow-body {
  width: 100%;
  padding: 0 .1rem;
  margin-bottom: .1rem;
  background: linear-gradient(to top, #f9f9f9, #fcfcfc);
  .publish-detail-follow-body-item { width: 100%; height: .34rem; }
  .detail-follow-item-id { width: 20%; height: 100%; font-size: .14rem; color: #bababa; }
  .detail-follow-item-name-box { width: 50%; height: 100%; font-size: .14rem; color: #777777; }
  .detail-follow-item-amt { width: 30%; height: 100%; font-size: .16rem; font-weight: bold; font-family: DIN; color: #555555; }
  .detail-follow-item-img { width: .2rem; height: .2rem; margin-right: .06rem; border: none; border-radius: 100%; overflow: hidden; }
  .detail-follow-item-img img { width: 100%; height: 100%; }
  .detail-follow-item-name-txt { line-height: .34rem; font-size: .14rem; color: #777777; }
}
.blue .nb-publish-detail-follow-body {
  background: linear-gradient(to bottom, #3a393f, #333238);
  .detail-follow-item-id { color: #666666; }
  .detail-follow-item-name-box { color: #999999; }
  .detail-follow-item-amt { color: #999999; }
  .detail-follow-item-name-txt { color: #999999; }
}
</style>
