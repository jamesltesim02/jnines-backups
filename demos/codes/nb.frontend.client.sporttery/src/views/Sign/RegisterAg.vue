<template>
  <sign-page
    class="register-page"
    :title="$t('page.registerTitle')"
    type="register"
  >
    <section>
      <username-field
        v-model="account"
        :placeholder="$t(`${isLite?'pagelite' : 'page'}.regAccountHolder`)"
        maxlength="11"
      />
      <password-field
        v-model="password"
        :placeholder="$t(`${isLite?'pagelite' : 'page'}.passwordHolder`)"
      />
      <captcha-field
        v-if="regType !== 3"
        ref="captchaField"
        type="register"
        v-model="captcha"
      />
      <word-check
        type="register"
        v-model="regPass"
        v-if="regType === 3"
        :text-captcha.sync="textCaptcha"
      />
    </section>
    <submit :label="$t('page.registerLabel')" @submit="doRegister" />
  </sign-page>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { StorageKey, AppModes, PortalAgyyConfig } from '@/config/constants';
import {
  getVerifyType,
  agFastRegister,
  getCustomer,
  transferToGame,
} from '@/api/portalAgyy';
import { memberRegister } from '@/api/activity';
import SignPage from '@/components/Sign/SignPage';
import UsernameField from '@/components/Sign/UsernameField';
import PasswordField from '@/components/Sign/PasswordField';
import CaptchaField from '@/components/Sign/CaptchaField';
import WordCheck from '@/components/Sign/WordCheck';
import Submit from '@/components/Sign/Submit';

const { APP_MODE } = window.NBConfig;

export default {
  data() {
    return {
      account: '',
      password: '',
      captcha: '',
      regPass: false,
      textCaptcha: '',
      isLite: APP_MODE === AppModes.STANDALONE_LITE,
      regType: 0,
    };
  },
  computed: {
    ...mapState('app', ['lastLocation']),
  },
  components: {
    SignPage,
    UsernameField,
    PasswordField,
    CaptchaField,
    WordCheck,
    Submit,
  },
  watch: {
    account() {
      this.regPass = false;
      this.textCaptcha = '';
    },
  },
  async mounted() {
    try {
      const type = await getVerifyType();
      this.regType = type.registerVerificationType;
    } catch (e) {
      console.log(e);
    }
  },
  methods: {
    ...mapActions('member', ['loadMemberInfo']),
    ...mapMutations('app', ['setUserinfo']),
    ...mapActions(['getNBUser']),
    async doRegister() {
      const {
        phone,
        internetPhone,
        registerPassword,
        captcha,
      } = PortalAgyyConfig.REGEXIES;

      // 手机号码不能为空
      if (!this.account) {
        this.$toast.center(this.$t('message.phoneRequire'));
        return;
      }
      // 网络运营商手机号码
      if (internetPhone.test(this.account)) {
        this.$toast.center(this.$t('message.internetPhone'));
        return;
      }
      // 手机号格式不对
      if (!phone.test(this.account)) {
        this.$toast.center(this.$t('message.phoneFail'));
        return;
      }

      // 密码不能为空
      if (!this.password) {
        this.$toast.center(this.$t('message.passwordRequire'));
        return;
      }
      // 密码长度
      const [PASS_MIN, PASS_MAX, passLen] = [8, 10, this.password.length];
      if (passLen < PASS_MIN || passLen > 10) {
        this.$toast.center(this.$t(
          'message.passwordLength',
          { min: PASS_MIN, max: PASS_MAX },
        ));
        return;
      }

      // 密码格式错误
      if (!registerPassword.test(this.password)) {
        this.$toast.center(this.$t('message.passwordFail'));
        return;
      }

      // 只会出现一种验证码(文字验证码时无需校验数字验证码)
      if (this.regType === 3) {
        // 文字验证未通过
        if (!this.regPass) {
          this.$toast.center(this.$t('message.wordCheckFail'));
          return;
        }
      } else {
        // 验证码不能为空
        if (!this.captcha) {
          this.$toast.center(this.$t('message.captchaRequire'));
          return;
        }
        // 验证码格式不正确
        if (!captcha.test(this.captcha)) {
          this.$toast.center(this.$t('message.captchaStyle'));
          return;
        }
      }

      try {
        let scanInfo = JSON.parse(JSON.stringify(this.scanInfo));
        scanInfo = scanInfo || { };
        this.$loading(this.$t('message.registing'));
        const regResult = await agFastRegister({
          phone: this.account,
          password: this.password,
          code: this.regType === 3 ? this.textCaptcha : this.captcha,
          userSource: PortalAgyyConfig.USER_SOURCE,
          isToken: true,
        });

        this.setUserinfo({ accessToken: regResult.accessToken });

        const transferResult = await transferToGame();
        const customerInfo = await getCustomer();
        this.setUserinfo({
          ...customerInfo,
          balance: 0,
          token: transferResult.token,
          loginName: customerInfo.userName,
          memberAccount: customerInfo.userName,
          memberLevel: customerInfo.userLevel,
          accessToken: regResult.accessToken,
        });
        await memberRegister({
          userName: this.account,
          password: this.password,
          code: this.captcha,
          frontId: this.frontId,
          ...scanInfo,
        });
        await this.getNBUser(true);
        await this.loadMemberInfo();
        this.$toast.center(this.$t(
          'message.registerSuccess',
          { account: regResult.loginName },
        ));
        // 保存最后一次登录账号名
        localStorage.setItem(StorageKey.LAST_LOGIN_USERNAME_KEY, customerInfo.userName);
        this.$nextTick(() => {
          if (
            this.lastLocation
            && this.lastLocation.path
            && !['/login', '/register'].includes(this.lastLocation.path)
          ) {
            this.$router.replace(this.lastLocation.path);
            return;
          }
          this.$router.replace('/');
        });
      } catch (e) {
        this.captcha = '';
        if (this.regType !== 3) {
          this.$refs.captchaField.loadCaptcha();
        }
      } finally {
        this.$loading.close();
      }
    },
  },
};
</script>
