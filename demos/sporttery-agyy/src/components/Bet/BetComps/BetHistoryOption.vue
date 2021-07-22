<template>
  <div class="nb-history-option">
    <div :class="boxClass">
      <div class="detail-real-head flex-start">
        <span class="head-index" v-if="showId || !isSingle">{{data.idx}}</span>
        <rolling-text class="head-team" :text="getOptName(data)" :maxLength="11" scrollamount="1" />
        <span class="head-odds">{{getOddv(data)}}</span>
        <span class="head-blank"></span>
        <span class="head-score" v-if="data.live || /^1$/.test(data.matchState)">{{data.msc || data.matchScore}}</span>
        <span class="head-blank"></span>
        <div class="head-win-box" v-if="!isSingle">
          <span class="head-box-win" v-if="/^\d{2,3}$/.test(data.res)">{{data.winStu}}</span>
          <span class="head-box-lose" v-else-if="/^-\d{2,3}$/.test(data.res)">{{data.winStu}}</span>
          <span class="head-box-other" v-else>{{data.winStu || ''}}</span>
        </div>
      </div>
      <div class="history-body-item flex-start">
        <span class="body-item-team">{{$t(`common.wf.wf_${getJoinStr(data)}`)}}</span>
      </div>
      <div class="history-body-item flex-start">
        <rolling-text class="body-item-legal" :text="data.tn || data.tournamentName || ''" :maxLength="8" scrollamount="1" />
        <div class="body-item-line flex-center"><i></i></div>
        <rolling-text class="body-item-team" :text="getCompName(data)" :maxLength="24" scrollamount="2" />
      </div>
    </div>
  </div>
</template>

<script>
import toOptionName from '@/components/common/GameOption/toOptionName';
import RollingText from '@/components/common/RollingText';
import oddsFormat from '@/filters/oddsFormat';

export default {
  inheritAttrs: false,
  name: 'BetHistoryOption',
  props: {
    data: Object,
    isSingle: Boolean,
    showId: Boolean,
  },
  computed: {
    boxClass() {
      return `history-body-${this.isSingle ? 'single' : 'multiple'}`;
    },
  },
  components: {
    RollingText,
  },
  methods: {
    getOddv(v) {
      return v.odv ? v.odv : oddsFormat(v.ods || v.odds, v.gmt || v.gameType);
    },
    getJoinStr(v) {
      return `${v.sno || v.sportID}_${v.gpt || v.groupType || 0}_${v.stg || v.betStage || 0}_${v.gmt || v.gameType || 0}`;
    },
    getOptName(v) {
      const obj = toOptionName(v.gmt || v.gameType, v.bar || v.betBar, v.bop || v.betOption, true);
      let optName = obj.key_s ? this.$t(`common.optionNames.${obj.key_s}`) : '';
      optName += obj.prefix ? `${/-/.test(obj.prefix) ? '' : '+'}${obj.prefix} ` : '';
      optName += obj.key_e ? this.$t(`common.optionNames.${obj.key_e}`) : '';
      optName += !obj.key_s && obj.key ? this.$t(`common.optionNames.${obj.key}`) : '';
      return `${optName}${obj.value || ''}${obj.suffix || ''}`;
    },
    getCompName(v) {
      const cStr = v.mn || v.compName || '';
      return cStr && v.fmsc ? cStr.replace(/\s+vs\s+/i, ` ${v.fmsc.replace(':', ' vs ')} `) : cStr;
    },
  },
};
</script>

<style lang="less">
.white .nb-history-option {
  .history-body-single, .history-body-multiple {
    .head-win-box .head-box-win {
      border: .01rem solid #ff5353;
      color: #fe6246;
    }
    .head-win-box .head-box-lose {
      border: .01rem solid #428723;
      color: #428723;
    }
    .head-win-box .head-box-other {
      border: .01rem solid transparent;
      color: #909090;
    }
    .history-body-item i {
      background: #CCC;
    }
  }
  .history-body-single .history-body-item span, .history-body-single .history-body-item marquee {
    color: #3A3A3A;
  }
  .history-body-multiple .history-body-item span, .history-body-multiple .history-body-item marquee {
    color: #666;
  }
  .detail-real-head .head-team, .detail-real-head .head-odds {
    color: #333;
  }
  .detail-real-head .head-score {
    background: rgba(255,104,27,0.1);
    color: #FE6246;
  }
}
.black .nb-history-option {
  .history-body-single, .history-body-multiple {
    .head-win-box .head-box-win {
      border: .01rem solid #ff5353;
      color: #fe6246;
    }
    .head-win-box .head-box-lose {
      border: .01rem solid #428723;
      color: #428723;
    }
    .head-win-box .head-box-other {
      border: .01rem solid transparent;
      color: #bababa;
    }
    .history-body-item i {
      background: #CCC;
    }
  }
  .history-body-single .history-body-item span, .history-body-single .history-body-item marquee {
    color: #bababa;
  }
  .history-body-multiple .history-body-item span, .history-body-multiple .history-body-item marquee {
    color: #bababa;
  }
  .detail-real-head .head-team, .detail-real-head .head-odds {
    color: #ecebeb;
  }
  .detail-real-head .head-score {
    box-shadow: 0 .02rem .06rem 0 rgba(255,104,27,0.1);
    background: rgba(255,104,27,0.1);
    color: #fe6246;
  }
}
.nb-history-option {
  width: 100%;
  .history-body-single, .history-body-multiple {
    .history-body-item {
      width: 100%;
      height: .2rem;
      padding: 0 .12rem;
      span, marquee {
        white-space: nowrap;
        font-size: .12rem;
        user-select: none;
      }
      .body-item-legal {
        max-width: .4rem;
      }
      .body-item-team {
        max-width: 1.5rem;
      }
      .body-item-line {
        width: .13rem;
        height: .12rem;
        i {
          width: .01rem;
          height: .12rem;
        }
      }
    }
  }
  .history-body-single .detail-real-head .head-team {
    font-size: .16rem;
  }
  .history-body-multiple .detail-real-head .head-team {
    font-size: .14rem;
  }
  .history-body-single .detail-real-head .head-odds {
    font-size: .16rem;
  }
  .history-body-multiple .detail-real-head .head-odds {
    font-size: .14rem;
  }
  .detail-real-head {
    width: 100%;
    height: .34rem;
    padding: 0 .12rem;
    .head-index {
      color: #ff5353;
      font-size: .13rem;
      padding-top: .01rem;
      padding-right: .05rem;
    }
    .head-team {
      max-width: 1rem;
      white-space: nowrap;
      user-select: none;
    }
    .head-odds {
      padding-left: .05rem;
      user-select: none;
    }
    .head-blank {
      padding-left: .15rem;
    }
    .head-score {
      border-radius: .02rem;
      padding: .02rem .04rem;
      font-size: .13rem;
      user-select: none;
    }
    .head-win-box span {
      padding: .04rem;
      border-radius: .02rem;
      font-size: .12rem;
      user-select: none;
    }
  }
}
</style>
