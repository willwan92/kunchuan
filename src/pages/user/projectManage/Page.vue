<template>
	<div class="page">
		<div class="section list">
			<div class="tabs-wrapper">
				<el-tabs v-model="tabName" type="card" @tab-click="handleClick">
					<el-tab-pane label="单系统用户项目" name="2">
					</el-tab-pane>
					<el-tab-pane label="集团用户项目" name="1">
					</el-tab-pane>
				</el-tabs>
				<el-button class="btn" type="primary" size="small" @click="handleAddClick">添加</el-button>
			</div>
			
			<el-table :data="tableData" border>
				<el-table-column label="名称" prop="pjname"></el-table-column>
				<el-table-column label="类型" prop="">{{ tabName === '2' ? '单系统用户项目' : '集团用户项目' }}</el-table-column>
				<el-table-column label="地点" prop="address"></el-table-column>
				<el-table-column label="创建时间" prop="createTime"></el-table-column>
				<el-table-column label="描述" prop="description"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="text" @click="handleEditClick(scope.row.id)">编辑</el-button>
						<el-button type="text" @click="handleDelClick(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-dialog
				:title="actionName + '项目'"
				:visible.sync="dialogShow"
				width="600px"
				@close="dialogShow = false">
				<el-form :model="form" ref="form" label-width="100px">
					<el-form-item label="名称">
						<el-input v-model="form.pjname"></el-input>
					</el-form-item>
					<el-form-item label="路径">
						<el-cascader
							class="auto-width"
							:disabled="Boolean(this.id)"
							:options="[pjOptions]" 
							:props="{ expandTrigger: 'hover', checkStrictly: true }" 
							filterable
							v-model="form.pjtype">
						</el-cascader>
					</el-form-item>
					<el-form-item label="地点">
						<el-input v-model="form.address"></el-input>
					</el-form-item>
					<el-form-item label="描述">
						<el-input v-model="form.description"></el-input>
					</el-form-item>
					<el-form-item label="是否为项目" v-show="tabName === '1'">
						<el-radio-group v-model="isLeaf">
							<el-radio :disabled="Boolean(this.id)" :label="1">是</el-radio>
							<el-radio :disabled="Boolean(this.id)" :label="0">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="IP范围" v-show="isLeaf">
						<el-input v-model="form.ip" placeholder="例如：192.168.1-255.1-255或192.168.1.1-255和192.168.1.1"></el-input>
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
	import { toNumberArr } from 'common/utils'

	export default {
		data() {
			return {
				id: null,
				tabName: '2',
				isLeaf: 0,
				dialogShow: false,
				form: {
					pjname: '',
					pjtype: [],
					address: '',
					description: '',
					ip: ''
				},
				pjTreeData: null,
				tableData: []
			}
		},
		computed: {
			pjOptions() {
				let options = null;
				if (this.pjTreeData) {
					options = this.tabName === '1' ? this.pjTreeData[0] : this.pjTreeData[1];
				}

				return options;
			},
			actionName() {
				return this.id ? '编辑' : '添加';
			}
		},
		created() {
			this.fetchTableData();
			this.fetchPjTreeData();
		},
		methods: {
			initData() {
				this.fetchTableData();
				this.fetchPjTreeData();
			},
			async fetchTableData() {
				let url = this.tabName === '1' ? '/projectInfo/getProjectInfoList' : '/projectInfo/getProjectInfosList';
				const data = await this.fetch({url: url, vm: this});
				this.tableData = this._.clone(data);
			},
			
			async fetchPjTreeData() {
				const { data } = await this.fetch({url: '/porject/getProjectSelectByIsleaf', vm: this});
				this.pjTreeData = this.traverseArr(data);
			},
			traverseArr(arr) {
				let tmpArr = [];
				let tmpObj = {};

				arr.forEach(item => {
					tmpObj = {
						label: item.pjname,
						value: item.id
					};

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

				// 编辑
				if (this.id) {
					params.id = this.id;
					url = '/projectInfo/getProjectInfoid';
				} else {
					params.pid = params.pjtype.slice(-1)[0];
				}

				params.isleaf = this.isLeaf;
				params.pjtype = params.pjtype.join('/');

				const data = await this.fetch({
					'url': url, 
					'params': params, 
					'vm': this
				});


				if (data.code === 10000) {
					this.$message.success('添加成功！');
					this.dialogShow = false;
					this.initData();
				} else if (data === 1) {
					this.$message.success('修改成功！');
					this.dialogShow = false;
					this.initData();
				} else {
					this.$message.success(data.message);
				}
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

				if (this.tabName === '2') {
					this.isLeaf = 1;
				} else {
					this.isLeaf = 0;
				}
			},
			async handleEditClick(id) {
				this.dialogShow = true;
				this.id = id;
				const data = await this.fetch({'url': '/projectInfo/getProjectInfoFind', params: {'id': id}, 'vm': this});
				const pjData = data[0];

				this.form = Object.assign({}, this.form, {
					pjname: pjData.pjname,
					pjtype: toNumberArr(pjData.pjtype.split('/')),
					address: pjData.address,
					description: pjData.description,
					ip: pjData.ip
				});
				this.isLeaf = pjData.isleaf;

			},
			async handleDelClick(id) {
				const data = await this.fetch({'url': '/projectInfo/getProjectInfoDeleteid', params: {'id': id}, 'vm': this});
				if (data.code === 10000) {
					this.$message.success('删除成功！');
					this.initData();
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
