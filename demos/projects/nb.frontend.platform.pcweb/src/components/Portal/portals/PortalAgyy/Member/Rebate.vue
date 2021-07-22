<template>
  <sub-panel
    :title="$t('agPage.rebate.title')"
    class="agyy-rebate"
  >
    <div class="description">
      <template v-if="isLoged">
        <h3>1、{{$t('agPage.rebate.info')}}</h3>
        <ul class="info">
          <li>
            <label>{{$t('agPage.rebate.amount')}}</label>
            <span>￥{{loading ? $t('message.loading') : rebate.amount | moneyFormat}}</span>
          </li>
          <li>
            <label>{{$t('agPage.rebate.bets')}}</label>
            <span>￥{{loading ? $t('message.loading') : rebate.turnoverAmount | moneyFormat}}</span>
          </li>
          <li>
            <label>{{$t('agPage.rebate.weekBets')}}</label>
            <span>￥{{loading ? $t('message.loading') : rebate.totalTurnoverAmount | moneyFormat}}</span>
          </li>
        </ul>
      </template>
      <h3>{{1 + (isLoged ? 1 : 0)}}、{{$t('agPage.rebate.ruleLabel')}}</h3>
      <ul class="rules">
        <li>
          <span>{{$t('agPage.rebate.ruleTitles.level')}}</span>
          <span>{{$t('agPage.rebate.ruleTitles.requirement')}}</span>
          <span>{{$t('agPage.rebate.ruleTitles.proportion')}}</span>
        </li>
        <li
          v-for="r in rules"
          :key="r[0]"
          :class="{ active: isLoged && r[0] === userinfo.memberLevel}"
        >
          <span>{{$t(`agPage.levels.${r[0]}`)}}</span>
          <span>{{$t(`agPage.rebate.ruleRequirs.${r[1] > 0 ? 'weekly' : '0'}`, { bets: r[1] })}}</span>
          <span>{{r[2]}}</span>
        </li>
      </ul>
      <h3>{{2 + (isLoged ? 1 : 0)}}、{{$t('agPage.rebate.detail')}}</h3>
      <ol class="details">
        <li
          v-for="(d, i) in details"
          :key="i"
        >
          {{d.title || ''}}
          <ol v-if="d.subs && d.subs.length">
            <li
              v-for="(s, j) in d.subs"
              :key="j"
            >{{s || ''}}</li>
          </ol>
        </li>
      </ol>
    </div>
    <div
      slot="footer"
      class="submiter"
    >
      <button
        v-if="isLoged"
        :class="{ disabled: !rebatable }"
        @click="submit"
      >{{$t('agPage.rebate.submit')}}</button>
    </div>
  </sub-panel>
</template>
<script>
import { mapState } from 'vuex';
import { getRebate, submitRebate } from '@/api/portalAgyy';
import { AgyyConfig } from '../agyy-constant';
import SubPanel from './SubPanel';

export default {
  data() {
    return {
      rebate: {
        amount: 0,
        turnoverAmount: 0,
        totalTurnoverAmount: 0,
      },
      rules: AgyyConfig.REBATE_RULES,
      details: this.$t('agPage.rebate.details'),
      loading: false,
    };
  },
  computed: {
    ...mapState('app', ['isLoged', 'userinfo']),
    rebatable() {
      return this.rebate.amount >= AgyyConfig.REBATE_AMOUNT_CONDITION;
    },
  },
  components: {
    SubPanel,
  },
  created() {
    if (this.isLoged) {
      this.loadRebate();
    }
  },
  methods: {
    async loadRebate() {
      try {
        this.loading = true;
        const {
          rebateInfo: [
            rebateResult,
          ],
        } = await getRebate();

        this.rebate = rebateResult;
      } finally {
        this.loading = false;
      }
    },
    async submit() {
      if (!this.rebatable) {
        return;
      }

      try {
        this.$loading(this.$t('message.submitting'));
        const { totalAmount } = await submitRebate();
        this.$toast.center(this.$t('agPage.rebate.success', { amount: totalAmount }));
        this.loadRebate();
      } finally {
        this.$loading.close();
      }
    },
  },
};
</script>
<style lang="less">
.agyy-rebate {
  .description {
    padding: 0 60px 40px 60px;
  }
  h3 {
    position: relative;
    margin-top: 40px;
    font-size: 20px;
    color: #ddd;
    font-weight: 500;
  }
  .info,
  .rules {
    position: relative;
    margin-top: 20px;
    width: 100%;
    color: #bababa;
    letter-spacing: 0.2px;
    text-align: center;
    * {
      position: relative;
      z-index: 1;
    }
    &::before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border-radius: 6px;
      opacity: 0.5;
      z-index: 0;
      background-image: linear-gradient(to bottom, #3a393f, #333238);
    }
    li {
      border-bottom: solid 1px #28272d;
      &:last-child {
        border-bottom: 0;
      }
    }
  }
  .info {
    font-size: 14px;
    line-height: 50px;
    label, span {
      display: inline-block;
      width: 50%;
    }
    span {
      color: #ff5353;
    }
  }
  .rules {
    font-size: 12px;
    line-height: 35px;
    span {
      display: inline-block;
    }
    span:nth-child(1) {
      width: 30%;
    }
    span:nth-child(2) {
      width: 40%;
    }
    span:nth-child(3) {
      width: 30%;
    }
    .active {
      color: #ff5353;
    }
  }
  .details {
    margin: 20px 0 0 12px;
    line-height: 26px;
    font-size: 12px;
    li {
      list-style-position: outside;
    }
    & > li {
      list-style-type: decimal;
    }
    & ol {
      margin-left: 12px;
      // font-size: 12px;
      li {
        list-style-type: lower-alpha;
      }
    }
  }
  .submiter {
    padding: 10px 0 30px;
    text-align: center;
    button {
      border-radius: 6px;
      background-color: #ff5353;
      color: #fff;
      line-height: 50px;
      width: 320px;
      &.disabled {
        cursor: not-allowed;
        filter: grayscale(100%);
      }
    }
  }
}
</style>
