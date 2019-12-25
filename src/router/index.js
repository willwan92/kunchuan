import Vue from 'vue'
import Router from 'vue-router'

import Layout from 'components/layout/index'

Vue.use(Router)

export const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/login/Page')
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
        component: () => import('pages/user/userManage/Page'),
        meta: {
          title: '用户管理'
        }
      },
      {
        path: 'roleManage',
        name: 'roleManage',
        component: () => import('pages/user/roleManage/Page'),
        meta: {
          title: '角色管理'
        }
      },
      {
        path: 'loginManage',
        name: 'loginManage',
        component: () => import('pages/user/loginManage/Page'),
        meta: {
          title: '登录策略管理'
        }
      },
      {
        path: 'projectManage',
        name: 'projectManage',
        component: () => import('pages/user/projectManage/Page'),
        meta: {
          title: '项目管理'
        }
      },
      {
        path: 'logManage',
        name: 'logManage',
        component: () => import('pages/user/logManage/Page'),
        meta: {
          title: '日志管理'
        }
      }
    ]
  },


  // 信息调查收集
  {
    path: '/info',
    name: 'info',
    meta: {
      title: '信息调查收集'
    },
    component: Layout,
    redirect: '/info/projectInfo',
    children: [
      {
        path: 'projectInfo',
        name: 'projectInfo',
        component: () => import('pages/info/projectInfo/Page'),
        meta: {
          title: '项目信息录入'
        }
      },
      {
        path: 'networkConf',
        name: 'networkConf',
        component: () => import('pages/info/networkConf/Page'),
        meta: {
          title: '网络环境配置'
        }
      },
      {
        path: 'systemUpdate',
        name: 'systemUpdate',
        component: () => import('pages/info/systemUpdate/Page'),
        meta: {
          title: '系统升级'
        }
      },
      {
        path: 'timeConf',
        name: 'timeConf',
        component: () => import('pages/info/timeConf/Page'),
        meta: {
          title: '时间配置'
        }
      },
      {
        path: 'systemInfo',
        name: 'systemInfo',
        component: () => import('pages/info/systemInfo/Page'),
        meta: {
          title: '系统信息'
        }
      },
    ]
  },

  // 资产识别
  {
    path: '/assetIdent',
    name: 'assetIdent',
    component: Layout,
    meta: {
      title: '资产识别'
    },
    redirect: '/assetIdent/singleIp',
    children: [
      {
        path: 'singleIp',
        name: 'singleIp',
        component: () => import('pages/assetIdent/singleIp/Page'),
        meta: {
          title: '单IP扫描'
        }
      },
      {
        path: 'multiIp',
        name: 'multiIp',
        component: () => import('pages/assetIdent/multiIp/Page'),
        meta: {
          title: '多IP扫描'
        }
      },
      {
        path: 'customIp',
        name: 'customIp',
        component: () => import('pages/assetIdent/customIp/Page'),
        meta: {
          title: '自定义操作'
        }
      },
      {
        path: 'assetList',
        name: 'assetList',
        component: () => import('pages/ciiIdent/assetList/Page'),
        meta: {
          title: '资产清单'
        }
      }
    ]
  },

  // CII识别认定
  {
    path: '/ciiIdent',
    name: 'ciiIdent',
    component: Layout,
    meta: {
      title: 'CII识别认定'
    },
    redirect: '/ciiIdent/criticalBusiness',
    children: [
      {
        path: 'criticalBusiness',
        name: 'criticalBusiness',
        component: () => import('pages/ciiIdent/criticalBusiness/Page'),
        meta: {
          title: '关键业务识别'
        }
      },
      {
        path: 'maxBoundary',
        name: 'maxBoundary',
        component: () => import('pages/ciiIdent/maxBoundary/Page'),
        meta: {
          title: '最大可能边界识别'
        }
      },
      {
        path: 'templateManage',
        name: 'templateManage',
        component: () => import('pages/ciiIdent/templateManage/Page'),
        meta: {
          title: '评估模板管理'
        }
      },
      {
        path: 'ciiAffirm',
        name: 'ciiAffirm',
        component: () => import('pages/ciiIdent/ciiAffirm/Page'),
        meta: {
          title: 'CII认定'
        }
      },
      {
        path: 'exportCriticalAsset',
        name: 'exportCriticalAsset',
        component: () => import('pages/ciiIdent/exportCriticalAsset/Page'),
        meta: {
          title: '关键业务资产导出'
        }
      }
    ]


  },

  // CII对象管理
  {
    path: '/ciiObject',
    name: 'ciiObject',
    meta: {
      title: 'CII对象管理'
    },
    redirect: '/ciiObject/infoMainten',
    component: Layout,
    children: [
      {
        path: 'infoMainten',
        name: 'infoMainten',
        component: () => import('pages/ciiObject/infoMainten/Page'),
        meta: {
          title: '信息维护'
        }
      },
      {
        path: 'backupManage',
        name: 'backupManage',
        component: () => import('pages/ciiObject/backupManage/Page'),
        meta: {
          title: '备份管理'
        }
      },
      {
        path: 'patchManage',
        name: 'patchManage',
        component: () => import('pages/ciiObject/patchManage/Page'),
        meta: {
          title: '安全补丁管理'
        }
      }
    ]
  },

  // 安全评估工具
  {
    path: '/evaluationTool',
    name: 'evaluationTool',
    meta: {
      title: '安全评估工具'
    },
    component: Layout,
    redirect: '/evaluationTool/templateManage',
    children: [
      {
        path: 'templateManage',
        name: 'templateManage',
        component: () => import('pages/evaluationTool/templateManage/Page'),
        meta: {
          title: '安全评估模板管理'
        }
      },
      {
        path: 'securityEvaluate',
        name: 'securityEvaluate',
        component: () => import('pages/evaluationTool/securityEvaluate/Page'),
        meta: {
          title: '安全评估'
        }
      }
    ]
  },

  // 安全检查工具
  {
    path: '/securityCheck',
    name: 'securityCheck',
    component: Layout,
    meta: {
      title: '安全检查工具'
    },
    redirect: '/securityCheck/vulnerabilityQuery',
    children: [
      {
        path: 'vulnerabilityQuery',
        name: 'vulnerabilityQuery',
        component: () => import('pages/securityCheck/vulnerabilityQuery/Page'),
        meta: {
          title: '漏洞查询'
        }
      },
      {
        path: 'policyTemplate',
        name: 'policyTemplate',
        component: () => import('pages/securityCheck/policyTemplate/Page'),
        meta: {
          title: '策略模板管理'
        }
      },
      {
        path: 'checkItem',
        name: 'checkItem',
        component: () => import('pages/securityCheck/checkItem/Page'),
        meta: {
          title: '核查项管理'
        }
      },
      {
        path: 'chckRealTime',
        name: 'chckRealTime',
        component: () => import('pages/securityCheck/chckRealTime/Page'),
        meta: {
          title: '资产实时核查'
        }
      },
      {
        path: 'checkPeriodic',
        name: 'checkPeriodic',
        component: () => import('pages/securityCheck/checkPeriodic/Page'),
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
