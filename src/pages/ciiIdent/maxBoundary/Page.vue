<template>
  <div class="page">
    <div class="section list">
      <el-form :inline="true" label-position="left" label-width="90px">
        <el-form-item label="项目名称">
          <el-cascader
            @change="handlePjChange"
            :show-all-levels="false"
            :options="pjOptions"
            :props="{ expandTrigger: 'hover' }"
            filterable
            v-model="pjValue"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border v-loading="isLoading">
        <el-table-column label="序号" prop="index" width="50px"></el-table-column>
        <el-table-column label="IP/资产标识" prop="ip" width="100px"></el-table-column>
        <el-table-column label="资产类型" prop="assetType"></el-table-column>
        <el-table-column label="设备型号" prop="deviceNum"></el-table-column>
        <el-table-column label="版本号" prop="version"></el-table-column>
        <el-table-column label="生产厂家" prop="vendorName"></el-table-column>
        <el-table-column label="操作系统" prop="deviceOs"></el-table-column>
        <el-table-column label="所属关键业务" width="200px" prop="">
          <template slot-scope="scope">
            <el-cascader
              filterable
              v-model="scope.row.kbName"
              @change="handleKbChange(scope.row)"
              :options="businessOptions"
              :props="{ expandTrigger: 'hover' }"
            >
            </el-cascader>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getCascaderOptions, toNumberArr } from "common/utils";

export default {
  data() {
    return {
      searchParams: {
        nickname: ""
			},
			pjValue: [],
			pjOptions: [],
      isLoading: false,
      businessOptions: [],
      tableData: []
    };
  },
  created() {
		this.fetchPjTreeData();
    this.fetchbusinessOptionsData();
	},
	computed: {
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
    async handleKbChange(row) {
      const data = await this.fetch({
        url: "/device/getDeviceByKbname",
        params: {
          deviceid: row.id,
          kbname: row.kbName && row.kbName.join('/')
        },
        vm: this
      });

      if (data.success) {
        this.$message.success('修改成功！')
      } else {
        this.$message.console.error(data.success);
      }
    },
    handlePjChange() {
      this.fetchTableData();
      sessionStorage.setItem('pjValue', JSON.stringify(this.pjValue));
    },
    async fetchbusinessOptionsData() {
      const { data } = await this.fetch({
        url: "/keybusiness/getKeybusinessList",
        params: {
          pjid: 22
        },
        vm: this
      });

      this.businessOptions = getCascaderOptions({
				arr: data,
				label: "kbname",
				value: "kbname"
			});
		},
		async fetchPjTreeData() {
      const { data } = await this.fetch({
        url: "/porject/getProjectList",
        vm: this
      });

			this.pjOptions = getCascaderOptions({
				arr: data,
				label: "pjname",
				value: "id",
				filter: 'isleaf'
			});
    },
    async fetchTableData() {
      const pjId = this.getPjId;

      const data = await this.fetch({
        url: "/device/getDeviceinfoBypjname",
        params: {
          pjid: pjId
        },
        vm: this
      });

      if (data && data[0]) {
         this.tableData = data.map((item, index) => {
          return {
            index: index + 1,
            ip: item.ip,
            id: item.deviceid,
            assetType: item.devtype,
            deviceNum: item.name,
            version: item.version,
            vendorName: item.vendor,
            deviceOs: item.os,
            kbName: item.kbname && item.kbname.split('/')
          };
        });
      } else {
        this.tableData = [];
      }
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
</style>
