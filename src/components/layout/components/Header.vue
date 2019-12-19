<template>
	<div id="header" class="clearfix">
		<div class="fl logo-wrapper">
			<img class="logo" src="../../../assets/images/logo.png" alt="logo">
		</div>
		<div class="navbar">
			<div class="top clearfix">
				<div class="fl">云南昆船设计研究院有限公司</div>
				<div class="fr">
					<span>欢迎回来</span>
					<span class="user"><i class="iconfont icon-user"></i> {{ account }}</span>
					<span class="logout" @click="logout"><i class="iconfont icon-tuichu"></i>退出登陆</span>
				</div>
			</div>
			<div class="breadcrumb">
				<span class="separator-line">|</span>
				<el-breadcrumb class="el-breadcrumb" separator-class="el-icon-arrow-right">
					<el-breadcrumb-item v-for="(item, index) in levelList" :key="index" :to="{path: item.path}">{{ item.meta.title }}</el-breadcrumb-item>
				</el-breadcrumb> 
			</div>
		</div>
	</div>
</template>

<script>

	export default {
		data() {
			return {
				account: '',
				levelList: null,
				logoutDialogVisible: false
			}
		},
		created() {
			this.getLevelList();
			this.account = sessionStorage.getItem('account');
		},
		methods: {
			logout() {
				this.$emit('logout');
			},
			getLevelList() {
				this.levelList = this.$route.matched.filter(item => item.name);;
			}
		},
		watch: {
			$route() {
				this.getLevelList();
			}
		}
	}
</script>

<style lang="less" scoped>
#header {
	.logo-wrapper {
		width: @leftWidth;
		height: 100%;
		background-color: @themeColor;
		text-align: center;
		line-height: 135px;
		.logo {
			width: 136px;
		}
	}
}

.navbar {
	margin-left: @leftWidth;
	.top {
		height: 50px;
		line-height: 50px;
		padding-left: 20px;
		color: #fff;
		background-color: @themeColor;
		font-size: 16px;
		font-weight: 700;

		.user {

			margin-left: 20px;
			margin-right: 20px;
			font-weight: 500;
		}

		.icon-user {
			display: inline-block;
			width: 26px;
			height: 26px;
			line-height: 26px;
			text-align: center;
			color: #d9ecff;
			border-radius: 50%;
			background-color: @themeColor;
		}
		.logout {
			display: inline-block;
			width: 150px;
			height: 50px;
			text-align: center;
			color: #fff;
			cursor: pointer;
			background-color: @themeColor;
			.iconfont {
				font-weight: 400;
				font-size: 18px;
				margin-right: 10px;
			}
		}
	}
	.breadcrumb {
		height: 35px;
		padding-left: 18px;
		padding-top: 10px;
		color: @themeColor;
		background-color: #fff;
		border-bottom: 1px solid #ccc;
		.separator-line {
			font-size: 20px;
			margin-top: 15px;
		}
		.el-breadcrumb {
			display: inline-block;;
		}
	}

}
</style>