<template>
  <span>{{$t(`common.wf.wf_${sportId}_${groupType}_${betStage}_${gameType}`)}}</span>
</template>
<script>
export default {
  props: [
    'sportId',
    'groupType',
    'betStage',
    'gameType',
  ],
};
</script>
