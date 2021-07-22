import Vue from 'vue';
import VueRouter from 'vue-router';
import devConfig from '@/config/config.dev'
import store from '@/store'

import Home from '@/views/demo/Home.vue';
import Charts from '@/views/demo/Charts.vue';
import Login from '@/views/Login.vue';

import Profile from '@/views/Profile.vue';
import BetList from '@/views/bet/BetList.vue';
import PlanList from '@/views/plan/PlanList.vue';
import BetReport from '@/views/report/BetReport.vue';
import Chart from '@/views/report/Charts.vue';

import Notice from '@/views/notice/Notice.vue';
import Hot from '@/views/hot/HotNews.vue';
import Ware from '@/views/ware/Ware.vue';
import Resource from '@/views/resource/Resource.vue';
import Role from '@/views/role/Role.vue';
import AdminUser from '@/views/user/AdminUser.vue';
import User from '@/views/user/User.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/demo/home',
    name: 'home',
    component: Home,
  },
  {
    path: '/demo/charts',
    name: 'chart',
    component: Charts
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/profile',
    component: Profile
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/notice',
    component: Notice
  },
  {
    path: '/ware',
    component: Ware
  },
  {
    path: '/hotNews',
    component: Hot
  },
  {
    path: '/role',
    component: Role
  },
  {
    path: '/admin',
    component: AdminUser
  },
  {
    path: '/user',
    component: User
  },
  {
    path: '/resource',
    component: Resource
  },
  {
    path: '/bet',
    component: BetList,
  },
  {
    path: '/plan',
    component: PlanList,
  },
  {
    path: '/betReport/',
    component: BetReport,
  },
  {
    path: '/chart',
    component: Chart,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

/**
 * 判断地址是否需要登录
 *
 * @param {string} path 被判断的地址
 */
const checkPath = (path) => {
  const {
    urls,
    excludes
  } = devConfig.auths

  if (excludes.findIndex(exp => exp.test(path)) !== -1) {
    return false
  }

  return urls.findIndex(exp => exp.test(path)) > -1
}

/** 路由监听, 做登录判断 */
router.beforeEach((to, from, next) => {
  // 如果当前已经登录,或者当前url不需要登录,则允许直接转到路由地址
  if (!checkPath(to.fullPath)) {
    next()
    return
  } else {
    if(store.getters['app/isLogin']) {
      if(store.state.app.userinfo.authPath.includes(to.fullPath.split("?")[0])) {
        next()
      } else {
        //TODO 转到另外地址或提示
        next('/chart')
        store.commit('app/toast', '无访问权限')
      }
      return
    }
  }

  store.commit('app/toast', '您还未登录或登录已失效,请先登录')
  next('/login')
})

export default router;
