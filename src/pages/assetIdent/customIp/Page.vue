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
          <el-input v-model="searchParams.port" placeholder=""></el-input>
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
            <el-button type="text" @click="handleContentClick(scope.row.index)"
              >网络资产确认</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="资产类型" prop="assetType"></el-table-column>
        <el-table-column label="厂家名称" prop="manufName"></el-table-column>
        <el-table-column label="设备型号" prop="deviceType"></el-table-column>
        <el-table-column label="版本号" prop="version"></el-table-column>
        <el-table-column
          label="传统设备"
          prop="TraditionalDevice"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getCascaderOptions } from "common/utils";

export default {
  data() {
    return {
      isLoading: false,
      loadingText: "正在扫描",
      timer: null,
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
    async fetchScanResult() {
      const params = {
        t: Math.random(),
        pjid: this.getPjId
      };

      const { data } = await this.fetchFuzz({
        url: "/fuzz/page/view/scanstation!findScanDatas.action",
        params: params,
        vm: this
      });

      // console.log(data);

      if (data && data.length) {
        this.tableData = data.map((item, idx) => {
          return {
            // ip: item["0"],
            // port: item["1"],
            // protoName: item["2"],
            // protoType: item["3"],
            // result: "",
            // deviceType: "",
            // cveId: ""
          };
        });
      } else {
        this.timer && this.$message.info("扫描结束，未发现开放端口!");
      }

      this.isLoading = false;
      this.timer && clearInterval(this.timer);
      this.timer = null;
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
        clearInterval(this.timer);
      }
		},
		handleStartClick() {
			this.$refs['searchParams'].validate(valid => {
				if (valid) {
					this.startScan();
				}
			})
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

      const data = await this.fetchFuzz({
        url: "/fuzz/page/view/scanstation!confirm_propertis.action",
        params: params,
        type: "get",
        vm: this
      });

			this.isLoading = false;

      // this.tableData[index].deviceType = data.name;
      // this.tableData[index].cveId = data.cveid;
      // if (data.state === 1) {

      // 	// this.timer = setInterval(this.fetchScanResult, 3000);
      // } else {
      // 	// this.$message.info(data.msg);
      // }
    },
    async handleProtoClick(index) {
			const current = this.tableData[index];
			// 参数：id  ip   port_type  port
      let params = {
				id: current.id,
        ip: current.ip,
        port: current.port,
        protocolName: current.protoName,
        type: current.protoType
      };
			  
      this.loadingText = "正在分析...";
      this.isLoading = true;

      const data = await this.fetchFuzz({
        url: "/fuzz/page/view/scanstation!analyze.action",
        params: params,
        type: "get",
        vm: this
      });

      this.isLoading = false;

      // if (data.state === 1) {
      //   this.tableData[index].result = data.msg;
      //   // this.timer = setInterval(this.fetchScanResult, 3000);
      // } else {
      //   this.tableData[index].result = "unknown";
      //   // this.$message.error(data.msg);
      // }
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
        this.timer = setInterval(this.fetchScanResult, 3000);
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
    },
    handleOperate(row, type, target) {
      this.editItem({ id: row.id });
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
        filter: "isleaf"
      });
    },
    // 请求列表数据
    fetchData() {},
    viewDetail(row) {
      this.$router.push({
        path: "/user/userDetail",
        query: {
          id: row.userId
        }
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$nextTick(() => {
        vm.fetchData();
      });
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchData();
    });
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
