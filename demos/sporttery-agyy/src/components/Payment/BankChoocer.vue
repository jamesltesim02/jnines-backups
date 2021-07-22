<template>
  <v-touch
    class="bank-choocer"
    @tap="expand"
  >
    <span class="bank-text">{{(this.value || {}).text || $t('payment.bankLabel')}}</span>
    <button class="flex-center"><icon-arrow direction="down" /></button>
  </v-touch>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import IconArrow from '@/components/common/icons/IconArrow';

export default {
  model: {
    prop: 'value',
    event: 'update',
  },
  props: {
    banklist: {},
    value: {},
  },
  components: {
    IconArrow,
  },
  computed: {
    ...mapState('query', ['pickSelect']),
    banks() {
      if (!this.banklist) {
        return [];
      }
      const entries = Object.entries(this.banklist);

      if (!entries || !entries.length) {
        return [];
      }

      return entries.map(b => ({ value: b[1], text: this.$t(`payment.banks.${b[1]}`) }));
    },
  },
  watch: {
    pickSelect(n) {
      this.$emit('update', {
        value: n.val[0],
        text: n.text[0],
      });
    },
  },
  methods: {
    ...mapMutations('query', ['setPickerData']),
    expand() {
      if (!this.banks || !this.banks.length) {
        return;
      }

      this.setPickerData({
        hide: false,
        title: '充值银行',
        default: (this.value || {}).text,
        data: [this.banks],
      });
    },
  },
};
</script>
<style lang="less">
.bank-choocer {
  margin-top: .2rem;
  padding: 0 .1rem 0 .15rem;
  display: flex;
  span, button {
    border: 1px solid #bababa;
    line-height: .41rem;
  }
  span {
    display: block;
    flex-grow: 1;
    border-right: 0;
    color: #ff5353;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    text-align: center;
    font-size: .14rem;
    letter-spacing: 1.5px;
  }
  button {
    width: .4rem;
    font-size: 0;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    svg {
      width: .12rem;
      height: .12rem;
      path {
        fill: #bababa;
      }
    }
  }
}

.black .bank-choocer {
  span, button {
    border-color: #716d6d;
  }
  button svg path {
    fill: #909090;
  }
}
</style>
