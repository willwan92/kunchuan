<template>
  <div class="page">
    <div class="section list">
      <el-form
        ref="form"
        :inline="true"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="项目名称">
          <el-cascader
            :disabled="true"
            :show-all-levels="false"
            :options="pjOptions"
            :props="{ expandTrigger: 'hover' }"
            filterable
            v-model="pjValue"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <div class="section-title">
        <span>关键性评估规则管理</span>
				<el-button
          class="export-btn"
          type="primary"
          size="small"
          :disabled="!multipleSelection.length"
          @click="handleExportClick"
          >导出</el-button
        >
        
      </div>

      <el-table
        :data="tableData"
        @selection-change="handleSelectionChange"
        width="55"
        border
        v-loading="isLoading"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="IP/资产标识" prop="ip"></el-table-column>
        <el-table-column label="资产类型" prop="assetType"></el-table-column>
        <el-table-column label="设备型号" prop="deviceNum"></el-table-column>
        <el-table-column label="版本号" prop="version"></el-table-column>
        <el-table-column label="操作系统" prop="deviceOs"></el-table-column>
        <el-table-column label="生产厂家" prop="vendorName"></el-table-column>
        <el-table-column label="所属关键系统" prop="kbName"></el-table-column>
        <el-table-column label="关键性" prop="kbValue"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getCascaderOptions, downloadFileByUrl, formatTreeData } from "common/utils";
import { API_URL } from "common/axiosClient";
import qs from 'qs';

export default {
  data() {
    return {
      isLoading: false,
      pjValue: [],
      businessOptions: [],
      pjOptions: [],
      tableData: [],
      multipleSelection: []
    };
  },
  created() {
    this.pjValue = JSON.parse(sessionStorage.getItem("pjValue"));
    this.fetchTableData();
		this.fetchPjTreeData();
  },
  computed: {	
		exportUrl() {
      const params = this.getIds();
			return `${API_URL}/device/getExport?deviceid=${params}`;
		},
    getPjId() {
      let id;
      if (this.pjValue && this.pjValue[0]) {
        id = this.pjValue.slice(-1)[0];
      } else {
        id = null;
      }

      return id;
    }
  },
  methods: {
    handleExportClick() {
      downloadFileByUrl(this.exportUrl);
    },
    async fetchTableData() {
      const resData = JSON.parse(sessionStorage.getItem("affirmRes"));
      this.tableData = resData.map(item => {
        return {
          ip: item.ip,
          id: item.deviceid,
          assetType: item.devtype,
          deviceNum: item.name,
          version: item.version,
          vendorName: item.vendor,
          deviceOs: item.os,
          kbName: item.kbname,
          kbValue: item.keychoice
        };
      });
    },
    async fetchPjTreeData() {
			const roleId = sessionStorage.getItem('roleId');

     this.isLoading = true;
      const data = await this.post({
				url: "/projectInfo/getEnableRole",
				params: {
					enablerole: `(${roleId})`
				},
        vm: this
      });
      this.isLoading = false;
			const treeData = formatTreeData(data, 0);

      this.pjOptions = getCascaderOptions({
        arr: treeData,
        label: "pjname",
        value: "id",
        filter: "isleaf"
      });
    },
		getIds() {
			let ids = [];
      this.multipleSelection.forEach(item => {
        ids.push(item.id);
      })

			return ids.toString();
    },
    handleSelectionChange(val) {
			this.multipleSelection = val;
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
      padding: 5px;
      height: 35px;
      color: @blue;
      .export-btn {
        position: absolute;
        right: 5px;
        bottom: 5px;
      }
    }
  }
}

.btn-lg {
  width: 150px;
  margin-right: 30px;
}
</style>
