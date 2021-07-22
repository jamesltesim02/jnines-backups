<template>
  <div class="home-notice flex-between" v-if="show">
    <div class="notice-title flex-center"><slot /></div>
    <div class="notice-box">
      <div class="notice-body flex-center" :style="{ left: `${left[0]}px` }">
        <v-touch tag="span" v-for="(v, k) in data" :key="k" @tap="setJumpNewObject(v)">
          {{v.title}}
        </v-touch>
      </div>
      <div class="notice-body flex-center" :style="{ left: `${left[1]}px` }">
        <v-touch tag="span" v-for="(v, k) in data" :key="k" @tap="setJumpNewObject(v)">
          {{v.title}}
        </v-touch>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { findNotice } from '@/api/pull';

export default {
  data() {
    return {
      data: [],
      left: [0, 99999999],
      timer: null,
      show: false,
    };
  },
  methods: {
    ...mapMutations('app', ['setJumpNewObject']),
    async getData() {
      [this.data, this.left] = [[], [0, 99999999]];
      try {
        const dt = await findNotice() || [];
        for (let i = 0; i < dt.length; i += 1) {
          this.data.push({ title: dt[i].noticeTitle, detail: dt[i].noticeBody });
        }
        const oData = JSON.parse(JSON.stringify(this.data));
        if (this.data.length > 0 && this.data.length < 6) {
          for (let i = 0; i < 6; i += 1) {
            this.data = this.data.concat(oData);
            if (this.data.length >= 6) break;
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    runMaquee() {
      const that = this;
      clearInterval(this.timer);
      const nBody = document.querySelector('.home-notice .notice-box .notice-body');
      const width = nBody ? nBody.offsetWidth : 0;
      this.timer = setInterval(() => {
        const [nLeft, nStep] = [JSON.parse(JSON.stringify(that.left)), 1];
        nLeft[0] -= nStep;
        nLeft[1] = nLeft[1] === 99999999 ? nLeft[0] + width : nLeft[1] - nStep;
        nLeft[0] = nLeft[0] <= -width ? nLeft[0] + width * 2 : nLeft[0];
        nLeft[1] = nLeft[1] <= -width ? nLeft[1] + width * 2 : nLeft[1];
        that.left = nLeft;
      }, 30);
    },
  },
  async mounted() {
    this.show = false;
    clearInterval(this.timer);
    await this.getData();
    if (this.data.length > 0) {
      this.show = true;
      setTimeout(this.runMaquee, 400);
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="less">
.white .home-notice {
  .notice-title { color: #a9a9a9; }
  .notice-body span { color: #ff5353; }
}
.black .home-notice {
  .notice-title { color: #6f6e6e; }
  .notice-body span { color: #ecdbde; }
}
.blue .home-notice {
  .notice-title { color: #6f6e6e; }
  .notice-body span { color: #ecdbde; }
}
.home-notice {
  width: 3.75rem;
  height: .3rem;
  .notice-title, .notice-body span {
    white-space: nowrap;
    font-size: .12rem;
    user-select: none;
  }
  .notice-title { width: .55rem; }
  .notice-box {
    position: relative;
    height: 100%;
    flex-grow: 1;
    overflow: hidden;
    .notice-body {
      position: absolute;
      height: 100%;
      span { padding-right: .5rem; }
    }
  }
}
.home-three .home-notice { margin: .12rem 0; }
</style>
