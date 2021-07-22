<template>
<div class="nb-publish-detail-match">
  <publish-detail-match-item :data="v" v-for="(v, k) in data" :key="k" />
</div>
</template>

<script>
import PublishDetailMatchItem from '@/components/Publish/PublishDetailMatchItem';

export default {
  inheritAttrs: false,
  name: 'PublishDetailMatch',
  props: { data: Array },
  components: { PublishDetailMatchItem },
};
</script>

<style lang="less">
.nb-publish-detail-match { width: 100%; height: auto; margin-bottom: .15rem; border-bottom-left-radius: .06rem; border-bottom-right-radius: .06rem; background: #ffffff; overflow: hidden; }
.blue .nb-publish-detail-match { box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.08); background: linear-gradient(to bottom, #3a393f, #333238); }
</style>
