<template>
  <!-- 安全评估模板管理 -->
  <div class="page">
    <div class="section list">
      <el-form :inline="true" label-width="75px">
        <el-form-item label="">
          <el-button type="primary" @click="add()">添加</el-button>
        </el-form-item>
        <el-form-item label="" prop="">
          <el-upload class="upload-demo" ref="upload" action="https://jsonplaceholder.typicode.com/posts/" :before-remove="beforeRemove" :on-remove="handleRemove" :file-list="fileList1" :auto-upload="true" :limit="1">
            <el-button type="primary" @click="submitUpload">导入模板</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template v-if="!itemDetail">
        <div class="query-title">
          <span>模板列表</span>
        </div>
        <div>
          <el-table :data="tableData1" border :span-method="objectSpanMethod" v-loading="isLoading" :element-loading-text="loadingText">
            <el-table-column label="序号" prop="id"></el-table-column>
            <el-table-column label="关键信息基础设施网络安全检查表" prop="modelName"></el-table-column>
            <el-table-column label="操作" prop="deal">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleView(scope.$index, scope.row)">查看</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
      <template v-else>
        <div class="query-title">
          <span>详情</span>
          <span class="el-icon-refresh-left re-back" @click="itemDetail = false">返回</span>
        </div>
        <el-table :data="tableData2" border :span-method="objectSpanMethod" v-loading="isLoading" :element-loading-text="loadingText">
          <el-table-column label="序号" prop="id" width="50"></el-table-column>
          <el-table-column label="检查项" prop="checkItem" width="140"></el-table-column>
          <el-table-column label="检查子项" prop="checkChildItem" width="140"></el-table-column>
          <el-table-column label="基本要求" prop="require"></el-table-column>
          <el-table-column label="检查方法" prop="method"></el-table-column>
          <el-table-column label="评分标准" prop="standard"></el-table-column>
          <el-table-column label="基准分值" prop="baseMark" width="80"></el-table-column>
        </el-table>
      </template>

    </div>
    <el-dialog title="添加" :visible.sync="dialogVisible" width="50%">
      <el-form width="600px" label-width="75px" ref="form" :model="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="序号:" prop="id">
              <el-col :span="22">
                <el-input placeholder="" v-model="form.id"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关键信息基础设施网络安全检查表:" prop="modelName">
              <el-col :span="22">
                <el-input placeholder="" v-model="form.modelName"></el-input>
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
      safeModel: "",
      modelOptions: [],
      tableData1: [],
      tableData2: [],
      form: {
        id: "",
        modelName: ""
      },
      isLoading: false,
      dialogVisible: false,
      itemDetail: false // 详情
    };
  },
  methods: {
    load() {},
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
    },
    handleView() {
      this.itemDetail = !this.itemDetail;
    }
  },
  created() {
    this.tableData1 = [
      {
        id: 1,
        modelName: "CII安全评估项"
      }
    ];
    this.tableData2 = [
      {
        id: 1,
        checkItem: "责任落实",
        checkChildItem: "网络安全负责人",
        require:
          "1.各单位（企业）应明确单位网络安全直接责任人;2.各单位（企业）应明确网络安全具体负责人。",
        method:
          "1.查验有关领导（网络安全直接责任人和具体负责人）工作分工的相关文件或任命通知;2.查验网络安全相关工作批示、会议记录等，了解主管领导履职情况。",
        standard:
          "1.缺少网络安全直接责任人和具体负责人扣4分；2.网络安全主管领导是单位（企业）正副职领导，否则扣2分（相关人事任命正式文件或通知，可作为本项符合的支撑性材料）。",
        baseMark: 4
      },
      {
        id: 2,
        checkItem: "责任落实",
        checkChildItem: "网络安全机构",
        require: "1.设立负责网络安全管理工作的内设机构，并明确机构负责人。",
        method:
          "1.查验单位各内设机构职责分工等文件，检查是否指定了网络安全管理机构,或者成立了网络与信息安全领导小组，有相关批示文件；2.检查文件或通知下发的时间不大于5年。",
        standard:
          "1.未成立网络安全组织机构，扣4分；2.网络安全组织机构成立文件明显过期或失效，扣2分。",
        baseMark: 4
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

.re-back {
  position: absolute;
  cursor: pointer;
  right: 0;
  top: 0;
  z-index: 10;
}
</style>
