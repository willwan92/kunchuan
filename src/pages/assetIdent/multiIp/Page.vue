<template>
	<div class="page">
		<div class="section list">
			<el-form 
				:inline="true"
				label-width="75px">
				<el-row>
					<el-form-item label="起始IP">
						<el-input v-model="searchParams.startIp" placeholder=""></el-input>
					</el-form-item>
					<el-form-item label="结束IP">
						<el-input v-model="searchParams.endIp" placeholder=""></el-input>
					</el-form-item>
					<el-form-item label="扫描方式">
						<el-select v-model="searchParams.scannerType" placeholder="">
							<el-option v-for="item in scanTypes"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="端口范围">
						<el-input v-model="searchParams.startPort" placeholder=""></el-input>
					</el-form-item>
					<span style="display: inline-block; width: 24px; line-height: 36px;">— </span>
					<el-form-item label="">
						<el-input v-model="searchParams.endPort" placeholder=""></el-input>
					</el-form-item>
					<el-form-item label="">
						<el-button type="primary" @click="startScan">网络端口分析</el-button>
						<el-button @click="stopScan">停止扫描</el-button>
					</el-form-item>
				</el-row>
			</el-form>
		
			<!-- <app-table :table-data="tableData" :table-titles="tableTitles" @operate="handleOperate"></app-table> -->

			<el-table :data="tableData" border :span-method="objectSpanMethod" v-loading="isLoading" :element-loading-text="loadingText">
				<el-table-column label="IP地址" prop="ip" width="135"></el-table-column>
				<el-table-column label="端口" prop="port" width="70"></el-table-column>
				<el-table-column label="协议名称" prop="protoName"></el-table-column>
				<el-table-column label="协议类型" prop="protoType" width="90"></el-table-column>
				<el-table-column label="协议分析" prop="" width="108">
					<template slot-scope="scope">
						<el-button type="text" @click="handleProtoClick(scope.row.index)">网络类型分析</el-button>
					</template>
				</el-table-column>
				<el-table-column label="确认结果" prop="result"></el-table-column>
				<el-table-column label="内容分析" prop="" width="108">
					<template slot-scope="scope">
						<el-button type="text" @click="handleContentClick(scope.row.index)">网络资产确认</el-button>
					</template>
				</el-table-column>
				<el-table-column label="设备类型" prop="deviceType"></el-table-column>
				<el-table-column label="CVE ID" prop="">
					<template slot-scope="scope">
            <span v-if="Array.isArray(scope.row.cveId)">
							<el-link type="primary"
								v-for="(item, index) in scope.row.cveId" 
								:key="item"
								@click="checkCveDetail(scope.row, index)"
								style="margin-right: 10px;"
							>{{item}}</el-link>
						</span>
						<span v-else>{{scope.row.cveId}}</span>
          </template>
				</el-table-column>
			</el-table>
		</div>

		<!-- cve漏洞详情（弹窗） -->
    <cve-detail
      :detail-data="detailData"
      :is-loading-detail="isLoadingDetail"
      :dialog-visible="dialogVisible"
			:hasIp="false"
      @close="handleDialogClose"
    ></cve-detail>
	</div>
</template>

<script>
	import { judgeGender, deepCopy, commonExport } from 'common/utils'

	export default {
		data() {
			return {
				dialogVisible: false,
				isLoadingDetail: false,
				isLoading: false,
				timer: null,
				loadingText: '正在扫描',
				scanTypes: [
					{
						label: 'TCP',
						value: 2
					},
					{
						label: 'UDP',
						value: 3
					},
					{
						label: 'TCP&UDP',
						value: 4
					}
				],
				searchParams: {
					startIp: '',
					endIp: '',
					scannerType: 2,
					startPort: '1',
					endPort: '65535',
				},
				tableData: [],
				currentRowIp: '',
				detailData: {}
			}
		},
		created() {
			this.fetchScanResult();
		},
		methods: {
			handleDialogClose() {
				this.dialogVisible = false;
			},
			/**
			 * cve详情
			 * @param row 表格的行数据
			 * @param index 当前cveid在数组中的索引
			 */
			async checkCveDetail(row, index) {
				this.dialogVisible = true;
				this.isLoadingDetail = true;

				this.getFuzz({
					url: "/fuzz/page/view/scanner!findbugList.action",
					params: {
						vendors: row.vendors,
						product_name: row.devDesc ? row.devDesc : row.productName ? row.productName : null
					},
					vm: this
				}).then(res => {
					this.isLoadingDetail = false;
					const data = res.data;
					
					if (data && data[index]) {
						this.detailData = data[index];
					}
				});
			},
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
			async handleContentClick(index) {
				const current = this.tableData[index];
				let params = {
					ip: current.ip,
					port: current.port,
					protocol: current.protoType
				};
				
				this.loadingText = '正在确认...';
				this.isLoading = true;

				const data = await this.getFuzz({
					url: '/fuzz/page/view/scanner!assetsConfirm.action',
					params: params,
					type: 'get',
					vm: this
				});

				this.isLoading = false;
				
				this.tableData[index].deviceType = data.name;
				this.tableData[index].vendors = data.vendors;
				this.tableData[index].productName = data.product_name;
				this.tableData[index].devDesc = data.dev_desc;
				this.tableData[index].cveId = data.cveid;
				// if (data.state === 1) {
					
				// 	// this.timer = setInterval(this.fetchScanResult, 3000);
				// } else {
				// 	// this.$message.info(data.msg);
				// }
			},
			async handleProtoClick(index) {
				const current = this.tableData[index];
				let params = {
					ip: current.ip,
					port: current.port,
					protocolName: current.protoName,
					type: current.protoType
				};
				
				this.loadingText = '正在分析...';
				this.isLoading = true;

				const data = await this.getFuzz({
					url: '/fuzz/page/view/scanner!procotolConfirm.action',
					params: params,
					type: 'get',
					vm: this
				});

				this.isLoading = false;

				if (data.state === 1) {
					this.tableData[index].result = data.msg;
					// this.timer = setInterval(this.fetchScanResult, 3000);
				} else {
					this.tableData[index].result = 'unknown';
					// this.$message.error(data.msg);
				}
			},
			async stopScan(){
				this.isLoading = false;

				const data = await this.getFuzz({
					url: '/fuzz/page/view/scanner!scannerStopPort.action',
					type: 'get',
					vm: this
				});

				if (data.state === "true") {
					this.$message.info('扫描已停止！');
					clearInterval(this.timer);
				}

			},
			async startScan() {
				if (this.isLoading) return;

				this.tableData = [];
				this.loadingText = '正在扫描...';
				this.isLoading = true;
				
				const data = await this.getFuzz({
					url: '/fuzz/page/view/scanner!scannerPort.action',
					params: this.searchParams,
					type: 'get',
					vm: this
				});

				if (data.state === 1) {
					this.timer = setInterval(this.fetchScanResult, 3000);
				} else {
					this.$message.info(data.msg);
				}

			},
			async fetchScanResult() {
				let params = {
					_current: Date.now()
				};

				
				this.isLoading = true;
				
				const data = await this.getFuzz({
					url: '/fuzz/page/view/scanner!scannerResult.action',
					params: params,
					type: 'get',
					vm: this
				});

				if (data.data && data.data.length) {
					this.tableData = data.data.map((item, idx) => {
						return {
							index: idx,
							ip: item['0'],
							port: item['1'],
							protoName: item['2'],
							protoType: item['3'],
							result: '',
							deviceType: '',
							cveId: ''
						}
					})
				} else if (data.data && !data.data.length) {
					this.timer && this.$message.info('扫描结束，未发现开放端口!')
				}

				if (data.state && data.state === 1) {
					this.isLoading = false;
					if (this.timer) {
						clearInterval(this.timer);
						this.timer = null;
					}
				}
			}
		}
	}
</script>
<style lang="less" scoped>
.page {
	.section {
		padding: 20px;
		border:1px solid #ccc;
		border-radius: 5px;
		background:#fff;
		box-shadow:0 2px 4px rgba(0,0,0,.15);
		-webkit-box-shadow: 0 2px 4px rgba(0,0,0,.15);
		margin-bottom:30px;
		&:hover{
			box-shadow:0 4px 8px rgba(0,0,0,.15);
			-webkit-box-shadow: 0 4px 8px rgba(0,0,0,.15);
		}
	}
}

.btn-lg {
	width:150px;
	margin-right:30px;
}
</style>
