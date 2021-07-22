import Vue from 'vue'
import Router from 'vue-router'
// import toPlatform from '@/utils/toPlatform'
import Login from './views/Login'
import Member from './views/Member'
import PcTest from './views/PcTest'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/member',
      name: 'member',
      component: Member
    },
    {
      path: '/pctest',
      name: 'pctest',
      component: PcTest
    }
  ]
})

const getUserinfo = () => {
  return JSON.parse(localStorage.getItem('nb-casino-userinfo') || 'null') || null
}

const routerInterceptor = {
  // '/': toPlatform,
  '/login': (next) => {
    const userinfo = getUserinfo()
    if (userinfo) {
      next({ path: '/pctest' })
      return
    }

    next()
  },
  '/member': (next) => {
    const userinfo = getUserinfo()
    if (userinfo) {
      next()
      return
    }

    next({ path: '/login' })
  }
}

router.beforeEach((to, from, next) => {
  const interceptor = routerInterceptor[to.path]
  if (interceptor) {
    interceptor(next)
    return
  }
  next()
})

export default router
