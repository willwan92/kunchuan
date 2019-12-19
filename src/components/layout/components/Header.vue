<template>
	<div id="header" class="clearfix">
		<div class="fl logo-wrapper">
			<img class="logo" src="../../../assets/images/logo.png" alt="logo">
		</div>
		<div class="navbar">
			<div class="top clearfix">
				<div class="fl">云南昆船设计研究院有限公司</div>
				<div class="fr">
					<!-- <span>用户名：</span> -->
					<span class="user"><i class="iconfont icon-user"></i> {{ userName }}</span>
					<span class="user-btn logout" @click="logout">退出</span>
					<span class="user-btn" >重启</span>
					<span class="user-btn" >关机</span>
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
				userName: '',
				levelList: null,
				logoutDialogVisible: false
			}
		},
		created() {
			this.getLevelList();
			this.userName = 'admin'
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
			width: 75%;
		}
	}
}

.navbar {
	margin-left: @leftWidth;
	.top {
		height: 70px;
		line-height: 70px;
		padding-left: 20px;
		color: #fff;
		background-color: @themeColor;
		font-size: 18px;
		.user-btn {
			margin-right: 10px;
			cursor: pointer;
		}
		.user {
			margin-right: 10px;
			font-weight: 500;
		}

		.icon-user {
			display: inline-block;
			width: 26px;
			height: 26px;
			line-height: 26px;
			text-align: center;
			color: #d9ecff;
			font-size: 20px;
			border-radius: 50%;
			background-color: @themeColor;
		}
		.logout {
			display: inline-block;
			height: 50px;
			text-align: center;
			color: #fff;
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