<template>
  <!-- 安全补丁管理 -->
  <div class="page">
    <div class="section">
      <el-form :inline="true" label-width="70px" :model="queryForm">
        <el-form-item label="资产类型" prop="">
          <el-select
            placeholder="请选择"
            v-model="queryForm.devtype"
            clearable
          >
            <el-option
              v-for="item in assetsTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号" prop="">
          <el-select
            placeholder="请选择"
            v-model="queryForm.name"
            clearable
          >
            <el-option
              v-for="item in equipmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="厂家名称" prop="">
          <el-select
            placeholder="请选择"
            v-model="queryForm.vendor"
            clearable
          >
            <el-option
              v-for="item in factoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作系统" prop="">
          <el-select
            placeholder="请选择"
            v-model="queryForm.os"
            clearable
          >
            <el-option
              v-for="item in systemOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchTableData">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add">添加</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border v-loading="isLoading">
        <el-table-column label="序号" prop="idx"></el-table-column>
        <el-table-column label="漏洞名称" prop="bugName"></el-table-column>
        <el-table-column label="解决方案" prop="solution"></el-table-column>
        <el-table-column label="补丁下载地址" prop="cveurl" width="400px">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.cveurl"
              size="small"
              :ref="`url${scope.row.id}`"
              readonly
              placeholder=""
            >
              <template slot="append">
                <el-button type="default" @click="handleCopy(scope.row)"
                  >复制</el-button
                >
              </template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

		<!-- 添加补丁dialog -->
    <el-dialog title="添加补丁" :visible.sync="dialogVisible" width="600px">
      <el-form class="dialog-form" label-width="120px" ref="form" :model="form" :rules="rules">
        <el-form-item label="漏洞名称" prop="bugname">
          <el-input v-model="form.bugname"></el-input>
        </el-form-item>
        <el-form-item label="资产类型" prop="devtype">
          <el-select
            placeholder="请选择"
            v-model="form.devtype"
            clearable
          >
            <el-option
              v-for="item in assetsTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="厂家名称" prop="vendor">
          <el-select
            placeholder="请选择"
            v-model="form.vendor"
            clearable
          >
            <el-option
              v-for="item in factoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号" prop="name">
          <el-input v-model="form.name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="操作系统" prop="os">
          <el-select
            placeholder="请选择"
            v-model="form.os"
            clearable
          >
            <el-option
              v-for="item in systemOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="解决方案" prop="solution">
          <el-input v-model="form.solution"></el-input>
        </el-form-item>
        <el-form-item label="补丁下载地址" prop="cveurl">
          <el-input v-model="form.cveurl"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSaveClick">保 存</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading:false,
      tableData: [],
      form: {
        bugname: "",
        devtype: "",
        vendor: "",
        name: "",
        os: "",
        solution: "",
        cveurl: "",
      },
			rules: {
        bugname: [
					{ required: true, message: '请输入漏洞名称', trigger: 'blur' }
				],
				devtype: [
					{ required: true, message: '请选择资产类型', trigger: 'blur' }
				],
				cveurl: [
					{ required: true, message: '请输入补丁下载地址', trigger: 'blur' }
				]
			},
      queryForm: {
        devtype: "",
        vendor: "",
        name: "",
        os: ""
      },
      deviceOsOptions: [],
      assetsTypeOptions: [],
      vendorOptions: [],
      dialogVisible: false,
      assetsOptions: [],
      equipmentOptions: [],
      factoryOptions: [],
      systemOptions: []
    };
  },
  created() {
    this.fetchAssetTypeOptions();
    this.fetchDevTypeOptions();
    this.fetchVendorOptions();
    this.fetchOsOptions();
  },
  methods: {
    add() {
			this.dialogVisible = true;
			
			this.$nextTick(() => {
				// dialog内的子组件form渲染完成后才能被获取到
				this.$refs['form'].resetFields();
			})
		},
		/**
		 * 点击保存
		 */
		handleSaveClick() {
			this.$refs['form'].validate(valid => {
				if (valid) {
					this.submit();
				}
			})
		},
		/**
		 * 提交保存
		 */
    async submit() {
      const data = await this.fetch({
        url: "/back/getBackAdd",
        params: this.form,
        vm: this
      });

      if (data && data.code === 10000) {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        
        this.dialogVisible = false;
      } else {
        this.$message({
          message: "添加失败，请稍后再试",
          type: "error"
        });
      }
    },
    async fetchTableData() {
      if (
        this.queryForm.devtype == "" &&
        this.queryForm.vendor == "" &&
        this.queryForm.name == "" &&
        this.queryForm.os == ""
      ) {
        this.$message({
          message: "请至少选择一个查询条件",
          type: "warning"
        });

        return;
      }

      const params = this._.pickBy(this.queryForm, (value, key) => {
        return Boolean(value);
      })

      this.isLoading = true;
      this.tableData = [];
      const data = await this.fetch({
        url: "/back/getSelect",
        params: params,
        vm: this
      });
      this.isLoading = false;
      if (Array.isArray(data)) {
        this.tableData = data.map((item, index) => {
          return {
            idx: index + 1,
            id: item.id,
            bugName: item.bugname,
            solution: item.solution,
            cveurl: item.cveurl
          };
        });
      }
    },
    async fetchAssetTypeOptions() {
      const { data } = await this.fetchFuzz({
        url: "/fuzz/page/view/station/device!findAllDevtype.action",
        vm: this
      });

      if (Array.isArray(data)) {
        this.assetsTypeOptions = data.map((item, index) => {
          return {
            label: item.devtype,
            value: item.devtype
          }
        });
      }
    },
    async fetchDevTypeOptions() {
      const data = await this.fetch({
        url: "/back/selectBackByName",
        vm: this
      });

      if (Array.isArray(data)) {
        this.equipmentOptions = data.map(item => {
          return {
            value: item.name,
            label: item.name
          };
        });
      }
    },
    async fetchVendorOptions() {
      const { data } = await this.fetchFuzz({
        url: "/fuzz/page/view/station/device!findVendorByType.action",
        params: {
          devtype: ""
        },
        vm: this
      });

      if (Array.isArray(data)) {
        this.factoryOptions = data.map(item => {
          return {
            value: item.vendor,
            label: item.vendor
          };
        });
      }
    },
    async fetchOsOptions() {
      const { list } = await this.fetchFuzz({
        url: "/fuzz/page/view/station/device!loadOsDatas.action",
        vm: this
      });

      if (list && list[0]) {
        this.systemOptions = list.map(item => {
          return {
            value: item,
            label: item
          };
        });
      }
    },
    async delPatchById(id) {
      const data = await this.fetch({
        url: "/back/deleteById",
        params: {
          id: id
        },
        vm: this
      });

      if (data && data.code === 10000) {
        this.$message({
          type: "success",
          message: "删除成功"
        });
        this.fetchTableData();
      }
    },
    handleDelete(row) {
      this.$confirm("确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delPatchById(row.id);
        })
        .catch(err => {});
    },
    handleCopy(row) {
      let urlInput = this.$refs["url" + row.id];
      urlInput.focus();
      urlInput.select();
      document.execCommand("copy", false);

      this.$message({
        message: "已复制",
        type: "success"
      });

      return false;
    }
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

.dialog-form {
  width: 480px;
}
</style>
