<template>
	<div class="page">
		<div class="section list">
			<el-form 
				:inline="true"
				label-width="75px">
				<el-form-item label="角色名称">
					<el-input v-model="searchParams.roleName" placeholder="请输入角色名称"></el-input>
				</el-form-item>
				<el-form-item label="">
					<el-button type="primary" @click="fetchData">查 询</el-button>
				</el-form-item>
				<el-form-item label="">
					<el-button class="btn-lg" type="primary" @click="dialogShow = true">添加角色</el-button>
				</el-form-item>
			</el-form>

			<el-table :data="tableData" border>
				<el-table-column label="角色名称" prop="roleName"></el-table-column>
				<el-table-column label="角色描述" prop="desc"></el-table-column>
				<el-table-column label="所属权限" prop="permission"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="text" @click="handleEditClick(scope.row)">编辑</el-button>
						<el-button type="text" @click="handleDelClick(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<el-dialog
      :title="actionName"
			:visible.sync="dialogShow"
			width="600px"
			:close-on-click-modal="false"
			@close="dialogShow = false">
			<el-form :model="dialogForm" :rules="dialogFormRules" ref="dialogForm" label-width="80px">
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
				<el-form-item label="项目权限" prop="permission">
					<el-input v-model="dialogForm.permission"></el-input>
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
	import { judgeGender, deepCopy, commonExport } from 'common/utils'

	export default {
		data() {
			return {
				id: null,
				dialogShow: false,
				searchParams: {
					roleName: ''
				},
				dialogForm: {
					roleName: '',
					desc: '',
					roleType: 2,
					permission: '',
				},
				tableData: [],
				dialogFormRules: {
					roleName: [
						{ required: true, message: '请输入角色名', trigger: 'blur' }
					]
				},
			}
		},
		computed: {
			actionName() {
				return this.id ? '编辑角色' : '添加角色';
			}
		},
		methods: {
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
			handleEditClick({id, index}) {
				this.id = id;
				this.dialogShow = true;
				
				const roleInfo = this.tableData[index];

				this.dialogForm = Object.assign({}, this.dialogForm, {
					roleName: roleInfo.roleName,
					desc: roleInfo.desc,
					roleType: roleInfo.roleType,
					permission: roleInfo.permission
				});
			},
			resetForm(formName) {
				this.$refs[formName] && this.$refs[formName].resetFields();
			},
			handleComfirmClick() {
				this.$refs['dialogForm'].validate(valid => {
					if (!valid) return;
					this.save();
				})
			},
			async save() {
				let dialogForm = this.dialogForm;

				const params = {
					role_name: dialogForm.roleName,
					role_desc: dialogForm.desc,
					role_type: dialogForm.roleType,
					role_auth: dialogForm.permission
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
						permission: element[4],
					};
				});
			}
		},
		beforeRouteEnter(to, from, next) {
			next( vm => {
				vm.$nextTick( () => {
					vm.fetchData();
				});
			})
		},
		mounted() {
			this.$nextTick(() => {
				this.fetchData();
			})
		}
	}
</script>
<style lang="less" scoped>
.page {
	.section {
		padding: 20px;
		border:1px solid #ccc;
		border-radius: 5px;
		background:#fff;
		box-shadow:0 2px 4px rgba(0,0,0,.15);
		-webkit-box-shadow: 0 2px 4px rgba(0,0,0,.15);
		margin-bottom:30px;
		&:hover{
			box-shadow:0 4px 8px rgba(0,0,0,.15);
			-webkit-box-shadow: 0 4px 8px rgba(0,0,0,.15);
		}
	}
}

.btn-lg {
	width:150px;
	margin-right:30px;
}
</style>
