import Vue from 'vue'
import Router from 'vue-router'

import Layout from '../components/layout/index'

Vue.use(Router)

export const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/login/Page')
  },

  // 用户管理
  {
    path: '/user',
    name: 'user',
    component: Layout,
    meta: {
      title: '用户管理'
    },
    redirect: '/user/userManage',
    children: [
      {
        path: 'userManage',
        name: 'userManage',
        component: () => import('../pages/user/userManage/Page'),
        meta: {
          title: '用户管理'
        }
      },
      {
        path: 'userDetail',
        name: 'userDetail',
        component: () => import('../pages/user/userManage/components/userDetail'),
        meta: {
          title: '角色管理'
        }
      },
      {
        path: 'userManage',
        name: 'userManage',
        component: () => import('../pages/user/userManage/Page'),
        meta: {
          title: '登录策略管理'
        }
      },
      {
        path: 'userDetail',
        name: 'userDetail',
        component: () => import('../pages/user/userManage/components/userDetail'),
        meta: {
          title: '项目管理'
        }
      },
      {
        path: 'userManage',
        name: 'userManage',
        component: () => import('../pages/user/userManage/Page'),
        meta: {
          title: '日志管理'
        }
      }
    ]
  },


  // 信息调查收集
  {
    path: '/goods',
    name: 'goods',
    meta: {
      title: '信息调查收集'
    },
    component: Layout,
    children: [
      {
        path: 'goodsManage',
        name: 'goodsManage',
        component: () => import('../pages/goods/goodsManage/Page'),
        meta: {
          title: '项目信息录入'
        }
      },
      {
        path: 'goodsRecycle',
        name: 'goodsRecycle',
        component: () => import('../pages/goods/goodsRecycle/Page'),
        meta: {
          title: '网络环境配置'
        }
      },
      {
        path: 'goodsClassification',
        name: 'goodsClassification',
        component: () => import('../pages/goods/goodsClassification/Page'),
        meta: {
          title: '系统升级'
        }
      },
      {
        path: 'goodsComments',
        name: 'goodsComments',
        component: () => import('../pages/goods/goodsComments/Page'),
        meta: {
          title: '时间配置'
        }
      },
      {
        path: 'goodsManageNew',
        name: 'goodsManageNew',
        component: () => import('../pages/goods/goodsManage/components/goodsManageNew'),
        meta: {
          title: '系统信息'
        }
      },
    ]
  },

  // 资产识别
  {
    path: '/order',
    name: 'order',
    component: Layout,
    meta: {
      title: '资产识别'
    },
    redirect: '/order/orderManage',
    children: [
      {
        path: 'orderManage',
        name: 'orderManage',
        component: () => import('../pages/order/orderManage/Page'),
        meta: {
          title: '单IP扫描'
        }
      },
      {
        path: 'orderDetail',
        name: 'orderDetail',
        component: () => import('../pages/order/orderManage/components/orderDetail'),
        meta: {
          title: '多IP扫描'
        }
      },
      {
        path: 'orderDetail',
        name: 'orderDetail',
        component: () => import('../pages/order/orderManage/components/orderDetail'),
        meta: {
          title: '自定义操作'
        }
      }
    ]
  },

  // CII识别认定
  {
    path: '/finance',
    name: 'finance',
    component: Layout,
    meta: {
      title: 'CII识别认定'
    },
    redirect: '/finance/financeManage',
    children: [
      {
        path: 'financeManage',
        name: 'financeManage',
        component: () => import('../components/NoContent'),
        meta: {
          title: '关键业务识别'
        }
      },
      {
        path: 'financeManage',
        name: 'financeManage',
        component: () => import('../components/NoContent'),
        meta: {
          title: '最大可能边界识别'
        }
      },
      {
        path: 'financeManage',
        name: 'financeManage',
        component: () => import('../components/NoContent'),
        meta: {
          title: '边界管理'
        }
      },
      {
        path: 'financeManage',
        name: 'financeManage',
        component: () => import('../components/NoContent'),
        meta: {
          title: '评估模板管理'
        }
      },
      {
        path: 'financeManage',
        name: 'financeManage',
        component: () => import('../components/NoContent'),
        meta: {
          title: 'CII认定'
        }
      },
      {
        path: 'financeManage',
        name: 'financeManage',
        component: () => import('../components/NoContent'),
        meta: {
          title: '关键业务资产导出'
        }
      }
    ]


  },

  // CII对象管理
  {
    path: '/service',
    name: 'service',
    meta: {
      title: 'CII对象管理'
    },
    component: Layout,
    children: [
      {
        path: 'service',
        name: 'service',
        component: () => import('../pages/service/Page'),
        meta: {
          title: '信息维护'
        }
      },
      {
        path: 'service',
        name: 'service',
        component: () => import('../pages/service/Page'),
        meta: {
          title: '备份管理'
        }
      },
      {
        path: 'service',
        name: 'service',
        component: () => import('../pages/service/Page'),
        meta: {
          title: '安全补丁管理'
        }
      }
    ]
  },

  // 安全评估工具
  {
    path: '/advertising',
    name: 'advertising',
    meta: {
      title: '安全评估工具'
    },
    component: Layout,
    children: [
      {
        path: 'advertising',
        name: 'advertising',
        component: () => import('../pages/advertising/Page'),
        meta: {
          title: '安全评估模板管理'
        }
      },
      {
        path: 'advertisManagementNew',
        name: 'advertisManagementNew',
        component: () => import('../pages/advertising/components/advertisManagementNew'),
        meta: {
          title: '安全评估'
        }
      }
    ]
  },

  // 安全检查工具
  {
    path: '/msg',
    name: 'msg',
    component: Layout,
    meta: {
      title: '安全检查工具'
    },
    redirect: '/msg/msgManage',
    children: [
      {
        path: 'msgManage',
        name: 'msgManage',
        component: () => import('../components/NoContent'),
        meta: {
          title: '漏洞查询'
        }
      },
      {
        path: 'msgManage',
        name: 'msgManage',
        component: () => import('../components/NoContent'),
        meta: {
          title: '策略模板管理'
        }
      },
      {
        path: 'msgManage',
        name: 'msgManage',
        component: () => import('../components/NoContent'),
        meta: {
          title: '脚本管理'
        }
      },
      {
        path: 'msgManage',
        name: 'msgManage',
        component: () => import('../components/NoContent'),
        meta: {
          title: '核查项管理'
        }
      },
      {
        path: 'msgManage',
        name: 'msgManage',
        component: () => import('../components/NoContent'),
        meta: {
          title: '资产实时核查'
        }
      },
      {
        path: 'msgManage',
        name: 'msgManage',
        component: () => import('../components/NoContent'),
        meta: {
          title: '资产周期核查'
        }
      },
    ]
  }
];

export default new Router({
  mode: 'hash',
  routes: routes
});
