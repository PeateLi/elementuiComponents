import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首页',icon:"el-icon-phone",roles: ['admin', 'editor']},
    hidden: true   //控制那些页面不需要配置路由信息
  },
  {
    path: '/test1',
    name: 'test1',
    redirect: '/test1/test1-1',
    component: () => import('../views/testViews/test1.vue'),
    meta: { title: '测试1',icon:"el-icon-phone",roles: ['admin', 'editor']},
    hidden: true,
    children:[
      {
        path: 'test1-1',
        component: () => import('../views/testViews/test1-1.vue'),
        name: 'test1-1',
        meta: {
          title: '测试1-1',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      
    ]
  },

]
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
