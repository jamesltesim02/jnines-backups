<template>
  <sign-page
    class="register-page"
    :title="$t('page.registerTitle')"
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
        ref="captchaField"
        type="register"
        v-model="captcha"
      />
      <word-check
        type="register"
        v-model="regPass"
        v-if="/^3$/.test(agRegType)"
      />
      <submit
        :label="$t('page.registerLabel')"
        @submit="doRegister"
      />
    </section>
    <login-register-toggle
      to="/login"
      :label="$t('page.toggleLogin')"
    />
  </sign-page>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { StorageKey, AppModes, PortalAgyyConfig } from '@/config/constants';
import { agFastRegister, getCustomer, transferToGame } from '@/api/portalAgyy';
import SignPage from '@/components/Sign/SignPage';
import UsernameField from '@/components/Sign/UsernameField';
import PasswordField from '@/components/Sign/PasswordField';
import CaptchaField from '@/components/Sign/CaptchaField';
import WordCheck from '@/components/Sign/WordCheck';
import Submit from '@/components/Sign/Submit';
import LoginRegisterToggle from '@/components/Sign/LoginRegisterToggle';

const { APP_MODE } = window.NBConfig;

export default {
  data() {
    return {
      account: '',
      password: '',
      captcha: '',
      regPass: false,
      isLite: APP_MODE === AppModes.STANDALONE_LITE,
    };
  },
  computed: {
    ...mapState('app', ['lastLocation', 'agRegType']),
  },
  components: {
    SignPage,
    UsernameField,
    PasswordField,
    CaptchaField,
    WordCheck,
    Submit,
    LoginRegisterToggle,
  },
  watch: {
    account() {
      this.regPass = false;
    },
  },
  methods: {
    ...mapMutations('app', ['setUserinfo']),
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
      const [
        PASS_MIN,
        PASS_MAX,
        passLen,
      ] = [
        8,
        10,
        this.password.length,
      ];
      if (passLen < PASS_MIN || passLen > 10) {
        this.$toast.center(this.$t(
          'message.passwordLength',
          {
            min: PASS_MIN,
            max: PASS_MAX,
          },
        ));
        return;
      }

      // 密码格式错误
      if (!registerPassword.test(this.password)) {
        this.$toast.center(this.$t('message.passwordFail'));
        return;
      }

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

      // 文字验证未通过
      if (/^3$/.test(this.agRegType) && !this.regPass) {
        this.$toast.center(this.$t('message.wordCheckFail'));
        return;
      }

      try {
        this.$loading(this.$t('message.registing'));
        const regResult = await agFastRegister({
          phone: this.account,
          password: this.password,
          code: this.captcha,
          userSource: PortalAgyyConfig.USER_SOURCE,
        });

        const [
          transferResult,
          customerInfo,
        ] = await Promise.all([
          // 余额转至游戏中
          transferToGame(),
          // 查询用户信息
          getCustomer(),
        ]);

        this.setUserinfo({
          ...customerInfo,
          balance: 0,
          token: transferResult.token,
          memberAccount: customerInfo.userName,
          memberLevel: customerInfo.userLevel,
        });

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
        this.$refs.captchaField.refresh();
      } finally {
        this.$loading.close();
      }
    },
  },
};
</script>
