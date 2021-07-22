<template>
<!-- style in common.less -->
<div
  class="no-more"
  :class="{'full': full}"
>
  <div>
    <icon-no-more />
    <p>{{$t('message.noMoreRecords')}}</p>
  </div>
</div>
</template>
<script>
import IconNoMore from './icons/IconNoMore';

export default {
  props: {
    full: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    IconNoMore,
  },
};
</script>
<style lang="less">
.no-more p {
  font-size: 20px;
  color: #c8c9ca;
  margin-top: 15px;
}
.dark .no-more p {
  color: #585858;
}
</style>
