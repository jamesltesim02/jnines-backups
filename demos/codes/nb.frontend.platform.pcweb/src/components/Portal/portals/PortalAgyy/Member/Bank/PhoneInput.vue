<template>
  <div class="phone-input flex-center">
    <input type="text" ref="ipt" class="input-hide" v-model="phoneMid" maxlength="7">
    <div class="input-title flex-center">
      <div class="title-start flex-center">{{phoneStart}}</div>
      <div class="title-mid flex-around">
        <div class="input-item flex-center" v-for="(v, k) in phoneArr" :key="k">
          <span :class="`sel-text${active && v.active ? '-active' : ''} flex-center`">{{v.text}}</span>
        </div>
      </div>
      <div class="title-end flex-center">{{phoneEnd}}</div>
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'PhoneInput',
  data() {
    return { numStr: '', phoneMid: '', active: false };
  },
  props: { data: String },
  computed: {
    phoneStart() {
      return this.numStr && this.numStr.length > 3 ? this.numStr.slice(0, 3) : '';
    },
    phoneEnd() {
      return this.numStr && this.numStr.length > 3 ? this.numStr.slice(-1) : '';
    },
    phoneArr() {
      const [arr, oArr] = [`${this.phoneMid}_______`.slice(0, 7).split(''), []];
      let flag = false;
      for (let i = 0; i < arr.length; i += 1) {
        oArr.push({ text: arr[i], active: !flag && !/^\d$/.test(arr[i]) });
        flag = flag || !/^\d$/.test(arr[i]);
      }
      return oArr;
    },
  },
  watch: {
    data() {
      if (`${this.numStr}` !== `${this.data}`) {
        this.changeStr();
      }
    },
    phoneMid(n) {
      const nStr = /^\d+$/.test(n) ? n : `${n}`.slice(0, -1);
      this.$emit('update:data', `${this.phoneStart}${nStr}${this.phoneEnd}`);
    },
  },
  methods: {
    changeStr() {
      this.numStr = this.data;
      this.phoneMid = this.numStr && this.numStr.length > 4 ? this.numStr.slice(3, -1) : '';
    },
  },
  mounted() {
    this.changeStr();
    const that = this;
    this.$refs.ipt.addEventListener('focus', () => {
      [that.$refs.ipt.selectionStart, that.active] = [that.phoneMid.length, true];
    });
    this.$refs.ipt.addEventListener('input', () => {
      let val = that.$refs.ipt.value;
      val = /^\d+$/.test(val) ? val : `${val}`.slice(0, -1);
      [that.$refs.ipt.value, that.phoneMid, that.active] = [val, val, true];
    });
    this.$refs.ipt.addEventListener('blur', () => {
      that.active = false;
    });
  },
};
</script>

<style lang="less">
@keyframes phoneblink {
  from { border-left: 2px solid rgba(151,151,151,1); }
  50% { border-left: 2px solid rgba(151,151,151,0); }
  to { border-left: 2px solid rgba(151,151,151,1); }
}
.phone-input {
  border: 1px solid #716d6d;
  position: relative;
  .input-title {
    position: absolute;
    z-index: 19;
    width: 100%;
    height: 100%;
    .title-start, .title-end, .sel-text, .sel-text-active { height: 100%; font-size: 16px; }
    .title-start { width: 26.6%; color: #f5f5f5; }
    .title-end { width: 14.1%; color: #f5f5f5; }
    .title-mid {
      width: 59.3%;
      height: 100%;
      border-left: 1px solid #716d6d;
      border-right: 1px solid #716d6d;
      padding: 0 14px;
      .input-item {
        width: 24px;
        height: 100%;
        .sel-text, .sel-text-active { width: 100%; height: 20px; }
        .sel-text { color: #f5f5f5; border-left: 2px solid transparent; }
        .sel-text-active { color: #ff5353; animation: phoneblink 1000ms infinite; }
      }
    }
  }
  .input-hide {
    position: absolute;
    z-index: 99;
    width: 59.3%;
    height: 100%;
    opacity: 0;
    color: transparent;
    border: none;
    outline: none;
    top: 0;
    left: 26.6%;
    padding-left: 18px;
    font-size: 16px;
    letter-spacing: 8px;
  }
}
</style>
