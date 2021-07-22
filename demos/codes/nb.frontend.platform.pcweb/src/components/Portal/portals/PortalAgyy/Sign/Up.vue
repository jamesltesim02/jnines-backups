<template>
<scroll-panel class="agyy-sign">
  <div>
    <div class="welcome-text">{{$t('agPage.sign.welcome')}}</div>
    <sign-title>{{$t('agPage.sign.uptitle')}}</sign-title>
    <input-field
      :label="$t('agPage.sign.account')"
      maxlength="20"
      :placeholder="$t('agPage.sign.phoneholder')"
      v-model="account"
      @keypress="enter"
    />
    <password-field
      v-model="password"
      @keypress="enter"
    />
    <captcha-field
      v-if="!textCaptcha.visible"
      ref="captchaField"
      type="register"
      v-model="captcha"
      @keypress="enter"
    />
    <text-captcha
      v-else
      type="register"
      v-model="textCaptcha.value"
    />
    <button
      class="btn-submit"
      @click="doRegister"
    >{{$t('agPage.sign.upsubmit')}}</button>
  </div>
  <sign-footer slot="footer">
    {{$t('agPage.sign.uped1')}}, <a @click="pushRouter('/signin')">{{$t('agPage.sign.uped2')}}</a>
  </sign-footer>
</scroll-panel>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import {
  getVerifyType,
  agFastRegister,
  getCustomer,
  transferToGame,
} from '@/api/portalAgyy';
import { saveToStorage } from '@/utils/StorageUtil';
import ScrollPanel from '../common/ScrollPanel';
import SignTitle from './SignTitle';
import SignFooter from './SignFooter';
import InputField from './InputField';
import PasswordField from './PasswordField';
import CaptchaField from './CaptchaField';
import TextCaptcha from './TextCaptcha';
import { AgyyStorageKey, AgyyConfig } from '../agyy-constant';

import './Sign.less';

export default {
  data() {
    return {
      account: '',
      password: '',
      captcha: '',
      textCaptcha: {
        value: '',
        visible: false,
      },
    };
  },
  computed: {
    ...mapState('agyy', ['portalConf']),
  },
  components: {
    ScrollPanel,
    SignTitle,
    InputField,
    SignFooter,
    PasswordField,
    CaptchaField,
    TextCaptcha,
  },
  async created() {
    const type = await getVerifyType();
    this.textCaptcha.visible = type.registerVerificationType === AgyyConfig.TEXT_CAPTCHA_TYPE;
  },
  methods: {
    ...mapMutations('app', ['setUserinfo']),
    ...mapMutations('agyy', ['pushRouter']),
    enter(e) {
      const { keyCode } = e;
      if (keyCode === 13) {
        this.doRegister();
      }
    },
    validate() {
      const {
        phone,
        internetPhone,
        registerPassword,
        captcha,
      } = AgyyConfig.REGEXIES;

      // 手机号码不能为空
      if (!this.account) {
        this.$toast.center(this.$t('message.phoneRequire'));
        return false;
      }
      // 网络运营商手机号码
      if (internetPhone.test(this.account)) {
        this.$toast.center(this.$t('message.internetPhone'));
        return false;
      }
      // 手机号格式不对
      if (!phone.test(this.account)) {
        this.$toast.center(this.$t('message.phoneFail'));
        return false;
      }

      // 密码不能为空
      if (!this.password) {
        this.$toast.center(this.$t('message.passwordRequire'));
        return false;
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
        return false;
      }

      // 密码格式错误
      if (!registerPassword.test(this.password)) {
        this.$toast.center(this.$t('message.passwordFail'));
        return false;
      }

      // 只会出现一种验证码(文字验证码时无需校验数字验证码)
      if (this.textCaptcha.visible) {
        // 文字验证码不通过
        if (!this.textCaptcha.value) {
          this.$toast.center(this.$t('message.wordCheckFail'));
          return false;
        }
      } else {
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
    async doRegister() {
      if (!this.validate()) {
        return;
      }

      try {
        this.$loading(this.$t('message.registing'));
        const regResult = await agFastRegister({
          phone: this.account,
          password: this.password,
          userSource: AgyyConfig.USER_SOURCE,
          isToken: true,
          code: this.textCaptcha.visible ? this.textCaptcha.value : this.captcha,
        });
        this.setUserinfo({ accessToken: regResult.accessToken });

        const transferResult = await transferToGame();
        const customerInfo = await getCustomer();
        this.setUserinfo({
          ...customerInfo,
          balance: 0,
          token: transferResult.token,
          memberAccount: customerInfo.userName,
          loginName: customerInfo.userName,
          memberLevel: customerInfo.userLevel,
          accessToken: regResult.accessToken,
        });

        this.$toast.center(this.$t(
          'message.registerSuccess',
          { account: regResult.loginName },
        ));
        // 保存最后一次登录账号名
        saveToStorage(AgyyStorageKey.LAST_LOGIN_USERNAME_KEY, customerInfo.userName);
        // 转到登录成功
        this.pushRouter('/member');
      } catch (e) {
        this.captcha = '';
        if (!this.textCaptcha.visible) {
          this.$refs.captchaField.loadCaptcha();
        }
      } finally {
        this.$loading.close();
      }
    },
  },
};
</script>
