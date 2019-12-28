<template>
	<!-- 备份管理 -->
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
				<el-form-item label="" prop="">
					<el-upload class="upload-demo" ref="upload" action="https://jsonplaceholder.typicode.com/posts/" :before-remove="beforeRemove" :on-remove="handleRemove" :file-list="fileList1" :auto-upload="true" :limit="1">
						<el-button type="primary" @click="submitUpload">上传</el-button>
					</el-upload>
				</el-form-item>
			</el-form>
			<div class="tabs-wrapper">
				<el-tabs v-model="tabName" type="card" @tab-click="handleClick">
					<el-tab-pane label="主机类资产" name="1">
						<el-table :data="tableData1" border>
							<el-table-column label="备份文件名" prop="copyName"></el-table-column>
							<el-table-column label="备份时间" prop="copyTime"></el-table-column>
							<el-table-column label="备份位置" prop="copyPosition"></el-table-column>
							<el-table-column label="操作">
								<template slot-scope="scope">
									<el-button size="mini" type="primary" @click="handleLoad(scope.$index, scope.row)">下载</el-button>
									<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label="网络类资产" name="2">
						<el-table :data="tableData2" border>
							<el-table-column label="备份文件名" prop="copyName"></el-table-column>
							<el-table-column label="备份时间" prop="copyTime"></el-table-column>
							<el-table-column label="备份位置" prop="copyPosition"></el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label="数据类资产" name="3">
						<el-table :data="tableData3" border>
							<el-table-column label="备份文件名" prop="copyName"></el-table-column>
							<el-table-column label="备份时间" prop="copyTime"></el-table-column>
							<el-table-column label="备份位置" prop="copyPosition"></el-table-column>
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
	</div>
</template>

<script>
export default {
  data() {
    return {
      pjOptions: "",
      tabName: "1",
      tableData1: [],
      tableData2: [],
      tableData3: [],
      form: {},
      rowEditData1: {
        version: "",
        KeyBusiness: ""
      },
      rowEditData2: {
        version: "",
        KeyBusiness: ""
      },
      rowEditData3: {
        version: "",
        KeyBusiness: ""
      },
      fileList1: [],
      fileList2: [],
      tableData1: [
        {
          copyName: "",
          copyTime: "",
          copyPosition: ""
        }
      ],
      tableData2: [
        {
          copyName: "",
          copyTime: "",
          copyPosition: ""
        }
      ],
      tableData3: [
        {
          copyName: "",
          copyTime: "",
          copyPosition: ""
        }
      ]
    };
  },
  methods: {
    async fetchPjTreeData() {
      const { data } = await this.fetch({
        url: "/porject/getProjectList",
        vm: this
      });
      this.pjOptions = this.traverseArr(data);
    },
    handleClick() {},
    rowSubmit(index, row) {
      row.version = this.rowEditData.version
        ? this.rowEditData.version
        : row.version;
      row.KeyBusiness = this.rowEditData.KeyBusiness
        ? this.rowEditData.KeyBusiness
        : row.KeyBusiness;
      console.log(index, row);
      this.$message({
        message: "保存成功",
        type: "success"
      });
    },
    submit() {
      this.$message({
        message: "提交成功",
        type: "success"
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    submitUpload() {
      console.log(this.fileList1);
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleSubmit(event, file, fileList) {
      console.log(file);
      console.log(fileList);
    }
  },
  created() {
    this.fetchPjTreeData();
    this.tableData1 = [
      {
        copyName: "收藏夹.zip",
        copyTime: "2019/12/1 13:56:03",
        copyPosition: "/usr/local/etc/data"
      },
      {
        copyName: "1.txt",
        copyTime: "2019/12/1 13:56:54",
        copyPosition: "/usr/local/etc/data"
      }
    ];
    this.tableData2 = [
      {
        copyName: "固件.zip",
        copyTime: "2019/12/12 13:56:03",
        copyPosition: "/usr/local/etc/data"
      },
      {
        copyName: "config.txt",
        copyTime: "2019/12/15 13:56:54",
        copyPosition: "/usr/local/etc/data"
      }
    ];
    this.tableData3 = [
      {
        copyName: "固件.zip",
        copyTime: "2019/12/12 13:56:03",
        copyPosition: "/usr/local/etc/data"
      },
      {
        copyName: "config.txt",
        copyTime: "2019/12/15 13:56:54",
        copyPosition: "/usr/local/etc/data"
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

/deep/.el-table__row {
  td {
    .el-input__inner {
      height: 28px;
    }
  }
}

.upload-demo {
  position: relative;
  box-sizing: border-box;
  /deep/.el-upload-list {
    // position: absolute;
    // left: 100px;
		// top: -3px;
		display: none;
  }
}
</style>
