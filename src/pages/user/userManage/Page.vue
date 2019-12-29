<template>
  <div class="page">
    <div class="section list">
      <el-form :inline="true" label-width="75px">
        <el-form-item label="用户名称">
          <el-input
            v-model="form.userName"
            placeholder="请输入用户名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="fetchData()">查 询</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button class="btn-lg" type="primary" @click="handleAddClick()"
            >添加用户</el-button
          >
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border>
        <el-table-column label="用户名" prop="userName"></el-table-column>
        <el-table-column label="所属角色" prop="">
          <template slot-scope="scope">
            {{roleTypeName(scope.row.roleType)}}
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="项目权限"
          prop="permissionList"
        ></el-table-column> -->
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="固话" prop="telephone"></el-table-column>
        <el-table-column label="邮箱地址" prop="email"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEditClick(scope.row)"
              >编辑</el-button
            >
            <el-button type="text" @click="handleDelClick(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="actionName"
      :visible.sync="dialogShow"
      width="600px"
			:close-on-click-modal="false"
      @close="dialogShow = false"
    >
      <el-form :model="dialogForm" :rules="userRules" ref="dialogForm" label-width="80px">
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="dialogForm.userName" :readonly="Boolean(this.id)" autocomplete="off"></el-input>
        </el-form-item>
				<el-form-item label="用户密码" v-show="id" prop="password">
          <el-input type="password" v-model="dialogForm.password"></el-input>
        </el-form-item>
        <el-form-item label="所属角色" prop="roleType">
          <el-select v-model="dialogForm.roleType" placeholder="">
            <el-option
              v-for="item in roleTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="dialogForm.mobile" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="固定电话" prop="telephone">
          <el-input v-model="dialogForm.telephone" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址" prop="email">
          <el-input v-model="dialogForm.email" placeholder=""></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="handleComfirmClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { judgeGender, deepCopy, commonExport } from "common/utils";

export default {
  data() {
    return {
			id: null,
      dialogShow: false,
      form: {
        userName: ""
      },
      roleTypeOptions: [
        {
          label: "配置管理员",
          value: 2
        },
        {
          label: "操作员",
          value: 3
        }
      ],
      dialogForm: {
				userName: "",
				password: "",
        roleType: 1,
        mobile: "",
        email: "",
        telephone: ""
			},
			userRules: {
				userName: [
					{ required: true, message: '请输入用户名', trigger: 'blur' }
				]
			},
      tableData: [],
    };
  },
  created() {
    this.fetchData();
	},
	computed: {
		actionName() {
			return this.id ? '编辑用户' : '添加用户';
    }
	},
  methods: {
    roleTypeName(roleType) {
      return roleType === 1 ? '系统管理员' : roleType === 2 ? '配置管理员' : '操作员';
    },
    handleAddClick() {
      this.dialogShow = true;
      this.resetForm('dialogForm');
    },
    handleDelClick(id) {
      this.$confirm("确认要删除该用户吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delUserById(id);
        })
        .catch(() => {});
		},
		handleEditClick({id, index}) {
			this.id = id;
      this.dialogShow = true;
      
      const userInfo = this.tableData[index];

      this.dialogForm = Object.assign({}, this.dialogForm, {
        userName: userInfo.userName,
        password: userInfo.password,
        roleType: userInfo.roleType,
        mobile: userInfo.mobile,
        telephone: userInfo.telephone,
        email: userInfo.email
      });
    },
    resetForm(formName) {
      this.$refs[formName] && this.$refs[formName].resetFields();
    },
		handleComfirmClick() {
			this.$refs['dialogForm'].validate(valid => {
				if (!valid) return;
				this.saveUser();
			})
		},
    async saveUser() {
      // executeType 此参数为1 表示执行新增操作
			// 修改功能 原项目用户名不可修改 executeType 此参数为2 表示执行修改操作
			// user_pwd

			let dialogForm = this.dialogForm;

      const params = {
				user_name: dialogForm.userName,
				email: dialogForm.email,
				mobile_code: dialogForm.mobile,
				fixed_line: dialogForm.telephone,
				role_id: dialogForm.roleType
      };
      
			if (this.id) {
				params.user_pwd = dialogForm.password;
				params.user_id = this.id;
				params.executeType = 2;
			} else {
				params.executeType = 1;
			}

      const data = await this.postFuzz({
        url: "/fuzz/page/view/user/user!saveUser.action",
        params: params,
        vm: this
      });
			
			this.dialogShow = false;
      if (data.state === 1) {
				this.$message({
					showClose: true,
					duration: 0,
          message: data.msg
        });
        this.fetchData();
      } else {
        this.$message.error(`${this.actionName}失败，${data.msg}`);
      }
    },
    async delUserById(id) {
      const data = await this.postFuzz({
        url: "/fuzz/page/view/user/user!deleteUser.action",
        params: {
          userIds: id
        },
        vm: this
      });

      if (data.state === 1) {
        this.$message.success("删除成功！");
        this.fetchData();
      } else {
        this.$message.error("删除失败，请稍后再试！");
      }
    },
    //查询
    async fetchData() {
      const params = {
        start: 0,
        t: Math.random(),
        user_name: this.form.userName
      };
      
      const { data } = await this.fetchFuzz({
        url: "/fuzz/page/view/system/user!getAllUser.action",
        params: params,
        vm: this
      });

      this.tableData = data.map((element, index) => {
        return {
          index: index,
          id: element[6],
          userName: element[0],
          roleType: element[1],
          permissionList: element[2],
          mobile: element[3],
          telephone: element[4],
          email: element[5],
          password: element[7]
        };
      });
    }
  }
};
</script>
<style lang="less" scoped>
.page {
  .section {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    margin-bottom: 30px;
    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      -webkit-box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
  }
}

.btn-lg {
  width: 150px;
  margin-right: 30px;
}
</style>
