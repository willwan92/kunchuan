<template>
  <div class="page">
    <div class="section list">
      <el-form :inline="true" label-position="left" label-width="90px">
        <el-form-item label="业务信息库">
          <el-select v-model="excel" placeholder="">
            <el-option
              v-for="item in excelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary">加载</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary">保存</el-button>
        </el-form-item>
      </el-form>

      <el-row>
        <el-col :span="10">
          <el-table class="business-info-table" :data="tableData" border>
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="行业业务名称" prop="name"></el-table-column>
            <el-table-column label="业务描述" prop="desc"></el-table-column>
            <el-table-column
              label="关键性推荐"
              prop="critical"
            ></el-table-column>
          </el-table>
        </el-col>
        <el-col class="btn-wrapper" :span="4">
          <p><el-button type="info" @click="toRight">&gt;&gt;</el-button></p>
          <p><el-button type="info" @click="toLeft">&lt;&lt;</el-button></p>
        </el-col>
        <el-col :span="10">
          <el-table class="business-info-table" :data="tableData" border>
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="行业业务名称" prop="name"></el-table-column>
            <el-table-column label="业务描述" prop="desc"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      excel: "",
      pjOptions: [],
      excelOptions: [],
      tableData: []
    };
  },
  created() {
    this.initData();
  },
  computed: {
    actionName() {
      return this.AssetsId ? "编辑" : "添加";
    }
  },
  methods: {
    toRight() {},
    toLeft() {},
    initData() {
      //   this.fetchAssetsTypeData();
      //   this.fetchVendorsData();
      //   this.fetchOsData();
    },
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
  margin-right: 30px;
}

.btn-wrapper {
  text-align: center;
  padding-top: 200px;
}

.business-info-table {
  height: 600px;
}
</style>
