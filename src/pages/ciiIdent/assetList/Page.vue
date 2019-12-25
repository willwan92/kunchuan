<template>
	<div class="page">
		<div class="section list">
			<el-form 
				:inline="true"
				label-width="75px">
				<el-form-item label="项目名称">
					<el-cascader
						:options="pjOptions" 
						:props="{ expandTrigger: 'hover' }" 
						filterable
						v-model="pjValue">
					</el-cascader>
				</el-form-item>
				<el-form-item label="">
					<el-button type="primary" @click="fetchTableData">查询</el-button>
				</el-form-item>
				<el-form-item label="">
					<el-button class="btn-lg" type="primary" @click="dialogShow = true">添加资产</el-button>
				</el-form-item>
			</el-form>
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
				<el-form :model="form" class="dialog-form" ref="form" label-width="100px">
					<el-form-item label="IP地址">
						<el-input v-model="form.ip"></el-input>
					</el-form-item>
					<el-form-item label="登录方式">
						<el-select v-model="form.loginMethod" placeholder="">
							<el-option v-for="item in loginMethodOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="端口">
						<el-input v-model="form.port"></el-input>
					</el-form-item>
					<el-form-item label="资产类型">
						<el-select v-model="form.assetsType" placeholder="">
							<el-option v-for="item in assetsTypeOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="厂家名称">
						<el-select v-model="form.vendorName" placeholder="">
							<el-option v-for="item in vendorOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="设备型号">
						<el-input v-model="form.deviceNum"></el-input>
					</el-form-item>
					<el-form-item label="版本号">
						<el-input v-model="form.version"></el-input>
					</el-form-item>
					<el-form-item label="操作系统">
						<el-select v-model="form.deviceOs" placeholder="">
							<el-option v-for="item in deviceOsOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="用户名">
						<el-input v-model="form.userName"></el-input>
					</el-form-item>
					<el-form-item label="登录密码">
						<el-input v-model="form.password"></el-input>
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
				dialogShow: false,
				pjValue: [],
				loginMethodOptions: [
					{
						label: '请选择',
						value: 0
					},
					{
						label: 'ssh',
						value: 1
					},
					{
						label: 'telnet',
						value: 2
					}
				],
				deviceOsOptions: [{
					label: '请选择',
					value: ''
				}],
				assetsTypeOptions: [{
					label: '请选择',
					value: ''
				}],
				vendorOptions: [{
					label: '请选择',
					value: ''
				}],
				form: {
					ip: '',
					loginMethod: 0,
					port: '',
					assetsType: '',
					vendorName: '',
					deviceNum: '',
					version: '',
					deviceOs: '',
					userName: '',
					password: '',
					suUserName: '',
					suPassword: '',
					databasePath: '',
					databaseAccount: '',
					databasePassword: '',
					databaseInstance: '',
				},
				pjOptions: null,
				tableData: [],
			}
		},
		created() {
			this.fetchPjTreeData();
			this.initData();
		},
		computed: {
			getPjId() {
				let id;
				if (this.pjValue && this.pjValue[0]) {
					id = this.pjValue.slice(-1)[0]
				} else {
					id = null;
				}

				return id;
			}
		},
		methods: {
			initData() {
				this.fetchAssetsTypeData();
				this.fetchVendorsData();
				this.fetchOsData();
			},
			async fetchTableData() {
				const pjId = this.getPjId;

				if (!pjId) {
					this.$message.info('请选择项目');
					return;
				}

				const { data } = await this.fetchFuzz({
					url: '/fuzz/page/view/station/device!getAssetsListByPjID.action',
					params: {
						pjid: pjId
					},
					vm: this
				});

				console.log(data)
			},
			async fetchAssetsTypeData() {
				const { data } = await this.fetchFuzz({
					url: '/fuzz/page/view/station/device!findAllDevtype.action',
					vm: this
				});

				data.forEach((item, index) => {
					this.assetsTypeOptions.push({
						label: item.devtype,
						value: index
					})
				});
			},
			async fetchVendorsData() {
				const { data } = await this.fetchFuzz({
					url: '/fuzz/page/view/station/device!findVendorByType.action',
					params: {
						devtype: ''
					},
					vm: this
				});

				data.forEach((item, index) => {
					this.vendorOptions.push({
						label: item.vendor,
						value: index
					})
				});
			},
			async fetchOsData() {
				const { list } = await this.fetchFuzz({
					url: '/fuzz/page/view/station/device!loadOsDatas.action',
					vm: this
				});

				list.forEach((item, index) => {
					this.deviceOsOptions.push({
						label: item,
						value: index
					})
				});
			},
			async fetchPjTreeData() {
				const { data } = await this.fetch({url: '/porject/getProjectList', vm: this});
				this.pjOptions = this.traverseArr(data);
			},
			traverseArr(arr) {
				let tmpArr = [];
				let tmpObj = {};

				arr.forEach(item => {
					tmpObj = {
						label: item.pjname,
						value: item.id
					}

					if (item.children && item.children[0]) {
						tmpObj.children = this.traverseArr(item.children);
						tmpArr.push(tmpObj);
					} else {
						if (item.isleaf) {
							tmpArr.push(tmpObj);
						}
					}
				});

				return tmpArr;
			},
			handleClick(tab) {
				this.fetchTableData();
			},
			async addDevice() {
				let params = this._.clone(this.form);
				//params.pid = this.tabName;

				const data = await this.fetchFuzz({
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

.btn-lg {
	width:150px;
	margin-right:30px;
}

.dialog-form {
	width: 500px;
}
</style>
