<template>
  <div class="page">
    <div class="section list">
      <el-form :inline="true" label-width="75px">
        <el-form-item label="角色名称">
          <el-input
            v-model="searchParams.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="fetchData">查 询</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button class="btn-lg" type="primary" @click="handleAddClick"
            >添加角色</el-button
          >
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色类型" prop="roleType">
					<template slot-scope="scope">
            <span>{{roleType[scope.row.roleType]}}</span>
          </template>
				</el-table-column>
        <el-table-column label="角色描述" prop="desc"></el-table-column>
        <el-table-column label="权限" width="500px" prop="sysPermission"></el-table-column>
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
      <el-form
        :model="dialogForm"
        :rules="dialogFormRules"
        ref="dialogForm"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="dialogForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input v-model="dialogForm.desc" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="角色类型" prop="roleType">
          <el-radio-group v-model="dialogForm.roleType">
            <el-radio :label="2">配置管理员</el-radio>
            <el-radio :label="3">操作员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="dialogForm.roleType === 3" label="项目权限" prop="pjPermission">
          <el-tree
            show-checkbox
						ref="pjTree"
						node-key="id"
            :data="pjTreeData"
            :props="defaultProps"
						:default-checked-keys="dialogForm.permission"
						@check-change="getCheckedNodes"
          ></el-tree>
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
import { getTreeData } from "common/utils";

export default {
  data() {
    return {
      id: null,
      dialogShow: false,
      searchParams: {
        roleName: ""
      },
      pjTreeData: null,
      pjChecked: null,
      defaultProps: {
        children: "children",
        label: "pjname"
      },
      dialogForm: {
        roleName: "",
        desc: "",
        roleType: 2,
        pjPermission: []
      },
      tableData: [],
      dialogFormRules: {
        roleName: [{ required: true, message: "请输入角色名", trigger: "blur" }]
			},
			sysPermission: {
				'0': '全部权限',
				'2': '用户管理/角色管理/登录策略管理/日志管理/网络环境配置/系统升级/时间配置/系统信息',
				'3': '项目管理/项目信息录入/单IP扫描/多IP扫描/自定义操作/资产清单/关键业务识别/最大可能边界识别/评估模板管理/CII评估/关键业务资产导出/信息维护/备份管理/安全补丁管理/安全评估模板管理/安全评估/漏洞查询/策略模板管理/核查项管理/资产实时核查/资产周期核查'
			},
			roleType: {
				'0': '系统管理员',
				'2': '配置管理员',
				'3': '操作员'
			}
    };
  },
  computed: {
    actionName() {
      return this.id ? "编辑角色" : "添加角色";
		},
  },
  created() {
    this.fetchData();
    this.fetchPjTreeData();
  },
  methods: {
		handleAddClick() {
			this.dialogShow = true;
			this.resetForm('dialogForm');
			this.$nextTick(() => {
				this.setCheckedNodes([]);
			})
		},
		resetForm(formName) {
      this.$refs[formName] && this.$refs[formName].resetFields();
    },
		getCheckedNodes() {
      let treeNodes = this.$refs['pjTree'].getCheckedNodes(true);
      this.dialogForm.pjPermission = JSON.stringify(treeNodes);
    },
    async fetchPjTreeData() {
      const { data } = await this.fetch({
        url: "/porject/getProjectList",
        vm: this
      });

      this.pjTreeData = getTreeData(data);
    },
    handleDelClick(id) {
      this.$confirm("确认要删除该角色吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delRoleById(id);
        })
        .catch(() => {});
    },
    async delRoleById(id) {
      const data = await this.postFuzz({
        url: "/fuzz/page/view/user/user!deleteRole.action",
        params: {
          roleIds: id
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
    handleEditClick({ id, index }) {
      this.id = id;
      this.dialogShow = true;

      const roleInfo = this.tableData[index];

      this.dialogForm = Object.assign({}, this.dialogForm, {
        roleName: roleInfo.roleName,
        desc: roleInfo.desc,
        roleType: roleInfo.roleType,
        permission: JSON.parse(roleInfo.pjPermission)
			});

			this.$nextTick(() => {
				this.setCheckedNodes(JSON.parse(roleInfo.pjPermission));
			})
		},
		setCheckedNodes(checkedNodes) {
			if (this.$refs['pjTree']) {
				this.$refs['pjTree'].setCheckedNodes(checkedNodes)
			}
		},
    resetForm(formName) {
      this.$refs[formName] && this.$refs[formName].resetFields();
    },
    handleComfirmClick() {
      this.$refs["dialogForm"].validate(valid => {
				if (!valid) return;
        this.save();
      });
    },
    async save() {
      let dialogForm = this.dialogForm;

      const params = {
        role_name: dialogForm.roleName,
        role_desc: dialogForm.desc,
        role_type: dialogForm.roleType,
        role_auth: dialogForm.pjPermission
      };

      if (this.id) {
        params.role_id = this.id;
      }

      const data = await this.postFuzz({
        url: "/fuzz/page/view/user/user!saveRole.action",
        params: params,
        vm: this
      });

      this.dialogShow = false;

      if (data.state === 1) {
        this.$message.success(`${this.actionName}成功`);
        this.fetchData();
      } else {
        this.$message.error(`${this.actionName}失败，${data.msg}`);
      }
    },
    // 请求列表数据
    async fetchData() {
      const params = {
        start: 0,
        t: Math.random(),
        role_name: this.searchParams.roleName
      };

      const { data } = await this.fetchFuzz({
        url: "/fuzz/page/view/system/user!getAllRole.action",
        params: params,
        vm: this
      });

      this.tableData = data.map((element, index) => {
        return {
          index: index,
          id: element[0],
          roleName: element[1],
          desc: element[2],
          roleType: element[3],
					sysPermission: this.sysPermission[element[3]],
					pjPermission: element[4]
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
