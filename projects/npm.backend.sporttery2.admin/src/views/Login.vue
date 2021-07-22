<template>
  <div>
    <!-- Login Content -->
    <div class="bg-white pulldown">
      <div class="content content-boxed overflow-hidden">
        <div class="row">
          <div class="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
            <div class="push-30-t push-50 animated fadeIn">
              <!-- Login Title -->
              <div class="text-center">
                <i class="fa fa-2x fa-circle-o-notch text-primary"></i>
                <p class="text-muted push-15-t">红彩后台管理系统</p>
              </div>
              <!-- END Login Title -->

              <!-- Login Form -->
              <form
                class="js-validation-login form-horizontal push-30-t"
                method="post"
              >
                <div class="form-group">
                  <div class="col-xs-12">
                    <div class="form-material form-material-primary">
                      <input
                        class="form-control"
                        type="text"
                        v-model="user.userName"
                      />
                      <label for="login-username">账号:</label>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-xs-12">
                    <div class="form-material form-material-primary">
                      <input
                        class="form-control"
                        type="text"
                        v-model="user.passWord"
                      />
                      <label for="login-password">密码:</label>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-xs-6">
                    <label class="css-input switch switch-sm switch-primary">
                      <input type="checkbox" id="login-remember-me" name="login-remember-me" />
                      <span></span> 记住我 ?
                    </label>
                  </div>
                  <div class="col-xs-6">
                    <div class="font-s13 text-right push-5-t">
                      <a href="base_pages_reminder_v2.html">忘记密码 ?</a>
                    </div>
                  </div>
                </div>
                <div class="form-group push-30-t">
                  <div class="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
                    <button
                      class="btn btn-sm btn-block btn-primary"
                      type="button"
                      @click="doLogin"
                    >提交登录</button>
                  </div>
                </div>
              </form>
              <!-- END Login Form -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- END Login Content -->

    <!-- Login Footer -->
    <div class="pulldown push-30-t text-center animated fadeInUp">
      <small class="text-muted">
        <span class="js-year-copy"></span> &copy; 红彩 1.0
      </small>
    </div>
    <!-- END Login Footer -->
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { login } from '@/api/user';


export default {
  data() {
    return {
      user: {
        userName: 'Burr',
        passWord: '111111'
      }
    };
  },
  methods: {
    ...mapMutations('app', ['setUserinfo']),
    async doLogin() {
      try {
        this.$loading('登录中...');
        const result = await login(this.user);
        this.$toast.center('登录成功')
        this.setUserinfo(result)
        this.$router.replace('/chart')
      } finally {
        this.$loading.close();
      }
    }
  }
};
</script>
