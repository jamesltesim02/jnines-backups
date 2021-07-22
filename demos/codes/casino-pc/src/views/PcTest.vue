<template>
  <div class="pc-teset">
    <div
      v-if="this.userinfo.token"
      class="header"
    >
      welcome: {{userinfo.memberAccount}} |
      VIP{{userinfo.memberLevel}} |
      余额: {{userinfo.balance}} |
      <a @click="logout">退出</a>
    </div>
    <div
      v-else
      class="need-login"
    >
      暂未登陆, <a @click="$router.replace('/')">立即登陆</a>
    </div>
    <iframe :src="src"></iframe>
  </div>
</template>
<script>
const {
  FRONT_ID,
  PLATFORM_URL
} = window.NBConfig

export default {
  data () {
    return {
      userinfo: {}
    }
  },
  created () {
    this.userinfo = JSON.parse(localStorage.getItem('nb-casino-userinfo') || '{}')
    // if (!this.userinfo.token) {
    //   this.logout()
    // }
  },
  computed: {
    src () {
      let url = `${PLATFORM_URL}?frontId=${FRONT_ID}`

      if (this.userinfo.token) {
        url += `&token=${this.userinfo.token}&loginName=${this.userinfo.memberAccount}`
      }

      return url
    }
  },
  methods: {
    logout () {
      localStorage.removeItem('nb-casino-userinfo')
      this.$router.replace('/login')
    }
  }
}
</script>
<style lang="less">
.pc-teset {
  display: flex;
  color: #fff;
  flex-direction: column;
  height: 100%;
  .header {
    height: 30px;
    line-height: 30px;
    padding-left: 30px;
    font-size: 16px;
    a {
      color: #fff;
      cursor: pointer;
      &:hover {
        color: #ff5353;
      }
    }
  }
  iframe {
    width: 100%;
    flex-grow: 1;
    border: 0;
  }
  .need-login {
    padding: 10px;
    a {
      color: #fff;
      cursor: pointer;
      font-weight: bolder;
      &:hover {
        color: #ff5353;
      }
    }
  }
}
</style>
