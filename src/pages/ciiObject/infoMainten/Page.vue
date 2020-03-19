<template>
	<!-- 信息维护 -->
	<div class="page">
		<div class="section">
			<el-form :inline="true" label-width="75px">
				<el-form-item label="项目名称">
					<el-cascader :show-all-levels="false" :options="pjOptions" :props="{ expandTrigger: 'hover' }" filterable v-model="pjValue">
					</el-cascader>
				</el-form-item>
				<el-form-item label="">
					<el-button type="primary" @click="fetchData">查询</el-button>
				</el-form-item>
			</el-form>
			<div class="tabs-wrapper">
				<el-tabs v-model="tabName" type="card" @tab-click="0">
					<el-tab-pane label="主机类资产" name="1">
						<el-table :data="tableData1" border v-loading="isLoading">
							<el-table-column label="序号" prop="index"></el-table-column>
							<el-table-column label="IP/资产标识" prop="iPAddress"></el-table-column>
							<el-table-column label="资产类型" prop="assetType"></el-table-column>
							<el-table-column label="设备型号" prop="equipmentModel"></el-table-column>
							<el-table-column label="操作系统" prop="os"></el-table-column>
							<el-table-column label="所属关键业务" prop="KeyBusiness"></el-table-column>
							<el-table-column label="操作">
								<template slot-scope="scope">
									<el-button type="text" @click="rowView1(scope.row)">查看</el-button>
									<el-button type="text" @click="rowEdit1(scope.row)">编辑</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label="网络类资产" name="2">
						<el-table :data="tableData2" border v-loading="isLoading">
							<el-table-column label="序号" prop="index"></el-table-column>
							<el-table-column label="IP/资产标识" prop="iPAddress"></el-table-column>
							<el-table-column label="资产类型" prop="assetType"></el-table-column>
							<el-table-column label="设备型号" prop="equipmentModel"></el-table-column>
							<el-table-column label="厂家名称" prop="vendorName"></el-table-column>
							<el-table-column label="所属关键业务" prop="KeyBusiness"></el-table-column>
							<el-table-column label="操作">
								<template slot-scope="scope">
									<el-button type="text" @click="rowView1(scope.row)">查看</el-button>
									<el-button type="text" @click="rowEdit1(scope.row)">编辑</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label="数据类资产" name="3">
						<el-table :data="tableData3" border v-loading="isLoading">
							<el-table-column label="序号" prop="index"></el-table-column>
							<el-table-column label="IP/资产标识" prop="iPAddress"></el-table-column>
							<el-table-column label="设备型号" prop="equipmentModel"></el-table-column>
							<el-table-column label="厂家名称" prop="vendorName"></el-table-column>
							<el-table-column label="所属关键业务" prop="KeyBusiness"></el-table-column>
							<el-table-column label="操作">
								<template slot-scope="scope">
									<el-button type="text" @click="rowView2(scope.row)">查看</el-button>
									<el-button type="text" @click="rowEdit2(scope.row)">编辑</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>

		<!-- 主机类资产和网络类资产 -->
		<el-dialog :title="operateName" :visible.sync="dialogVisible1" width="800px">
			<el-form v-loading="isUpdate" width="600px" label-width="100px" ref="form1" :model="form1">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="IP地址2:" prop="ip2">
							<el-input :readonly="operate === 'view'" v-model="form1.ip2"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="IP地址3:" prop="ip3">
							<el-input :readonly="operate === 'view'" v-model="form1.ip3"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="MAC地址2:" prop="mac2">
								<el-input :readonly="operate === 'view'" v-model="form1.mac2"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="MAC地址3:" prop="mac3">
								<el-input :readonly="operate === 'view'" v-model="form1.mac3"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="部署位置:" prop="position">
								<el-input :readonly="operate === 'view'" v-model="form1.position"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="投入使用时间:" prop="commissioningdate">
								<el-input :readonly="operate === 'view'" v-model="form1.commissioningdate"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item v-if="tabName === '1'" label="软件安装情况:" prop="">
								<el-input :readonly="operate === 'view'" v-model="softwaresituation"></el-input>
						</el-form-item>
						<el-form-item v-if="tabName === '2'" label="软件版本号:" prop="">
								<el-input v-model="softwareversion"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="功能简述:" prop="functiondetail">
								<el-input :readonly="operate === 'view'" type="textarea" v-model="form1.functiondetail"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="operate === 'edit'" :gutter="20">
					<el-col :span="12">
						<el-form-item>
								<el-button :disabled="isUpdate" type="primary" @click="updateAssetsInfo">提交</el-button>
								<el-button :disabled="isUpdate" type="primary" @click="resetForm('form1')">重置</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
		<!-- 数据类资产 -->
		<el-dialog :title="operateName" :visible.sync="dialogVisible2" width="800px">
			<el-form v-loading="isUpdate" width="600px" label-width="100px" ref="form2" :model="form2">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="存储位置:" prop="storagepath">
							<el-input :readonly="operate === 'view'" v-model="form2.storagepath"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="占用空间:" prop="usedspace">
							<el-input :readonly="operate === 'view'" v-model="form2.usedspace"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="版本号:" prop="version">
								<el-input :readonly="operate === 'view'" v-model="form2.version"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="最终更新时间:" prop="updated">
								<el-input :readonly="operate === 'view'" v-model="form2.updated"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="打开方式:" prop="runas">
								<el-input :readonly="operate === 'view'" v-model="form2.runas"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="功能简述:" prop="functiondetail">
								<el-input :readonly="operate === 'view'" v-model="form2.functiondetail"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item>
								<el-button :disabled="isUpdate" type="primary" @click="updateDataAssetsInfo">保存</el-button>
								<el-button :disabled="isUpdate" type="primary" @click="resetForm('form2')">重置</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import { getCascaderOptions, formatTreeData } from "common/utils";

export default {
  data() {
    return {
			operate: 'edit',
      pjOptions: [],
      pjValue: [],
	  tabName: "1",
	  isLoading:false,
	  isUpdate:false,
      tableData1: [],
      tableData2: [],
      tableData3: [],
      dialogVisible1: false,
      dialogVisible2: false,
      form1: {
        ip2: "",
        ip3: "",
        mac2: "",
        mac3: "",
        position: "",
        commissioningdate: "",
        functiondetail: ""
			},
			form2: {
        storagepath: "",
        usedspace: "",
        version: "",
        updated: "",
        runas: "",
        functiondetail: ""
			},
			softwaresituation: "",
			softwareversion: ""
    };
	},
	created() {
		this.fetchPjTreeData();
  },
	computed: {
    getPjId() {
      let id;
      if (this.pjValue && this.pjValue[0]) {
        id = this.pjValue.slice(-1)[0];
      } else {
        id = null;
      }

      return id;
		},
		operateName() {
      return this.operate === "edit" ? "编辑资产" : "查看资产";
    }
  },
  methods: {
		async fetchData() {
			const ret = await this.fetchTableData('tableData1');
			
			if (ret !== false) {
				this.fetchTableData('tableData2');
				this.fetchTableData('tableData3');
			}
		},
		async fetchTableData(table) {
			
			const pjId = this.getPjId;

			if (!pjId) {
				this.$message.info("请选择项目");
				return false;
			}

			let url = '';
			if (table === 'tableData1') {
				url = "/device/sortDevclass";
			} else if (table === 'tableData2') {
				url = "/device/sortDevclassTwo";
			} else if (table === 'tableData3') {
				url = "/device/sortDevclassThree";
			}

			this.isLoading = true;
			const data = await this.fetch({
				url: url,
				params: {
					pjid: pjId
				},
				vm: this
			});
			this.isLoading = false;
			this.mapTableData(table, data);
		},
		mapTableData(table, data) {
			if (!Array.isArray(data)) {
				return;
			}
			
			if (table === 'tableData1') {
				this.tableData1 = data.map((item, index) => { 
					return {
						id: item.deviceid,
						index: index + 1,
						iPAddress: item.ip,
						assetType: item.devtype,
						equipmentModel: item.name,
						os: item.os,
						KeyBusiness: item.kbname,
					};
				});
			} else if (table === 'tableData2') {
				this.tableData2 = data.map((item, index) => { 
					return {
						id: item.deviceid,
						index: index + 1,
						iPAddress: item.ip,
						assetType: item.devtype,
						equipmentModel: item.name,
						vendorName: item.vendor,
						KeyBusiness: item.kbname,
					};
				});
			} else if (table === 'tableData3') {
				this.tableData3 = data.map((item, index) => { 
					return {
						id: item.deviceid,
						index: index + 1,
						iPAddress: item.ip,
						equipmentModel: item.name,
						vendorName: item.vendor,
						KeyBusiness: item.kbname,
					};
				});
			}	
		},
		async fetchDataAssetsInfoById(id) {
			let url = '/device/selectDataId';

			const data = await this.fetch({
				url: url,
				params: {
					deviceid: id
				},
        vm: this
			});

			if  (data && data[0]) {
				const detail = data[0];
				this.form2 = {
					storagepath: detail.storagepath,
					usedspace: detail.usedspace,
					version: detail.version,
					updated: detail.updated,
					runas: detail.runas,
					functiondetail: detail.functiondetail
				}
			} else {
				this.$message.error('获取资产数据失败，请稍后再试')
			}
		},
		async fetchAssetsInfoById(id) {
			let url;
			if (this.tabName === '1') {
				url = "/device/selectDeviceinfoId";
			} else if (this.tabName === '2') {
				url = "/device/selectNetworkId";
			}

			const data = await this.fetch({
				url: url,
				params: {
					deviceid: id
				},
        vm: this
			});

			if  (data && data[0]) {
				const detail = data[0];
				let mapDetail = {
					ip2: detail.ip2,
					ip3: detail.ip3,
					mac2: detail.mac2,
					mac3: detail.mac3,
					position: detail.position,
					commissioningdate: detail.commissioningdate,
					functiondetail: detail.functiondetail
				};

				if (this.tabName === '1') {
					this.softwaresituation = detail.softwaresituation;
				} else if (this.tabName === '2') {
					this.softwareversion = detail.softwareversion;
				}

				this.form1 = mapDetail;
			} else {
				this.$message.error('获取资产数据失败，请稍后再试')
			}
		},
    rowView1(row) {
			this.dialogVisible1 = true;
			this.operate = 'view';
			this.fetchAssetsInfoById(row.id);
    },
    rowEdit1(row) {
      this.dialogVisible1 = true;
			this.operate = 'edit';
			this.assetsId = row.id;
			this.fetchAssetsInfoById(row.id);
		},
		rowView2(row) {
			this.dialogVisible2 = true;
			this.operate = 'view';
			this.fetchDataAssetsInfoById(row.id);
    },
    rowEdit2(row) {
      this.dialogVisible2 = true;
			this.operate = 'edit';
			this.assetsId = row.id;
			this.fetchDataAssetsInfoById(row.id);
		},
		async updateDataAssetsInfo() {
			let params = this._.clone(this.form2);
			params.deviceid = this.assetsId;
			
			const data = await this.fetch({
				url: "/device/updateDataId",
				params: params,
        vm: this
			});

			if  (data && data.code === 10000) {
				this.$message.success(`${this.operateName}成功`)
				this.dialogVisible2 = false;
				this.fetchTableData('tableData3');
			} else {
				this.$message.error(`${this.operateName}失败，请稍后再试`)
			}
		},
		async updateAssetsInfo() {
			let url;
			let params = this._.clone(this.form1);
			params.deviceid = this.assetsId;
			if (this.tabName === '1') {
				url = "/device/updateIp";
				params.softwaresituation = this.softwaresituation;
			} else if (this.tabName === '2') {
				url = "/device/updateNetworkId";
				params.softwareversion = this.softwareversion;
			}
			
			this.isUpdate = true;
			const data = await this.fetch({
				url: url,
				params: params,
        vm: this
			});
			this.isUpdate = false;

			if  (data && data.code === 10000) {
				this.$message.success(`${this.operateName}成功`)
				this.dialogVisible1 = false;
				if (this.tabName === '1') {
					this.fetchTableData('tableData1');
				} else if (this.tabName === '2') {
					this.fetchTableData('tableData2');
				}
			} else {
				this.$message.error(`${this.operateName}失败，请稍后再试`)
			}
		},
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async fetchPjTreeData() {
			const roleId = sessionStorage.getItem('roleId');

      const data = await this.fetch({
				url: "/projectInfo/getEnableRole",
				params: {
					enablerole: `(${roleId})`
				},
        vm: this
      });

			const treeData = formatTreeData(data, 0);

      this.pjOptions = getCascaderOptions({
        arr: treeData,
        label: "pjname",
        value: "id",
        filter: "isleaf"
      });
    },
  }
};
</script>
<style lang="less" scoped>
.section {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  margin-bottom: 30px;
  color: #409eff;
}
.section:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  -webkit-box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.tabs-wrapper {
  position: relative;
  .btn {
    position: absolute;
    right: 5px;
    top: 5px;
  }
}

.query-title {
  margin-bottom: 30px;
  padding: 5px;
  height: 35px;
  color: @blue;
  border-bottom: 1px solid #ccc;
  .icon {
    float: left;
    width: 22px;
    margin: -1px 8px 0 0;
  }
}

/deep/.el-table__row {
  td {
    .el-input__inner {
      height: 28px;
    }
  }
}
</style>
