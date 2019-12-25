<template>
	<div class="page">
		<div class="section list">
			<el-form 
				:inline="true"
				label-width="75px">
				<el-form-item label="用户名称">
					<el-input v-model="form.username" placeholder="请输入用户名称"></el-input>
				</el-form-item>
				<el-form-item label="">
					<el-button class="btn-lg" type="primary" @click="fetchData">查 询</el-button>
				</el-form-item>
				<el-form-item label="">
					<el-button class="btn-lg" type="primary" @click="dialogShow = true">添加用户</el-button>
				</el-form-item>
			</el-form>
		
			<el-table :data="tableData" border>
				<el-table-column label="用户名" prop="userName"></el-table-column>
				<el-table-column label="所属角色" prop="roleType"></el-table-column>
				<el-table-column label="项目权限" prop="permissionList"></el-table-column>
				<el-table-column label="手机号" prop="mobile"></el-table-column>
				<el-table-column label="固话" prop="telephone"></el-table-column>
				<el-table-column label="邮箱地址" prop="email"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="text" @click="handleEditClick(scope.row.id)">编辑</el-button>
						<el-button type="text" @click="handleDelClick(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<el-dialog
				title="添加用户"
				:visible.sync="dialogShow"
				width="600px"
				@close="dialogShow = false">
				<el-form :model="dialogForm" ref="form" label-width="80px">
					<el-form-item label="用户名称">
						<el-input v-model="dialogForm.userName"></el-input>
					</el-form-item>
					<el-form-item label="所属角色">
						<el-select v-model="dialogForm.roleType" placeholder="">
							<el-option v-for="item in roleTypeOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="项目权限">
						<el-input v-model="dialogForm.permissionList"></el-input>
					</el-form-item>
					<el-form-item label="手机号">
						<el-input v-model="dialogForm.mobile" placeholder=""></el-input>
					</el-form-item>
					<el-form-item label="固定电话">
						<el-input v-model="dialogForm.telephone" placeholder=""></el-input>
					</el-form-item>
					<el-form-item label="邮箱地址">
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
	import { judgeGender, deepCopy, commonExport } from 'common/utils'

	export default {
		data() {
			return {
				dialogShow: false,
				form: {
					username: ''
				},
				roleTypeOptions: [
					{
						label: '配置管理员',
						value: 1
					},
					{
						label: '操作员',
						value: 2
					}
				],
				dialogForm: {
					userName: '',
					roleType: 1,
					permissionList: '',
					mobile: '',
					email: '',
					telephone: ''
				},
				tableData: []
			}
		},
		methods: {
			//查询
			async fetchData(){
				const params = {
					start: 0,
					t: Math.random(),
					user_name: this.form.username
				};

				const { data } = await this.fetchFuzz({
					url: '/fuzz/page/view/system/user!getAllUser.action',
					params: params,
					vm: this
				});

				this.tableData = data.map(element => {
					return {
						userName: element[0],
						roleType: element[1],
						permissionList: element[0],
						mobile: element[0],
						telephone: element[0],
						email: element[0],
					}
				});

			},
			handleComfirmClick() {
				
			},
			editItem(id) {

			},
			createParams() {
				let params = deepCopy(this.searchParams);
				params.pageNum = this.currentPage;
				return params;
			},
			// 请求列表数据
			fetchData() {
				// 
			},
			viewDetail(row) {
				this.$router.push({
					path: '/user/userDetail',
					query: {
						id: row.userId
					}
				})
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
