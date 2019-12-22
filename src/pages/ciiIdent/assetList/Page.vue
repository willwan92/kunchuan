<template>
	<div class="page">
		<div class="section list">
			<el-button class="btn" type="primary" size="small" @click="handleAddClick">添加</el-button>
			<el-table :data="tableData" border>
			  <el-table-column label="序号" prop="deviceid"></el-table-column>
			  <el-table-column label="ip地址" prop="deviceip"></el-table-column>
			  <el-table-column label="登录方式" prop="devicelogin"></el-table-column>
			  <el-table-column label="端口" prop="deviceport"></el-table-column>
			  <el-table-column label="资产类型" prop="devicelist"></el-table-column>
			  <el-table-column label="厂家名称" prop="deviceEname"></el-table-column>
			  <el-table-column label="设备型号" prop="deviceSname"></el-table-column>
			  <el-table-column label="版本号" prop="devicenum"></el-table-column>
			  <el-table-column label="操作系统" prop="deviceos"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="text" @click="handleEditClick(scope.row.id)">编辑</el-button>
						<el-button type="text" @click="handleDelClick(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-dialog
				title="添加资产"
				:visible.sync="dialogShow"
				width="600px"
				@close="dialogShow = false">
				<el-form :model="form" ref="form" label-width="90px">
					<el-form-item label="ip地址">
						<el-input v-model="form.deviceip"></el-input>
					</el-form-item>
					<el-form-item label="登录方式">
						<el-cascader :options="devicelogin" v-model="form.devicelogin">
						</el-cascader>
					</el-form-item>
					<el-form-item label="端口">
						<el-input v-model="form.deviceport"></el-input>
					</el-form-item>
					<el-form-item label="资产类型">
						<el-input v-model="form.devicelist"></el-input>
					</el-form-item>
					<el-form-item label="厂家名称">
						<el-input v-model="form.deviceEname"></el-input>
					</el-form-item>
					<el-form-item label="设备型号">
						<el-input v-model="form.deviceSname"></el-input>
					</el-form-item>
					<el-form-item label="版本号">
						<el-input v-model="form.devicenum"></el-input>
					</el-form-item>
					<el-form-item label="操作系统">
						<el-cascader :options="deviceo" v-model="form.deviceos"></el-cascader>
					</el-form-item>
					<el-form-item label="用户名">
						<el-input v-model="form.deviceusr"></el-input>
					</el-form-item>
					<el-form-item label="登录密码">
						<el-input v-model="form.devicepass"></el-input>
					</el-form-item>
					<el-form-item label="su用户名">
						<el-input v-model="form.suUserName"></el-input>
					</el-form-item>
					<el-form-item label="su密码">
						<el-input v-model="form.suPassword"></el-input>
					</el-form-item>
					<el-form-item label="数据库路径">
						<el-input v-model="form.databasePath"></el-input>
					</el-form-item>
					<el-form-item label="数据库账号">
						<el-input v-model="form.databaseAccount"></el-input>
					</el-form-item>
					<el-form-item label="数据库口令">
						<el-input v-model="form.databasePassword"></el-input>
					</el-form-item>
					<el-form-item label="数据库实例">
						<el-input v-model="form.databaseInstance"></el-input>
					</el-form-item>
				</el-form>
				
				
				<span slot="footer">
					<el-button @click="dialogShow = false">取 消</el-button>
					<el-button type="primary" @click="addDevice">确 定</el-button>
				</span>
			</el-dialog>
			
		</div>
	</div>
</template>

<script>
	// import { judgeGender, deepCopy, commonExport } from 'common/utils'

	export default {
		data() {
			return {
				//tabName: '2',
				dialogShow: false,
				form: {
					deviceid: '',
					deviceip: '',
					devicelogin: [],
					deviceport: '',
					devicelist: '',
					deviceEname: '',
					deviceSname: '',
					devicenum: '',
					deviceos: [],
					deviceusr: '',
					devicepass: '',
					databasePath: '',
					databaseAccount: '',
					databasePassword: '',
					suUserName: '',
					suPassword: '',
					databaseInstance: '',
				},
				pjOptions: null,
				tableData: [],
			}
		},
		created() {
			//this.fetchTableData();
			this.fetchPjTreeData();
		},
		methods: {
			/*async fetchTableData() {
				let url = this.tabName === '1' ? '/projectInfo/getProjectInfoList' : '/projectInfo/getProjectInfosList';
				const data = await this.fetch({url: url, vm: this});
				this.tableData = this._.clone(data);
			},*/
			async fetchPjTreeData() {
				const data = await this.fetchFuzz({url: '/fuzz/page/view/station/station!loaddatas.action', vm: this});
				// this.tableData = this._.clone(data);
				console.log(data);
			},
			handleClick(tab) {
				this.fetchTableData();
			},
			async addDevice() {
				let params = this._.clone(this.form);
				//params.pid = this.tabName;

				const data = await this.fetch({
					'url': '/fuzz/page/view/station/device!adddevice.action', 
					'params': params, 
					'vm': this
				});

				console.log(data);
			},
			async handleAddClick() {
				this.dialogShow = true;
				this.form = {
					pjname: '',
					pjtype: [],
					address: '',
					description: '',
					ip: ''
				};
			},
			async handleEditClick(id) {
				this.dialogShow = true;
				const data = await this.fetch({'url': '/projectInfo/getProjectInfoFind', params: {'id': id}, 'vm': this});
				console.log(data);
				let pjData = data[0];
				this.form = {
					pjname: pjData.pjname,
					pjtype: pjData.pjtype,
					address: pjData.address,
					description: pjData.description,
					ip: pjData.ip,
				};
				// if (data === 1) {
				// 	this.$message.success('修改成功！');
				// 	this.fetchTableData();
				// }
			},
			async handleDelClick(id) {
				const data = await this.fetch({'url': '/projectInfo/getProjectInfoDeleteid', params: {'id': id}, 'vm': this});
				if (data === 1) {
					this.$message.success('删除成功！');
					this.fetchTableData();
				}
			}
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

.tabs-wrapper {
	position: relative;
	.btn {
		position: absolute;
		right: 5px;
		top: 5px;
	}
}

.btn-lg {
	width:150px;
	margin-right:30px;
}
</style>
