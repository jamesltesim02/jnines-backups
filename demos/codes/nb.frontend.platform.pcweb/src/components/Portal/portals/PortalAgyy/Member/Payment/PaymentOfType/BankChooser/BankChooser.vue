<template>
  <div
    class="agyy-bankchooser"
    :style="{ height: `${height}px` }"
  >
    <ul>
      <template v-for="(b, i) in banks">
        <li
          :key="i"
          :class="{ active: value === b.bankKey }"
          @click="$emit('change', b.bankKey)"
        >
          <bank-item :code="b.bankCode" />
          <choose-flag :active="value === b.bankKey" />
        </li>
        <li
          v-if="needExpand && i + 1 === min"
          :class="{
            'more': true,
            expanded: expanded,
          }"
          :key="`${i}-more`"
          @click="expanded = !expanded"
        >{{expanded ? $t('agPage.payment.hideBank') : $t('agPage.payment.moreBank')}}</li>
      </template>
    </ul>
  </div>
</template>
<script>
import ChooseFlag from '@/components/common/ChooseFlag';
import BankItem from './BankItem';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    banklist: {},
    value: {},
  },
  data() {
    return {
      expanded: false,
      min: 5,
    };
  },
  computed: {
    banks() {
      if (!this.banklist) {
        return [];
      }
      const entries = Object.entries(this.banklist);

      if (!entries || !entries.length) {
        return [];
      }

      return entries.map(b => ({ bankKey: b[0], bankCode: b[1] }));
    },
    needExpand() {
      return this.banks.length > this.min;
    },
    height() {
      const len = this.banks.length;
      if (len <= 3) {
        return 50;
      }
      if (!this.expanded) {
        return 110;
      }

      return (Math.ceil((len + 1) / 3) * 60) - 10;
    },
  },
  components: {
    BankItem,
    ChooseFlag,
  },
};
</script>
<style lang="less">
.agyy-bankchooser {
  overflow: hidden;
  transition: height .25s ease-out;
  ul {
    display: grid;
    grid-template-columns: 210px 210px 210px;
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    li {
      position: relative;
      height: 48px;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid #fff;
      transition: border-color .35s ease-out;
      cursor: pointer;
      div {
        margin: -1px;
      }
      &.active {
        border: 1px solid #ff5353;
      }
      &.more {
        position: relative;
        background: #fff;
        font-size: 18px;
        line-height: 50px;
        text-align: center;
        color: #bababa;
        &::before {
          content: "";
          position: absolute;
          display: block;
          right: 20px;
          top: 20px;
          border-top: 12px solid #d3d3d3;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          transition: transform .25s ease-out;
        }
        &::after {
          content: "";
          position: absolute;
          display: block;
          width: 16px;
          height: 13px;
          border: 5px solid #fff;
          right: 15px;
          top: 12.5px;
          border-radius: 50%;
          transition: top .25s ease-out;
        }
        &.expanded {
          &::before {
            transform: rotate(-180deg);
          }
          &::after {
            top: 16.5px;
          }
        }
      }
    }
  }
}
</style>
