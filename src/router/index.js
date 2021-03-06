import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入登录组件
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import Users from '@/components/users/Users.vue'
import Rights from '@/components/rights/Rights.vue'
import Roles from '@/components/rights/Roles.vue'
import Categories from '@/components/goods/Categories.vue'
import Params from '@/components/goods/Params.vue'
import Goods from '@/components/goods/Goods.vue'
import Orders from '@/components/orders/Orders.vue'
import Reports from '@/components/reports/Reports.vue'
// 导入添加商品的组件
import Add from '@/components/goods/Add.vue'
Vue.use(VueRouter)
// 路由组件规则
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Reports },
    ]
  }
]
const router = new VueRouter({
  routes
})
// 前置导航守卫
router.beforeEach((to, from, next) => {
  // to表示即将去往的路由信息对象，from表示从哪个路由信息对象调转过来的
  // next()放行
  // 如果访问的登陆页面，直接放行
  // 如果访问的不是登陆页面。首先验证是否有token，没有，强制跳转到登陆页面
  if (to.path === '/login') {
    next()
  } else {
    if (!sessionStorage.getItem('token')) return next('/login')
    next()
  }
})
export default router
