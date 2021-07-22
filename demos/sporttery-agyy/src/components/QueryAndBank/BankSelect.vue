<template>
  <v-touch tag="div" class="bank-select flex-between" @tap="showFun">
    <div class="select-title flex-start">
      <span class="sel-text" v-if="data.default">{{data.default}}</span>
      <span class="sel-def" v-else>{{placeholder}}</span>
    </div>
    <div class="select-arrow flex-center">
      <svg width=".12rem" height=".12rem" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <path d="M 0 14.5 L 100 14.5 L50 85.5 Z" :fill="/black/i.test(theme) ? '#bababa' : '#bababa'"></path>
      </svg>
    </div>
  </v-touch>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  inheritAttrs: false,
  name: 'BankSelect',
  props: {
    data: Object,
    placeholder: String,
  },
  computed: {
    ...mapState('app', {
      theme: state => state.theme,
    }),
  },
  methods: {
    ...mapMutations('query', ['setPickerData']),
    showFun() {
      const dt = this.data;
      dt.hide = false;
      this.setPickerData(JSON.parse(JSON.stringify(dt)));
    },
  },
};
</script>

<style lang="less">
.white .bank-select {
  border: .01rem solid #ecebeb;
  background: #fff;
  .select-title {
    .sel-text {
      color: #2e2f34;
    }
    .sel-def {
      color: #909090;
    }
  }
  .select-arrow {
    border-left: .01rem solid #ecebeb;
  }
}
.black .bank-select {
  border: .01rem solid #ecebeb;
  .select-title {
    .sel-text {
      color: #2e2f34;
    }
    .sel-def {
      color: #909090;
    }
  }
  .select-arrow {
    border-left: .01rem solid #ecebeb;
  }
}
.bank-select {
  width: 2.16rem;
  height: .43rem;
  border-radius: .04rem;
  .select-title, .select-arrow {
    height: 100%;
    font-size: .14rem;
    font-family: PingFangSC;
  }
  .select-title {
    width: 1.73rem;
    padding-left: .1rem;
    overflow: hidden;
    .sel-text, .sel-def {
      font-size: .14rem;
      font-family: PingFangSC;
      user-select: none;
    }
  }
  .select-arrow {
    width: .43rem;
  }
}
</style>
