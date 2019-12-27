<template>
  <div class="page">
    <div class="section list">
      <p>
				<el-button
					type="primary"
					size="small"
					@click="startAffirm"
					>选择结束、开始认定</el-button
				>
			</p>

      <el-table :data="tableData" border v-loading="isLoading">
        <el-table-column label="IP/资产标识" prop="ip"></el-table-column>
        <el-table-column label="资产类型" prop="assetType"></el-table-column>
        <el-table-column label="设备型号" prop="deviceNum"></el-table-column>
        <el-table-column label="版本号" prop="version"></el-table-column>
        <el-table-column label="操作系统" prop="deviceOs"></el-table-column>
        <el-table-column label="所属关键系统" prop="kbName"></el-table-column>
        <el-table-column label="关键性选择" prop="vendorName">
					<template slot-scope="scope">
            <el-input v-model="scope.row.keyProp" placeholder="请输入"></el-input>
          </template>
				</el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { commonExport } from "common/utils";

export default {
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    //选择框
    handleSelectionChange(val) {
      if (val) {
        this.multipleSelection = [];
        for (var i = 0; i < val.length; i++) {
          this.exportDetail = val[i].id;
          this.multipleSelection.push(this.exportDetail);
        }
      }
    },
    //导出列表
    exportList(item) {
      let params = {};
      if (this.goodsNumber) {
        params.id = this.goodsNumber;
      }
      if (this.goodsName) {
        params.name = this.goodsName;
      }
      params.page = 2;
      let url = "/api/pj-operation/goods/exportInfo";
      commonExport(params, "回收站商品列表", url);
    }
  }
};
</script>
<style scoped lang="less">
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

    .section-title {
      position: relative;
      margin-bottom: 30px;
      padding: 5px;
      height: 35px;
      color: @blue;
      border-bottom: 1px solid #ccc;
    }
  }
}

.btn-lg {
  width: 150px;
  margin-right: 30px;
}
</style>
