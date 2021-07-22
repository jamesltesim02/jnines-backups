<template>
  <bet-cover-box class="nb-check-mobile" :index="399999" :show="show" @close="closeFun">
    <div class="check-mobile-body">
      <div class="body-items">
        <div class="alert-head flex-between-top">
          <div class="alert-head-flag"><query-alert /></div>
          <div class="alert-text">{{$t('withBank.mobileAlert')}}</div>
        </div>
        <div class="body-phone flex-between">
          <div class="phone-title">{{$t('withBank.mobilePhone')}}</div>
          <phone-input :data.sync="phone" />
        </div>
        <div class="body-message flex-center">
          <input class="msg-input" type="text" v-model="phoneCode" maxlength="6" :placeholder="$t('withBank.inputMessage')">
          <v-touch class="msg-btn flex-center" @tap="messageFun">
            <span class="btn-active" v-if="second">{{`${second} ${$t('withBank.sendSecond')}`}}</span>
            <span class="btn-normal" v-else>{{$t('withBank.sendMessage')}}</span>
          </v-touch>
        </div>
        <div class="alert-foot flex-start">
          <query-alert class="alert-flag" />
          <span class="alert-text">{{$t('withBank.hasQuestion')}}</span>
          <v-touch tag="span" class="serve-btn" @tap="serveFun">{{$t('withBank.online')}}</v-touch>
        </div>
      </div>
      <v-touch class="body-btn flex-center" @tap="submitFun">{{$t('withBank.nextStep')}}</v-touch>
    </div>
    <div class="check-mobile-close flex-center"><bet-cover-close /></div>
  </bet-cover-box>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { toCustomerService } from '@/utils/app/AppAdapter';
import BetCoverClose from '@/components/Bet/BetComps/BetCoverClose';
import BetCoverBox from '@/components/Bet/BetComps/BetCoverBox';
import QueryAlert from '@/components/QueryAndBank/QueryAlert';
import PhoneInput from '@/components/QueryAndBank/PhoneInput';
import { checkPhone, getPhoneMessage, verPhoneMessage } from '@/api/portalAgyy';

export default {
  inheritAttrs: false,
  name: 'CheckMobile',
  data() {
    return {
      phone: '',
      phonePass: false,
      phoneCode: '',
      secondDef: 300,
      second: 0,
      timer: null,
    };
  },
  computed: {
    ...mapState('app', {
      data: state => state.bankObj,
      user: state => state.userinfo || {},
    }),
    show() {
      return !!(this.data && /1/.test(this.data.step));
    },
  },
  watch: {
    show() {
      this.setDefault();
    },
    user() {
      this.setDefault();
    },
    async phone() {
      let pPass = /^1[2-9]\d{9}$/.test(this.phone);
      if (pPass) {
        try {
          await checkPhone({ phone: this.phone });
        } catch (e) {
          pPass = false;
        }
      }
      this.phonePass = pPass;
    },
  },
  components: {
    BetCoverClose,
    BetCoverBox,
    QueryAlert,
    PhoneInput,
  },
  methods: {
    ...mapMutations('app', ['setBankObject', 'setMsgCheckTime']),
    getPhone() {
      const phone = this.user && this.user.phone ? this.user.phone : '';
      return phone.replace(/[^\d]/g, '');
    },
    setDefault() {
      clearInterval(this.timer);
      [this.phonePass, this.phoneCode] = [false, ''];
      [this.phone, this.second] = [this.getPhone(), 0];
    },
    closeFun() {
      this.setBankObject();
    },
    async messageFun() {
      if (!this.second && this.phonePass) {
        try {
          await getPhoneMessage({ phone: this.phone, type: 'bank' });
          this.second = this.secondDef;
        } catch (e) {
          if (e && e.msg) {
            const numArr = e.msg.match(/(\d+)/);
            this.second = numArr ? +numArr[1] : 0;
          }
        }
        if (this.second) {
          this.timer = setInterval(() => {
            if (this.second <= 1) {
              clearInterval(this.timer);
              this.second = 0;
            } else {
              this.second -= 1;
            }
          }, 1000);
        }
      } else if (!this.second) {
        this.$toast(this.$t('withBank.mobileWrong'));
      }
    },
    async submitFun() {
      if (!this.phonePass) {
        this.$toast(this.$t('withBank.mobileWrong'));
      } else if (!/^\d{6}$/.test(this.phoneCode)) {
        this.$toast(this.$t('withBank.messageWrong'));
      } else {
        try {
          await verPhoneMessage({ phone: this.phone, type: 'bank', code: this.phoneCode });
          this.setBankObject({ step: 2 });
          this.setMsgCheckTime();
        } catch (e) {
          if (e && e.msg) this.$toast(e.msg);
        }
      }
    },
    serveFun() {
      this.setBankObject();
      toCustomerService(this);
    },
  },
  mounted() {
    this.setDefault();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style lang="less">
.nb-check-mobile .nb-bet-public-box-body {
  top: 1.05rem;
  .check-mobile-body {
    position: relative;
    border-radius: .1rem;
    background: #fff;
    width: 3.15rem;
    margin: 0 auto;
    padding-bottom: .5rem;
    overflow: hidden;
    .body-items {
      width: 100%;
      height: 2.54rem;
      .alert-head {
        width: 100%;
        padding: .2rem .15rem;
        border-bottom: .01rem solid rgba(236, 236, 236, 0.5);
        .alert-head-flag {
          width: .14rem;
          height: 100%;
          padding-top: .02rem;
        }
        .alert-text {
          width: 2.67rem;
          font-size: .12rem;
          color: #909090;
        }
      }
      .body-phone {
        width: 2.85rem;
        height: .43rem;
        margin: .15rem auto 0;
        .phone-title {
          font-size: .14rem;
          font-weight: 500;
          color: #909090;
        }
      }
      .body-message {
        width: 2.85rem;
        height: .43rem;
        border-radius: .04rem;
        margin: .1rem auto 0;
        overflow: hidden;
        .msg-input {
          width: 1.89rem;
          height: .43rem;
          border-left: .01rem solid #ecebeb;
          border-right: none;
          border-top: .01rem solid #ecebeb;
          border-bottom: .01rem solid #ecebeb;
          -webkit-appearance: none;
          border-radius: 0;
          font-size: .12rem;
          color: #909090;
          padding-left: .14rem;
          letter-spacing: 0.02rem;
        }
        .msg-btn {
          width: .96rem;
          height: .43rem;
          background: #ff5353;
          .btn-normal {
            font-size: .14rem;
            color: #efefef;
            user-select: none;
          }
          .btn-active {
            font-size: .14rem;
            color: rgba(236, 236, 236, 0.8);
            user-select: none;
          }
        }
      }
      .alert-foot {
        width: 2.85rem;
        height: .2rem;
        margin: .15rem auto 0;
        .alert-flag {
          margin-right: .04rem;
        }
        .alert-text {
          font-size: .12rem;
          color: #909090;
        }
        .serve-btn {
          font-size: .12rem;
          color: #ff5353;
          text-decoration: underline;
        }
      }
    }
    .body-btn {
      position: absolute;
      width: 100%;
      height: .5rem;
      left: 0;
      bottom: 0;
      color: #fff;
      background: #ff5353;
      font-size: .16rem;
    }
  }
  .check-mobile-close {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -.72rem;
    height: .72rem;
  }
}
.horizontal .nb-check-mobile .nb-bet-public-box-body {
  top: .1rem;
  .check-mobile-close {
    position: absolute;
    left: auto;
    right: -.72rem;
    bottom: 0;
    width: .72rem;
    height: 100%;
  }
}
</style>
