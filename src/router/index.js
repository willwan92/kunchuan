import Vue from 'vue'
import Router from 'vue-router'

import Layout from 'components/layout/index'

Vue.use(Router)

export const routes = [{
	path: '/',
	redirect: '/login'
},
{
	path: '/login',
	name: 'login',
	component: () =>
		import('pages/login/Page')
},

// 用户管理
{
	path: '/user',
	name: 'user',
	component: Layout,
	meta: {
		title: '用户管理',
		roleType: '023'
	},
	redirect: '/user/userManage',
	children: [{
		path: 'userManage',
		name: 'userManage',
		component: () =>
			import('pages/user/userManage/Page'),
		meta: {
			title: '用户管理',
			roleType: '0'
		}
	},
	{
		path: 'roleManage',
		name: 'roleManage',
		component: () =>
			import('pages/user/roleManage/Page'),
		meta: {
			title: '角色管理',
			roleType: '0'
		}
	},
	{
		path: 'loginManage',
		name: 'loginManage',
		component: () =>
			import('pages/user/loginManage/Page'),
		meta: {
			title: '登录策略管理',
			roleType: '02'
		}
	},
	{
		path: 'projectManage',
		name: 'projectManage',
		component: () =>
			import('pages/user/projectManage/Page'),
		meta: {
			title: '项目管理',
			roleType: '03'
		}
	},
	{
		path: 'logManage',
		name: 'logManage',
		component: () =>
			import('pages/user/logManage/Page'),
		meta: {
			title: '日志管理',
			roleType: '02'
		}
	}
	]
},


// 信息调查收集
{
	path: '/info',
	name: 'info',
	meta: {
		title: '信息调查收集',
		roleType: '023'
	},
	component: Layout,
	redirect: '/info/projectInfo',
	children: [{
		path: 'projectInfo',
		name: 'projectInfo',
		component: () =>
			import('pages/info/projectInfo/Page'),
		meta: {
			title: '项目信息录入',
			roleType: '03'
		}
	},
	{
		path: 'networkConf',
		name: 'networkConf',
		component: () =>
			import('pages/info/networkConf/Page'),
		meta: {
			title: '网络环境配置',
			roleType: '02'
		}
	},
	{
		path: 'systemUpdate',
		name: 'systemUpdate',
		component: () =>
			import('pages/info/systemUpdate/Page'),
		meta: {
			title: '系统升级',
			roleType: '02'
		}
	},
	{
		path: 'timeConf',
		name: 'timeConf',
		component: () =>
			import('pages/info/timeConf/Page'),
		meta: {
			title: '时间配置',
			roleType: '02'
		}
	},
	{
		path: 'systemInfo',
		name: 'systemInfo',
		component: () =>
			import('pages/info/systemInfo/Page'),
		meta: {
			title: '系统信息',
			roleType: '02'
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
		title: '资产识别',
		roleType: '03'
	},
	redirect: '/assetIdent/singleIp',
	children: [{
		path: 'singleIp',
		name: 'singleIp',
		component: () =>
			import('pages/assetIdent/singleIp/Page'),
		meta: {
			title: '单IP扫描',
			roleType: '03'
		}
	},
	{
		path: 'multiIp',
		name: 'multiIp',
		component: () =>
			import('pages/assetIdent/multiIp/Page'),
		meta: {
			title: '多IP扫描',
			roleType: '03'
		}
	},
	{
		path: 'customIp',
		name: 'customIp',
		component: () =>
			import('pages/assetIdent/customIp/Page'),
		meta: {
			title: '自定义操作',
			roleType: '03'
		}
	},
	{
		path: 'assetList',
		name: 'assetList',
		component: () =>
			import('pages/assetIdent/assetList/Page'),
		meta: {
			title: '资产清单',
			roleType: '03'
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
		title: 'CII识别认定',
		roleType: '03'
	},
	redirect: '/ciiIdent/criticalBusiness',
	children: [{
		path: 'businessInfoLib',
		name: 'businessInfoLib',
		component: () =>
			import('pages/ciiIdent/businessInfoLib/Page'),
		meta: {
			title: '业务信息库管理',
			roleType: '03'
		}
	},
	{
		path: 'criticalBusiness',
		name: 'criticalBusiness',
		component: () =>
			import('pages/ciiIdent/criticalBusiness/Page'),
		meta: {
			title: '关键业务识别',
			roleType: '03'
		}
	},
	{
		path: 'maxBoundary',
		name: 'maxBoundary',
		component: () =>
			import('pages/ciiIdent/maxBoundary/Page'),
		meta: {
			title: '最大可能边界识别',
			roleType: '03'
		}
	},
	{
		path: 'ciiTemplate',
		name: 'ciiTemplate',
		component: () =>
			import('pages/ciiIdent/templateManage/Page'),
		meta: {
			title: '评估模板管理',
			roleType: '03'
		}
	},
	{
		path: 'criticalRule',
		name: 'criticalRule',
		component: () =>
			import('pages/ciiIdent/criticalRule/Page'),
		meta: {
			title: '关键性评估规则管理',
			roleType: '03'
		}
	},
	{
		path: 'ciiAffirm',
		name: 'ciiAffirm',
		component: () =>
			import('pages/ciiIdent/ciiAffirm/Page'),
		meta: {
			title: 'CII认定',
			roleType: '03'
		}
	},
	{
		path: 'exportCriticalAsset',
		name: 'exportCriticalAsset',
		component: () =>
			import('pages/ciiIdent/exportCriticalAsset/Page'),
		meta: {
			title: '关键业务资产导出',
			roleType: '03'
		}
	}
	]


},

// CII对象管理
{
	path: '/ciiObject',
	name: 'ciiObject',
	meta: {
		title: 'CII对象管理',
		roleType: '03'
	},
	redirect: '/ciiObject/infoMainten',
	component: Layout,
	children: [{
		path: 'infoMainten',
		name: 'infoMainten',
		component: () =>
			import('pages/ciiObject/infoMainten/Page'),
		meta: {
			title: '信息维护',
			roleType: '03'
		}
	},
	{
		path: 'backupManage',
		name: 'backupManage',
		component: () =>
			import('pages/ciiObject/backupManage/Page'),
		meta: {
			title: '备份管理',
			roleType: '03'
		}
	},
	{
		path: 'patchManage',
		name: 'patchManage',
		component: () =>
			import('pages/ciiObject/patchManage/Page'),
		meta: {
			title: '安全补丁管理',
			roleType: '03'
		}
	}
	]
},

// 安全评估工具
{
	path: '/evaluationTool',
	name: 'evaluationTool',
	meta: {
		title: '安全评估工具',
		roleType: '03'
	},
	component: Layout,
	redirect: '/evaluationTool/securityTemplate',
	children: [{
		path: 'securityTemplate',
		name: 'securityTemplate',
		component: () =>
			import('pages/evaluationTool/templateManage/Page'),
		meta: {
			title: '安全评估模板管理',
			roleType: '03'
		}
	},
	{
		path: 'securityEvaluate',
		name: 'securityEvaluate',
		component: () =>
			import('pages/evaluationTool/securityEvaluate/Page'),
		meta: {
			title: '安全评估',
			roleType: '03'
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
		title: '安全检查工具',
		roleType: '03'
	},
	redirect: '/securityCheck/vulnerabilityQuery',
	children: [{
		path: 'vulnerabilityQuery',
		name: 'vulnerabilityQuery',
		component: () =>
			import('pages/securityCheck/vulnerabilityQuery/Page'),
		meta: {
			title: '漏洞查询',
			roleType: '03'
		}
	},
	{
		path: 'policyTemplate',
		name: 'policyTemplate',
		component: () =>
			import('pages/securityCheck/policyTemplate/Page'),
		meta: {
			title: '策略模板管理',
			roleType: '03'
		}
	},
	{
		path: 'checkItem',
		name: 'checkItem',
		component: () =>
			import('pages/securityCheck/checkItem/Page'),
		meta: {
			title: '核查项管理',
			roleType: '03'
		}
	},
	{
		path: 'chckRealTime',
		name: 'chckRealTime',
		component: () =>
			import('pages/securityCheck/chckRealTime/Page'),
		meta: {
			title: '资产实时核查',
			roleType: '03'
		}
	},
	{
		path: 'checkPeriodic',
		name: 'checkPeriodic',
		component: () =>
			import('pages/securityCheck/checkPeriodic/Page'),
		meta: {
			title: '资产周期核查',
			roleType: '03'
		}
	},
	]
}
];

const router = new Router({
	mode: 'hash',
	routes: routes
});

router.beforeEach((to, from, next) => {
	if (!sessionStorage.getItem('SESSIONID') && to.path !== '/login') {
		next('/login');
	}
	next();
})

export default router;