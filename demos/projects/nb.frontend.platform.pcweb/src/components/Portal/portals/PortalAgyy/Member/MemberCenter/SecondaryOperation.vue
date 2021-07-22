<template>
  <ul class="agyy-secondaryoper">
    <li
      v-for="(m, mi) in menus"
      :key="mi"
      :class="{
        expandable: m.children,
        expanded: m.expanded,
      }"
    >
      <a
        @click="handleClick(m, mi)"
      >{{m.text}}</a>
      <expand-box
        v-if="m.children"
        :expanded="m.expanded"
      >
        <component
          v-for="(c, ci) in m.children"
          :key="ci"
          :is="c"
        />
      </expand-box>
    </li>
  </ul>
</template>
<script>
import { mapMutations } from 'vuex';
import Settings from './Settings';

export default {
  data() {
    return {
      menus: [
        {
          url: '/member/bank',
          text: this.$t('agPage.member.mbank'),
          action: this.bankCardFun,
        },
        {
          url: '/member/report',
          text: this.$t('agPage.member.mreport'),
        },
        // {
        //   url: '/member/infomation',
        //   text: this.$t('agPage.member.minfo'),
        // },
        // {
        //   url: '/member/messages',
        //   text: this.$t('agPage.member.mmsg'),
        // },
        {
          text: this.$t('agPage.member.msettings'),
          children: [Settings],
          expand: false,
        },
      ],
    };
  },
  methods: {
    ...mapMutations('agyy', ['pushRouter', 'setNoBankAlert']),
    bankCardFun(url) {
      this.setNoBankAlert();
      this.pushRouter(url);
    },
    handleClick(m, mi) {
      if (!m.url) {
        if (m.children) {
          this.$set(
            this.menus,
            mi,
            { ...m, expanded: !m.expanded },
          );
        }
        return;
      }

      if (m.action) {
        m.action(m.url);
        return;
      }

      this.pushRouter(m.url);
    },
  },
};
</script>
<style lang="less">
.agyy-secondaryoper {
  margin-top: 40px;
  font-size: 14px;
  li {
    line-height: 50px;
    cursor: pointer;
    a {
      position: relative;
      display: block;
      padding-left: 10px;
      border-bottom: 1px solid #353535;
      &::before {
        content: "";
        display: block;
        position: absolute;
        width: 9px;
        height: 9px;
        border-top: 1px solid #bababa;
        border-left: 1px solid #bababa;
        top: 50%;
        right: 15px;
        transform: translateY(-50%) rotate(135deg);
      }
    }
    &.expandable {
      a::before {
        transform: translateY(-50%) rotate(225deg);
        transition: transform .35s ease-out;
      }
    }
    &.expanded {
      a::before {
        transform: translateY(-50%) rotate(45deg);
      }
    }
  }
}
</style>
