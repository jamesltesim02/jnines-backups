<template>
  <div
    class="x-match-info"
    @click="$emit('click')"
  >
    <info-header :match="match" />
    <info-content :match="match" />
  </div>
</template>
<script>
import InfoHeader from './InfoHeader';
import InfoContent from './InfoContent';

export default {
  props: {
    match: {},
  },
  components: {
    InfoHeader,
    InfoContent,
  },
};
</script>
