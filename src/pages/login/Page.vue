<template>
	<div class="page">
		<div class="login-wrapper">
			<el-row class="header">
				<el-col :span="11">
					<img class="logo" src="../../assets/images/logo-login.png" alt="logo"> 
				</el-col>
				<el-col class="separation" :span="2"> | </el-col>
				<el-col :span="11">运营管理后台</el-col>
			</el-row>
			<el-form>
				<el-form-item>
					<el-input v-model="loginParams.account" placeholder="请输入账号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input type="password" v-model="loginParams.passwd" placeholder="请输入密码"></el-input>
				</el-form-item>
				<el-button class="btn-lg" type="primary" @click="login">登 录</el-button>
			</el-form>
		</div>
	</div>
</template>

<script>
import { login } from 'api/login';
import { 
	getToken,
	setToken,
	removeToken,
} from 'common/utils'

export default {
	data() {
		return {
			loginParams: {
				account: '',
				passwd: ''
			}
		}
	},
	methods: {
		login() {
			let loginParams = this.loginParams;
			if (loginParams.account === '' || loginParams.passwd === '') {
				return this.$message.error('账号和密码不能为空！');
			}
			login(loginParams)
			.then(res => {
				let data = res.data;
				if (data.code === 2000000) {
					this.$router.push({
						path: '/user/userManage'
					})
					setToken(data.data.opToken);
					sessionStorage.setItem('account', loginParams.account);
				} else {
					this.$message.error(data.msg);
				}
			})
			.catch(err => {
				this.$message.error('出现错误！');
			})
		}
	}
}
</script>

<style lang="less" scoped="">
.page {
	padding-top: 150px;
	min-height: 100%;
	background-color: #d9ecff;
}

.login-wrapper {
	margin: 0 auto;
	padding: 20px 50px;
	width: 400px;
	height: 300px;
	border-radius: 8px;
	background-color: #fff;
	.header {
		margin-bottom: 30px;
		height: 60px;
		line-height: 55px;
		font-size: 20px;
		color: @themeColor;
		.logo {
			height: 60px;
		}
		.separation {
			text-align: center;
		}
	}
	.btn-lg {
		width: 100%;
	}
}
</style>