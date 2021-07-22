<template>
  <component
    :is="comp"
    :info="payInfo"
  />
</template>
<script>
import CommonDesc from './CommonDesc';
import TransferDesc from './TransferDesc';
import VirtualDesc from './VirtualDesc';

const DESC_MAPPING = {
  transfer: TransferDesc,
  virtual: VirtualDesc,
};

export default {
  props: ['payInfo'],
  computed: {
    comp() {
      const descComp = DESC_MAPPING[this.payInfo.type];
      return descComp || CommonDesc;
    },
  },
};
</script>
