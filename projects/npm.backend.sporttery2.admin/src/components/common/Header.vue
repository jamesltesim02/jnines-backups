<template>
  <!-- Header -->
  <header id="header-navbar" class="content-mini content-mini-full">
    <!-- Header Navigation Right -->
    <ul class="nav-header pull-right">
      <li>
        <div
          id="headerDropdownMenu"
          :class="{
            'btn-group': true,
            open: profileVisible
          }"
          @blur="profileVisible = false"
        >
          <button
            class="btn btn-default btn-image dropdown-toggle"
            type="button"
            @click="profileVisible = true"
          >
            <img :src="getURL" alt="Avatar">
            <span class="caret"></span>
          </button>
          <ul class="dropdown-menu dropdown-menu-right">
            <!-- <li class="dropdown-header">Profile</li>
            <li>
              <a href="base_pages_inbox.html">
                <i class="si si-envelope-open pull-right"></i>
                <span class="badge badge-primary pull-right">3</span>Inbox
              </a>
            </li>
            <li>
              <a href="base_pages_profile.html">
                <i class="si si-user pull-right"></i>
                <span class="badge badge-success pull-right">1</span>Profile
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">
                <i class="si si-settings pull-right"></i>Settings
              </a>
            </li>
            <li class="divider"></li>
            <li class="dropdown-header">Actions</li>
            <li>
              <a href="base_pages_lock.html">
                <i class="si si-lock pull-right"></i>Lock Account
              </a>
            </li> -->
            <li>
              <a @click="logout">
                <i class="si si-logout pull-right"></i>退出登录
              </a>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <!-- END Header Navigation Right -->
  </header>
  <!-- END Header -->
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import opsConfig from '@/config/config.ops'

export default {
  data () {
    return {
      profileVisible: false
    }
  },
  computed: {
    ...mapState('app', ['userinfo']),
    getURL(){
      console.log(opsConfig.RESOURCE_URL + this.userinfo.header)
      return opsConfig.RESOURCE_URL + this.userinfo.header
    }
  },
  mounted () {
    document.addEventListener('click', this.handleGlobalClick.bind(this))
  },
  beforeDestroy () {
    document.removeEventListener('click', this.handleGlobalClick)
  },
  methods: {
    ...mapMutations('app', ['setUserinfo']),
    /** 绑定关闭profile弹出菜单的事件 */
    handleGlobalClick (e) {
      if (!this.profileVisible) {
        return
      }
      let el = e.target
      while(el && el !== document.body) {
        if (el.getAttribute('id') === 'headerDropdownMenu') {
          return
        }
        el = el.parentNode
      }
      this.profileVisible = false
    },
    logout () {
      this.setUserinfo()
      this.$router.replace('/login')
    }
  }
}
</script>
<style scoped>

</style>