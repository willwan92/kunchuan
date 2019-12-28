<template>
	<!-- 安全补丁管理 -->
	<div class="page">
		<div class="section">
			<el-form :inline="true" label-width="70px">
				<el-form-item label="资产类型" prop="">
					<el-select placeholder="">
						<el-option>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="设备型号" prop="">
					<el-select placeholder="">
						<el-option>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="厂家名称" prop="">
					<el-select placeholder="">
						<el-option>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="操作系统" prop="">
					<el-select placeholder="">
						<el-option>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="search()">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="add()">添加</el-button>
				</el-form-item>
			</el-form>

			<div class="tabs-wrapper">
				<el-tabs v-model="tabName" type="card" @tab-click="handleClick">
					<el-tab-pane label="主机类资产" name="1">
						<el-table :data="tableData1" border>
							<el-table-column label="序号" prop="id"></el-table-column>
							<el-table-column label="漏洞名称" prop="bugName"></el-table-column>
							<el-table-column label="解决方案" prop="solution"></el-table-column>
							<el-table-column label="补丁下载地址" prop="load"></el-table-column>
							<el-table-column label="操作">
								<template slot-scope="scope">
									<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label="网络类资产" name="2">
						<el-table :data="tableData2" border>
							<el-table-column label="序号" prop="id"></el-table-column>
							<el-table-column label="漏洞名称" prop="bugName"></el-table-column>
							<el-table-column label="解决方案" prop="solution"></el-table-column>
							<el-table-column label="补丁下载地址" prop="load"></el-table-column>
							<el-table-column label="操作">
								<template slot-scope="scope">
									<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
		<el-dialog title="添加" :visible.sync="dialogVisible" width="50%">
			<el-form width="600px" label-width="110px" ref="form" :model="form">
				<el-row>
					<el-col :span="12">
						<el-form-item label="序号:" prop="id">
							<el-col :span="22">
								<el-input v-model="form.id"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="漏洞名称:" prop="bugName">
							<el-col :span="22">
								<el-input v-model="form.bugName"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="解决方案:" prop="solution">
							<el-col :span="22">
								<el-input v-model="form.solution"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="补丁下载地址:" prop="load">
							<el-col :span="22">
								<el-input v-model="form.load"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item>
							<el-col :span="22">
								<el-button type="primary" @click="submit()">提交</el-button>
								<el-button type="primary" @click="resetForm('form')">重置</el-button>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
export default {
  data() {
    return {
      tabName: "1",
      tableData1: [],
      tableData2: [],
      tableData3: [],
      form: {
        id: "",
        bugName: "",
        solution: "",
        load: ""
      },
      dialogVisible: false
    };
  },
  methods: {
    handleClick() {},
    add() {
      this.dialogVisible = true;
    },
    submit() {
      this.dialogVisible = false;
      this.$message({
        message: "提交成功",
        type: "success"
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created() {
    this.tableData1 = [
      {
        id: "1",
        bugName: "Microsoft Windows内核组件信息泄露漏洞",
        solution: "目前厂商已发布升级补丁以修复漏洞",
        load:
          "https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2017-8680"
      },
      {
        id: "2",
        bugName: "Microsoft Windows Shell 安全漏洞",
        solution: "无",
        load: "无"
      }
		];
		this.tableData2 = [
      {
        id: "1",
        bugName: "交换机内核组件信息泄露漏洞",
        solution: "目前厂商已发布升级补丁以修复漏洞",
        load:
          "无"
      },
      {
        id: "2",
        bugName: "华为交换机安全漏洞",
        solution: "无",
        load: "无"
      }
    ];
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
</style>
