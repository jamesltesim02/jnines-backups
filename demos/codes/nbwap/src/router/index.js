import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/views/Index'
import Detail from '@/views/Detail'
import Operators from '@/views/Operators'
import Football from '@/views/Football'

Vue.use(Router)

export default new Router({
  // mode: "history"
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'Index',
      component: Index
    },
    {
      path: '/detail',
      name: 'Detail',
      component: Detail
    },
    {
      path: '/operators',
      name: 'Operators',
      component: Operators
    },
    {
      path: '/football',
      name: 'Football',
      component: Football
    }
  ]
})
