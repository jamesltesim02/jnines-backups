<template>
<scroll-panel>
  <div class="agyy-sign">
    <sign-title>{{$t('agPage.sign.intitle')}}</sign-title>
    <input-field
      :label="$t('agPage.sign.account')"
      :placeholder="$t('agPage.sign.phoneholder')"
      focus
      name="account"
      v-model="account"
      @keypress="enter"
    />
    <password-field
      v-model="password"
      name="password"
      @keypress="enter"
    />
    <captcha-field
      ref="captchaField"
      v-if="this.loginErrorCount >= 3"
      v-model="captcha"
      @keypress="enter"
    />
    <button
      class="btn-submit"
      @click="doLogin"
    >{{$t('agPage.sign.insubmit')}}</button>
  </div>
  <sign-footer slot="footer">
    {{$t('agPage.sign.needup1')}},
    <a @click="pushRouter('/signup')">
      {{$t('agPage.sign.needup2')}}
    </a>
  </sign-footer>
</scroll-panel>
</template>
<script>
import { mapMutations } from 'vuex';
import { agLogin, transferToGame } from '@/api/portalAgyy';
import { loadFromStorage, saveToStorage } from '@/utils/StorageUtil';
import ScrollPanel from '../common/ScrollPanel';
import SignTitle from './SignTitle';
import SignFooter from './SignFooter';
import InputField from './InputField';
import PasswordField from './PasswordField';
import CaptchaField from './CaptchaField';
import { AgyyStorageKey, AgyyConfig } from '../agyy-constant';

import './Sign.less';

export default {
  data() {
    return {
      account: loadFromStorage(AgyyStorageKey.LAST_LOGIN_USERNAME_KEY, ''),
      password: '',
      captcha: '',
      passVisible: false,
      loginErrorCount: loadFromStorage(AgyyStorageKey.LOGIN_ERROR_TIMES_KEY, 0),
    };
  },
  components: {
    ScrollPanel,
    SignTitle,
    SignFooter,
    InputField,
    PasswordField,
    CaptchaField,
  },
  watch: {
    loginErrorCount(n) {
      saveToStorage(AgyyStorageKey.LOGIN_ERROR_TIMES_KEY, n);
    },
  },
  methods: {
    ...mapMutations('app', ['setUserinfo']),
    ...mapMutations('agyy', ['pushRouter']),
    /**
     * 校验
     */
    validate() {
      const {
        internetPhone,
        username,
        loginPassword,
        captcha,
      } = AgyyConfig.REGEXIES;

      // 账号不能为空
      if (!this.account) {
        this.$toast.center(this.$t('message.accountRequire'));
        return false;
      }
      // 网络运营商手机号码
      if (internetPhone.test(this.account)) {
        this.$toast.center(this.$t('message.internetPhone'));
        return false;
      }
      // 账号不符合规范
      if (!username.test(this.account)) {
        this.$toast.center(this.$t('message.accountFail'));
        return false;
      }

      // 密码不能为空
      if (!this.password) {
        this.$toast.center(this.$t('message.passwordRequire'));
        return false;
      }

      // 密码长度
      const [PASS_MIN, PASS_MAX, passLen] = [8, 10, this.password.length];
      if (passLen < PASS_MIN || passLen > PASS_MAX) {
        this.$toast.center(this.$t(
          'message.passwordLength',
          { min: PASS_MIN, max: PASS_MAX },
        ));
        return false;
      }

      // 密码格式错误
      if (!loginPassword.test(this.password)) {
        this.$toast.center(this.$t('message.passwordFail'));
        return false;
      }

      if (this.loginErrorCount >= 3) {
        // 验证码不能为空
        if (!this.captcha) {
          this.$toast.center(this.$t('message.captchaRequire'));
          return false;
        }
        // 验证码格式不正确
        if (!captcha.test(this.captcha)) {
          this.$toast.center(this.$t('message.captchaStyle'));
          return false;
        }
      }

      return true;
    },
    /**
     * 登录
     */
    async doLogin() {
      if (!this.validate()) {
        return;
      }

      try {
        this.$loading(this.$t('message.logining'));

        // 登录
        const result = await agLogin({
          loginName: this.account,
          password: this.password,
          verification: this.captcha,
          isToken: true,
        });
        this.setUserinfo({ accessToken: result.accessToken });

        // 余额转至游戏中
        const transferResult = await transferToGame();

        this.$toast.center(this.$t('message.loginSuccess'));
        this.setUserinfo({
          ...result,
          balance: 0,
          token: transferResult.token,
          memberAccount: result.loginName,
          memberLevel: result.userLevel,
        });
        this.loginErrorCount = 0;
        // 保存最后一次登录账号名
        saveToStorage(AgyyStorageKey.LAST_LOGIN_USERNAME_KEY, this.account);
        // 转到登录成功
        this.pushRouter('/member');
      } catch ({ msg, code }) {
        if (code === 9611) {
          this.loginErrorCount = 4;
        }
        if (code === 9612) {
          this.loginErrorCount += 1;
        }
        if (![9611].includes(code) && this.loginErrorCount >= 3) {
          this.$nextTick(() => {
            this.$refs.captchaField.loadCaptcha();
          });
        }
      } finally {
        this.$loading.close();
      }
    },
    enter(e) {
      const { keyCode } = e;
      if (keyCode === 13) {
        this.doLogin();
      }
    },
  },
};
</script>
