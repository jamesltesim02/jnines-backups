<template>
  <div class="x-following-program">
    <v-touch tag="header" @tap="toPubDetail" >
      <icon-head :src="program.header" />
      <div class="publisher">
        <div class="title-line">
          <h3>{{ program.nickName }}</h3>
          <template v-if="tags && tags.length">
            <span
              v-for="(t, i) in tags"
              :key="i"
              :class="tagClass(t)"
            >{{tagStr(t)}}</span>
          </template>
          <span
            v-if="program.longRedCount > 0"
            class="max-win-count"
          >{{program.longRedCount}}连红</span>
        </div>
        <div class="date">{{ program.planCreateDate | dateFormat('MM/dd HH:mm') }}</div>
      </div>
      <div class="return-rate">
        <div>大于<span>{{ parseInt(program.odds * 100) }}</span>%</div>
        <label>回报率</label>
      </div>
    </v-touch>
    <section>
      <div class="title">{{ program.planTitle }}</div>
      <program-match-items
        :items="program.items"
        :ensure-odds="program.ensureOdds"
      />
    </section>
    <v-touch tag="footer" @tap="toPubDetail" >
      <div class="self-amount">自购<span>{{ program.betAmount | moneyFormat }}</span>元</div>
      <div class="follow-count">跟单<span>{{ program.followCount }}</span>人</div>
    </v-touch>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import ProgramMatchItems from '@/components/XSports/Xmember/ProgramMatchItems';
import IconHead from './icons/IconHead';

export default {
  props: {
    program: { default: {} },
  },
  computed: {
    tags() {
      return this.program.tags ? `${this.program.tags}`.split('#') : [];
    },
  },
  components: { IconHead, ProgramMatchItems },
  methods: {
    ...mapMutations('app', ['setPageAziFlag']),
    tagClass(v) {
      let clsStr = /^1/.test(v) ? 'tag' : 'tag';
      clsStr = /^0/.test(v) ? 'max-win-count' : clsStr;
      return clsStr;
    },
    tagStr(v) {
      return /^\d/.test(v) ? `${v}`.slice(1) : `${v}`;
    },
    toPubDetail() {
      if (this.program && this.program.ticketId) {
        this.setPageAziFlag(1);
        this.$router.push(`/publishdetail/${this.program.ticketId}`);
      }
    },
  },
};
</script>
<style lang="less">
.x-following-program {
  border-radius: 6px;
  box-shadow: 0 10px 20px 0 rgba(223, 222, 223, 0.5);
  border: solid 1px #ecebeb;
  background-image: linear-gradient(to top, #f9f9f9, #ffffff);
  margin-top: .1rem;
  padding: .15rem .1rem 0;
  & > header {
    display: grid;
    grid-template-columns: .4rem 1fr .7rem;
    .icon-head {
      width: .4rem;
      height: .4rem;
    }
    .publisher {
      padding-left: .08rem;
      .title-line {
        display: flex;
        line-height: .21rem;
        align-items: center;
        h3 {
          font-size: .16rem;
        }
        span {
          display: inline-block;
          margin-left: .06rem;
          line-height: .16rem;
          height: .16rem;
          font-size: .12rem;
          padding: 0 .06rem;
          border-radius: 10rem;
          border-top-left-radius: 0;
        }
        .tag {
          color: #6eb4ff;
          background: rgba(110, 180, 255, 0.1);
          border: 1px solid #6eb4ff;
        }
        .max-win-count {
          color: #ff5353;
          background-color: rgba(255, 83, 83, 0.1);
          border: 1px solid #ff5353;
        }
      }
      .date {
        line-height: .16rem;
        font-size: .12rem;
        color: #bababa;
        margin-top: .03rem;
        letter-spacing: -0.23px;
      }
    }
    .return-rate {
      text-align: right;
      font-size: .12rem;
      color: #ff5353;
      letter-spacing: -1px;
      white-space: nowrap;
      span {
        font-size: .24rem;
        letter-spacing: -2px;
        line-height: .24rem;
        padding-right: .01rem;
      }
      label {
        padding-right: .06rem;
        font-weight: bolder;
      }
    }
  }
  & > section {
    .title {
      margin-top: .04rem;
      padding: .05rem 0;
      line-height: .2rem;
      font-size: .14rem;
      color: #505050;
      letter-spacing: -0.27px;
    }
    .detail {
      margin: 0 -.1rem;
      background-image: linear-gradient(to top, #fcfcfc, #f3f3f3);
      border-top: 1px solid #f8f8f8;
      border-bottom: 1px solid #f6f6f6;
      padding: 0 .1rem;
    }
  }
  & > footer {
    line-height: .36rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    color: #909090;
    background: #fff;
    .follow-count {
      text-align: right;
    }
    span {
      font-size: 16px;
      color: #ff5353;
      margin: 0 .03rem;
    }
  }
}
</style>
