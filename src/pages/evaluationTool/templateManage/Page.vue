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
        <el-form-item label="">
          <el-button type="primary" @click="add()">添加</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border :span-method="objectSpanMethod" v-loading="isLoading" :element-loading-text="loadingText">
        <el-table-column label="序号" prop="id"></el-table-column>
        <el-table-column label="模板名称" prop="modelName"></el-table-column>
        <el-table-column label="操作" prop="">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="添加" :visible.sync="dialogVisible" width="50%">
      <el-form width="600px" label-width="75px" ref="form" :model="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="序号:" prop="id">
              <el-col :span="22">
                <el-input placeholder="" v-model="form.id" ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板名称:" prop="modelName">
              <el-col :span="22">
                <el-input placeholder="" v-model="form.modelName" ></el-input>
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
      pjtype: "",
      pjOptions: [],
      safeModel: "",
      modelOptions: [],
      tableData: [],
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
    add() {
      this.dialogVisible = true;
    },
    async fetchPjTreeData() {
      const { data } = await this.fetch({
        url: "/porject/getProjectList",
        vm: this
      });
      this.pjOptions = this.traverseArr(data);
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
    this.fetchPjTreeData();
    this.tableData = [
      {
        id: 1,
        modelName: "CII安全评估项"
      }
    ];
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

.btn-lg {
  width: 150px;
  margin-right: 5px;
}

.upload-demo {
  position: relative;
  box-sizing: border-box;
  /deep/.el-upload-list {
    display: none;
  }
}
</style>
