<template>
  <div class="page">
    <div class="section list">
      <el-form
        :inline="true"
        class="info-form max-width"
        label-position="left"
        label-width="90px"
      >
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
          <el-button type="primary" @click="loadExcel">加载</el-button>
        </el-form-item>
        <el-button class="save-btn" :disabled="!KbTableData.length" @click="save" type="primary">保存关键业务</el-button>
      </el-form>

      <el-row class="max-width">
        <el-col :span="10" class="business-info-table">
          <el-table
            :data="isVisiableTableData"
            @selection-change="handleTablebSelectionChange"
            ref="table"
            border
            v-loading="isLoading"
          >
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
        <el-col :span="10" class="business-info-table">
          <el-table
            ref="KbTable"
            :data="KbTableData"
            border
            @selection-change="handleKbTablebSelectionChange"
            v-loading="isLoading"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="关键业务名称" prop="name"></el-table-column>
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
      excelOptions: [],
      isLoading:false,
      tableData: [],
      tableSelection: [],
      KbTableSelection: []
    };
  },
  created() {
    this.initData();
  },
  computed: {
    isVisiableTableData() {
      return this.tableData.filter(item => {
        return item.isVisiable;
      });
    },
    KbTableData() {
      return this.tableData.filter(item => {
        return !item.isVisiable;
      });
    }
  },
  methods: {
    async initData() {
      await this.fetchFileList();
      this.loadExcel();
    },
    getIds() {
      let ids = [];
      this.KbTableData.forEach(item => {
        ids.push(item.id);
      })

      return ids;
    },
    async save() {
      const data = await this.getFuzz({
        url: "/fuzz/page/view/CIIidentification!keyServiceIdentificationSave.action",
        params: {
          ids: this.getIds().toString()
        },
        vm: this
      });

      if (data.state === 1) {
        this.$message.success('保存成功！');
      } else {
        this.$message.error('保存失败，请稍后再试！');
      }
    },
    handleTablebSelectionChange(val) {
      this.tableSelection = val;
    },
    handleKbTablebSelectionChange(val) {
      this.KbTableSelection = val;
    },
    toRight() {
      let KbTableData = this.KbTableData;
      let tableData = this.tableData;
      this.tableSelection.forEach(item => {
        tableData[item.index].isVisiable = false;
      });
    },
    toLeft() {
      let KbTableData = this.KbTableData;
      let tableData = this.tableData;
      this.KbTableSelection.forEach(item => {
        tableData[item.index].isVisiable = true;
      });
    },
    async loadExcel() {
      this.tableData = [];
      const { data } = await this.getFuzz({
        url: "/fuzz/page/view/CIIidentification!getInfoByReadFile.action",
        params: {
          excelType: 1,
          fileName: this.excel
        },
        vm: this
      });

      if (Array.isArray(data)) {
        this.tableData = data.map((item, index) => {
          return {
            index: index,
            id: item[3],
            name: item[0],
            desc: item[1],
            critical: item[2],
            isVisiable: true
          }
        });
      }
    },
    async fetchFileList() {
      this.isLoading = true;
      const data = await this.post({
        url: "/file/fileName",
        vm: this
      });
      this.isLoading = false;
      if (Array.isArray(data)) {
        this.excelOptions = data.map(element => {
          return {
            label: element,
            value: element
          }
        });
      }

      this.excel = data[0];
    }
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

    .info-form {
      position: relative;
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

.max-width {
  max-width: 1300px;
}

.save-btn {
  position: absolute;
  right: 0;
  bottom: 22px;
}

.business-info-table {
  height: 600px;
  overflow: auto;
  border: 1px solid #DCDFE6;
}
</style>
