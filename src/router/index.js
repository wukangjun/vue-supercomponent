import Vue from 'vue'
import Router from 'vue-router'
import child from './child.js'
import monitorChild from './monitorChild.js'
Vue.use(Router)

const api = resolve => require(['@/components/api/api.vue'], resolve)
const login = resolve => require(['@view/login/login'], resolve)
const index = resolve => require(['@view/managePlatform/index/index.vue'], resolve)
const monitor = resolve => require(['@view/monitorPlatform/index/index.vue'], resolve)
const noFound =resolve=>require(['@view/404/404.vue'], resolve)
const authorization = resolve=>require(['@view/authorization/authorization.vue'], resolve)
const video = (resolve) =>require(['@/view/monitorPlatform/video/video'],resolve)
const RMvideo=(resolve) =>require(['@/view/monitorPlatform/video/RMvideo/RMvideo'],resolve)

const router = new Router({
  //mode: 'history',
  routes: [
    {
      path: '*',
      component: noFound
    },
    {
      path: '/',
      redirect: '/login',
      component: login
    },
    {
      path: '/login',
      component: login,
    },
    {
      path: '/api',
      component: api
    },
    {
      path: '/index',
      redirect: '/index/companyManage',
      component: index,
      children: child
    },
    {
      path: '/monitor',
      redirect: '/monitor/home',
      component: monitor,
      children: monitorChild
    },
    {
      name: 'authorization',
      path: '/authorization',
      component: authorization
    },
    {
      name: 'video',
      path: '/video',
      component: video
    },
    {
      name: 'RMvideo',
      path: '/RMvideo',
      component: RMvideo
    }
  ]
})

export default router;