<template>
  <div class="page">
    <div class="section list">
      <el-form
        :inline="true"
        :model="searchParams"
        :rules="rules"
				label-position="left"
        ref="searchParams"
        label-width="100px"
      >
        <el-form-item label="项目名称" prop="pjValue">
          <el-cascader
            @change="getPjDetail"
            :options="pjOptions"
            :props="{ expandTrigger: 'hover' }"
            filterable
            v-model="searchParams.pjValue"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="IP范围" prop="ipRange">
          <el-input
            v-model="searchParams.ipRange"
            readonly=""
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="扫描类型" prop="scanType">
          <el-select v-model="searchParams.scanType" placeholder="">
            <el-option
              v-for="item in scanTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接状态" prop="linkStatus">
          <el-select v-model="searchParams.linkStatus" placeholder="">
            <el-option
              v-for="item in linkStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <br />
        <!-- <el-form-item label="端口方式">
					<el-select v-model="searchParams.portMethod" placeholder="">
						<el-option v-for="item in portMethodOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item> -->
        <el-form-item label="端口范围" prop="port">
          <el-input v-model="searchParams.port" placeholder="1-65535"></el-input>
        </el-form-item>
        <el-form-item label="扫描方式" prop="scanMethod">
          <el-select v-model="searchParams.scanMethod" placeholder="">
            <el-option
              v-for="item in scanMethodOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="autoIdentAsset">
          <el-checkbox
            v-model="searchParams.autoIdentAsset"
            label="自动识别资产"
          ></el-checkbox>
        </el-form-item>
        <el-row type="flex" justify="center">
          <el-button
            class="btn-lg"
            type="primary"
            :disabled="isLoading"
            @click="handleStartClick"
            >开始</el-button
          >
          <el-button class="btn-lg" :disabled="!isLoading" @click="stopScan"
            >停止</el-button
          >
        </el-row>
        <br />
      </el-form>

      <el-table
        :data="tableData"
        border
        v-loading="isLoading"
        :span-method="objectSpanMethod"
        :element-loading-text="loadingText"
      >
        <el-table-column label="IP地址" prop="ip"></el-table-column>
        <el-table-column label="端口" prop="port"></el-table-column>
        <el-table-column label="协议名称" prop="protoName"></el-table-column>
        <el-table-column label="TCP/UDP" prop="protoType"></el-table-column>
        <el-table-column label="协议分析" prop="">
          <template slot-scope="scope">
            <el-button type="text" @click="handleProtoClick(scope.row.index)"
              >网络类型分析</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="确认协议" prop="result"></el-table-column>
        <el-table-column label="资产确认" prop="">
          <template slot-scope="scope">
            <el-button type="text" @click="handleAssetClick(scope.row.index)"
              >网络资产确认</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="资产类型" prop="assetType"></el-table-column>
        <el-table-column label="厂家名称" prop="vendorName"></el-table-column>
        <el-table-column label="设备型号" prop="deviceNum"></el-table-column>
        <el-table-column label="版本号" prop="version"></el-table-column>
        <el-table-column
          label="操作系统"
          prop="deviceOs"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getCascaderOptions, formatTreeData } from "common/utils";

export default {
  data() {
    return {
      isLoading: false,
      loadingText: "正在扫描",
      searchParams: {
        pjValue: [],
        ipRange: "",
        scanType: "TCP",
        linkStatus: 0,
        portMethod: 1,
        port: "",
        scanMethod: 0,
        autoIdentAsset: true
      },
      rules: {
        pjValue: [{ required: true, message: "请选择项目", trigger: "blur" }],
        ipRange: [
          { required: true, message: "请选择有IP的项目", trigger: "blur" }
        ],
        scanType: [
          { required: true, message: "请选择扫描类型", trigger: "blur" }
        ],
        linkStatus: [
          { required: true, message: "请选择连接状态", trigger: "blur" }
        ],
        port: [{ required: true, message: "请输入端口", trigger: "blur" }],
        scanMethod: [
          { required: true, message: "请选择扫描方式", trigger: "blur" }
        ]
      },
      scanTypes: [
        {
          label: "TCP",
          value: "TCP"
        },
        {
          label: "UDP",
          value: "UDP"
        },
        {
          label: "TCP&UDP",
          value: "TCP&UDP"
        }
      ],
      linkStatusOptions: [
        {
          label: "半连接扫描",
          value: 0
        },
        {
          label: "全连接扫描",
          value: 1
        },
        {
          label: "FIN 扫描",
          value: 2
        },
        {
          label: "圣诞树扫描",
          value: 3
        },
        {
          label: "空扫描",
          value: 4
        }
      ],
      portMethodOptions: [
        {
          label: "离散端口",
          value: 0
        },
        {
          label: "连续端口",
          value: 1
        }
      ],
      scanMethodOptions: [
        {
          label: "快速扫描",
          value: 0
        },
        {
          label: "深度扫描",
          value: 1
        }
      ],
      tableTitles: [
        {
          title: "操作",
          prop: "id",
          isTemplate: true,
          width: 150,
          templateType: "check",
          operate: "修改"
        }
      ],
      pjOptions: null,
      tableData: []
    };
  },
  created() {
    this.fetchPjTreeData();
  },
  computed: {
    getPjId() {
      let id;
      if (this.searchParams.pjValue && this.searchParams.pjValue[0]) {
        id = this.searchParams.pjValue.slice(-1)[0];
      } else {
        id = null;
      }

      return id;
    }
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex > 5) {
        if(rowIndex === 0 || row.ip !== this.tableData[rowIndex - 1].ip) {
          return {
            rowspan: this.getIpCount(row.ip),
            colspan: 1
          }
        }
      }
    },
    getIpCount(ip) {
      let count = 0;
      this.tableData.forEach(item => {
        if (item.ip === ip) {
          count ++;
        }
      })

      return count;
    },
    async handleAssetClick(index) {
			const current = this.tableData[index];
			// scanstation!confirm_propertis.action?scanMethod=0&ip=10.60.4.1&pjid=22
      let params = {
				pjid: this.getPjId,
				ip: current.ip,
				scanMethod: this.searchParams.scanMethod
      };

      this.loadingText = "正在确认...";
      this.isLoading = true;

      const { data } = await this.fetchFuzz({
        url: "/fuzz/page/view/scanstation!confirm_propertis.action",
        params: params,
        type: "get",
        vm: this
      });

      this.isLoading = false;
      
      if (data && data[0]) {
          this.tableData[index].assetType = data[0].devtype;
          this.tableData[index].vendorName = data[0].vendor;
          this.tableData[index].deviceNum = data[0].name;
          this.tableData[index].version = data[0].version;
          this.tableData[index].deviceOs = data[0].os;
      }
    },
    async handleProtoClick(index) {
			const current = this.tableData[index];
			// 参数：id  ip   port_type  port
      let params = {
				id: this.getPjId,
        ip: current.ip,
        port: current.port,
        port_type: current.protoType
      };
			  
      this.loadingText = "正在分析...";
      this.isLoading = true;

      const data = await this.fetchFuzz({
        url: "/fuzz/page/view/scanstation!analyze.action",
        params: params,
        type: "get",
        vm: this
      });

      if (data.success === "success") {
        this.tableData[index].result = data.data[0].confirm;
      }

      this.isLoading = false;
    },
    async fetchScanResult(isScan) {
      const params = {
        t: Math.random(),
        pjid: this.getPjId
      };

      const { data } = await this.fetchFuzz({
        url: "/fuzz/page/view/scanstation!findScanDatas.action",
        params: params,
        vm: this
      });

      if (data && data.length) {
        this.tableData = data.map((item, idx) => {
          return {
            index: idx,
            ip: item[0],
            port: item[1],
            protoName: item[2],
            protoType: item[3],
            result: item[5],
            assetType: item[7],
            vendorName: item[8],
            deviceNum: item[9],
            version: item[10],
            deviceOs:item[11]
          };
        });
      } else {
        isScan && this.$message.info("扫描结束，未发现开放端口!");
      }

      this.isLoading = false;
    },
    async stopScan() {
      let searchParams = this.searchParams;
      const params = {
        pjid  : this.getPjId,
        ip_scope: searchParams.ipRange,
        scan_type: searchParams.scanType,
        port_type: searchParams.portMethod
      };

      const data = await this.fetchFuzz({
        url: "/fuzz/page/view/scanstation!stopSend.action",
        params: params,
        vm: this
      });

      if (data.success === "success") {
				this.$message.info("扫描已停止！");
				this.isLoading = false;
      }
		},
		handleStartClick() {
			this.$refs['searchParams'].validate(valid => {
				if (valid) {
					this.startScan();
				}
			})
		},
    async startScan() {
      let searchParams = this.searchParams;

      const params = {
        id: this.getPjId,
        ip_scope: searchParams.ipRange,
        scan_type: searchParams.scanType,
        cont_type: searchParams.linkStatus,
        port_type: searchParams.portMethod,
        port_vales: searchParams.port,
        propertiesd: Number(searchParams.autoIdentAsset),
        scanMethod: searchParams.scanMethod
      };

      this.tableData = [];
      this.loadingText = "正在扫描...";
      this.isLoading = true;

      const data = await this.fetchFuzz({
        url: "/fuzz/page/view/scanner/scanstation!startBtnMe.action",
        params: params,
        vm: this
      });

      if (data.success === "success") {
        this.fetchScanResult(1);
      } else {
        this.$message.error("扫描失败，请稍后再试！");
      }
    },
    async getPjDetail() {
      const data = await this.fetch({
        url: "/projectInfo/getSelectProjectById",
        params: {
          id: this.getPjId
        },
        vm: this
      });

      data && (this.searchParams.ipRange = data.ip);

      this.fetchScanResult(0);
    },
    async fetchPjTreeData() {
			const roleId = sessionStorage.getItem('roleId');

      const data = await this.fetch({
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
  }
}

.btn-lg {
  width: 150px;
  margin-right: 30px;
}
</style>
