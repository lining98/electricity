import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: () => import('./../views/login.vue'),
  },
  {
    path: '/home',
    component: () => import('./../views/Home.vue'),
    children: [
      // {
      //   path: '/',
      //   redirect: 'users'
      // },
      {
        path: 'users',
        component: () => import('./../components/users/users.vue'),
      },
      {
        path: 'roles',
        component: () => import('./../components/rights/roles.vue'),
      },
      {
        path: 'rights',
        component: () => import('./../components/rights/rights.vue'),
      },
      {
        path: 'addgoods',
        component: () => import('./../components/goods/addshop.vue'),
      },
      {
        path: 'goods',
        component: () => import('./../components/goods/goods.vue'),
      },
      {
        path: 'params',
        component: () => import('./../components/goods/params.vue'),
      },
      {
        path: 'categories',
        component: () => import('./../components/goods/categories.vue'),
      },
      {
        path: 'orders',
        component: () => import('./../components/orders/orders.vue'),
      },
      {
        path: 'reports',
        component: () => import('./../components/reports/reports.vue'),
      },
    ],
  },
]

const router = new VueRouter({
  routes
})

// 为路由对象，添加 beforeEach 导航守卫 
router.beforeEach((to, from, next) => {
  // 如果用户访问的登录页，直接放行 
  if (to.path === '/login') return next()
  // 从 sessionStorage 中获取到 保存的 token 值 
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token，强制跳转到登录页 
  if (!tokenStr) return next('/login')
  next()
})
export default router
