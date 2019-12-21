<template>
  <div class="page">
    <div class="login-wrapper">
      <el-row class="header">
        <el-col :span="8">
          <img class="logo" src="../../assets/images/logo.png" alt="logo" />
        </el-col>
        <el-col class="separation" :span="2">|</el-col>
        <el-col :span="14" class="system-name">烟草行业关键信息基础设施<br/>安全评估管理系统</el-col>
      </el-row>
      <el-form>
        <el-form-item>
          <el-input v-model="loginParams.account" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input 
		  	type="password" 
		  	v-model="loginParams.passwd" 
			@keydown.enter.native="login"
		  	placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-button class="btn-lg" type="primary" @click="login">登 录</el-button>
      </el-form>
    </div>

	<p class="copyright">&copy; 云南昆船设计研究院有限公司</p>
  </div>
</template>

<script>
import sha1 from 'js-sha1';
import md5 from 'md5';
import { login } from "api/login";
import cookies from 'js-cookies';
import { getToken, setToken, removeToken } from "common/utils";

export default {
  data() {
    return {
      loginParams: {
        account: "",
        passwd: ""
      }
    };
  },
  created() {

    this.getLoginPage();
  },
  methods: {
    async getLoginPage() {
      const data = await this.fetchFuzz({
      url: '/fuzz/login/login.jsp',
      vm: this
    });

    console.log(data)
    },
    async login() {
      let loginParams = this.loginParams;
      if (loginParams.account === "" || loginParams.passwd === "") {
        return this.$message.error("请输入账号和密码！");
      }
    
      this.$message.info('正在登录...');

      let params = {
        userName: this.loginParams.account,
        password: md5(sha1(this.loginParams.passwd)),
      };



      const data = await this.postFuzz({
        url: '/fuzz/login/login!userLogin.action',
        params: params,
        vm: this
      });

      

      const state = data.sate ? data.sate : '';
      const info = data.info ? data.info : '';
      
      if (state === '8') {
        this.$message.success('登录成功！');
        this.$router.push({
          path: "/user/userManage"
        });
      } else {
        this.$message.error(info);
      }
    }
  }
};
</script>

<style lang="less" scoped="">
.page {
  position: relative;
  padding-top: 150px;
  min-height: 100%;
  background-color: @themeColor;
}

.login-wrapper {
  margin: 0 auto;
  padding: 20px 50px;
  width: 550px;
  height: 320px;
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
    .system-name {
      line-height: 1.4;
      text-align: center;
    }
  }
  .btn-lg {
    width: 100%;
  }
}

.copyright {
	position: absolute;
	bottom: 15px;
	width: 100%;
	text-align: center;
	color: #ffffffb3;
}
</style>