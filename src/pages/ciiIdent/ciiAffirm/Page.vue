<template>
  <div class="page">
    <div class="section list">
      <el-form ref="form" :inline="true" label-width="80px">
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
        <el-form-item>
          <el-button
            type="primary"
            @click="startAffirm"
            >选择结束、开始认定</el-button
          >
        </el-form-item>
      </el-form>
      
      <el-table :data="tableData" border v-loading="isLoading">
        <el-table-column label="IP/资产标识" prop="ip"></el-table-column>
        <el-table-column label="资产类型" prop="assetType"></el-table-column>
        <el-table-column label="设备型号" prop="deviceNum"></el-table-column>
        <el-table-column label="版本号" prop="version"></el-table-column>
        <el-table-column label="操作系统" prop="deviceOs"></el-table-column>
        <el-table-column label="所属关键系统" prop="kbName" width="240px">
        </el-table-column>
        <el-table-column label="关键性（4方面）" prop="" width="220px">
					<template slot-scope="scope">
            <el-select 
              v-model="scope.row.kbValue" 
              filterable
              @change="updateKbValue(scope.row)"
              placeholder="请选择">
              <el-option
                v-for="item in kbOptions"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </template>
				</el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getCascaderOptions, formatTreeData } from "common/utils";

const kbOptions = []

function createKbOptions() {
  const items = ['A', 'B', 'C']
  let options = []
  let option = new Array(4)

  items.forEach(item0 => {
    let option = new Array(4)
    option[0] = item0
    items.forEach(item1 => {
      option[1] = item1
      items.forEach(item2 => {
        option[2] = item2
        items.forEach(item3 => {
          option[3] = item3
          options.push(option.join(''))
        })
      })
    })
  })

  return options
}

export default {
  data() {
    return {
      isLoading: false,
      pjValue: [],
      kbOptions: Object.freeze(createKbOptions()),
      businessOptions: [],
			pjOptions: [],
      tableData: []
    };
  },
  created() {
    this.pjValue = JSON.parse(sessionStorage.getItem('pjValue'));
    this.fetchTableData();
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
    async startAffirm() {
      const data = await this.post({
        url: "/device/getSelectByKeyChoise",
        params: {
          pjid: this.getPjId,
          keychoice: sessionStorage.getItem('aCount')
        },
        vm: this
      });

      if (data) {
        this.$message.success("认定成功！");
        sessionStorage.setItem('affirmRes', JSON.stringify(data));
			} else {
				this.$message.error('认定失败，请稍后再试！');
			}
      
    },
    async updateKbValue(row) {
      const data = await this.post({
        url: "/device/getUpdateByKeyChoice",
        params: {
          deviceid: row.id,
          keychoice: row.kbValue
        },
        vm: this
      });

      if (data.code === 10000) {
				this.$message.success("关键性修改成功！");
			} else {
				this.$message.error('关键性修改失败，请稍后再试！');
			}
		},
    async fetchbusinessOptionsData() {
      const { data } = await this.post({
        url: "/keybusiness/getKeybusinessList",
        params: {
          pjid: this.getPjId
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
			const roleId = sessionStorage.getItem('roleId');

      const data = await this.post({
				url: "/projectInfo/getEnableRole",
				params: {
					enablerole: `(${roleId})`
				},
        vm: this
      });

			const treeData = formatTreeData(data, 0);

      this.pjOptions = getCascaderOptions({
        arr: treeData,
        label: "pjname",
        value: "id",
        filter: "isleaf"
      });
    },
    async fetchTableData() {
      const pjId = this.getPjId;
      this.tableData = [];
      this.isLoading = true;
      
      const data = await this.post({
        url: "/device/getDeviceinfoFindAll",
        params: {
          pjid: pjId
        },
        vm: this
      });

      this.isLoading=false;
      if (Array.isArray(data)) {
         this.tableData = data.map((item, index) => {
          return {
            index: index,
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
      } else {
        this.tableData = [];
      }
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
