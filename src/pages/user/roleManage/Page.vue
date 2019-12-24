<template>
	<div class="page">
		<div class="section list">
			<el-form 
				:inline="true"
				label-width="75px">
				<el-form-item label="角色名称">
					<el-input v-model="searchParams.nickname" placeholder="请输入角色名称"></el-input>
				</el-form-item>
				<el-form-item label="">
					<el-button class="btn-lg" type="primary" @click="search">查 询</el-button>
				</el-form-item>
				<el-form-item label="">
					<el-button class="btn-lg" type="primary" @click="dialogShow = true">添加用户</el-button>
				</el-form-item>
			</el-form>

			<el-table :data="tableData" border>
				<el-table-column label="角色名称" prop="pjname"></el-table-column>
				<el-table-column label="角色描述" prop="pjtype"></el-table-column>
				<el-table-column label="所属权限" prop="address"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="text" @click="handleEditClick(scope.row.id)">编辑</el-button>
						<el-button type="text" @click="handleDelClick(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<el-dialog
			title="添加角色"
			:visible.sync="dialogShow"
			width="600px"
			@close="dialogShow = false">
			<el-form :model="form" ref="form" label-width="80px">
				<el-form-item label="角色名称">
					<el-input v-model="form.roleName"></el-input>
				</el-form-item>
				<el-form-item label="角色描述">
					<el-input v-model="form.desc" placeholder=""></el-input>
				</el-form-item>
				<el-form-item label="角色类型">
					<el-radio v-model="radio" label="1">配置管理员</el-radio>
  					<el-radio v-model="radio" label="2">操作员</el-radio>
				</el-form-item>
				<el-form-item label="项目权限">
					<el-input v-model="form.permissionList"></el-input>
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
	import { getUserList } from 'api/user/user'
	import { judgeGender, deepCopy, commonExport } from 'common/utils'

	export default {
		data() {
			return {
				dialogShow: false,
				searchParams: {
					nickname: ''
				},
				form: {
					
				},
				tableData: []
			}
		},
		methods: {
			//查询
			search(){
				this.fetchData();
			},
			// 请求列表数据
			fetchData() {
				
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
