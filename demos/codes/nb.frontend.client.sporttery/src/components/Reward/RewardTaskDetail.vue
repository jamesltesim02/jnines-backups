<template>
  <div class="nb-reward-task-detail flex-between" >
    <div class="nb-reward-detail-lft flex-start">
      <div class="reward-detail-icon flex-center">
        <icon-publish-white v-if="/^3$/.test(type) && !/blue/.test(theme)" />
        <icon-publish-blue v-if="/^3$/.test(type) && /blue/.test(theme)" />
        <icon-share-white v-if="/^(2|8|9|10|11)$/.test(type) && !/blue/.test(theme)" />
        <icon-share-blue v-if="/^(2|8|9|10|11)$/.test(type) && /blue/.test(theme)" />
        <icon-follow-white v-if="/^4$/.test(type) && !/blue/.test(theme)" />
        <icon-follow-blue v-if="/^4$/.test(type) && /blue/.test(theme)" />
        <icon-bet-white v-if="/^1$/.test(type) && !/blue/.test(theme)" />
        <icon-bet-blue v-if="/^1$/.test(type) && /blue/.test(theme)" />
        <icon-shine-white v-if="/^5$/.test(type) && !/blue/.test(theme)" />
        <icon-shine-blue v-if="/^5$/.test(type) && /blue/.test(theme)" />
        <icon-week-white v-if="/^12$/.test(type) && !/blue/.test(theme)" />
        <icon-week-blue v-if="/^12$/.test(type) && /blue/.test(theme)" />
      </div>
      <div class="reward-detail-txt-box flex-between-col">
        <span class="reward-detail-title flex-start">{{detailTitle}}</span>
        <span class="reward-detail-text flex-start">{{detailText}}</span>
      </div>
    </div>
    <v-touch class="nb-reward-detail-rgt flex-center" @tap="toPageFun">
      <span class="to-finish flex-center" v-if="isToFinish">{{$t('share.toFinish')}}</span>
      <span class="to-reward flex-center" v-if="isFinished">{{$t('share.toGetReward')}}</span>
      <span class="rewarded flex-center" v-if="isRewarded">{{$t('share.rewarded')}}</span>
    </v-touch>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { getTaskReward } from '@/api/activity';
import IconPublishWhite from '@/components/Reward/icon/IconPublishWhite';
import IconPublishBlue from '@/components/Reward/icon/IconPublishBlue';
import IconShareWhite from '@/components/Reward/icon/IconShareWhite';
import IconShareBlue from '@/components/Reward/icon/IconShareBlue';
import IconFollowWhite from '@/components/Reward/icon/IconFollowWhite';
import IconFollowBlue from '@/components/Reward/icon/IconFollowBlue';
import IconBetWhite from '@/components/Reward/icon/IconBetWhite';
import IconBetBlue from '@/components/Reward/icon/IconBetBlue';
import IconShineWhite from '@/components/Reward/icon/IconShineWhite';
import IconShineBlue from '@/components/Reward/icon/IconShineBlue';
import IconWeekWhite from '@/components/Reward/icon/IconWeekWhite';
import IconWeekBlue from '@/components/Reward/icon/IconWeekBlue';

export default {
  inheritAttrs: false,
  name: 'RewardTaskDetail',
  props: { type: String, baseData: Array },
  computed: {
    ...mapState('app', ['userinfo', 'theme']),
    data() {
      let dt = this.baseData && this.baseData.length ? this.baseData : [];
      dt = dt.filter(v => v.activityType && `${v.activityType}` === `${this.type}`);
      return dt && dt.length ? dt[0] : { };
    },
    userValid() {
      return !!(this.userinfo && this.userinfo.token && this.userinfo.nbUser);
    },
    dataValid() {
      return !!(this.data && /^\d+$/.test(this.data.total) && /^\d+$/.test(this.data.finish));
    },
    isValid() {
      return !!(this.userValid && this.dataValid && this.data.total && this.data.activityId);
    },
    isToFinish() {
      return !!(this.isValid && this.data.finish < this.data.total);
    },
    isFinished() {
      return !!(this.isValid && this.data.finish >= this.data.total && this.data.recordId && !this.data.reward);
    },
    isRewarded() {
      return !!(this.isValid && this.data.finish >= this.data.total && this.data.recordId && this.data.reward);
    },
    detailTitle() {
      let titleStr = '';
      if (/^1$/i.test(this.type)) {
        titleStr = this.$t('share.finishOneBet');
      } else if (/^2$/i.test(this.type)) {
        titleStr = `${this.$t('share.shareBetTo')}${this.data.total || 0}${this.$t('share.friendCnt')}`;
      } else if (/^3$/i.test(this.type)) {
        titleStr = this.$t('share.finishOnePub');
      } else if (/^4$/i.test(this.type)) {
        titleStr = this.$t('share.finishOneFlw');
      } else if (/^5$/i.test(this.type)) {
        titleStr = this.$t('share.finishOneShi');
      } else if (/^11$/i.test(this.type)) {
        titleStr = `${this.$t('share.shareFlwTo')}${this.data.total || 0}${this.$t('share.registerCnt')}`;
      } else if (/^12$/i.test(this.type)) {
        titleStr = `${this.$t('share.finishWeek')}${this.data.total || 0}${this.$t('share.weekCnt')}`;
      }
      return titleStr;
    },
    detailText() {
      let textStr = '';
      if (/^1$/i.test(this.type)) {
        textStr = `${this.$t('share.oneBetOver')}${500}${this.$t('share.rmb')}`;
      } else if (/^2$/i.test(this.type)) {
        textStr = `${this.$t('share.registerProc')}${this.data.finish || 0}/${this.data.total || 0}`;
      } else if (/^3$/i.test(this.type)) {
        textStr = `${this.$t('share.pubPlanCnt')}${this.data.finish || 0}/${this.data.total || 0}`;
      } else if (/^4$/i.test(this.type)) {
        textStr = `${this.$t('share.oneFlwOver')}${500}${this.$t('share.rmb')}`;
      } else if (/^5$/i.test(this.type)) {
        textStr = `${this.$t('share.shiPlanCnt')}${this.data.finish || 0}/${this.data.total || 0}`;
      } else if (/^11$/i.test(this.type)) {
        textStr = `${this.$t('share.registerProc')}${this.data.finish || 0}/${this.data.total || 0}`;
      } else if (/^12$/i.test(this.type)) {
        textStr = `${this.$t('share.tskFinshed')}${this.data.finish || 0}/${this.data.total || 0}`;
      }
      return textStr;
    },
  },
  components: {
    IconPublishWhite,
    IconPublishBlue,
    IconShareWhite,
    IconShareBlue,
    IconFollowWhite,
    IconFollowBlue,
    IconBetWhite,
    IconBetBlue,
    IconShineWhite,
    IconShineBlue,
    IconWeekWhite,
    IconWeekBlue,
  },
  methods: {
    ...mapMutations(['setTaskReward']),
    async getTaskPackage() {
      if (this.isFinished && /^(3|5|12)$/i.test(this.type)) {
        this.setTaskReward();
        const params = { userId: this.userinfo.nbUser, ActivityRecordId: this.data.recordId, activityRecordId: this.data.recordId };
        [params.count, params.index] = [1, 1];
        try {
          const dt = await getTaskReward(params);
          if (dt && dt.amountList && dt.amountList[0]) {
            const obj = Object.assign({ type: this.type }, dt || { });
            setTimeout(() => { this.setTaskReward(obj); }, 500);
          }
        } catch (e) {
          if (e && e.msg) {
            this.$toast(e.msg);
          }
        }
      }
    },
    toPageFun() {
      if (this.isFinished) {
        if (/^(1|2|4|11)$/i.test(this.type)) {
          this.$router.push(`/lottery/${this.data.recordId}/${this.type}`);
        } else if (/^(3|5|12)$/i.test(this.type)) {
          this.getTaskPackage();
        }
      } else if (this.isToFinish) {
        if (/^(1|12)$/i.test(this.type)) {
          this.$router.push('/xsports/1');
        } else if (/^2$/i.test(this.type)) {
          this.$router.push('/history/1');
        } else if (/^4$/i.test(this.type)) {
          this.$router.push('/publish/1');
        } else if (/^11$/i.test(this.type)) {
          this.$router.push(`/member/specialist/${this.userinfo.nbUser}/0`);
        } else if (/^3$/i.test(this.type)) {
          this.$router.push('/history/0');
        } else if (/^5$/i.test(this.type)) {
          this.$router.push(`/member/specialist/${this.userinfo.nbUser}/1`);
        }
      }
    },
  },
};
</script>

<style lang="less">
.nb-reward-task-detail {
  width: 100%;
  height: .76rem;
  margin-bottom: .1rem;
  border-radius: .06rem;
  padding: .15rem .12rem .15rem .1rem;
  border: .01rem solid #ececec;
  box-shadow: 0 .1rem .2rem 0 rgba(223,222,223,.3);
  background: linear-gradient(to top, #ffffff, #fafafa);
  .nb-reward-detail-lft { width: 2.56rem; height: 100%; }
  .reward-detail-icon { width: .46rem; height: .46rem; margin-right: .1rem; border-radius: 100%; overflow: hidden; }
  .reward-detail-txt-box { width: 2rem; height: .46rem; padding: .02rem 0; }
  .reward-detail-title { width: 100%; height: .22rem; font-size: .16rem; color: #2e2f34; }
  .reward-detail-text { width: 100%; height: .17rem; font-size: .12rem; color: #666666; }
  .nb-reward-detail-rgt { width: .74rem; height: .26rem; span { width: 100%; height: 100%; border-radius: .13rem; font-size: .14rem; } }
  .nb-reward-detail-rgt .to-finish { border: .01rem solid #ff5353; color: #ff5353; }
  .nb-reward-detail-rgt .to-reward { background: #ff5353; color: #ffffff; }
  .nb-reward-detail-rgt .rewarded { background: #bababa; color: #ffffff; }
}
.blue .nb-reward-task-detail {
  border: .01rem solid #313237;
  box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1);
  background: linear-gradient(to bottom, #3a393f, #333238);
  .reward-detail-title { color: #ecebeb; }
  .reward-detail-text { color: #909090; }
  .nb-reward-detail-rgt .to-finish { border: .01rem solid #53fffd; color: #53fffd; }
  .nb-reward-detail-rgt .to-reward { background: #00b5b3; color: #ffffff; }
  .nb-reward-detail-rgt .rewarded { background: #909090; color: #ffffff; }
}
</style>
