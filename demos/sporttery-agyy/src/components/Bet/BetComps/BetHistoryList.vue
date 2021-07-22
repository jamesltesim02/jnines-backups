<template>
  <transition name="history">
    <div class="nb-history-list" v-if="show">
      <div class="history-list-item flex-between" v-for="(v, k) in bArr" :key="k">
        <span class="list-item-name">{{v.oids.join('/')}}</span>
        <span v-if="v.win > 0" class="list-item-win">+{{v.win}}</span>
        <span v-else-if="v.win < 0" class="list-item-lose">{{v.win}}</span>
        <span v-else class="list-item-other">{{$t('pageBet.setNo')}}</span>
      </div>
    </div>
  </transition>
</template>

<script>
import { toSerList } from '@/utils/betUtils';

export default {
  inheritAttrs: false,
  name: 'BetHistoryList',
  data() {
    return {
      bArr: [],
    };
  },
  props: {
    data: Object,
  },
  computed: {
    show() {
      return this.data.detail;
    },
  },
  watch: {
    show() {
      this.calculateMult();
    },
  },
  methods: {
    repOids(arr = []) {
      let arrStr = JSON.stringify(arr);
      for (let i = 0; i < this.data.opts.length; i += 1) {
        arrStr = arrStr.replace(new RegExp(`([\\[,])${this.data.opts[i].oid}([,\\]])`, 'g'), `$1${i + 1}$2`);
      }
      arrStr = JSON.parse(arrStr);
      for (let i = 0; i < arrStr.length; i += 1) {
        arrStr[i].win = arrStr[i].win || 0;
      }
      return arrStr;
    },
    calculateMult() {
      const bOpts = JSON.parse(JSON.stringify(this.data.opts));
      const nData = JSON.parse(JSON.stringify(this.data.bets[0]));
      if (!this.show) {
        this.bArr = [];
        return;
      }
      let [flag, data] = [false, []];
      for (let i = 0; i < bOpts.length; i += 1) {
        if (!bOpts[i].mid || !bOpts[i].ods) {
          flag = true;
          break;
        }
        if (!bOpts[i].res) {
          [bOpts[i].odds, bOpts[i].flag] = [0, 1];
        } else if (/^(-50|-100)$/.test(bOpts[i].res)) {
          bOpts[i].odds = /5/.test(bOpts[i].res) ? 0.5 : 0;
        } else if (/^(50|100)$/.test(bOpts[i].res)) {
          const pt = bOpts[i].ods * (/5/.test(bOpts[i].res) ? 0.5 : 1);
          bOpts[i].odds = pt + 1;
        } else {
          bOpts[i].odds = 1;
        }
      }
      if (!flag && nData) {
        const amt = nData.tamt && nData.cnt ? nData.tamt / nData.cnt : 0;
        data = toSerList(bOpts, nData.num, nData.amt || amt);
      }
      this.bArr = data && data.length ? this.repOids(data) : [];
    },
  },
};
</script>

<style lang="less">
.history-enter-active, .history-leave-active {
  transition: all 0.15s linear;
}
.history-enter, .history-leave-active {
  transform: scaleY(0);
}
.white .nb-history-list {
  border-bottom: .01rem solid #ECEBEB;
  .history-list-item {
    border-bottom: .01rem solid #F7F7F7;
    .list-item-name {
      color: #666;
    }
    .list-item-win {
      color: #ff5353;
    }
    .list-item-lose {
      color: #428723;
    }
    .list-item-other {
      color: #999;
    }
  }
}
.black .nb-history-list {
  border-bottom: .01rem solid #2e2f34;
  .history-list-item {
    border-bottom: .01rem solid #2e2f34;
    .list-item-name {
      color: #bababa;
    }
    .list-item-win {
      color: #ff5353;
    }
    .list-item-lose {
      color: #428723;
    }
    .list-item-other {
      color: #999;
    }
  }
}
.nb-history-list {
  width: 100%;
  .history-list-item {
    width: 100%;
    height: .3rem;
    padding: 0 .15rem;
    border-bottom: .01rem solid #f1f1f1;
    .list-item-name, .list-item-win, .list-item-lose {
      font-size: .13rem;
    }
    .list-item-other {
      padding-right: .05rem;
      font-size: .12rem;
    }
  }
  .history-list-item:last-child {
    border: none;
  }
}
</style>
