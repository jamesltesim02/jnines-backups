<template>
  <marquee v-if="outBounds" v-bind="$attrs">{{text}}</marquee>
  <span v-else v-bind="$attrs">{{text}}</span>
</template>
<script>
import { placeLength } from '@/utils/StringUtil';

export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    maxLength: {
      type: Number,
      required: true,
    },
  },
  computed: {
    outBounds() {
      return placeLength(this.text) > this.maxLength;
    },
  },
};
</script>
