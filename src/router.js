import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home.vue'
import Content from './pages/common/Content'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Content,
      meta: {
        title: '首页'
      },
      children: [
        {
          path: '',
          name: 'home',
          component: Home
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./pages/login/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./pages/register/Register.vue')
    },
    {
      path: '/findPwd',
      name: 'findPwd',
      component: () => import('./pages/findPwd/FindPwd.vue')
    },
    {
      path: '/calendar',
      component: Content,
      children: [
        {
          path: '',
          name: 'calendar',
          component: () => import('./pages/calendar/Calendar.vue'),
          meta: {
            title: '日程'
          }
        }
      ],

    },
    {
      path: '/mailList',
      component: Content,
      children: [
        {
          path: '',
          name: 'mailList',
          component: () => import('./pages/mailList/MailList.vue'),
          meta: {
            title: '通讯录'
          }
        }
      ],
    },
    {
      path: '/form',
      component: Content,
      meta: {
        title: '表单页'
      },
      children: [
        {
          path: 'stepForm',
          name: 'stepForm',
          component: () => import('./pages/stepForm/StepForm.vue'),
          meta: {
            title: '分步表单'
          }
        }
      ],
    },
    {
      path: '/organization',
      name: 'organization',
      component: Content,
      meta: {
        title: '组织员工',
        icon: 'el-icon-folder-opened'
      },
      children: [
        {
          path: 'offer',
          name: 'offer',
          component: () => import('./pages/offer/Offer.vue'),
          meta: {
            title: 'offer管理',
            icon: 'el-icon-folder-opened'
          }
        },
        {
          path: 'userInfo',
          name: 'userInfo',
          component: () => import('./pages/userInfo/UserInfo.vue'),
          meta: {
            title: '人员信息',
            icon: 'el-icon-user'
          }
        },
        {
          path: 'pay',
          name: 'pay',
          component: () => import('./pages/pay/Pay.vue'),
          meta: {
            title: '薪酬管理',
            icon: 'el-icon-price-tag'
          }
        }
      ]
    },
    {
      path: '*',
      component: Content,
      meta: {
        title: '错误页面'
      },
      children: [
        {
          path: '',
          component: () => import('./pages/err/404.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  let isLogin = localStorage.adminUser
  if (to.path === '/login' || to.path === '/register' || to.path === '/findPwd') {
    next()
  } else {
    isLogin ? next() : next('/login')
  }
})


export default router
