<template>
	<div id="app-wrapper">
		<Header @logout="handleLogout" id="header"/>
		<div class="clearfix" id="main-container">
			<SideMenu id="sidebar"/>
			<AppMain id="app-main"/>
			<el-dialog
			  :visible.sync="logoutDialogVisible"
			  width="20%">
			  <span class="dialog-main">确认要退出登录吗？</span>
			  <span slot="footer" class="dialog-footer">
			    <el-button @click="logoutDialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click="confirmLogout">确 定</el-button>
			  </span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import AppMain from './components/AppMain';

export default {
	components: {
		Header,
		SideMenu,
		AppMain
	},
	data() {
		return {
			logoutDialogVisible: false
		}
	},
	methods: {
		handleLogout() {
			this.logoutDialogVisible = true;
		}, 
		confirmLogout() {
			sessionStorage.removeItem('account');
			this.$cookies.removeItem('JSESSIONID');
			this.logoutDialogVisible = false;
			this.$router.push('/login');
		}
	}
}
</script>

<style lang="less" scoped>
#app-wrapper {
	position: relative;
	height: 100%;

	#header {
		position: fixed;
		width: 100%;
		height: 85px;
		z-index: 1000;
	}
	
	#main-container {
		position: relative;
		width: 100%;
		height: 100%;
		padding-top: 84px;
		#sidebar {
			position: fixed;
			padding-bottom: 100px;
			width: @leftWidth;
			height: 100%;
			background-color: @themeColor;
		}

		#app-main {
			margin-left: @leftWidth;
			margin-top: 20px;
			padding: 20px;
			min-height: 100%;
			background-color: @light-blue;
		}
	}
}

</style>