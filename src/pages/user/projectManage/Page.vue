<template>
	<div class="page">
		<div class="section list">
			<div class="tabs-wrapper">
				<el-tabs v-model="tabName" type="card" @tab-click="handleClick">
					<el-tab-pane label="单系统用户项目" name="2">
					</el-tab-pane>
					<el-tab-pane label="集团用户项目" name="1">
					</el-tab-pane>
					<!-- <app-table :table-data="tableData" :table-titles="tableTitles" @operate="handleOperate"></app-table> -->
				</el-tabs>
				<el-button class="btn" type="primary" size="small" @click="handleAddClick">添加</el-button>
			</div>
			
			<el-table :data="tableData" border>
				<el-table-column label="项目名称" prop="pjname"></el-table-column>
				<el-table-column label="项目类型" prop="pjtype"></el-table-column>
				<el-table-column label="项目地点" prop="address"></el-table-column>
				<el-table-column label="开始时间" prop="createTime"></el-table-column>
				<el-table-column label="项目描述" prop="description"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="text" @click="handleEditClick(scope.row.id)">编辑</el-button>
						<el-button type="text" @click="handleDelClick(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-dialog
				title="添加项目"
				:visible.sync="dialogShow"
				width="600px"
				@close="dialogShow = false">
				<el-form :model="form" ref="form" label-width="80px">
					<el-form-item label="项目名称">
						<el-input v-model="form.pjname"></el-input>
					</el-form-item>
					<el-form-item label="项目类型">
						<el-cascader
							:options="pjOptions" 
							:props="{ expandTrigger: 'hover', checkStrictly: true }" 
							filterable
							v-model="form.pjtype">
						</el-cascader>
					</el-form-item>
					<el-form-item label="项目地点">
						<el-input v-model="form.address"></el-input>
					</el-form-item>
					<el-form-item label="项目描述">
						<el-input v-model="form.description"></el-input>
					</el-form-item>
					<el-form-item label="Ip范围">
						<el-input v-model="form.ip" placeholder="ip格式为192.168.1-2.2-1或192.168.1.1-255和192.168.1.1"></el-input>
					</el-form-item>
				</el-form>
				
				
				<span slot="footer">
					<el-button @click="dialogShow = false">取 消</el-button>
					<el-button type="primary" @click="handleComfirmClick">确 定</el-button>
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
				id: null,
				tabName: '2',
				dialogShow: false,
				form: {
					pjname: '',
					pjtype: [],
					address: '',
					description: '',
					ip: ''
				},
				pjOptions: null,
				tableData: [],
			}
		},
		created() {
			this.fetchTableData();
			this.fetchPjTreeData();
		},
		methods: {
			async fetchTableData() {
				let url = this.tabName === '1' ? '/projectInfo/getProjectInfoList' : '/projectInfo/getProjectInfosList';
				const data = await this.fetch({url: url, vm: this});
				this.tableData = this._.clone(data);
			},
			
			async fetchPjTreeData() {
				const { data } = await this.fetch({url: '/porject/getProjectList', vm: this});
				this.pjOptions = this.traverseArr(data);
				console.log(this.traverseArr(data));
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
					}

					tmpArr.push(tmpObj);
				});

				return tmpArr;
			},
			handleClick(tab) {
				this.fetchTableData();
			},
			async handleComfirmClick() {
				let url = '/projectInfo/getProjectInfoAdd';
				let params = this._.clone(this.form);
				params.pid = this.tabName;
				params.pjtype = params.pjtype.join('/');

				// 编辑
				if (this.id) {
					params.id = this.id;
					url = '/projectInfo/getProjectInfoid';
				}

				// const data = await this.fetch({
				// 	'url': url, 
				// 	'params': params, 
				// 	'vm': this
				// });

				console.log(params);
				// if (data.status === 1) {
				// 	this.$message.success('添加成功！');
				// 	this.dialogShow = false;
				// 	this.fetchTableData();
				// } else {
				// 	this.$message.success(data.msg);
				// }
			},
			async handleAddClick() {
				this.dialogShow = true;
				this.id = null;
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
				this.id = id;
				const data = await this.fetch({'url': '/projectInfo/getProjectInfoFind', params: {'id': id}, 'vm': this});
				let pjData = data[0];
				this.form = {
					pjname: pjData.pjname,
					pjtype: pjData.pjtype,
					address: pjData.address,
					description: pjData.description,
					ip: pjData.ip,
				};
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
