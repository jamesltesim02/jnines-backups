<template>
  <list-page class="rebate-page img-bg-page" v-if="!horizScreen">
    <nav-bar :title="$t('rebate.title')" slot="header" transparent />
    <section class="rebate-content">
      <acount-block :userinfo="userinfo">
        <div class="amount">
          <label class="flex-end-bottom">{{$t('rebate.amount')}}</label>
          <span>{{loading ? $t('message.loading') : rebate.amount | moneyFormat}}</span>
        </div>
        <v-touch tag="button" :class="{disabled: !rebatable}" @tap="submit" >{{$t('rebate.submit')}}</v-touch>
      </acount-block>
    </section>
    <div class="detail">
      <h4>{{$t('rebate.detail')}}</h4>
      <div class="items">
        <detail-item :label="$t('rebate.amount')">
          ￥{{loading ? $t('message.loading') : rebate.amount | moneyFormat}}
        </detail-item>
        <detail-item :label="$t('rebate.bets')">
          {{loading ? $t('message.loading') : rebate.turnoverAmount | moneyFormat}}
        </detail-item>
        <detail-item :label="$t('rebate.weekBets')">
          {{loading ? $t('message.loading') : rebate.totalTurnoverAmount | moneyFormat}}
        </detail-item>
      </div>
    </div>
    <div class="rules">
      <h4>
        <span>{{$t('rebate.ruleLabel')}}</span>
        <v-touch tag="a" @tap="$router.push('/rebatedetail')" >{{$t('rebate.more')}}<pre> ></pre></v-touch>
      </h4>
      <div class="items">
        <rule-item :values="[$t('rebate.ruleTitles.level'), $t('rebate.ruleTitles.requirement'), $t('rebate.ruleTitles.proportion')]" />
        <rule-item v-for="(r, i) in rules" :key="i" :active="r[0] === userinfo.memberLevel"
          :values="[$t(`pagelite.levels.${r[0]}`), $t(`rebate.ruleRequirs.${r[1] > 0 ? 'weekly' : '0'}`, { bets: r[1] }),  r[2]]"
        />
      </div>
    </div>
  </list-page>
  <div class="rebate-page" v-else>
    <div class="rebate-page-left img-bg-page flex-none-col">
      <div class="rebate-left-header">
        <nav-bar :title="$t('rebate.title')" slot="header" transparent />
      </div>
      <div class="rebate-left-content">
        <div class="rebate-content">
          <section class="rebate-content">
            <acount-block :userinfo="userinfo">
              <div class="amount">
                <label class="flex-end-bottom">{{$t('rebate.amount')}}</label>
                <span>{{loading ? $t('message.loading') : rebate.amount | moneyFormat}}</span>
              </div>
              <v-touch tag="button" :class="{disabled: !rebatable}" @tap="submit" >{{$t('rebate.submit')}}</v-touch>
            </acount-block>
          </section>
        </div>
      </div>
    </div>
    <div class="rebate-page-right">
      <list-page>
        <div class="rebate-content">
          <div class="detail">
            <h4>{{$t('rebate.detail')}}</h4>
            <div class="items">
              <detail-item :label="$t('rebate.amount')">
                ￥{{loading ? $t('message.loading') : rebate.amount | moneyFormat}}
              </detail-item>
              <detail-item :label="$t('rebate.bets')">
                {{loading ? $t('message.loading') : rebate.turnoverAmount | moneyFormat}}
              </detail-item>
              <detail-item :label="$t('rebate.weekBets')">
                {{loading ? $t('message.loading') : rebate.totalTurnoverAmount | moneyFormat}}
              </detail-item>
            </div>
          </div>
          <div class="rules">
            <h4>
              <span>{{$t('rebate.ruleLabel')}}</span>
              <v-touch tag="a" @tap="$router.push('/rebatedetail')" >{{$t('rebate.more')}}<pre> ></pre></v-touch>
            </h4>
            <div class="items">
              <rule-item :values="[$t('rebate.ruleTitles.level'), $t('rebate.ruleTitles.requirement'), $t('rebate.ruleTitles.proportion')]" />
              <rule-item
                v-for="(r, i) in rules"
                :key="i"
                :active="r[0] === userinfo.memberLevel"
                :values="[$t(`pagelite.levels.${r[0]}`), $t(`rebate.ruleRequirs.${r[1] > 0 ? 'weekly' : '0'}`, { bets: r[1] }),  r[2]]"
              />
            </div>
          </div>
        </div>
      </list-page>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { PortalAgyyConfig } from '@/config/constants';
import { getRebate, submitRebate } from '@/api/portalAgyy';
import ListPage from '@/components/common/ListPage';
import NavBar from '@/components/common/NavBar';
import AcountBlock from '@/components/common/AcountBlock';
import DetailItem from '@/components/Rebate/DetailItem';
import RuleItem from '@/components/Rebate/RuleItem';

export default {
  data() {
    return {
      rebate: {
        amount: 0,
        turnoverAmount: 0,
        totalTurnoverAmount: 0,
      },
      loading: false,
    };
  },
  computed: {
    ...mapState('app', ['userinfo', 'horizScreen']),
    rules() {
      return PortalAgyyConfig.REBATE_RULES;
    },
    rebatable() {
      return this.rebate.amount >= PortalAgyyConfig.REBATE_AMOUNT_CONDITION;
    },
  },
  components: {
    ListPage,
    NavBar,
    AcountBlock,
    DetailItem,
    RuleItem,
  },
  created() {
    this.loadRebate();
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
        this.$toast.center(this.$t('rebate.success', { amount: totalAmount }));
        this.loadRebate();
      } finally {
        this.$loading.close();
      }
    },
  },
};
</script>
<style lang="less">
.rebate-page {
  background-image: url(./images/background.png);
  background-repeat: no-repeat;
  background-size: 3.75rem auto;
  .memberinfo {
    padding-bottom: 0;
  }
  .amount {
    display: flex;
    margin-top: .2rem;
    label {
      padding-bottom: .04rem;
      width: .98rem;
      text-align: right;
      font-size: .12rem;
      letter-spacing: -0.3px;
      color: #2e2f34;
    }
    span {
      position: relative;
      flex-grow: 1;
      line-height: .36rem;
      padding-left: .48rem;
      font-size: .3rem;
      letter-spacing: 3.7px;
      color: #ff5353;
      &::before {
        position: absolute;
        content: "￥";
        bottom: .04rem;
        left: .2rem;
        display: inline-block;
        font-size: .18rem;
        line-height: .18rem;
        color: #909090;
      }
    }
  }
  button {
    width: 100%;
    margin-top: .23rem;
    font-size: .14rem;
    color: rgba(255, 255, 255, .84);
    line-height: .4rem;
    letter-spacing: -0.3px;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    background-color: #ff5353;
    &.disabled {
      background: #909090;
    }
  }
  .detail, .rules {
    margin-top: .2rem;
    padding: 0 .1rem;
    border-radius: 6px;
    h4 {
      font-size: 14px;
      letter-spacing: -0.3px;
      color: #909090;
      font-weight: normal;
      padding-left: .2rem;
    }
    .items {
      position: relative;
      margin-top: .1rem;
      border-radius: 6px;
      overflow: hidden;
      * {
        position: relative;
        z-index: 1;
      }
      &::before {
        content: "";
        display: block;
        position: absolute;
        opacity: 0.5;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        background-image: linear-gradient(to bottom, #ffffff, #fcfcfc);
      }
    }
  }
  .rules {
    h4 {
      display: flex;
      span {
        flex-grow: 1;
      }
      a {
        font-size: .12rem;
        color: #909090;
        transform: translateY(.03rem);
        pre {
          display: inline;
        }
      }
    }
    .items {
      border-radius: 0;
    }
  }
}
.rebate-content {
  padding-left: .1rem;
}

.webp .rebate-page {
  background-image: url(./images/background.webp);
}
.black .rebate-page {
  .nav-bar svg path{
    fill: #fff;
  }
  .amount label {
    color: #909090;
  }
  .detail, .rules {
    h4 {
      color: #716d6d;
    }
    a {
      color: #716d6d;
    }
    .items::before {
      background-image: linear-gradient(to bottom, #3a393f, #333238);
    }
  }
}
.rebate-page-left {
  float: left;
  width: 3.75rem;
  height: 100%;
  .rebate-left-header {
    position: relative;
    z-index: 13;
  }
  .rebate-left-content {
    position: relative;
    flex-grow: 1;
    z-index: 10;
    width: 3.75rem;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: .1rem;
  }
}
.rebate-page-right {
  float: right;
  width: 3.75rem;
  height: 100%;
  .rebate-content {
    margin-top: .05rem;
  }
}
.horizontal .rebate-page {
  width: 100%;
  height: 100%;
}
</style>
