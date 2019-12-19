<template>
  <div class="page">
    <div class="login-wrapper">
      <el-row class="header">
        <el-col :span="8">
          <img class="logo" src="../../assets/images/logo.png" alt="logo" />
        </el-col>
        <el-col class="separation" :span="2">|</el-col>
        <el-col :span="14">云南昆船设计研究院有限公司</el-col>
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
import { login } from "api/login";
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
  methods: {
    login() {
      let loginParams = this.loginParams;
      if (loginParams.account === "" || loginParams.passwd === "") {
        return this.$message.error("账号和密码不能为空！");
	  }
	  
	  	this.$message.info('正在登录...');
		this.$router.push({
			path: "/user/userManage"
		});
		this.$message.success('登录成功！');
    //   login(loginParams)
    //     .then(res => {
    //       let data = res.data;
    //       if (data.code === 2000000) {
    //         this.$router.push({
    //           path: "/user/userManage"
    //         });
    //         setToken(data.data.opToken);
    //         sessionStorage.setItem("account", loginParams.account);
    //       } else {
    //         this.$message.error(data.msg);
    //       }
    //     })
    //     .catch(err => {
    //       this.$message.error("登录失败，请稍后再试！");
    //     });
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