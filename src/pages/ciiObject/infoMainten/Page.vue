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
					<el-button type="primary" @click="fetchTableData">查询</el-button>
				</el-form-item>
			</el-form>
			<div class="tabs-wrapper">
				<el-tabs v-model="tabName" type="card" @tab-click="handleClick">
					<el-tab-pane label="主机类资产" name="1">
						<el-table :data="tableData1" border>
							<el-table-column label="序号" prop="id"></el-table-column>
							<el-table-column label="IP/资产标识" prop="IPaddress"></el-table-column>
							<el-table-column label="资产类型" prop="AssetType"></el-table-column>
							<el-table-column label="设备型号" prop="EquipmentModel"></el-table-column>
							<el-table-column label="操作系统" prop="system"></el-table-column>
							<el-table-column label="所属关键业务" prop="KeyBusiness"></el-table-column>
							<el-table-column label="操作">
								<template slot-scope="scope">
									<el-button size="mini" @click="rowView1(scope.$index, scope.row)">查看</el-button>
									<el-button size="mini" @click="rowEdit1(scope.$index, scope.row)">编辑</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label="网络类资产" name="2">
						<el-table :data="tableData2" border>
							<el-table-column label="序号" prop="id"></el-table-column>
							<el-table-column label="IP/资产标识" prop="IPaddress"></el-table-column>
							<el-table-column label="资产类型" prop="AssetType"></el-table-column>
							<el-table-column label="设备型号" prop="EquipmentModel"></el-table-column>
							<el-table-column label="厂家名称" prop="system"></el-table-column>
							<el-table-column label="所属关键业务" prop="KeyBusiness"></el-table-column>
							<el-table-column label="操作">
								<template slot-scope="scope">
									<el-button size="mini" @click="rowView2(scope.$index, scope.row)">查看</el-button>
									<el-button size="mini" @click="rowEdit2(scope.$index, scope.row)">编辑</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label="数据类资产" name="3">
						<el-table :data="tableData3" border>
							<el-table-column label="序号" prop="id"></el-table-column>
							<el-table-column label="IP/资产标识" prop="IPaddress"></el-table-column>
							<el-table-column label="设备型号" prop="EquipmentModel"></el-table-column>
							<el-table-column label="厂家名称" prop="system"></el-table-column>
							<el-table-column label="所属关键业务" prop="KeyBusiness"></el-table-column>
							<el-table-column label="操作">
								<template slot-scope="scope">
									<el-button size="mini" @click="rowView3(scope.$index, scope.row)">查看</el-button>
									<el-button size="mini" @click="rowEdit3(scope.$index, scope.row)">编辑</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>

		<!-- 主机类资产 -->
		<el-dialog title="查看" :visible.sync="dialogVisibleView1" width="50%">
			<el-form width="600px" label-width="100px" ref="form1" :model="form1">
				<el-row>
					<el-col :span="12">
						<el-form-item label="IP地址2:" prop="">
							<el-col :span="22">
								<el-input v-model="form1.Ip2" disabled="true"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="IP地址3:" prop="">
							<el-col :span="22">
								<el-input v-model="form1.Ip3" disabled="true"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="MAC地址2:" prop="">
							<el-col :span="22">
								<el-input v-model="form1.Mac2" disabled="true"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="MAC地址3:" prop="">
							<el-col :span="22">
								<el-input v-model="form1.Mac3" disabled="true"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="部署位置3:" prop="">
							<el-col :span="22">
								<el-input v-model="form1.Pos3" disabled="true"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="投入使用时间:" prop="">
							<el-col :span="22">
								<el-input v-model="form1.startTime" disabled="true"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="软件安装情况:" prop="">
							<el-col :span="22">
								<el-input v-model="form1.use" disabled="true"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="功能简述:" prop="">
							<el-col :span="22">
								<el-input type="textarea" v-model="form1.des" disabled="true"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
		<el-dialog title="编辑" :visible.sync="dialogVisibleEdit1" width="50%">
			<el-form width="600px" label-width="100px" ref="form1" :model="form1">
				<el-row>
					<el-col :span="12">
						<el-form-item label="IP地址2:" prop="Ip2">
							<el-col :span="22">
								<el-input v-model="form1.Ip2"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="IP地址3:" prop="Ip3">
							<el-col :span="22">
								<el-input v-model="form1.Ip3"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="MAC地址2:" prop="Mac2">
							<el-col :span="22">
								<el-input v-model="form1.Mac2"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="MAC地址3:" prop="Mac3">
							<el-col :span="22">
								<el-input v-model="form1.Mac3"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="部署位置3:" prop="Pos3">
							<el-col :span="22">
								<el-input v-model="form1.Pos3"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="投入使用时间:" prop="startTime">
							<el-col :span="22">
								<el-input v-model="form1.startTime"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="软件安装情况:" prop="use">
							<el-col :span="22">
								<el-input v-model="form1.use"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="功能简述:" prop="des">
							<el-col :span="22">
								<el-input type="textarea" v-model="form1.des"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item>
							<el-col :span="22">
								<el-button type="primary" @click="submit()">提交</el-button>
								<el-button type="primary" @click="resetForm('form1')">重置</el-button>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
		<!-- 网络类资产 -->
		<el-dialog title="查看" :visible.sync="dialogVisibleView2" width="50%">
			<el-form width="600px" label-width="100px" ref="form2" :model="form2">
				<el-row>
					<el-col :span="12">
						<el-form-item label="IP地址2:" prop="">
							<el-col :span="22">
								<el-input v-model="form2.Ip2" disabled="true"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="IP地址3:" prop="">
							<el-col :span="22">
								<el-input v-model="form2.Ip3" disabled="true"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="MAC地址2:" prop="">
							<el-col :span="22">
								<el-input v-model="form2.Mac2" disabled="true"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="MAC地址3:" prop="">
							<el-col :span="22">
								<el-input v-model="form2.Mac3" disabled="true"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="部署位置3:" prop="">
							<el-col :span="22">
								<el-input v-model="form2.Pos3" disabled="true"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="投入使用时间:" prop="">
							<el-col :span="22">
								<el-input disabled="true" v-model="form2.startTime"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="软件版本号:" prop="">
							<el-col :span="22">
								<el-input v-model="form2.version" disabled="true"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="功能简述:" prop="">
							<el-col :span="22">
								<el-input type="textarea" v-model="form2.des" disabled="true"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
		<el-dialog title="编辑" :visible.sync="dialogVisibleEdit2" width="50%">
			<el-form width="600px" label-width="100px" ref="form2" :model="form2">
				<el-row>
					<el-col :span="12">
						<el-form-item label="IP地址2:" prop="">
							<el-col :span="22">
								<el-input v-model="form2.Ip2"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="IP地址3:" prop="">
							<el-col :span="22">
								<el-input v-model="form2.Ip3"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="MAC地址2:" prop="">
							<el-col :span="22">
								<el-input v-model="form2.Mac2"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="MAC地址3:" prop="">
							<el-col :span="22">
								<el-input v-model="form2.Mac3"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="部署位置3:" prop="">
							<el-col :span="22">
								<el-input v-model="form2.Pos3"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="投入使用时间:" prop="">
							<el-col :span="22">
								<el-input v-model="form2.startTime"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="软件版本号:" prop="">
							<el-col :span="22">
								<el-input type="textarea" v-model="form2.version"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="功能简述:" prop="">
							<el-col :span="22">
								<el-input type="textarea" v-model="form2.des"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item>
							<el-col :span="22">
								<el-button type="primary" @click="submit()">提交</el-button>
								<el-button type="primary" @click="resetForm('form2')">重置</el-button>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
		<!-- 数据类资产 -->
		<el-dialog title="查看" :visible.sync="dialogVisibleView3" width="50%">
			<el-form width="600px" label-width="100px" ref="form3" :model="form3">
				<el-row>
					<el-col :span="12">
						<el-form-item label="存储位置:" prop="pos">
							<el-col :span="22">
								<el-input v-model="form3.pos" disabled="true"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="占用空间:" prop="space">
							<el-col :span="22">
								<el-input v-model="form3.space" disabled="true"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="版本号:" prop="version">
							<el-col :span="22">
								<el-input v-model="form3.version" disabled="true"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="最终更新时间:" prop="updateTime">
							<el-col :span="22">
								<el-input v-model="form3.updateTime" disabled="true"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="打开方式:" prop="open">
							<el-col :span="22">
								<el-input v-model="form3.open" disabled="true"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="功能简述:" prop="des">
							<el-col :span="22">
								<el-input type="textarea" v-model="form3.des" disabled="true"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
		<el-dialog title="编辑" :visible.sync="dialogVisibleEdit3" width="50%">
			<el-form width="600px" label-width="100px" ref="form3" :model="form3">
				<el-row>
					<el-col :span="12">
						<el-form-item label="存储位置:" prop="pos">
							<el-col :span="22">
								<el-input v-model="form3.pos"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="占用空间:" prop="space">
							<el-col :span="22">
								<el-input v-model="form3.space"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="版本号:" prop="version">
							<el-col :span="22">
								<el-input v-model="form3.version"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="最终更新时间:" prop="updateTime">
							<el-col :span="22">
								<el-input v-model="form3.updateTime"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="打开方式:" prop="open">
							<el-col :span="22">
								<el-input v-model="form3.open"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="功能简述:" prop="des">
							<el-col :span="22">
								<el-input type="textarea" v-model="form3.des"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item>
							<el-col :span="22">
								<el-button type="primary" @click="submit()">提交</el-button>
								<el-button type="primary" @click="resetForm('form3')">重置</el-button>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import { getCascaderOptions } from "common/utils";

export default {
  data() {
    return {
      pjOptions: [],
      tabName: "1",
      tableData1: [],
      tableData2: [],
      tableData3: [],
      dialogVisibleView1: false,
      dialogVisibleView2: false,
      dialogVisibleView3: false,
      dialogVisibleEdit1: false,
      dialogVisibleEdit2: false,
      dialogVisibleEdit3: false,
      form1: {
        Ip2: "",
        Ip3: "",
        Mac2: "",
        Mac3: "",
        Pos3: "",
        startTime: "",
        des: "",
        use: ""
      },
      form2: {
        Ip2: "",
        Ip3: "",
        Mac2: "",
        Mac3: "",
        Pos3: "",
        startTime: "",
        des: "",
        version: ""
      },
      form3: {
        pos: "",
        space: "",
        version: "",
        updateTime: "",
        open: "",
        des: ""
      }
    };
  },
  methods: {
    rowView1() {
      this.dialogVisibleView1 = true;
    },
    rowEdit1(index, row) {
      this.dialogVisibleEdit1 = true;
    },
    rowView2() {
      this.dialogVisibleView2 = true;
    },
    rowEdit2(index, row) {
      this.dialogVisibleEdit2 = true;
    },
    rowView3() {
      this.dialogVisibleView3 = true;
    },
    rowEdit3(index, row) {
      this.dialogVisibleEdit3 = true;
    },
    submit() {
      this.dialogVisibleView1 = false;
      this.dialogVisibleView2 = false;
      this.dialogVisibleView3 = false;
      this.dialogVisibleEdit1 = false;
      this.dialogVisibleEdit2 = false;
      this.dialogVisibleEdit3 = false;
      this.$message({
        message: "提交成功",
        type: "success"
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async fetchPjTreeData() {
      const { data } = await this.fetch({
        url: "/porject/getProjectList",
        vm: this
      });

      this.pjOptions = getCascaderOptions({
        arr: data,
        label: "pjname",
        value: "id",
        filter: "isleaf"
      });
    }
  },
  created() {
    this.fetchPjTreeData();
    this.tableData1 = [
      {
        id: "1",
        IPaddress: "10.155.10.12",
        AssetType: "主机",
        EquipmentModel: "Windows",
        system: "Windows 10 Enterprise 2016 LTSB 14393",
        KeyBusiness: "制丝生产业务/制丝监控系统"
      },
      {
        id: "2",
        IPaddress: "10.155.10.17",
        AssetType: "主机",
        EquipmentModel: "Windows",
        system: "Windows 7 Ultimate 7601 Service Pack 1",
        KeyBusiness: "复烤生产业务/复烤监控系统"
      },
      {
        id: "3",
        IPaddress: "10.155.10.19",
        AssetType: "主机",
        EquipmentModel: "Linux",
        system: "Linux 2.6.32",
        KeyBusiness: "卷接包生产业务/视频监控系统"
      }
    ];
    this.tableData2 = [
      {
        id: "1",
        IPaddress: "10.155.11.25",
        AssetType: "交换机",
        EquipmentModel: "Quidway S9306",
        system: "Huawei",
        KeyBusiness: "制丝生产业务/制丝监控系统"
      },
      {
        id: "2",
        IPaddress: "10.155.10.17",
        AssetType: "路由器",
        EquipmentModel: "Quidway NetEngine 80",
        system: "Huawei",
        KeyBusiness: "复烤生产业务/复烤生产系统"
      },
      {
        id: "3",
        IPaddress: "10.155.11.100",
        AssetType: "交换机",
        EquipmentModel: "S5352C-EI",
        system: "Huawei",
        KeyBusiness: "卷接包生产业务/视频监控系统"
      }
    ];
    this.tableData3 = [
      {
        id: "1",
        IPaddress: "1",
        EquipmentModel: "isRTU",
        system: "中科",
        KeyBusiness: "制丝生产业务/制丝生产系统"
      },
      {
        id: "2",
        IPaddress: "2",
        EquipmentModel: "路由器统一工厂信息平台 ",
        system: "中京",
        KeyBusiness: "复烤生产业务/复烤生产系统"
      }
    ];

    this.form1 = {
      Ip2: "192.168.10.12",
      Ip3: "192.168.1.12",
      Mac2: "82:f6:75:41:dc:01",
      Mac3: "82:f6:75:41:dc:04",
      Pos3: "交换机s5700的14口",
      startTime: 46,
      des: "制丝监控系统浏览器",
      use: "谷歌浏览器"
    };
    this.form2 = {
      Ip2: "192.168.11.12",
      Ip3: "192.168.12.12",
      Mac2: "82:f5:75:41:dc:03",
      Mac3: "82:f6:75:42:dc:05",
      Pos3: "交换机s5700的14口",
      startTime: 134,
      version: 1,
      des: "多个浏览器访问制丝监控系统"
    };
    this.form3 = {
      pos: "d:RTU",
      space: "30M",
      version: "1",
      updateTime: "2019/12/4 14:54:23",
      open: "串口扫描工具",
      des: "RTU远程终端单元，负责对现场信号、工业设备进行监测 和控制"
    };
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
