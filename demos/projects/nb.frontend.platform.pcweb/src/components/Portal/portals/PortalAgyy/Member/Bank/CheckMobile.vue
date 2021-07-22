<template>
  <sub-panel class="agyy-check-mobile-page" :title="$t('agPage.bank.addCardNew')" >
    <div class="check-mobile-box">
      <div class="check-mobile-title flex-start">{{$t('agPage.bank.titleOne')}}</div>
      <div class="input-mobile-box flex-start">
        <div class="phone-title flex-start">{{$t('agPage.bank.mobilePhone')}}</div>
        <phone-input class="mobile-phone-input" :data.sync="phone" />
      </div>
      <div class="check-mobile-title flex-start">{{$t('agPage.bank.titleTwo')}}</div>
      <div class="input-code-box flex-start">
        <input class="msg-input" type="text" v-model="phoneCode" maxlength="6" :placeholder="$t('agPage.bank.inputMessage')">
        <div class="msg-btn flex-center" @click="messageFun">
          <span class="btn-active" v-if="second">{{`${second} ${$t('agPage.bank.sendSecond')}`}}</span>
          <span class="btn-normal" v-else>{{$t('agPage.bank.sendMessage')}}</span>
        </div>
      </div>
      <customer-service class="mobile-service" start />
      <div class="mobile-btn-box flex-between">
        <div class="body-btn-return flex-center" @click="returnFun">{{$t('agPage.bank.prevStep')}}</div>
        <div class="body-btn-submit flex-center" @click="submitFun">{{$t('agPage.bank.nextStep')}}</div>
      </div>
    </div>
  </sub-panel>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import PhoneInput from './PhoneInput';
import SubPanel from '@/components/Portal/portals/PortalAgyy/Member/SubPanel';
import CustomerService from '@/components/Portal/portals/PortalAgyy/Member/CustomerService';
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
    ...mapState('app', { user: state => state.userinfo || {} }),
  },
  watch: {
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
  components: { PhoneInput, SubPanel, CustomerService },
  methods: {
    ...mapMutations('app', ['setMsgCheckTime']),
    ...mapMutations('agyy', ['pushRouter']),
    getPhone() {
      const phone = this.user && this.user.phone ? this.user.phone : '';
      return phone.replace(/[^\d]/g, '');
    },
    setDefault() {
      clearInterval(this.timer);
      [this.phonePass, this.phoneCode] = [false, ''];
      [this.phone, this.second] = [this.getPhone(), 0];
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
        this.$toast(this.$t('agPage.bank.mobileWrong'));
      }
    },
    returnFun() {
      this.pushRouter('/member/bank');
    },
    async submitFun() {
      if (!this.phonePass) {
        this.$toast(this.$t('agPage.bank.mobileWrong'));
      } else if (!/^\d{6}$/.test(this.phoneCode)) {
        this.$toast(this.$t('agPage.bank.messageWrong'));
      } else {
        try {
          await verPhoneMessage({ phone: this.phone, type: 'bank', code: this.phoneCode });
          this.setMsgCheckTime();
          this.pushRouter('/member/bank/bind');
        } catch (e) {
          if (e && e.msg) this.$toast(e.msg);
        }
      }
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
.agyy-check-mobile-page {
  .check-mobile-box { width: 100%; padding: 40px 46px; }
  .check-mobile-title { width: 100%; height: 30px; margin-bottom: 20px; font-size: 20px; font-weight: 500; color: #dddddd; }
  .input-mobile-box { width: 100%; height: 50px; margin-bottom: 40px; }
  .mobile-phone-input { width: 376px; height: 100%; border-radius: 4px; }
  .input-mobile-box .phone-title { width: 69px; height: 50px; font-size: 14px; font-weight: 500; color: #bababa; }
  .input-code-box {
    width: 445px;
    height: 50px;
    .msg-input {
      width: 66%;
      height: 100%;
      border-left: 1px solid #716d6d;
      border-right: none;
      border-top: 1px solid #716d6d;
      border-bottom: 1px solid #716d6d;
      -webkit-appearance: none;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      padding-left: 14px;
      letter-spacing: 4px;
      font-size: 14px;
      background: transparent;
      color: #909090;
    }
    .msg-btn {
      width: 34%;
      height: 100%;
      background: #ff5353;
      font-size: 14px;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      .btn-normal { color: #efefef; user-select: none; }
      .btn-active { color: rgba(236, 236, 236, 0.8); user-select: none; }
    }
  }
  .mobile-service { margin-top: 10px; }
  .mobile-btn-box { width: 445px; height: 50px; margin-top: 150px; font-size: 16px; font-weight: 500; }
  .body-btn-return { width: 38%; height: 100%; border-radius: 6px; background: #323136; color: #716d6d; }
  .body-btn-submit { width: 55%; height: 100%; border-radius: 6px; background: #ff5353; color: #eaeaea; }
}
</style>
