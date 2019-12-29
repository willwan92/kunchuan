<template>
  <!-- 安全评估模板管理 -->
  <div class="page">
    <div class="section list">
      <el-form :inline="true" label-width="75px">
        <el-form-item label="" prop="">
          <el-upload class="upload-demo" ref="upload" action="https://jsonplaceholder.typicode.com/posts/" :before-remove="beforeRemove" :on-remove="handleRemove" :file-list="fileList1" :auto-upload="true" :limit="1">
            <el-button type="primary" @click="submitUpload">导入模板</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div>
        <el-table :data="tableData1" border :span-method="objectSpanMethod" v-loading="isLoading" :element-loading-text="loadingText">
          <el-table-column label="序号" prop="id"></el-table-column>
          <el-table-column label="模板名称" prop="modelName"></el-table-column>
          <el-table-column label="操作" prop="deal">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pjtype: "",
      safeModel: "",
      modelOptions: [],
      tableData1: [],
      tableData2: [],
      form: {
        id: "",
        modelName: ""
      },
      isLoading: false,
      dialogVisible: false
    };
  },
  methods: {
    load() {},
    submit() {
      this.dialogVisible = false;
      this.$message({
        message: "提交成功",
        type: "success"
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleDelete() {
      this.$confirm("确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  created() {
    this.tableData1 = [
      {
        id: 1,
        modelName: "关键信息基础设施网络安全检查表"
      }
    ]
  }
};
</script>
<style lang="less" scoped>
.page {
  .section {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    margin-bottom: 30px;
    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      -webkit-box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
  }
}

.query-title {
  position: relative;
  margin-bottom: 30px;
  padding: 5px;
  height: 35px;
  color: @blue;
  border-bottom: 1px solid #ccc;
  font-size: 15px;
  .icon {
    float: left;
    width: 22px;
    margin: -1px 8px 0 0;
  }
}
.btn-lg {
  width: 150px;
  margin-right: 5px;
}

.upload-demo {
  position: relative;
  box-sizing: border-box;
  /deep/.el-upload-list {
    // display: none;
    position: absolute;
    left: 120px;
    top: -3px;
  }
}

</style>
