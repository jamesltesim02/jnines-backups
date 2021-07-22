<template>
  <div class="query-input flex-start">
    <input type="text" ref="ipt" class="input-hide" v-model="numStr" :maxlength="maxlength">
    <div :class="`input-title flex-${active ? 'start' : 'center'}`">
      <span :class="`sel-text${active ? '-active' : ''} flex-center`">{{numStr}}</span>
      <span class="sel-def flex-center" v-if="!numStr">{{placeholder}}</span>
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'QueryInput',
  data() {
    return { numStr: '', active: false };
  },
  props: { data: String, placeholder: String, maxlength: Number },
  watch: {
    data() {
      if (`${this.numStr}` !== `${this.data}`) {
        this.numStr = this.data;
      }
    },
    numStr(n) {
      this.$emit('update:data', /^\d+\.?\d*$/.test(n) ? n : `${n}`.slice(0, -1));
    },
  },
  mounted() {
    this.numStr = this.data;
    const that = this;
    this.$refs.ipt.addEventListener('focus', () => {
      [that.$refs.ipt.selectionStart, that.active] = [that.numStr.length, true];
    });
    this.$refs.ipt.addEventListener('input', () => {
      let val = that.$refs.ipt.value;
      val = /^\d+\.?\d*$/.test(val) ? val : `${val}`.slice(0, -1);
      [that.$refs.ipt.value, that.numStr, that.active] = [val, val, true];
    });
    this.$refs.ipt.addEventListener('blur', () => {
      that.active = false;
    });
  },
};
</script>

<style lang="less">
@keyframes queryblink {
  from { border-right: .02rem solid rgba(151,151,151,1); }
  50% { border-right: .02rem solid rgba(151,151,151,0); }
  to { border-right: .02rem solid rgba(151,151,151,1); }
}
.white .query-input {
  border: .01rem solid #EBE9E9;
  background: #fff;
  .input-title {
    .sel-text, .sel-text-active {
      color: #ff5353;
    }
    .sel-def {
      color: #909090;
    }
  }
}
.black .query-input {
  border: .01rem solid #716d6d;
  .input-title {
    .sel-text, .sel-text-active {
      color: #ff5353;
    }
    .sel-def {
      color: #909090;
    }
  }
}
.query-input {
  position: relative;
  width: 3.5rem;
  height: .44rem;
  border-radius: .04rem;
  padding-right: .45rem;
  .input-title {
    position: absolute;
    z-index: 19;
    width: 3.05rem;
    height: 100%;
    .sel-text, .sel-text-active, .sel-def {
      height: .2rem;
      font-family: PingFangSC;
    }
    .sel-text, .sel-text-active {
      font-size: .14rem;
      letter-spacing: .02rem;
    }
    .sel-text {
      padding: 0 .1rem;
      border-right: .02rem solid transparent;
    }
    .sel-text-active {
      padding-left: .64rem;
      animation: queryblink 1000ms infinite;
    }
    .sel-def {
      padding: 0 .2rem 0 .02rem;
      font-size: .12rem;
    }
  }
  .input-hide {
    position: absolute;
    z-index: 99;
    width: 100%;
    height: 100%;
    opacity: 0;
    color: transparent;
    border: none;
    outline: none;
    top: 0;
    left: 0;
    padding-left: .64rem;
    font-size: .14rem;
    letter-spacing: .02rem;
    font-family: PingFangSC;
  }
}
</style>
