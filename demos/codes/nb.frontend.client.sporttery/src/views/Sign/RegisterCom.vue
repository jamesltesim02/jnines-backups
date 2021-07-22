<template>
  <sign-page
    class="register-page"
    :title="$t('page.registerTitle')"
    type="register"
  >
    <section>
      <username-field
        v-model="account"
        :placeholder="$t('pagelite.regAccountHolder')"
        maxlength="11"
      />
      <password-field
        v-model="password"
        :placeholder="$t('pagelite.passwordHolder')"
      />
      <captcha-field-x
        ref="captchaField"
        v-model="captcha"
      />
    </section>
    <submit :label="$t('page.registerLabel')" @submit="doRegister" />
  </sign-page>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { memberRegister } from '@/api/activity';
import { saveToStorage } from '@/utils/StorageUtil';
import { StorageKey, PortalAgyyConfig } from '@/config/constants';
import SignPage from '@/components/Sign/SignPage';
import UsernameField from '@/components/Sign/UsernameField';
import PasswordField from '@/components/Sign/PasswordField';
import CaptchaFieldX from '@/components/Sign/CaptchaFieldX';
import Submit from '@/components/Sign/Submit';

export default {
  data() {
    return { account: '', password: '', captcha: '' };
  },
  computed: {
    ...mapState('app', ['lastLocation', 'scanInfo', 'frontId', 'userinfo']),
  },
  components: {
    SignPage,
    UsernameField,
    PasswordField,
    CaptchaFieldX,
    Submit,
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
      if (passLen < PASS_MIN || passLen > PASS_MAX) {
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
      if (!this.captcha) {
        this.$toast.center(this.$t('message.captchaRequire'));
        return;
      }
      // 验证码格式不正确
      if (!captcha.test(this.captcha)) {
        this.$toast.center(this.$t('message.captchaStyle'));
        return;
      }
      // 扫码信息验证
      if (!this.frontId || !this.scanInfo || !this.scanInfo.invoteCode || !this.scanInfo.invoteFrom) {
        this.$toast.center(this.$t('message.scanErr'));
        return;
      }
      try {
        let scanInfo = JSON.parse(JSON.stringify(this.scanInfo));
        scanInfo = scanInfo || { };
        this.$loading(this.$t('message.registing'));
        const regResult = await memberRegister({
          userName: this.account,
          password: this.password,
          code: this.captcha,
          frontId: this.frontId,
          ...scanInfo,
        });
        if (regResult && regResult.memberToken) {
          saveToStorage(StorageKey.PORTAL_MEMBER_TOKEN, regResult.memberToken);
        }
        this.setUserinfo(regResult);
        await this.getNBUser(true);
        await this.loadMemberInfo();
        this.$toast.center(this.$t(
          'message.registerSuccess',
          { account: regResult.loginName },
        ));
        // 保存最后一次登录账号名
        localStorage.setItem(StorageKey.LAST_LOGIN_USERNAME_KEY, regResult.loginName);
        this.$router.replace('/');
      } catch (e) {
        this.captcha = '';
      } finally {
        this.$loading.close();
      }
    },
  },
};
</script>
