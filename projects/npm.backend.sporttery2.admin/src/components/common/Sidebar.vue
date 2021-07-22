<template>
  <nav id="sidebar">
    <!-- Sidebar Scroll Container -->
    <div id="sidebar-scroll">
      <!-- Sidebar Content -->
      <!-- Adding .sidebar-mini-hide to an element will hide it when the sidebar is in mini mode -->
      <div class="sidebar-content">
        <!-- Side Header -->
        <div class="side-header side-content bg-white-op">
          <a class="h5 text-white">
            <i class="fa fa-circle-o-notch text-primary"></i> <span class="h4 font-w600 sidebar-mini-hide">ne</span>
          </a>
        </div>
        <!-- END Side Header -->

        <!-- Side Content -->
        <div class="side-content">
          <ul class="nav-main">
            <li
              v-for="fm in menus"
              :key="fm._id"
              :class="{
                open: fm._id === opend
              }"
            >
              <a
                @click="to(fm)"
                :class="{
                  'nav-submenu': fm.nextResourceList,
                  active: isCurrent(fm.path)
                }"
              >
                <i :class="icons[fm.name]"></i>
                <span class="sidebar-mini-hide">
                  {{fm.resourceName}}
                  <i
                    v-if="(
                      fm.name === 'betRoot'
                      &&
                      plan > 0
                      &&
                      fm._id !== opend
                    )"
                    class="plan-count"
                  >{{plan}}</i>
                </span>
              </a>
              <ul v-if="fm.nextResourceList && fm.nextResourceList.length">
                <li
                  v-for="sm in fm.nextResourceList"
                  :key="sm._id"
                >
                  <a
                    @click="to(sm, 2)"
                    :class="{ active: isCurrent(sm.path) }"
                  >
                    <i :class="icons[sm.name]"></i>
                    <span class="sidebar-mini-hide">
                      {{sm.resourceName}}
                      <i
                        v-if="sm.name === 'planRoot' && plan > 0"
                        class="plan-count"
                      >{{plan}}</i>
                    </span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <!-- END Side Content -->
      </div>
      <!-- Sidebar Content -->
    </div>
    <!-- END Sidebar Scroll Container -->
  </nav>
  <!-- END Sidebar -->
</template>
<script>
import { getMenus } from '@/api/user'
import {planCount} from '@/api/plan'

export default {
  data () {
    return {
      roles: [],
      opend: null,
      icons: {
        // 控制面板
        dashboard: 'si si-speedometer',
        // 统计报表
        chartRoot: 'si si-bar-chart',
        // 统计汇总
        betReport: 'glyphicon glyphicon-list-alt',
        // 会员管理
        userRoot: 'si si-users',
        // 会员列表
        userList: 'fa fa-users',
        // 注单管理
        betRoot: 'fa fa-list-ul',
        // 注单列表
        betList: 'glyphicon glyphicon-list',
        // 方案管理
        planRoot: 'si si-notebook',
        // 权限管理
        powerRoot: 'fa fa-power-off',
        // 管理员用户
        adminUser: 'fa fa-user-md',
        // 角色管理
        role: 'fa fa-cogs',
        // 资源管理
        resource: 'fa fa-cubes',
        // 商品管理
        wareRoot: 'fa fa-star-o',
        // 商品列表
        wareList: 'fa fa-list-alt',
        // 新闻管理
        newRoot: 'si si-globe',
        // 新闻管理
        hotNews: 'fa fa-newspaper-o',
        // 公告
        notice: 'si si-volume-2'
      },
      plan: 0
    };
  },
  computed: {
    menus () {
      return [
        ...this.roles
      ]
    }
  },
  async created () {
    this.roles = (await getMenus() || [])
    const opendItem = this.roles.find(r => {
      if (!r.nextResourceList) {
        return false
      }

      return r.nextResourceList.findIndex(nr => this.isCurrent(nr.path)) > -1
    });
    if (opendItem) {
      this.opend = opendItem._id
    }
    this.queryPlan()
  },
  methods: {
    isCurrent (path) {
      return this.$route.fullPath === path
    },
    to (item, level = 1) {
      if (level === 1 && item.nextResourceList && item.nextResourceList.length > 0) {
        if (this.opend === item._id) {
          this.opend = null;
          return
        }
        this.opend = item._id
        return
      }

      if (item.path && !this.isCurrent(item.path)) {
        this.$router.push(item.path)
        if (level === 1) {
          this.opend = null
        }
      }
    },
    async queryPlan() {
      this.plan = await planCount();
      console.log('pan:', this.plan);
    }
  },
  mounted() {
     setInterval(this.queryPlan.bind(this), 30000);
  },
}
</script>
<style scoped>
.plan-count {
  display: inline-block;
  width: 15px;
  height: 15px;
  line-height: 15px;
  border-radius: 50%;
  background-color: #ff5353;
  color: #fff;
  text-align:  center;
  font-style: normal;
}
</style>